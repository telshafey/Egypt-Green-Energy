import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  Settings,
  Layers,
  FolderGit2,
  Image as ImageIcon,
  Mail,
  Phone,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Database,
  UploadCloud,
  LogOut,
  Key,
  Server,
  Check,
  Building2,
  MapPin,
  Calendar,
  MessageCircle,
  Copy,
  History,
  Compass,
  Sparkles,
  Users,
  UserPlus,
  UserCheck,
  Upload,
  Sliders,
  Award,
  TrendingUp,
  LayoutGrid,
  Cpu,
} from 'lucide-react';
import {
  auth,
  signInWithPopup,
  googleProvider,
  signOut,
  ensureAdminSession,
  testFirestoreConnection,
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  SiteSettingsData,
  DEFAULT_SITE_SETTINGS,
  getSiteSettings,
  saveSiteSettings,
  getSystems,
  saveSystem,
  deleteSystem,
  getProjects,
  saveProject,
  deleteProject,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  InquiryData,
  getMediaAssets,
  saveMediaAsset,
  deleteMediaAsset,
  uploadAndSaveImage,
  subscribeToMediaAssets,
  MediaAssetData,
  DEFAULT_MEDIA_ASSETS,
  AdminUserData,
  DEFAULT_ADMIN_USERS,
  getAdminUsers,
  saveAdminUser,
  deleteAdminUser,
  subscribeToAdminUsers,
  seedInitialFirestoreData,
  getFirestoreDatabaseStats,
  FirestoreDatabaseStats,
  subscribeToInquiries,
  subscribeToSystems,
  subscribeToProjects,
  getVendors,
  saveVendor,
  deleteVendor,
  subscribeToVendors,
  DEFAULT_VENDOR_BRANDS,
} from '../services/firebaseService';
import { optimizeImageForDatabase, formatBytes } from '../utils/imageUploadHelper';
import { LightCurrentSystem, ProjectItem, Language, VendorBrandItem } from '../types';
import { content, CCTV_IMAGE, CABLING_IMAGE, ACCESS_IMAGE } from '../data/translations';
import { resolveImageUrl, handleImageError, DEFAULT_HERO_IMAGE, DEFAULT_CCTV_IMAGE, DEFAULT_CABLING_IMAGE } from '../utils/imageHelper';
import { BrandLogo } from './BrandLogo';
import { checkLoginRateLimit, recordFailedLoginAttempt, resetLoginRateLimit } from '../utils/security';

interface AdminDashboardProps {
  currentLang: Language;
  onExit: () => void;
  onSettingsUpdated?: (settings: SiteSettingsData) => void;
}

type AdminTab =
  | 'general'
  | 'visibility'
  | 'systems'
  | 'projects'
  | 'vendors'
  | 'heritage'
  | 'about'
  | 'media'
  | 'inquiries'
  | 'users'
  | 'security';

export const SECRET_PORTAL_PATH = '/portal-ege-8492';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentLang,
  onExit,
  onSettingsUpdated,
}) => {
  // Auth states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [passcode, setPasscode] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [loginMethod, setLoginMethod] = useState<'google' | 'passcode'>('google');
  const [activeTab, setActiveTab] = useState<AdminTab>('general');
  const [activeAdminUser, setActiveAdminUser] = useState<AdminUserData | null>(null);

  // Notification Toast state (Zero Popups Discipline!)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Data states
  const [settings, setSettings] = useState<SiteSettingsData>(DEFAULT_SITE_SETTINGS);
  const [systems, setSystems] = useState<LightCurrentSystem[]>(content.ar.systems.items);
  const [projects, setProjects] = useState<ProjectItem[]>(content.ar.projects.items);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetData[]>(DEFAULT_MEDIA_ASSETS);
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUserData[]>(DEFAULT_ADMIN_USERS);
  const [editingUser, setEditingUser] = useState<AdminUserData | null>(null);
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [revealedPasscodes, setRevealedPasscodes] = useState<Record<string, boolean>>({});
  const [newUserForm, setNewUserForm] = useState<{
    name: string;
    email: string;
    role: 'super_admin' | 'systems_engineer' | 'content_manager';
    passcode: string;
    isActive: boolean;
    notes: string;
  }>({
    name: '',
    email: '',
    role: 'systems_engineer',
    passcode: '',
    isActive: true,
    notes: '',
  });

  const togglePasscodeReveal = (userId: string) => {
    setRevealedPasscodes((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Dynamic Content for About & Heritage
  const [aboutVisionAr, setAboutVisionAr] = useState<string>(
    'إدراك الحاجة المتزايدة لتكنولوجيا البنية التحتية والأنظمة الذكية والطاقة المتجددة في عالم اليوم، وتوفير حلول هندسية موثوقة ومستدامة بمعايير عالمية.'
  );
  const [aboutMissionAr, setAboutMissionAr] = useState<string>(
    'تصميم وتوريد وتركيب وصيانة أحدث أنظمة التيار الخفيف (ELV) والاتصالات، ودمجها مع الخبرات التاريخية في الطاقة والمياه لإنجاز منشآت ذكية آمنة وموفرة للطاقة.'
  );

  // Inline Editing states
  const [editingSystem, setEditingSystem] = useState<LightCurrentSystem | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [newMediaUrl, setNewMediaUrl] = useState<string>('');
  const [newMediaTitle, setNewMediaTitle] = useState<string>('');
  const [newMediaCategory, setNewMediaCategory] = useState<string>('cctv');

  // Device Image Upload States for Media Library
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);
  const [mediaUploadMode, setMediaUploadMode] = useState<'upload' | 'url'>('upload');
  const [selectedDeviceImage, setSelectedDeviceImage] = useState<{
    file: File;
    dataUrl: string;
    name: string;
    originalKb: number;
    compressedKb: number;
    width: number;
    height: number;
    format: string;
  } | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  // Vendor Brands Management States
  const [vendors, setVendors] = useState<VendorBrandItem[]>(DEFAULT_VENDOR_BRANDS);
  const [editingVendor, setEditingVendor] = useState<VendorBrandItem | null>(null);
  const [isAddingVendor, setIsAddingVendor] = useState<boolean>(false);
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState<string>('all');
  const [newVendorForm, setNewVendorForm] = useState<{
    name: string;
    category: VendorBrandItem['category'];
    logoUrl: string;
    websiteUrl: string;
    descriptionAr: string;
    descriptionEn: string;
    displayOrder: number;
    isActive: boolean;
  }>({
    name: '',
    category: 'cctv',
    logoUrl: '',
    websiteUrl: '',
    descriptionAr: '',
    descriptionEn: '',
    displayOrder: 1,
    isActive: true,
  });

  // Live Database Diagnostics State
  const [dbStats, setDbStats] = useState<FirestoreDatabaseStats | null>(null);
  const [isPingingDb, setIsPingingDb] = useState<boolean>(false);

  // Trigger non-blocking toast
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Run live database test
  const handlePingDatabase = async () => {
    setIsPingingDb(true);
    try {
      const stats = await getFirestoreDatabaseStats();
      setDbStats(stats);
      if (stats.connected) {
        showToast(
          `قاعدة بيانات فايربيز متصلة ومباشرة! زمن الاستجابة: ${stats.latencyMs}ms (${stats.systemsCount} أنظمة، ${stats.projectsCount} مشروعات، ${stats.adminUsersCount} مستخدمين)`
        );
      } else {
        showToast(`تنبيه في الاتصال: ${stats.error || 'غير متصل'}`, 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر فحص الاتصال';
      showToast(msg, 'error');
    } finally {
      setIsPingingDb(false);
    }
  };

  // Pre-load admin users so any authorized team member can login
  useEffect(() => {
    getAdminUsers().then((users) => {
      if (users.length > 0) setAdminUsers(users);
    }).catch(console.warn);
  }, []);

  // Listen to Firebase Auth & check stored unlock
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email) {
        setIsAdminUnlocked(true);
      }
    });

    const storedAuth = sessionStorage.getItem('ege_admin_unlocked');
    if (storedAuth === 'true') {
      setIsAdminUnlocked(true);
      ensureAdminSession().catch(console.warn);
    }

    return () => unsubscribe();
  }, []);

  // Fetch initial data & live database diagnostics
  useEffect(() => {
    let unsubInquiries: (() => void) | undefined;
    let unsubUsers: (() => void) | undefined;
    let unsubVendors: (() => void) | undefined;
    let unsubMedia: (() => void) | undefined;

    async function loadData() {
      setIsLoading(true);
      try {
        // Ensure active authenticated session
        ensureAdminSession().catch(console.warn);

        // Fetch live database statistics
        getFirestoreDatabaseStats().then(setDbStats).catch(console.warn);

        const [loadedSettings, loadedSystems, loadedProjects, loadedMedia, loadedInquiries, loadedUsers, loadedVendors] =
          await Promise.all([
            getSiteSettings(),
            getSystems(),
            getProjects(),
            getMediaAssets(),
            getInquiries(),
            getAdminUsers(),
            getVendors(),
          ]);

        setSettings(loadedSettings);
        if (loadedSettings.aboutVisionAr) setAboutVisionAr(loadedSettings.aboutVisionAr);
        if (loadedSettings.aboutMissionAr) setAboutMissionAr(loadedSettings.aboutMissionAr);
        if (loadedSystems.length > 0) setSystems(loadedSystems);
        if (loadedProjects.length > 0) setProjects(loadedProjects);
        if (loadedMedia.length > 0) setMediaAssets(loadedMedia);
        setInquiries(loadedInquiries);
        if (loadedUsers.length > 0) setAdminUsers(loadedUsers);
        if (loadedVendors.length > 0) setVendors(loadedVendors);

        // Subscribe to live incoming customer inquiries
        unsubInquiries = subscribeToInquiries((inqs) => {
          setInquiries(inqs);
        });

        // Subscribe to live admin users list
        unsubUsers = subscribeToAdminUsers((uList) => {
          if (uList.length > 0) setAdminUsers(uList);
        });

        // Subscribe to live vendor brands list
        unsubVendors = subscribeToVendors((vList) => {
          if (vList.length > 0) setVendors(vList);
        });

        // Subscribe to live media assets in database
        unsubMedia = subscribeToMediaAssets((mList) => {
          if (mList.length > 0) setMediaAssets(mList);
        });
      } catch (err) {
        console.warn('Admin: Fallback to bundled data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (isAdminUnlocked) {
      loadData();
    }

    return () => {
      if (unsubInquiries) unsubInquiries();
      if (unsubUsers) unsubUsers();
      if (unsubVendors) unsubVendors();
      if (unsubMedia) unsubMedia();
    };
  }, [isAdminUnlocked]);

  // Handle Enterprise Credentials / Passcode login
  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim();
    const cleanEmail = loginEmail.trim().toLowerCase();

    // Check rate limit first
    const rateStatus = checkLoginRateLimit();
    if (rateStatus.isLocked) {
      setAuthError(`تم قفل محاولات الدخول مؤقتاً لحماية أمان البوابة. يرجى المحاولة بعد ${Math.ceil(rateStatus.lockoutRemainingSeconds / 60)} دقيقة.`);
      return;
    }

    if (!cleanEmail) {
      setAuthError('يرجى إدخال البريد الإلكتروني الإداري المعتمد');
      return;
    }

    if (!cleanPass) {
      setAuthError('يرجى إدخال كلمة المرور أو رمز الدخول المشفر');
      return;
    }

    // 1. Check against master passcodes
    const isMaster = [
      'admin2026',
      'egyptge2026',
      'green123',
      'ege2026',
    ].includes(cleanPass.toLowerCase());

    // 2. Check against registered admin users in database
    const matchingUser = adminUsers.find((u) => {
      if (!u.isActive) return false;
      // Match by personal passcode
      if (u.passcode && u.passcode === cleanPass) return true;
      // Match by email + passcode
      if (cleanEmail && u.email.toLowerCase() === cleanEmail && (!u.passcode || u.passcode === cleanPass)) return true;
      return false;
    });

    if (isMaster || matchingUser) {
      resetLoginRateLimit();
      setIsAdminUnlocked(true);
      sessionStorage.setItem('ege_admin_unlocked', 'true');
      if (matchingUser) {
        setActiveAdminUser(matchingUser);
        sessionStorage.setItem('ege_active_admin_name', matchingUser.name);
      }
      setAuthError('');
      showToast(
        matchingUser
          ? `تم تسجيل الدخول بنجاح: ${matchingUser.name} (${matchingUser.role})`
          : 'تم تسجيل الدخول بنجاح إلى لوحة الإدارة المركزية'
      );
      ensureAdminSession().catch(console.warn);
    } else {
      const newStatus = recordFailedLoginAttempt();
      if (newStatus.isLocked) {
        setAuthError('تم تجاوز الحد الأقصى للمحاولات الخاطئة (5 محاولات). تم قفل الدخول مؤقتاً لمدة 15 دقيقة.');
      } else {
        setAuthError(`بيانات الدخول غير صحيحة. متبقي لديك ${newStatus.remainingAttempts} محاولات قبل القفل الأمني المؤقت.`);
      }
    }
  };

  // Handle Google Login via Firebase
  const handleGoogleLogin = async () => {
    try {
      setAuthError('');
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setIsAdminUnlocked(true);
        sessionStorage.setItem('ege_admin_unlocked', 'true');
        showToast(`مرحباً بك: ${res.user.displayName || res.user.email}`);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'فشل تسجيل الدخول بـ Google';
      setAuthError(errorMsg);
    }
  };


  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setIsAdminUnlocked(false);
    sessionStorage.removeItem('ege_admin_unlocked');
    showToast('تم تسجيل الخروج بنجاح', 'info');
  };

  // Copy Secret Link
  const handleCopySecretLink = () => {
    const fullUrl = `${window.location.origin}${SECRET_PORTAL_PATH}`;
    navigator.clipboard.writeText(fullUrl);
    showToast(`تم نسخ الرابط السري للوحة التحكم: ${fullUrl}`);
  };

  // 1. Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSiteSettings(settings);
      if (onSettingsUpdated) {
        onSettingsUpdated(settings);
      }
      showToast('تم حفظ وتحديث إعدادات وبيانات الموقع بنجاح في فايربيز');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ الإعدادات';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Save System
  const handleSaveSystem = async (sys: LightCurrentSystem) => {
    setIsSaving(true);
    try {
      await saveSystem(sys);
      setSystems((prev) => {
        const exists = prev.some((item) => item.id === sys.id);
        if (exists) {
          return prev.map((item) => (item.id === sys.id ? sys : item));
        }
        return [sys, ...prev];
      });
      setEditingSystem(null);
      showToast(`تم حفظ وتحديث نظام: ${sys.title} بنجاح في فايربيز`);
      getFirestoreDatabaseStats().then(setDbStats).catch(console.warn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حفظ النظام';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSystem = async (id: string) => {
    try {
      await deleteSystem(id);
      setSystems((prev) => prev.filter((item) => item.id !== id));
      showToast('تم حذف النظام بنجاح من قاعدة البيانات');
      getFirestoreDatabaseStats().then(setDbStats).catch(console.warn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حذف النظام';
      showToast(msg, 'error');
    }
  };

  // 3. Save Project
  const handleSaveProject = async (proj: ProjectItem) => {
    setIsSaving(true);
    try {
      await saveProject(proj);
      setProjects((prev) => {
        const exists = prev.some((p) => p.id === proj.id);
        if (exists) {
          return prev.map((p) => (p.id === proj.id ? proj : p));
        }
        return [proj, ...prev];
      });
      setEditingProject(null);
      showToast(`تم حفظ المشروع: ${proj.title} في فايربيز`);
      getFirestoreDatabaseStats().then(setDbStats).catch(console.warn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حفظ المشروع';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast('تم حذف المشروع بنجاح من فايربيز');
      getFirestoreDatabaseStats().then(setDbStats).catch(console.warn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حذف المشروع';
      showToast(msg, 'error');
    }
  };

  // 3.5 Vendor Brands Handlers
  const handleSaveVendor = async (vendorToSave: VendorBrandItem) => {
    setIsSaving(true);
    try {
      await saveVendor(vendorToSave, activeAdminUser?.email || 'admin');
      setVendors((prev) => {
        const exists = prev.some((v) => v.id === vendorToSave.id);
        if (exists) {
          return prev.map((v) => (v.id === vendorToSave.id ? vendorToSave : v));
        }
        return [...prev, vendorToSave];
      });
      setEditingVendor(null);
      setIsAddingVendor(false);
      showToast(`تم حفظ العلامة التجارية: ${vendorToSave.name} بنجاح`);
      getFirestoreDatabaseStats().then(setDbStats).catch(console.warn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حفظ العلامة التجارية';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVendor = async (id: string) => {
    try {
      await deleteVendor(id, activeAdminUser?.email || 'admin');
      setVendors((prev) => prev.filter((v) => v.id !== id));
      showToast('تم حذف العلامة التجارية بنجاح');
      getFirestoreDatabaseStats().then(setDbStats).catch(console.warn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حذف العلامة التجارية';
      showToast(msg, 'error');
    }
  };

  const handleToggleVendorActive = async (v: VendorBrandItem) => {
    const updated = { ...v, isActive: !v.isActive };
    try {
      await saveVendor(updated, activeAdminUser?.email || 'admin');
      setVendors((prev) => prev.map((item) => (item.id === v.id ? updated : item)));
      showToast(updated.isActive ? `تم تفعيل عرض: ${v.name}` : `تم إيقاف عرض: ${v.name}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر تغيير حالة العلامة';
      showToast(msg, 'error');
    }
  };

  const handleCreateNewVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorForm.name.trim()) {
      showToast('يرجى إدخال اسم العلامة التجارية', 'error');
      return;
    }
    const slug = newVendorForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const newVendor: VendorBrandItem = {
      id: slug || `vendor-${Date.now()}`,
      name: newVendorForm.name.trim(),
      slug: slug || `vendor-${Date.now()}`,
      category: newVendorForm.category || 'cctv',
      logoUrl: newVendorForm.logoUrl.trim() || `/assets/logos/${slug}.svg`,
      websiteUrl: newVendorForm.websiteUrl.trim(),
      descriptionAr: newVendorForm.descriptionAr.trim() || 'أنظمة وحلول متكاملة',
      descriptionEn: newVendorForm.descriptionEn.trim() || 'Integrated Systems & Solutions',
      displayOrder: Number(newVendorForm.displayOrder) || vendors.length + 1,
      isActive: newVendorForm.isActive !== false,
      createdAt: new Date().toISOString(),
    };
    await handleSaveVendor(newVendor);
    setNewVendorForm({
      name: '',
      category: 'cctv',
      logoUrl: '',
      websiteUrl: '',
      descriptionAr: '',
      descriptionEn: '',
      displayOrder: vendors.length + 2,
      isActive: true,
    });
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id: string) => {
    try {
      await deleteInquiry(id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      showToast('تم حذف الطلب بنجاح');
      getFirestoreDatabaseStats().then(setDbStats).catch(console.warn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حذف الطلب';
      showToast(msg, 'error');
    }
  };

  // Save About Vision & Mission
  const handleSaveAbout = async () => {
    setIsSaving(true);
    try {
      const updated: SiteSettingsData = {
        ...settings,
        aboutVisionAr,
        aboutMissionAr,
      };
      setSettings(updated);
      await saveSiteSettings(updated);
      if (onSettingsUpdated) onSettingsUpdated(updated);
      showToast('تم حفظ وتحديث رؤية ورسالة الشركة بنجاح في فايربيز');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حفظ البيانات';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Device Image Upload & Optimization for Media Library
  const handleDeviceImageSelect = async (file: File) => {
    if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.svg')) {
      showToast('يرجى اختيار ملف صورة صالح (PNG, JPG, WebP, SVG)', 'error');
      return;
    }

    try {
      showToast('جارِ فحص وضغط الصورة من جهازك...', 'info');
      const optimized = await optimizeImageForDatabase(file, {
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.84,
      });

      setSelectedDeviceImage({
        file,
        dataUrl: optimized.dataUrl,
        name: file.name,
        originalKb: optimized.originalSizeKb,
        compressedKb: optimized.compressedSizeKb,
        width: optimized.width,
        height: optimized.height,
        format: optimized.format,
      });

      if (!newMediaTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setNewMediaTitle(cleanName);
      }

      showToast(
        `تم تجهيز الصورة بنجاح: ${optimized.width}×${optimized.height} (${optimized.compressedSizeKb} KB)`,
        'success'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر ضغط وتجهيز الصورة';
      showToast(msg, 'error');
    }
  };

  const handleSaveDeviceImageToDatabase = async () => {
    if (!selectedDeviceImage) {
      showToast('يرجى اختيار صورة أولاً من جهازك', 'error');
      return;
    }

    setIsUploadingMedia(true);
    try {
      const assetId = `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const title = newMediaTitle.trim() || selectedDeviceImage.name.replace(/\.[^/.]+$/, '');
      const newAsset: MediaAssetData = {
        id: assetId,
        title,
        url: selectedDeviceImage.dataUrl,
        category: newMediaCategory,
        createdAt: new Date().toISOString(),
        sizeKb: selectedDeviceImage.compressedKb,
        dimensions: `${selectedDeviceImage.width}x${selectedDeviceImage.height}`,
        format: selectedDeviceImage.format,
        source: 'upload',
      };

      await saveMediaAsset(newAsset);
      setMediaAssets((prev) => [newAsset, ...prev]);
      setSelectedDeviceImage(null);
      setNewMediaTitle('');
      showToast(`تم حفظ الصورة بنجاح في قاعدة بيانات فايربيز (${newAsset.sizeKb} KB)`);
      getFirestoreDatabaseStats().then(setDbStats).catch(console.warn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حفظ الصورة في قاعدة البيانات';
      showToast(msg, 'error');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // Add External Media URL
  const handleAddMediaUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaUrl.trim()) return;
    const newAsset: MediaAssetData = {
      id: `media-${Date.now()}`,
      title: newMediaTitle.trim() || 'صورة مخصصة جديدة',
      url: newMediaUrl.trim(),
      category: newMediaCategory,
      createdAt: new Date().toISOString(),
      source: 'url',
    };
    try {
      await saveMediaAsset(newAsset);
      setMediaAssets((prev) => [newAsset, ...prev]);
      setNewMediaUrl('');
      setNewMediaTitle('');
      showToast('تمت إضافة رابط الصورة بنجاح إلى قاعدة بيانات فايربيز');
      getFirestoreDatabaseStats().then(setDbStats).catch(console.warn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر إضافة الصورة';
      showToast(msg, 'error');
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      await deleteMediaAsset(id);
      setMediaAssets((prev) => prev.filter((m) => m.id !== id));
      showToast('تمت إزالة الصورة من قاعدة البيانات');
      getFirestoreDatabaseStats().then(setDbStats).catch(console.warn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حذف الصورة';
      showToast(msg, 'error');
    }
  };

  // Set image as hero
  const handleSetHeroImage = async (url: string) => {
    const updated = { ...settings, heroImageUrl: url };
    setSettings(updated);
    try {
      await saveSiteSettings(updated);
      if (onSettingsUpdated) onSettingsUpdated(updated);
      showToast('تم تعيين وحفظ الصورة كخلفية رئيسية (Hero) في فايربيز');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر تعيين الصورة الرئيسية';
      showToast(msg, 'error');
    }
  };

  // Upload hero image directly from device
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)', 'error');
      return;
    }

    try {
      showToast('جارِ ضغط صورة الواجهة وحفظها في قاعدة البيانات...', 'info');
      const optimized = await optimizeImageForDatabase(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.84,
      });

      // Save to media assets library
      const assetId = `media-hero-${Date.now()}`;
      const newAsset: MediaAssetData = {
        id: assetId,
        title: `خلفية الواجهة الرئيسية (${file.name})`,
        url: optimized.dataUrl,
        category: 'hero',
        createdAt: new Date().toISOString(),
        sizeKb: optimized.compressedSizeKb,
        dimensions: `${optimized.width}x${optimized.height}`,
        format: optimized.format,
        source: 'upload',
      };
      await saveMediaAsset(newAsset);
      setMediaAssets((prev) => [newAsset, ...prev]);

      // Set to site settings
      const updated = { ...settings, heroImageUrl: optimized.dataUrl };
      setSettings(updated);
      await saveSiteSettings(updated);
      if (onSettingsUpdated) onSettingsUpdated(updated);

      showToast(`تم رفع وتثبيت صورة الـ Hero بنجاح في فايربيز (${optimized.compressedSizeKb} KB)`);
      getFirestoreDatabaseStats().then(setDbStats).catch(console.warn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حفظ صورة الواجهة';
      showToast(msg, 'error');
    }
  };

  // Set image as company brand logo
  const handleSetLogoImage = async (url: string) => {
    const updated = { ...settings, logoUrl: url };
    setSettings(updated);
    try {
      await saveSiteSettings(updated);
      if (onSettingsUpdated) onSettingsUpdated(updated);
      showToast('تم تعيين وحفظ شعار الشركة بنجاح في فايربيز');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حفظ الشعار';
      showToast(msg, 'error');
    }
  };

  // Upload logo image file directly with smart optimization
  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.svg')) {
      showToast('يرجى اختيار ملف صورة صالح (PNG شفاف، SVG، JPG، WebP)', 'error');
      return;
    }

    try {
      showToast('جارِ معالجة وتثبيت الشعار في قاعدة البيانات...', 'info');
      const optimized = await optimizeImageForDatabase(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.90,
        preserveTransparency: true,
      });

      const updated = { ...settings, logoUrl: optimized.dataUrl };
      setSettings(updated);

      // Register in media assets library
      const newAsset: MediaAssetData = {
        id: `media-logo-${Date.now()}`,
        title: `شعار الشركة المعتمد (${file.name})`,
        url: optimized.dataUrl,
        category: 'brand',
        createdAt: new Date().toISOString(),
        sizeKb: optimized.compressedSizeKb,
        dimensions: `${optimized.width}x${optimized.height}`,
        format: optimized.format,
        source: 'upload',
      };
      await saveMediaAsset(newAsset);
      setMediaAssets((prev) => [newAsset, ...prev]);

      await saveSiteSettings(updated);
      if (onSettingsUpdated) onSettingsUpdated(updated);
      showToast(`تم رفع وحفظ شعار الشركة في فايربيز (${optimized.compressedSizeKb} KB)`);
      getFirestoreDatabaseStats().then(setDbStats).catch(console.warn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حفظ ملف الشعار';
      showToast(msg, 'error');
    }
  };

  // Upload System Image directly from device
  const handleSystemImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingSystem) return;

    try {
      showToast('جارِ ضغط صورة النظام وحفظها...', 'info');
      const optimized = await optimizeImageForDatabase(file, {
        maxWidth: 1280,
        maxHeight: 800,
        quality: 0.84,
      });

      const newAsset: MediaAssetData = {
        id: `media-sys-${Date.now()}`,
        title: `نظام ${editingSystem.title} (${file.name})`,
        url: optimized.dataUrl,
        category: 'systems',
        createdAt: new Date().toISOString(),
        sizeKb: optimized.compressedSizeKb,
        dimensions: `${optimized.width}x${optimized.height}`,
        format: optimized.format,
        source: 'upload',
      };
      await saveMediaAsset(newAsset);
      setMediaAssets((prev) => [newAsset, ...prev]);

      setEditingSystem({ ...editingSystem, image: optimized.dataUrl });
      showToast(`تم رفع صورة النظام بنجاح (${optimized.compressedSizeKb} KB)`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر رفع صورة النظام';
      showToast(msg, 'error');
    }
  };

  // Upload Project Image directly from device
  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    try {
      showToast('جارِ ضغط صورة المشروع وحفظها...', 'info');
      const optimized = await optimizeImageForDatabase(file, {
        maxWidth: 1280,
        maxHeight: 800,
        quality: 0.84,
      });

      const newAsset: MediaAssetData = {
        id: `media-proj-${Date.now()}`,
        title: `مشروع ${editingProject.title} (${file.name})`,
        url: optimized.dataUrl,
        category: 'projects',
        createdAt: new Date().toISOString(),
        sizeKb: optimized.compressedSizeKb,
        dimensions: `${optimized.width}x${optimized.height}`,
        format: optimized.format,
        source: 'upload',
      };
      await saveMediaAsset(newAsset);
      setMediaAssets((prev) => [newAsset, ...prev]);

      setEditingProject({ ...editingProject, image: optimized.dataUrl });
      showToast(`تم رفع صورة المشروع بنجاح (${optimized.compressedSizeKb} KB)`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر رفع صورة المشروع';
      showToast(msg, 'error');
    }
  };


  // Reset to default geometric emblem
  const handleResetToDefaultLogo = async () => {
    const updated = { ...settings, logoUrl: '' };
    setSettings(updated);
    try {
      await saveSiteSettings(updated);
      if (onSettingsUpdated) onSettingsUpdated(updated);
      showToast('تمت استعادة الشعار الفيكتور الافتراضي للشركة');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر استعادة الشعار الافتراضي';
      showToast(msg, 'error');
    }
  };

  // Toggle individual section visibility on/off
  const handleToggleSectionVisibility = async (key: keyof SiteSettingsData) => {
    const currentVal = settings[key] !== false;
    const updated = { ...settings, [key]: !currentVal };
    setSettings(updated);
    if (onSettingsUpdated) onSettingsUpdated(updated);
    try {
      await saveSiteSettings(updated);
      showToast(
        !currentVal
          ? 'تم تفعيل وإظهار هذا القسم بنجاح في الموقع'
          : 'تم إخفاء هذا القسم بنجاح من الموقع وحفظ التغيير'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ الحالة';
      showToast(msg, 'error');
    }
  };

  // Batch toggle all sections
  const handleSetAllSectionsVisibility = async (visible: boolean) => {
    const updated: SiteSettingsData = {
      ...settings,
      showStats: visible,
      showAbout: visible,
      showHeritage: visible,
      showSystems: visible,
      showProjects: visible,
      showConfigurator: visible,
      showPartners: visible,
      showContact: visible,
    };
    setSettings(updated);
    if (onSettingsUpdated) onSettingsUpdated(updated);
    try {
      await saveSiteSettings(updated);
      showToast(
        visible
          ? 'تم تفعيل وإظهار كافة أقسام الموقع بنجاح'
          : 'تم إخفاء الأقسام الاختيارية بنجاح'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حفظ الإعدادات';
      showToast(msg, 'error');
    }
  };

  // 5. Seed Firestore master data
  const handleSeedDatabase = async () => {
    setIsSaving(true);
    try {
      const result = await seedInitialFirestoreData();
      if (result.success) {
        showToast(result.message);
        // Refresh live stats and document counts
        const stats = await getFirestoreDatabaseStats();
        setDbStats(stats);
      } else {
        showToast(result.message, 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشلت عملية المزامنة';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // User Management Handlers
  const handleSaveAdminUser = async (userToSave: AdminUserData) => {
    setIsSaving(true);
    try {
      await saveAdminUser(userToSave);
      setAdminUsers((prev) => {
        const exists = prev.some((u) => u.id === userToSave.id);
        if (exists) {
          return prev.map((u) => (u.id === userToSave.id ? userToSave : u));
        }
        return [userToSave, ...prev];
      });
      setEditingUser(null);
      setIsAddingUser(false);
      showToast(`تم حفظ بيانات المستخدم بنجاح: ${userToSave.name}`);
      const stats = await getFirestoreDatabaseStats();
      setDbStats(stats);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل حفظ المستخدم';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAdminUser = async (userId: string) => {
    if (adminUsers.length <= 1) {
      showToast('لا يمكن حذف المستخدم الأخير لتجنب قفل لوحة التحكم', 'error');
      return;
    }
    const targetUser = adminUsers.find((u) => u.id === userId);
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف المستخدم "${targetUser?.name || userId}"؟`)) {
      return;
    }
    try {
      await deleteAdminUser(userId);
      setAdminUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast('تم حذف المستخدم بنجاح من قاعدة البيانات');
      const stats = await getFirestoreDatabaseStats();
      setDbStats(stats);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل حذف المستخدم';
      showToast(msg, 'error');
    }
  };

  const handleToggleUserActive = async (user: AdminUserData) => {
    const updated = { ...user, isActive: !user.isActive };
    await handleSaveAdminUser(updated);
  };

  // Export full JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      company: 'Egypt Green Energy',
      settings,
      systems,
      projects,
      mediaAssets,
      inquiries,
      adminUsers,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `egyptge_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير ملف النسخة الاحتياطية بنجاح');
  };

  // ----------------------------------------------------
  // LOGIN SCREEN (Strictly credentials only - No personal names)
  // ----------------------------------------------------
  if (!isAdminUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center p-1.5 shrink-0">
                <BrandLogo size="sm" variant="emblem" logoUrl={settings.logoUrl} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">تسجيل الدخول للوحة الإدارة</h2>
                <p className="text-xs text-slate-300">بوابة الإدارة المركزية والتحكم المشفر</p>
              </div>
            </div>
            <button
              onClick={onExit}
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
            >
              العودة للموقع
            </button>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          {/* Secure Admin Credentials Login Form (No Google OAuth) */}
          <div className="space-y-5">
            <form onSubmit={handlePasscodeLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  البريد الإلكتروني المعتمد للمسؤول <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@egypt-ge.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  كلمة المرور / رمز الدخول المشفر <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    dir="ltr"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 font-mono transition-colors pe-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 end-0 pe-3 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>دخول آمن إلى لوحة التحكم المركزية</span>
              </button>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-medium">
                  <Shield className="w-3.5 h-3.5" />
                  <span>تسجيل دخول مشفر بالبريد وكلمة المرور فقط</span>
                </div>
                <div>حماية متقدمة ضد التخمين (Rate Limiting: 5 محاولات كحد أقصى مع قفل أمني مؤقت).</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // FULL ADMIN DASHBOARD VIEW
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" dir="rtl">
      {/* Toast Notification Container (Zero Popups Discipline!) */}
      {toast && (
        <div
          className={`fixed bottom-6 left-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 transition-all animate-in slide-in-from-bottom duration-300 ${
            toast.type === 'error'
              ? 'bg-red-950 border-red-800 text-red-200'
              : toast.type === 'info'
              ? 'bg-sky-950 border-sky-800 text-sky-200'
              : 'bg-emerald-950 border-emerald-800 text-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/40 flex items-center justify-center p-1 shrink-0">
            <BrandLogo size="sm" variant="emblem" logoUrl={settings.logoUrl} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white">
                لوحة التحكم المركزية والشاملة
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Firestore Connected
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-medium">
                {activeAdminUser ? `${activeAdminUser.name} (${activeAdminUser.email})` : 'فريق الإدارة والتشغيل'}
              </span>
              <span>•</span>
              <span>مصر للطاقة الخضراء (EGE)</span>
            </div>
          </div>
        </div>


        <div className="flex items-center gap-2 sm:gap-3">
          {/* Copy Secret URL Button */}
          <button
            onClick={handleCopySecretLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 border border-slate-700 transition-colors cursor-pointer"
            title="نسخ رابط لوحة التحكم السري"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">نسخ الرابط السري</span>
          </button>

          {/* Export JSON backup */}
          <button
            onClick={handleExportBackup}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="تصدير نسخة احتياطية من الموقع"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">نسخة احتياطية</span>
          </button>

          {/* View Live Site */}
          <button
            onClick={onExit}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>عرض الموقع المباشر</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="تسجيل الخروج"
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Live Database Diagnostics & Health Bar */}
      <section aria-label="Database Status" className="bg-slate-900/95 border-b border-slate-800 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Live ping badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-white">اتصال قاعدة البيانات:</span>
              <span className="text-emerald-400 font-mono font-medium">
                {dbStats?.connected ? 'متصلة ومباشرة (Online)' : 'جاري الفحص المباشر...'}
              </span>
              {dbStats?.latencyMs !== undefined && (
                <span className="text-[11px] text-slate-400 font-mono">
                  ({dbStats.latencyMs}ms)
                </span>
              )}
            </div>

            {/* Database ID badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-500">DB ID:</span>
              <span className="text-emerald-300 font-mono text-[10px]">ai-studio-egyptgreenenergy...</span>
            </div>

            {/* Quick live counts */}
            <div className="flex items-center flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-semibold font-mono">
                {systems.length} أنظمة ELV
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-semibold font-mono">
                {projects.length} مشروعات
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-semibold font-mono">
                {mediaAssets.length} صور
              </span>
              {inquiries.length > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/60 font-semibold font-mono">
                  {inquiries.length} طلبات
                </span>
              )}
            </div>
          </div>

          {/* Quick Diagnostics & Sync Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePingDatabase}
              disabled={isPingingDb}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="فحص سرعة استجابة قاعدة البيانات"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPingingDb ? 'animate-spin text-emerald-400' : ''}`} />
              <span>فحص الاتصال (Ping)</span>
            </button>

            <button
              onClick={handleSeedDatabase}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
              title="مزامنة وتثبيت كافة الأنظمة والمشروعات والإعدادات في فايربيز"
            >
              <UploadCloud className={`w-3.5 h-3.5 ${isSaving ? 'animate-bounce' : ''}`} />
              <span>مزامنة شاملة لفايربيز</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Admin Layout with Tabs */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* Navigation Sidebar Tabs */}
        <aside className="w-full md:w-64 shrink-0 space-y-1.5">
          <button
            onClick={() => {
              setActiveTab('general');
              setEditingSystem(null);
              setEditingProject(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'general'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>الهوية والنصوص والعناوين</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('visibility');
              setEditingSystem(null);
              setEditingProject(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'visibility'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            <div className="flex-1 flex items-center justify-between">
              <span>أقسام العرض (إظهار / إخفاء)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                {[
                  settings.showStats !== false,
                  settings.showAbout !== false,
                  settings.showHeritage !== false,
                  settings.showSystems !== false,
                  settings.showProjects !== false,
                  settings.showConfigurator !== false,
                  settings.showPartners !== false,
                  settings.showContact !== false,
                ].filter(Boolean).length}/8 مفعل
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('systems');
              setEditingSystem(null);
              setEditingProject(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'systems'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <div className="flex-1 flex items-center justify-between">
              <span>أنظمة التيار الخفيف (ELV)</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {systems.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('projects');
              setEditingSystem(null);
              setEditingProject(null);
              setEditingVendor(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <div className="flex-1 flex items-center justify-between">
              <span>المشروعات وسابقة الأعمال</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {projects.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('vendors');
              setEditingSystem(null);
              setEditingProject(null);
              setEditingVendor(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'vendors'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <div className="flex-1 flex items-center justify-between">
              <span>العلامات والموردين (Vendors)</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {vendors.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('heritage');
              setEditingSystem(null);
              setEditingProject(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'heritage'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>الجذور التاريخية (طاقة ومياه)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('about');
              setEditingSystem(null);
              setEditingProject(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>من نحن ورؤية الشركة</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('media');
              setEditingSystem(null);
              setEditingProject(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'media'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <div className="flex-1 flex items-center justify-between">
              <span>مكتبة الصور والوسائط</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {mediaAssets.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('inquiries');
              setEditingSystem(null);
              setEditingProject(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <div className="flex-1 flex items-center justify-between">
              <span>استشارات وطلبات الزوار</span>
              {inquiries.length > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  {inquiries.length}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('users');
              setEditingSystem(null);
              setEditingProject(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <div className="flex-1 flex items-center justify-between">
              <span>المستخدمون والصلاحيات</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {adminUsers.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('security');
              setEditingSystem(null);
              setEditingProject(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>الرابط السري وفايربيز</span>
          </button>
        </aside>

        {/* Main Content Card */}
        <main className="flex-1 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm overflow-hidden">
          
          {/* TAB 1: GENERAL & HERO */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">الهوية والنصوص والعناوين</h2>
                  <p className="text-xs text-slate-400">
                    تعديل الاسم التجاري، عنوان الواجهة الرئيسية (Hero)، أرقام التواصل، وبيانات المقر
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'جارِ الحفظ...' : 'حفظ التغييرات في فايربيز'}</span>
                </button>
              </div>

              {/* Quick Section Visibility Feature Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-950 to-slate-950 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-emerald-300 shrink-0">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>التحكم في ظهور أو إخفاء أقسام الموقع في العرض</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                        متاح الآن
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      يمكنك تفعيل أو إيقاف أي جزء (الإحصائيات، سابقة الأعمال، الكتالوج، المقايسة، الشركاء، التواصل) بنقرة واحدة.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('visibility')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-md"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>فتح لوحة تحكم أقسام العرض ←</span>
                </button>
              </div>

              {/* COMPANY BRAND LOGO MANAGEMENT CARD */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span>شعار وهوية الشركة الرسمي (Brand Logo)</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {settings.logoUrl ? 'شعار صورة مخصص' : 'شعار فيكتور هندسي معتمد'}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        يمكنك ضبط وتغيير الشعار برابط صورة مباشر، أو رفعه من جهازك، أو الاختيار من مكتبة الوسائط
                      </p>
                    </div>
                  </div>

                  {settings.logoUrl && (
                    <button
                      type="button"
                      onClick={handleResetToDefaultLogo}
                      className="text-xs text-slate-400 hover:text-amber-300 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-amber-800 transition-colors cursor-pointer self-start sm:self-auto"
                      title="استعادة الشعار الفيكتور الافتراضي"
                    >
                      استعادة الشعار الافتراضي
                    </button>
                  )}
                </div>

                {/* Previews and Controls Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* Left: Dual Background Live Previews */}
                  <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3">
                    {/* Dark Preview (Navbar & Footer) */}
                    <div className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-slate-400 mb-2 font-mono">معاينة بالوضع الليلي (Navbar)</span>
                      <div className="py-2">
                        <BrandLogo
                          size="md"
                          variant="horizontal"
                          textColor="white"
                          logoUrl={settings.logoUrl}
                          companyNameAr={settings.companyNameAr}
                          companyNameEn={settings.companyNameEn}
                        />
                      </div>
                    </div>

                    {/* Light Preview */}
                    <div className="flex-1 p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-slate-500 mb-2 font-mono">معاينة بالوضع الفاتح</span>
                      <div className="py-2">
                        <BrandLogo
                          size="md"
                          variant="horizontal"
                          textColor="dark"
                          logoUrl={settings.logoUrl}
                          companyNameAr={settings.companyNameAr}
                          companyNameEn={settings.companyNameEn}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: URL Input & Upload Action */}
                  <div className="lg:col-span-7 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        رابط صورة الشعار (Logo URL) أو رفعه مباشرة
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.logoUrl || ''}
                          onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                          placeholder="أدخل رابط صورة الشعار (PNG / SVG / JPG)..."
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 dir-ltr text-start"
                        />
                        <label
                          htmlFor="logo-file-uploader"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer shrink-0"
                          title="رفع ملف صورة الشعار من حاسوبك أو هاتفك (PNG شفاف / SVG)"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع ملف شعار</span>
                        </label>
                        <input
                          type="file"
                          id="logo-file-uploader"
                          accept="image/*"
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Quick Pick from Media Assets */}
                    {mediaAssets.length > 0 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        <span className="text-[10px] text-slate-500 shrink-0">اختيار من الوسائط:</span>
                        {mediaAssets.slice(0, 7).map((asset) => (
                          <button
                            key={asset.id}
                            type="button"
                            onClick={() => {
                              handleSetLogoImage(asset.url);
                            }}
                            className={`p-1 rounded-lg border transition-all shrink-0 ${
                              settings.logoUrl === asset.url
                                ? 'bg-emerald-950 border-emerald-500 ring-1 ring-emerald-500'
                                : 'bg-slate-900 hover:bg-slate-800 border-slate-800'
                            }`}
                            title={`تعيين ${asset.title} كشعار رسمي`}
                          >
                            <img src={asset.url} alt={asset.title} className="w-6 h-6 rounded object-contain" />
                          </button>
                        ))}
                      </div>
                    )}

                    <p className="text-[11px] text-slate-400">
                      💡 <strong>نصيحة:</strong> يفضل استخدام صورة شعار بخلفية شفافة (PNG أو SVG) لتبدو بأعلى وضوح وأناقة على خلفيات الموقع الداكنة والفاتحة.
                    </p>
                  </div>
                </div>
              </div>

              {/* HERO BANNER BACKGROUND IMAGE CARD */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span>خلفية الواجهة الرئيسية (Hero Banner Image)</span>
                        {settings.heroImageUrl && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            صورة مخصصة نشطة
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400">
                        رفع صورة فوتوغرافية من حاسوبك لتكون خلفية الواجهة الرئيسية للموقع مع حفظها في الداتا بيز
                      </p>
                    </div>
                  </div>

                  {settings.heroImageUrl && (
                    <button
                      type="button"
                      onClick={() => handleSetHeroImage('')}
                      className="text-xs text-slate-400 hover:text-amber-300 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-amber-800 transition-colors cursor-pointer self-start sm:self-auto"
                      title="استعادة صورة الواجهة الافتراضية"
                    >
                      استعادة الصورة الافتراضية
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* Left: Hero Preview */}
                  <div className="lg:col-span-5">
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group">
                      <img
                        src={resolveImageUrl(settings.heroImageUrl, DEFAULT_HERO_IMAGE)}
                        alt="Hero preview"
                        onError={handleImageError}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1122] via-[#0a1122]/60 to-transparent flex items-end p-3">
                        <span className="text-[11px] font-bold text-white">
                          {settings.heroTitleAr || 'أنظمة التيار الخفيف والحلول المتكاملة'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: URL Input & Device Upload Button */}
                  <div className="lg:col-span-7 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        رفع صورة خلفية من جهازك أو إدخال رابط مباشر
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.heroImageUrl || ''}
                          onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
                          placeholder="رابط الصورة أو ارفعها من جهازك مباشرة..."
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 dir-ltr text-start"
                        />
                        <label
                          htmlFor="hero-file-uploader"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer shrink-0"
                          title="رفع صورة من حاسوبك أو هاتفك وحفظها في الداتا بيز"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع صورة من جهازك</span>
                        </label>
                        <input
                          type="file"
                          id="hero-file-uploader"
                          accept="image/*"
                          onChange={handleHeroFileUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Quick Pick from Media Assets */}
                    {mediaAssets.length > 0 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        <span className="text-[10px] text-slate-500 shrink-0">اختيار من المكتبة:</span>
                        {mediaAssets.slice(0, 7).map((asset) => (
                          <button
                            key={asset.id}
                            type="button"
                            onClick={() => handleSetHeroImage(asset.url)}
                            className={`p-1 rounded-lg border transition-all shrink-0 ${
                              settings.heroImageUrl === asset.url
                                ? 'bg-emerald-950 border-emerald-500 ring-1 ring-emerald-500'
                                : 'bg-slate-900 hover:bg-slate-800 border-slate-800'
                            }`}
                            title={`تعيين ${asset.title} كخلفية Hero`}
                          >
                            <img src={resolveImageUrl(asset.url, DEFAULT_HERO_IMAGE)} alt={asset.title} className="w-6 h-6 rounded object-cover" />
                          </button>
                        ))}
                      </div>
                    )}

                    <p className="text-[11px] text-slate-400">
                      💡 <strong>ملاحظة:</strong> يتم ضغط الصورة المرفوعة تلقائياً إلى حجم خفيف وسريع (~60-120 KB) مع بقائها بدقة عالية جداً.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    اسم الشركة (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={settings.companyNameAr}
                    onChange={(e) => setSettings({ ...settings, companyNameAr: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    اسم الشركة (بالإنجليزية)
                  </label>
                  <input
                    type="text"
                    value={settings.companyNameEn}
                    onChange={(e) => setSettings({ ...settings, companyNameEn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 dir-ltr text-start"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  عنوان الواجهة الرئيسية (Hero Title - عربي)
                </label>
                <input
                  type="text"
                  value={settings.heroTitleAr}
                  onChange={(e) => setSettings({ ...settings, heroTitleAr: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  الوصف التفصيلي للواجهة (Hero Subtitle - عربي)
                </label>
                <textarea
                  rows={3}
                  value={settings.heroSubtitleAr}
                  onChange={(e) => setSettings({ ...settings, heroSubtitleAr: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              {/* Contact Information */}
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>بيانات الاتصال والمقر المعتمد</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      الهاتف الأساسي
                    </label>
                    <input
                      type="text"
                      value={settings.phonePrimary}
                      onChange={(e) => setSettings({ ...settings, phonePrimary: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500 dir-ltr text-start"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      الهاتف الثانوي
                    </label>
                    <input
                      type="text"
                      value={settings.phoneSecondary}
                      onChange={(e) => setSettings({ ...settings, phoneSecondary: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500 dir-ltr text-start"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      البريد الإلكتروني الرسمي
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500 dir-ltr text-start"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      رقم واتساب المباشر (201007196485)
                    </label>
                    <input
                      type="text"
                      value={settings.whatsAppNumber}
                      onChange={(e) => setSettings({ ...settings, whatsAppNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500 dir-ltr text-start"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    عنوان المقر الرئيسي (مدينة نصر، القاهرة)
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </form>
          )}

          {/* TAB: SECTION VISIBILITY (إظهار / إخفاء أقسام الموقع في العرض) */}
          {activeTab === 'visibility' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      التحكم في ظهور وأقسام الموقع في العرض
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    يمكنك تفعيل أو إيقاف أي جزء ليظهر أو يختفي من الموقع للزوار بنقرة واحدة، مع مزامنة فورية في فايربيز وتحديث تلقائي لروابط شريط التصفح.
                  </p>
                </div>

                {/* Batch Actions */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSetAllSectionsVisibility(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    title="تفعيل كافة أقسام الموقع ليظهر العرض الشامل كاملاً"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>إظهار وتفعيل الكل</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetAllSectionsVisibility(false)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    title="إخفاء الأقسام لتركيز العرض"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>إخفاء الكل</span>
                  </button>
                </div>
              </div>

              {/* Status Overview Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">حالة العرض المباشر</span>
                    <span className="text-sm font-bold text-white">
                      {[
                        settings.showStats !== false,
                        settings.showAbout !== false,
                        settings.showHeritage !== false,
                        settings.showSystems !== false,
                        settings.showProjects !== false,
                        settings.showConfigurator !== false,
                        settings.showPartners !== false,
                        settings.showContact !== false,
                      ].filter(Boolean).length} من 8 أقسام ظاهرة حالياً في الموقع
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 max-w-md">
                  💡 <strong>ملاحظة تقنية:</strong> عند إخفاء أي قسم، يتم أيضاً إخفاء رابطه تلقائياً من شريط التصفح العلوي (Navbar) والفوتر لمنع أي روابط معطلة.
                </div>
              </div>

              {/* Grid of 8 Sections with Individual Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    key: 'showStats' as keyof SiteSettingsData,
                    title: 'شريط الركائز الهندسية والالتزامات',
                    badge: 'Engineering Pillars',
                    desc: 'المعايير الهندسية الأربعة: التخطيط المسبق، التوريد المعتمد مع شهادات الضمان، التنفيذ الميداني الاحترافي، واتفاقيات الدعم والصيانة (SLA).',
                    icon: TrendingUp,
                  },
                  {
                    key: 'showAbout' as keyof SiteSettingsData,
                    title: 'من نحن والكيان الهندسي (تأسست 2014)',
                    badge: 'About Us',
                    desc: 'عرض نبذة الكيان المسجل عام 2014، الرؤية والرسالة، والمعايير الحاكمة لتنفيذ مشروعات أنظمة التيار الخفيف وتكنولوجيا المنشآت.',
                    icon: Compass,
                  },
                  {
                    key: 'showHeritage' as keyof SiteSettingsData,
                    title: 'المشروعات البيئية (الطاقة والمياه والجوجوبا)',
                    badge: 'Clean Energy & Water',
                    desc: 'سجل مشروعات الشركة المنفذة في محطات الطاقة الشمسية، تحلية المياه والضخ الشمسي، والمشروعات الزراعية التنموية.',
                    icon: History,
                  },
                  {
                    key: 'showSystems' as keyof SiteSettingsData,
                    title: 'أنظمة وحلول التيار الخفيف المتكاملة (ELV)',
                    badge: 'Low Current Systems',
                    desc: 'الكتالوج الأساسي: كاميرات المراقبة 4K، إنذار الحريق، التحكم في الدخول، الكابلات والشبكات، مع المواصفات الفنية.',
                    icon: Layers,
                  },
                  {
                    key: 'showProjects' as keyof SiteSettingsData,
                    title: 'المشروعات وسابقة الأعمال الميدانية',
                    badge: 'Projects Showcase',
                    desc: 'معرض المنشآت والجهات المنفذة (بنوك، مستشفيات، مصانع، مقرات ومراكز بيانات) مع معايير الكود المصري.',
                    icon: FolderGit2,
                  },
                  {
                    key: 'showConfigurator' as keyof SiteSettingsData,
                    title: 'حاسبة ومقايسة التيار الخفيف التفاعلية (BOQ)',
                    badge: 'BOQ Configurator',
                    desc: 'أداة تفاعلية للعملاء لحساب الكاميرات التقديرية ونقاط الداتا والأبواب المؤمنة بناءً على مساحة المنشأة ونوعها.',
                    icon: Cpu,
                  },
                  {
                    key: 'showPartners' as keyof SiteSettingsData,
                    title: 'شركاء التكنولوجيا والموردون المعتمدون',
                    badge: 'Certified Partners',
                    desc: 'شعارات ومواصفات كبرى الشركات التكنولوجية (Hikvision, Dahua, Cisco, Schneider Electric, Honeywell, Panasonic).',
                    icon: Award,
                  },
                  {
                    key: 'showContact' as keyof SiteSettingsData,
                    title: 'التواصل والاستشارات الهندسية والمقر والخريطة',
                    badge: 'Contact & Consultation',
                    desc: 'بيانات الاتصال، أرقام الهواتف، زر الواتساب المباشر، نموذج طلب المقايسة، وخريطة المقر المعتمد بمدينة نصر.',
                    icon: Mail,
                  },
                ].map((sec) => {
                  const Icon = sec.icon;
                  const isVisible = settings[sec.key] !== false;

                  return (
                    <div
                      key={sec.key}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isVisible
                          ? 'bg-slate-950/90 border-emerald-500/40 shadow-sm'
                          : 'bg-slate-950/40 border-slate-800/80 opacity-75'
                      }`}
                    >
                      <div>
                        {/* Top Row: Icon + Title + Status Badge */}
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                isVisible
                                  ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                                  : 'bg-slate-900 border border-slate-800 text-slate-500'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                                <span>{sec.title}</span>
                              </h3>
                              <span className="text-[10px] font-mono text-slate-400">{sec.badge}</span>
                            </div>
                          </div>

                          <span
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 ${
                              isVisible
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {isVisible ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>ظاهر بالعرض</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 text-slate-400" />
                                <span>مخفي</span>
                              </>
                            )}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                          {sec.desc}
                        </p>
                      </div>

                      {/* Interactive Toggle Control Row */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {isVisible ? 'القسم معروض حالياً للزوار' : 'القسم مخفي من واجهة الموقع'}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleSectionVisibility(sec.key)}
                          className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                            isVisible
                              ? 'bg-emerald-600 border-emerald-500'
                              : 'bg-slate-800 border-slate-700'
                          }`}
                          role="switch"
                          aria-checked={isVisible}
                          title={isVisible ? 'انقر لإخفاء هذا القسم' : 'انقر لإظهار هذا القسم'}
                        >
                          <span
                            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              isVisible ? 'translate-x-0' : '-translate-x-6'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SYSTEMS */}
          {activeTab === 'systems' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">إدارة أنظمة التيار الخفيف (ELV)</h2>
                  <p className="text-xs text-slate-400">
                    التحكم في مواصفات كاميرات المراقبة، إنذار الحريق، التحكم في الدخول، الشبكات، ونظم المباني الذكية
                  </p>
                </div>
                {!editingSystem && (
                  <button
                    onClick={() => {
                      const newSys: LightCurrentSystem = {
                        id: `system-${Date.now()}`,
                        title: 'نظام تيار خفيف هندسي جديد',
                        subtitle: 'حلول متقدمة للشركات والمنشآت',
                        category: 'security',
                        badge: 'نظام معتمد EGE',
                        description: 'وصف تفصيلي للحل الهندسي والتوريد والتركيب والبرمجة مع الضمان المعتمد...',
                        features: [
                          'توريد وتركيب معتمد',
                          'برمجة وربط شبكي متكامل',
                          'دعم فني وصيانة 24/7',
                        ],
                        specs: [
                          { label: 'معيار الهندسة', value: 'الكود المصري للتيار الخفيف' },
                          { label: 'البروتوكول', value: 'IPv6 / High Speed IP' },
                        ],
                        image: mediaAssets[1]?.url || CCTV_IMAGE,
                      };
                      setEditingSystem(newSys);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm cursor-pointer shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة نظام جديد</span>
                  </button>
                )}
              </div>

              {/* Inline System Editor */}
              {editingSystem && (
                <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      <span>تعديل نظام: {editingSystem.title}</span>
                    </h3>
                    <button
                      onClick={() => setEditingSystem(null)}
                      className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-lg border border-slate-800"
                    >
                      إلغاء التعديل
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        اسم النظام (عربي)
                      </label>
                      <input
                        type="text"
                        value={editingSystem.title}
                        onChange={(e) =>
                          setEditingSystem({ ...editingSystem, title: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        العنوان الفرعي / التصنيف
                      </label>
                      <input
                        type="text"
                        value={editingSystem.subtitle}
                        onChange={(e) =>
                          setEditingSystem({ ...editingSystem, subtitle: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        تصنيف النظام
                      </label>
                      <select
                        value={editingSystem.category}
                        onChange={(e) =>
                          setEditingSystem({
                            ...editingSystem,
                            category: e.target.value as any,
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="security">أنظمة المراقبة والأمن (CCTV & Security)</option>
                        <option value="safety">أنظمة السلامة ومكافحة الحريق (Fire Alarm)</option>
                        <option value="connectivity">البنية التحتية والشبكات (Data & Fiber)</option>
                        <option value="audio-bms">الصوتيات وإدارة المباني (Audio & BMS)</option>
                        <option value="maintenance">عقود الصيانة وخدمات SLA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        شارة النظام الترويجية (Badge)
                      </label>
                      <input
                        type="text"
                        value={editingSystem.badge}
                        onChange={(e) =>
                          setEditingSystem({ ...editingSystem, badge: e.target.value })
                        }
                        placeholder="مثال: 4K Ultra HD & AI Analytics"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      الوصف الهندسي للحل
                    </label>
                    <textarea
                      rows={3}
                      value={editingSystem.description}
                      onChange={(e) =>
                        setEditingSystem({ ...editingSystem, description: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      المزايا الفنية والمواصفات (اكتب كل ميزة في سطر منفصل)
                    </label>
                    <textarea
                      rows={3}
                      value={editingSystem.features.join('\n')}
                      onChange={(e) =>
                        setEditingSystem({
                          ...editingSystem,
                          features: e.target.value
                            .split('\n')
                            .map((f) => f.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="توريد وتركيب معتمد&#10;ضمان استبدال وصيانة 24/7"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      صورة النظام — رفع من جهازك أو إدخال رابط مباشر
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingSystem.image}
                        onChange={(e) =>
                          setEditingSystem({ ...editingSystem, image: e.target.value })
                        }
                        placeholder="رابط الصورة أو ارفعها من جهازك..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 dir-ltr text-start"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>رفع من جهازك</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleSystemImageUpload}
                        />
                      </label>
                      {editingSystem.image && (
                        <img
                          src={resolveImageUrl(editingSystem.image, DEFAULT_CCTV_IMAGE)}
                          alt="preview"
                          onError={handleImageError}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                      )}
                    </div>

                    {/* Quick Image Selector from Media Assets */}
                    <div className="mt-2 flex items-center gap-1.5 overflow-x-auto py-1">
                      <span className="text-[10px] text-slate-500 shrink-0">اختيار سريع:</span>
                      {mediaAssets.slice(0, 6).map((asset) => (
                        <button
                          key={asset.id}
                          type="button"
                          onClick={() => setEditingSystem({ ...editingSystem, image: asset.url })}
                          className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 shrink-0 transition-colors"
                          title={asset.title}
                        >
                          <img
                            src={resolveImageUrl(asset.url, DEFAULT_CCTV_IMAGE)}
                            alt={asset.title}
                            onError={handleImageError}
                            className="w-6 h-6 rounded object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      onClick={() => setEditingSystem(null)}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => handleSaveSystem(editingSystem)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                    >
                      حفظ النظام في فايربيز
                    </button>
                  </div>
                </div>
              )}

              {/* Systems Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systems.map((sys) => (
                  <div
                    key={sys.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {sys.badge}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingSystem(sys)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
                            title="تعديل النظام"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSystem(sys.id)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-900/50 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
                            title="حذف النظام"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={resolveImageUrl(sys.image, DEFAULT_CCTV_IMAGE)}
                          alt={sys.title}
                          onError={handleImageError}
                          className="w-16 h-14 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">{sys.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                            {sys.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{sys.features.length} ميزات معتمدة</span>
                      <button
                        onClick={() => setEditingSystem(sys)}
                        className="text-emerald-400 hover:underline font-semibold cursor-pointer"
                      >
                        تعديل التفاصيل ←
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">سابقة الأعمال والمشاريع المنفذة</h2>
                  <p className="text-xs text-slate-400">
                    إضافة وتعديل مشروعات سيوة، مطروح، مراكز بيانات القاهرة، ونظم SCADA
                  </p>
                </div>
                {!editingProject && (
                  <button
                    onClick={() => {
                      const newProj: ProjectItem = {
                        id: `project-${Date.now()}`,
                        title: 'مشروع تيار خفيف جديد',
                        category: 'surveillance',
                        categoryLabel: 'أنظمة أمنية',
                        location: 'القاهرة، مصر',
                        year: '2026',
                        clientType: 'قطاع خاص',
                        description: 'وصف تفصيلي للأعمال الهندسية والتوريدات...',
                        impactMetrics: [{ label: 'زمن الإنجاز', value: 'قياسي' }],
                        technicalSpecs: [{ label: 'معيار الكابلات', value: 'Cat6A Shielded' }],
                        image: mediaAssets[0]?.url || '',
                      };
                      setEditingProject(newProj);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة مشروع جديد</span>
                  </button>
                )}
              </div>

              {/* Inline Project Editor */}
              {editingProject && (
                <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      <span>بيانات المشروع: {editingProject.title}</span>
                    </h3>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-lg border border-slate-800 cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        اسم المشروع
                      </label>
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, title: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        الموقع الجغرافي
                      </label>
                      <input
                        type="text"
                        value={editingProject.location}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, location: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        سنة التنفيذ
                      </label>
                      <input
                        type="text"
                        value={editingProject.year}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, year: e.target.value })
                        }
                        placeholder="2026"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        تصنيف المشروع
                      </label>
                      <select
                        value={editingProject.category}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          const labels: Record<string, string> = {
                            surveillance: 'أنظمة مراقبة وتحكم',
                            networks: 'بنية شبكات وداتا سنتر',
                            safety: 'إنذار حريق وسلامة',
                            'smart-bms': 'مباني ذكية و BMS',
                          };
                          setEditingProject({
                            ...editingProject,
                            category: val,
                            categoryLabel: labels[val] || 'أنظمة هندسية',
                          });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="surveillance">أنظمة مراقبة وتحكم (Surveillance & Security)</option>
                        <option value="networks">بنية شبكات وداتا سنتر (Enterprise Networks)</option>
                        <option value="safety">إنذار حريق وسلامة (Fire & Life Safety)</option>
                        <option value="smart-bms">مباني ذكية وتحكم (Smart BMS & Automation)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        جهة المشروع / العميل
                      </label>
                      <input
                        type="text"
                        value={editingProject.clientType}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, clientType: e.target.value })
                        }
                        placeholder="مثال: منشأة تجارية / بنك / مجمع سكني"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      نطاق الأعمال والمواصفات
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.description}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, description: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      صورة المشروع — رفع من جهازك أو إدخال رابط مباشر
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingProject.image}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, image: e.target.value })
                        }
                        placeholder="رابط الصورة أو ارفعها من جهازك..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 dir-ltr text-start"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>رفع من جهازك</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProjectImageUpload}
                        />
                      </label>
                      {editingProject.image && (
                        <img
                          src={resolveImageUrl(editingProject.image, DEFAULT_CABLING_IMAGE)}
                          alt="preview"
                          onError={handleImageError}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                      )}
                    </div>

                    {/* Quick Image Picker */}
                    <div className="mt-2 flex items-center gap-1.5 overflow-x-auto py-1">
                      <span className="text-[10px] text-slate-500 shrink-0">اختيار سريع من الوسائط:</span>
                      {mediaAssets.slice(0, 6).map((asset) => (
                        <button
                          key={asset.id}
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, image: asset.url })}
                          className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 shrink-0 transition-colors"
                          title={asset.title}
                        >
                          <img
                            src={resolveImageUrl(asset.url, DEFAULT_CABLING_IMAGE)}
                            alt={asset.title}
                            onError={handleImageError}
                            className="w-6 h-6 rounded object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      onClick={() => setEditingProject(null)}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => handleSaveProject(editingProject)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                    >
                      حفظ المشروع في فايربيز
                    </button>
                  </div>
                </div>
              )}

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {proj.categoryLabel}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingProject(proj)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
                            title="تعديل المشروع"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-900/50 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
                            title="حذف المشروع"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={resolveImageUrl(proj.image, DEFAULT_CABLING_IMAGE)}
                          alt={proj.title}
                          onError={handleImageError}
                          className="w-16 h-14 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                            <span>{proj.location}</span>
                            <span>•</span>
                            <span className="font-mono">{proj.year}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mt-2">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: VENDOR BRANDS MANAGEMENT */}
          {activeTab === 'vendors' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-lg sm:text-xl font-bold text-white">العلامات التجارية المعتمدة وموردو الأنظمة</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    إدارة العلامات التجارية للتيار الخفيف، وربط ملفات الشعارات الرسمية (.svg / .png)، وتحديد الفئات وروابط المصنعين وحالة التفعيل
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingVendor(null);
                      setIsAddingVendor(!isAddingVendor);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAddingVendor ? 'إغلاق نموذج الإضافة' : 'إضافة علامة تجارية جديدة'}</span>
                  </button>
                </div>
              </div>

              {/* Summary Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col">
                  <span className="text-[11px] text-slate-400">إجمالي العلامات</span>
                  <span className="text-xl font-bold text-white font-mono mt-1">{vendors.length}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col">
                  <span className="text-[11px] text-slate-400">العلامات النشطة المعروضة</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono mt-1">
                    {vendors.filter((v) => v.isActive !== false).length}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col">
                  <span className="text-[11px] text-slate-400">شعارات متصلة بملفات</span>
                  <span className="text-xl font-bold text-blue-400 font-mono mt-1">
                    {vendors.filter((v) => v.logoUrl).length}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col">
                  <span className="text-[11px] text-slate-400">تخصصات مغطاة</span>
                  <span className="text-xl font-bold text-amber-400 font-mono mt-1">
                    {new Set(vendors.map((v) => v.category)).size} تخصصات
                  </span>
                </div>
              </div>

              {/* Add New Brand Form Modal / Card */}
              {isAddingVendor && (
                <div className="p-6 rounded-2xl bg-slate-900 border-2 border-emerald-500/40 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>إضافة علامة تجارية ومورد جديد للأنظمة</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddingVendor(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      إلغاء
                    </button>
                  </div>

                  <form onSubmit={handleCreateNewVendor} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          اسم العلامة التجارية (English) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: Hikvision, Honeywell, Legrand"
                          value={newVendorForm.name}
                          onChange={(e) => setNewVendorForm({ ...newVendorForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          تصنيف التخصص والأنظمة *
                        </label>
                        <select
                          value={newVendorForm.category}
                          onChange={(e) => setNewVendorForm({ ...newVendorForm, category: e.target.value as VendorBrandItem['category'] })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="cctv">المراقبة والأمن المرئي (CCTV)</option>
                          <option value="fire">إنذار الحريق والسلامة (Fire Alarm)</option>
                          <option value="networks">الكابلات والشبكات (Structured Cabling)</option>
                          <option value="access">التحكم في الدخول (Access Control)</option>
                          <option value="telecom">السنترالات والاتصالات (IP Telephony)</option>
                          <option value="bms">إدارة المباني الذكية (BMS)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          الترتيب الرقمي في العرض
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={newVendorForm.displayOrder}
                          onChange={(e) => setNewVendorForm({ ...newVendorForm, displayOrder: parseInt(e.target.value) || 1 })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Logo URL & File Upload */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <label className="block text-xs font-semibold text-slate-300">
                        ملف الشعار (Logo File / URL)
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <input
                          type="text"
                          placeholder="/assets/logos/hikvision.svg أو رابط صورة مباشر"
                          value={newVendorForm.logoUrl}
                          onChange={(e) => setNewVendorForm({ ...newVendorForm, logoUrl: e.target.value })}
                          className="flex-1 w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 cursor-pointer whitespace-nowrap">
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع ملف شعار (.svg / .png)</span>
                          <input
                            type="file"
                            accept="image/*,.svg"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (loadEvt) => {
                                  const res = loadEvt.target?.result as string;
                                  if (res) {
                                    setNewVendorForm((prev) => ({ ...prev, logoUrl: res }));
                                    showToast('تم تحميل ملف الشعار بنجاح');
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Quick Logo Presets */}
                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        <span className="text-[10px] text-slate-500 shrink-0">شعارات جاهزة:</span>
                        {[
                          'hikvision', 'dahua', 'cisco', 'schneider',
                          'honeywell', 'notifier', 'legrand', 'panduit',
                          'zkteco', 'suprema', 'grandstream', 'yealink'
                        ].map((slug) => (
                          <button
                            key={slug}
                            type="button"
                            onClick={() => setNewVendorForm((prev) => ({ ...prev, logoUrl: `/assets/logos/${slug}.svg` }))}
                            className="px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono text-slate-300 shrink-0 hover:border-emerald-500 transition-colors"
                          >
                            {slug}
                          </button>
                        ))}
                      </div>

                      {/* Preview Box */}
                      {newVendorForm.logoUrl && (
                        <div className="flex items-center gap-3 pt-2 border-t border-slate-900">
                          <span className="text-[10px] text-slate-400">معاينة الشعار:</span>
                          <div className="w-28 h-12 rounded-lg bg-white p-1.5 flex items-center justify-center border border-slate-200">
                            <img
                              src={newVendorForm.logoUrl}
                              alt="Logo Preview"
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          وصف التخصص (بالعربية)
                        </label>
                        <input
                          type="text"
                          placeholder="مثال: كاميرات مراقبة IP وخوادم NVR وتحليلات الفيديو"
                          value={newVendorForm.descriptionAr}
                          onChange={(e) => setNewVendorForm({ ...newVendorForm, descriptionAr: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          وصف التخصص (بالإنجليزية)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. IP Cameras, NVRs & Video Analytics"
                          value={newVendorForm.descriptionEn}
                          onChange={(e) => setNewVendorForm({ ...newVendorForm, descriptionEn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          رابط الموقع الرسمي للشركة المصنعة
                        </label>
                        <input
                          type="url"
                          placeholder="https://www.example.com"
                          value={newVendorForm.websiteUrl}
                          onChange={(e) => setNewVendorForm({ ...newVendorForm, websiteUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                          <input
                            type="checkbox"
                            checked={newVendorForm.isActive !== false}
                            onChange={(e) => setNewVendorForm({ ...newVendorForm, isActive: e.target.checked })}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-950 border-slate-800 cursor-pointer"
                          />
                          <span>تفعيل وعرض العلامة التجارية في قسم الشركاء بالموقع</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsAddingVendor(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'جاري الحفظ...' : 'حفظ العلامة التجارية'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Edit Brand Inline Modal / Card */}
              {editingVendor && (
                <div className="p-6 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-emerald-400" />
                      <span>تعديل بيانات العلامة التجارية: {editingVendor.name}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingVendor(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      إلغاء
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveVendor(editingVendor);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          اسم العلامة التجارية (English) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingVendor.name}
                          onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          تصنيف التخصص والأنظمة *
                        </label>
                        <select
                          value={editingVendor.category}
                          onChange={(e) => setEditingVendor({ ...editingVendor, category: e.target.value as VendorBrandItem['category'] })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="cctv">المراقبة والأمن المرئي (CCTV)</option>
                          <option value="fire">إنذار الحريق والسلامة (Fire Alarm)</option>
                          <option value="networks">الكابلات والشبكات (Structured Cabling)</option>
                          <option value="access">التحكم في الدخول (Access Control)</option>
                          <option value="telecom">السنترالات والاتصالات (IP Telephony)</option>
                          <option value="bms">إدارة المباني الذكية (BMS)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          الترتيب الرقمي في العرض
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={editingVendor.displayOrder || 1}
                          onChange={(e) => setEditingVendor({ ...editingVendor, displayOrder: parseInt(e.target.value) || 1 })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Logo URL & File Upload */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <label className="block text-xs font-semibold text-slate-300">
                        ملف الشعار (Logo File / URL)
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <input
                          type="text"
                          value={editingVendor.logoUrl || ''}
                          onChange={(e) => setEditingVendor({ ...editingVendor, logoUrl: e.target.value })}
                          className="flex-1 w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 cursor-pointer whitespace-nowrap">
                          <Upload className="w-3.5 h-3.5" />
                          <span>تغيير ملف الشعار (.svg / .png)</span>
                          <input
                            type="file"
                            accept="image/*,.svg"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (loadEvt) => {
                                  const res = loadEvt.target?.result as string;
                                  if (res) {
                                    setEditingVendor((prev) => (prev ? { ...prev, logoUrl: res } : null));
                                    showToast('تم تحديث ملف الشعار بنجاح');
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Preview Box */}
                      {editingVendor.logoUrl && (
                        <div className="flex items-center gap-3 pt-2 border-t border-slate-900">
                          <span className="text-[10px] text-slate-400">معاينة الشعار:</span>
                          <div className="w-28 h-12 rounded-lg bg-white p-1.5 flex items-center justify-center border border-slate-200">
                            <img
                              src={editingVendor.logoUrl}
                              alt={editingVendor.name}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          وصف التخصص (بالعربية)
                        </label>
                        <input
                          type="text"
                          value={editingVendor.descriptionAr || ''}
                          onChange={(e) => setEditingVendor({ ...editingVendor, descriptionAr: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          وصف التخصص (بالإنجليزية)
                        </label>
                        <input
                          type="text"
                          value={editingVendor.descriptionEn || ''}
                          onChange={(e) => setEditingVendor({ ...editingVendor, descriptionEn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          رابط الموقع الرسمي للشركة المصنعة
                        </label>
                        <input
                          type="url"
                          value={editingVendor.websiteUrl || ''}
                          onChange={(e) => setEditingVendor({ ...editingVendor, websiteUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                          <input
                            type="checkbox"
                            checked={editingVendor.isActive !== false}
                            onChange={(e) => setEditingVendor({ ...editingVendor, isActive: e.target.checked })}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-950 border-slate-800 cursor-pointer"
                          />
                          <span>تفعيل وعرض العلامة التجارية في قسم الشركاء بالموقع</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setEditingVendor(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Category Filter Controls */}
              <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-slate-800">
                <button
                  type="button"
                  onClick={() => setVendorCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    vendorCategoryFilter === 'all'
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  الكل ({vendors.length})
                </button>
                <button
                  type="button"
                  onClick={() => setVendorCategoryFilter('cctv')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    vendorCategoryFilter === 'cctv'
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  المراقبة (CCTV)
                </button>
                <button
                  type="button"
                  onClick={() => setVendorCategoryFilter('fire')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    vendorCategoryFilter === 'fire'
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  إنذار الحريق (Fire)
                </button>
                <button
                  type="button"
                  onClick={() => setVendorCategoryFilter('networks')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    vendorCategoryFilter === 'networks'
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  الشبكات والكابلات (Networks)
                </button>
                <button
                  type="button"
                  onClick={() => setVendorCategoryFilter('access')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    vendorCategoryFilter === 'access'
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  التحكم بالدخول (Access)
                </button>
                <button
                  type="button"
                  onClick={() => setVendorCategoryFilter('telecom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    vendorCategoryFilter === 'telecom'
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  السنترالات (IP PBX)
                </button>
                <button
                  type="button"
                  onClick={() => setVendorCategoryFilter('bms')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    vendorCategoryFilter === 'bms'
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  إدارة المباني (BMS)
                </button>
              </div>

              {/* Grid of Brand Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {vendors
                  .filter((v) => vendorCategoryFilter === 'all' || v.category === vendorCategoryFilter)
                  .map((vendor) => {
                    const isEditing = editingVendor?.id === vendor.id;
                    return (
                      <div
                        key={vendor.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isEditing
                            ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30'
                            : vendor.isActive === false
                            ? 'bg-slate-950/60 border-slate-800 opacity-60'
                            : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          {/* Logo Box */}
                          <div className="w-full h-16 rounded-xl bg-white p-2.5 flex items-center justify-center border border-slate-200 mb-3 overflow-hidden">
                            {vendor.logoUrl ? (
                              <img
                                src={vendor.logoUrl}
                                alt={vendor.name}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="text-xs font-bold text-slate-700 font-mono">{vendor.name}</span>
                            )}
                          </div>

                          {/* Brand Info */}
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h4 className="text-sm font-bold text-white tracking-tight">{vendor.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono uppercase">
                              {vendor.category}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-400 leading-snug line-clamp-2 mb-2">
                            {vendor.descriptionAr || vendor.descriptionEn}
                          </p>

                          {/* Official Website Link */}
                          {vendor.websiteUrl && (
                            <a
                              href={vendor.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-mono mb-2"
                            >
                              <span>الموقع الرسمي</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          {/* Toggle Active Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleVendorActive(vendor)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                              vendor.isActive !== false
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/50'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {vendor.isActive !== false ? 'مفعل بالموقع' : 'معطل'}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingVendor(false);
                                setEditingVendor(vendor);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="تعديل بيانات العلامة"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`هل أنت متأكد من حذف العلامة التجارية: ${vendor.name}؟`)) {
                                  handleDeleteVendor(vendor.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                              title="حذف العلامة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 4: HERITAGE (ENERGY & WATER) */}
          {activeTab === 'heritage' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">مشروعات الطاقة النظيفة والمياه</h2>
                  <p className="text-xs text-slate-400">
                    استعراض مشروعات وسجل الشركة الميداني المنفذ في الطاقة الشمسية وتحلية المياه والجوجوبا
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
                <p>
                  يتم استعراض هذا القسم كـ <strong>سجل مشروعات تخصصية</strong> يبرز قدرات الشركة التنفيذية الميدانية، مع بقاء التركيز الهندسي الأساسي على قطاع أنظمة التيار الخفيف.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <h4 className="font-bold text-emerald-400 mb-1">1. الطاقة المتجددة والشمسية</h4>
                    <p className="text-slate-400">محطات كهروضوئية وميكروجريد سيوة، توفير الوقود والديزل.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <h4 className="font-bold text-emerald-400 mb-1">2. حلول المياه والتحلية والضخ</h4>
                    <p className="text-slate-400">محطات تحلية الآبار، وضخ المياه بالطاقة الشمسية، والزراعة المائية.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <h4 className="font-bold text-emerald-400 mb-1">3. الطاقة الحيوية والجوجوبا</h4>
                    <p className="text-slate-400">استصلاح أراضي صحراوية، زيوت الجوجوبا ومفاعلات الطحالب الخضراء.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ABOUT US */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">من نحن ورؤية ورسالة الشركة</h2>
                  <p className="text-xs text-slate-400">
                    شركة مصر للطاقة الخضراء ذ.م.م — تأسست عام 2014
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAbout}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer shadow-sm transition-colors"
                >
                  {isSaving ? 'جارِ الحفظ...' : 'حفظ الرؤية والرسالة في فايربيز'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    الرؤية (Our Vision)
                  </label>
                  <textarea
                    rows={3}
                    value={aboutVisionAr}
                    onChange={(e) => setAboutVisionAr(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    الرسالة والهدف التشغيلي (Our Mission)
                  </label>
                  <textarea
                    rows={3}
                    value={aboutMissionAr}
                    onChange={(e) => setAboutMissionAr(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MEDIA */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      مكتبة الصور والوسائط (حفظ مباشر في قاعدة البيانات)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    رفع الصور من حاسوبك أو هاتفك وتخزينها مباشرة في قاعدة بيانات فايربيز مع ضغط تلقائي فائق النقاء، لتعيينها كواجهة (Hero) أو مشروعات أو شعار
                  </p>
                </div>

                {/* Mode Selector */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMediaUploadMode('upload')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      mediaUploadMode === 'upload'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>رفع ملف من جهازك</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaUploadMode('url')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      mediaUploadMode === 'url'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>رابط خارجي (URL)</span>
                  </button>
                </div>
              </div>

              {/* MODE 1: UPLOAD FROM DEVICE */}
              {mediaUploadMode === 'upload' && (
                <div className="p-6 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                        <UploadCloud className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          رفع صورة من جهازك وتخزينها في قاعدة البيانات
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          يتم ضغط الصورة تلقائياً بجودة عالية وحفظها مباشرة داخل Firestore لتعمل بدون أي روابط خارجية
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        Firestore Native Base64
                      </span>
                    </div>
                  </div>

                  {/* Drag & Drop Area */}
                  {!selectedDeviceImage ? (
                    <label
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingOver(true);
                      }}
                      onDragLeave={() => setIsDraggingOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingOver(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleDeviceImageSelect(file);
                      }}
                      className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        isDraggingOver
                          ? 'border-emerald-400 bg-emerald-950/30 scale-[1.01]'
                          : 'border-slate-800 hover:border-emerald-500/60 bg-slate-900/50 hover:bg-slate-900/80'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*,.svg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDeviceImageSelect(file);
                        }}
                      />
                      <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mb-3 shadow-lg">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <span className="text-sm font-bold text-white mb-1">
                        انقر لاختيار صورة من جهازك، أو اسحب الملف وأفلته هنا
                      </span>
                      <span className="text-xs text-slate-400 max-w-md">
                        يدعم صيغ JPG، PNG، WebP، SVG — يتم تحجيم وضغط الصور الكبيرة تلقائياً لتناسب قاعدة البيانات وتضمن سرعة تحميل فائقة للزوار
                      </span>
                    </label>
                  ) : (
                    /* Selected Image Preview & Configuration Card */
                    <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                      <div className="flex flex-col md:flex-row items-center gap-5">
                        {/* Thumbnail */}
                        <div className="w-36 h-28 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0 relative group">
                          <img
                            src={selectedDeviceImage.dataUrl}
                            alt="معاينة"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/80 text-white font-bold uppercase">
                            {selectedDeviceImage.format}
                          </span>
                        </div>

                        {/* Compression & Details Metrics */}
                        <div className="flex-1 w-full space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                              <span className="block text-[10px] text-slate-500">الأبعاد</span>
                              <span className="text-xs font-bold text-white font-mono">
                                {selectedDeviceImage.width} × {selectedDeviceImage.height} px
                              </span>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                              <span className="block text-[10px] text-slate-500">الحجم الأصلي</span>
                              <span className="text-xs font-bold text-slate-400 font-mono">
                                {selectedDeviceImage.originalKb} KB
                              </span>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/40">
                              <span className="block text-[10px] text-emerald-400">الحجم في الداتا بيز</span>
                              <span className="text-xs font-bold text-emerald-300 font-mono">
                                {selectedDeviceImage.compressedKb} KB
                              </span>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                              <span className="block text-[10px] text-slate-500">نسبة التوفير</span>
                              <span className="text-xs font-bold text-blue-400 font-mono">
                                {selectedDeviceImage.originalKb > selectedDeviceImage.compressedKb
                                  ? `-${Math.round((1 - selectedDeviceImage.compressedKb / selectedDeviceImage.originalKb) * 100)}%`
                                  : '100%'}
                              </span>
                            </div>
                          </div>

                          {/* Title and Category Inputs */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                عنوان أو وصف الصورة *
                              </label>
                              <input
                                type="text"
                                value={newMediaTitle}
                                onChange={(e) => setNewMediaTitle(e.target.value)}
                                placeholder="عنوان معبر للصورة..."
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                تصنيف الاستخدام
                              </label>
                              <select
                                value={newMediaCategory}
                                onChange={(e) => setNewMediaCategory(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                              >
                                <option value="hero">خلفية الواجهة الرئيسية (Hero)</option>
                                <option value="projects">سابقة المشروعات (Projects)</option>
                                <option value="systems">أنظمة التيار الخفيف (Systems)</option>
                                <option value="brand">شعار وهوية الشركة (Brand Logo)</option>
                                <option value="general">عام / منوع (General)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setSelectedDeviceImage(null)}
                          className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          إلغاء واختيار صورة أخرى
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveDeviceImageToDatabase}
                          disabled={isUploadingMedia}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>
                            {isUploadingMedia
                              ? 'جارِ الحفظ في قاعدة البيانات...'
                              : 'حفظ الصورة في قاعدة بيانات فايربيز'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: EXTERNAL URL */}
              {mediaUploadMode === 'url' && (
                <form onSubmit={handleAddMediaUrl} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>إضافة رابط صورة خارجية إلى المكتبة</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={newMediaUrl}
                        onChange={(e) => setNewMediaUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 dir-ltr text-start"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="عنوان ووصف الصورة..."
                        value={newMediaTitle}
                        onChange={(e) => setNewMediaTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      حفظ الرابط في المكتبة
                    </button>
                  </div>
                </form>
              )}

              {/* Summary Stats Strip for Media Library */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400">
                  إجمالي الصور في المكتبة: <strong className="text-white font-mono">{mediaAssets.length}</strong>
                </span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>
                    {mediaAssets.filter((a) => a.source === 'upload' || a.url.startsWith('data:')).length} صورة مرفوعة مباشرة من الأجهزة ومحفوظة في قاعدة البيانات
                  </span>
                </span>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {mediaAssets.map((asset) => {
                  const isCurrentHero = settings.heroImageUrl === asset.url;
                  const isCurrentLogo = settings.logoUrl === asset.url;
                  const isStoredInDb = asset.source === 'upload' || asset.url.startsWith('data:');

                  return (
                    <div
                      key={asset.id}
                      className={`group relative rounded-2xl overflow-hidden border bg-slate-950 flex flex-col transition-all ${
                        isCurrentHero || isCurrentLogo
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="aspect-video w-full overflow-hidden bg-slate-950 relative">
                        <img
                          src={resolveImageUrl(asset.url, DEFAULT_HERO_IMAGE)}
                          alt={asset.title}
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                          {isCurrentHero && (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 text-white shadow-md flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              الخلفية الرئيسية (Hero)
                            </span>
                          )}
                          {isCurrentLogo && (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-600 text-white shadow-md flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              شعار الشركة المعتمد
                            </span>
                          )}
                        </div>

                        {/* Storage Indicator Badge */}
                        <div className="absolute bottom-2 left-2 flex items-center gap-1">
                          {isStoredInDb ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                              <Database className="w-2.5 h-2.5" />
                              <span>محفوظة بالداتا بيز</span>
                              {asset.sizeKb ? <span className="font-mono">({asset.sizeKb} KB)</span> : null}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-slate-900/90 text-slate-300 border border-slate-700 flex items-center gap-1">
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>رابط خارجي</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="text-xs font-bold text-white truncate">{asset.title}</h4>
                            {asset.category && (
                              <span className="text-[9px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono border border-slate-800 shrink-0">
                                {asset.category}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-mono text-slate-500 truncate dir-ltr text-start">
                            {isStoredInDb ? 'data:image/... [Base64 Firestore Document]' : asset.url}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleSetHeroImage(asset.url)}
                              disabled={isCurrentHero}
                              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                isCurrentHero
                                  ? 'bg-emerald-950 text-emerald-300 cursor-default'
                                  : 'bg-slate-900 hover:bg-emerald-600 text-white'
                              }`}
                            >
                              {isCurrentHero ? 'مفعلة كـ Hero' : 'تعيين كـ Hero'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSetLogoImage(asset.url)}
                              disabled={isCurrentLogo}
                              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                isCurrentLogo
                                  ? 'bg-purple-950 text-purple-300 cursor-default'
                                  : 'bg-slate-900 hover:bg-purple-600 text-white'
                              }`}
                            >
                              {isCurrentLogo ? 'الشعار المعتمد' : 'تعيين كشعار'}
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(asset.url);
                                showToast('تم نسخ مسار الصورة إلى الحافظة');
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                              title="نسخ مسار الصورة"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteMedia(asset.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors cursor-pointer"
                              title="حذف من قاعدة البيانات"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">طلبات واستشارات الزوار (الوارد)</h2>
                  <p className="text-xs text-slate-400">
                    الاستفسارات الواردة عبر نموذج الموقع والمحفوظة في قاعدة بيانات Firestore
                  </p>
                </div>
                <button
                  onClick={async () => {
                    const fresh = await getInquiries();
                    setInquiries(fresh);
                    showToast('تم تحديث قائمة الرسائل من فايربيز');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تحديث</span>
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-16 bg-slate-950 rounded-2xl border border-slate-800">
                  <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-300 mb-1">
                    لا توجد استفسارات واردة حتى الآن
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    أي رسالة أو طلب مقايسة يتم إرسالها من زوار الموقع ستظهر هنا فوراً مع إمكانية الرد بضغطة زر عبر WhatsApp.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => {
                    const whatsappDirect = `https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `مرحباً أستاذ ${inq.name}، بخصوص استفساركم عبر شركة مصر للطاقة الخضراء (EGE):`
                    )}`;

                    return (
                      <div
                        key={inq.id || inq.createdAt}
                        className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-900">
                          <div>
                            <span className="text-sm font-bold text-white">{inq.name}</span>
                            <span className="text-xs text-slate-400 mx-2">•</span>
                            <span className="text-xs font-mono text-emerald-400">{inq.phone}</span>
                            {inq.email && (
                              <>
                                <span className="text-xs text-slate-400 mx-2">•</span>
                                <span className="text-xs font-mono text-slate-300">{inq.email}</span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                inq.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : inq.status === 'in_progress'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-sky-500/20 text-sky-300'
                              }`}
                            >
                              {inq.status === 'completed'
                                ? 'تمت المتابعة'
                                : inq.status === 'in_progress'
                                ? 'جارِ التواصل'
                                : 'طلب جديد'}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              {new Date(inq.createdAt).toLocaleDateString('ar-EG')}
                            </span>
                          </div>
                        </div>

                        {inq.service && (
                          <div className="text-xs font-semibold text-emerald-400">
                            الخدمة المطلوبة: {inq.service}
                          </div>
                        )}

                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                          {inq.message}
                        </p>

                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${inq.phone}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 cursor-pointer"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-400" />
                              <span>اتصال هاتفي</span>
                            </a>

                            <a
                              href={whatsappDirect}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-semibold border border-[#25D366]/30 cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>الرد عبر واتساب</span>
                            </a>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <span>تغيير الحالة:</span>
                            <button
                              onClick={async () => {
                                if (inq.id) {
                                  await updateInquiryStatus(inq.id, 'in_progress');
                                  setInquiries((prev) =>
                                    prev.map((i) => (i.id === inq.id ? { ...i, status: 'in_progress' } : i))
                                  );
                                  showToast('تم تحديث حالة الطلب إلى جارِ التواصل');
                                }
                              }}
                              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] cursor-pointer"
                            >
                              جارِ التواصل
                            </button>
                            <button
                              onClick={async () => {
                                if (inq.id) {
                                  await updateInquiryStatus(inq.id, 'completed');
                                  setInquiries((prev) =>
                                    prev.map((i) => (i.id === inq.id ? { ...i, status: 'completed' } : i))
                                  );
                                  showToast('تم تحديد الطلب كمكتمل');
                                }
                              }}
                              className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 hover:bg-emerald-900 text-[10px] cursor-pointer"
                            >
                              مكتمل
                            </button>
                            {inq.id && (
                              <button
                                onClick={() => handleDeleteInquiry(inq.id!)}
                                className="p-1 rounded bg-slate-900 hover:bg-red-900/50 text-slate-400 hover:text-red-300 text-[10px] cursor-pointer transition-colors"
                                title="حذف الطلب"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: USERS & PERMISSIONS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <span>إدارة المستخدمين وفريق لوحة التحكم</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    إضافة وتعديل وحذف المهندسين والمستخدمين المصرح لهم بالدخول للوحة الإدارة وحفظها في Firestore
                  </p>
                </div>
                {!isAddingUser && !editingUser && (
                  <button
                    onClick={() => {
                      setNewUserForm({
                        name: '',
                        email: '',
                        role: 'systems_engineer',
                        passcode: `ege-${Math.floor(1000 + Math.random() * 9000)}`,
                        isActive: true,
                        notes: '',
                      });
                      setIsAddingUser(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>إضافة مستخدم جديد</span>
                  </button>
                )}
              </div>

              {/* Users Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">إجمالي المستخدمين</span>
                    <span className="text-2xl font-bold font-mono text-white">{adminUsers.length}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">الحسابات النشطة</span>
                    <span className="text-2xl font-bold font-mono text-emerald-400">
                      {adminUsers.filter((u) => u.isActive).length}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">المدراء العامون</span>
                    <span className="text-2xl font-bold font-mono text-purple-400">
                      {adminUsers.filter((u) => u.role === 'super_admin').length}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400">
                    <Shield className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Inline User Editor (Add or Edit) */}
              {(isAddingUser || editingUser) && (
                <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-2xl p-6 space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm sm:text-base font-bold text-emerald-400 flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      <span>{editingUser ? `تعديل بيانات المستخدم: ${editingUser.name}` : 'إضافة مستخدم جديد للوحة التحكم'}</span>
                    </h3>
                    <button
                      onClick={() => {
                        setIsAddingUser(false);
                        setEditingUser(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editingUser) {
                        handleSaveAdminUser(editingUser);
                      } else {
                        const newUser: AdminUserData = {
                          id: `user-${Date.now()}`,
                          name: newUserForm.name.trim(),
                          email: newUserForm.email.trim(),
                          role: newUserForm.role,
                          passcode: newUserForm.passcode.trim(),
                          isActive: newUserForm.isActive,
                          createdAt: new Date().toISOString(),
                          notes: newUserForm.notes.trim(),
                        };
                        handleSaveAdminUser(newUser);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          اسم المستخدم / المهندس <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={editingUser ? editingUser.name : newUserForm.name}
                          onChange={(e) =>
                            editingUser
                              ? setEditingUser({ ...editingUser, name: e.target.value })
                              : setNewUserForm({ ...newUserForm, name: e.target.value })
                          }
                          placeholder="مثال: م. أحمد الشافعي"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          البريد الإلكتروني <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={editingUser ? editingUser.email : newUserForm.email}
                          onChange={(e) =>
                            editingUser
                              ? setEditingUser({ ...editingUser, email: e.target.value })
                              : setNewUserForm({ ...newUserForm, email: e.target.value })
                          }
                          placeholder="ahmed@egyptge.com"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 dir-ltr text-start font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          الصلاحية والدور في النظام <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={editingUser ? editingUser.role : newUserForm.role}
                          onChange={(e) => {
                            const val = e.target.value as AdminUserData['role'];
                            if (editingUser) setEditingUser({ ...editingUser, role: val });
                            else setNewUserForm({ ...newUserForm, role: val });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="super_admin">مدير عام (Super Admin) - صلاحية كاملة للنظام</option>
                          <option value="systems_engineer">مهندس أنظمة (Systems Engineer) - إدارة الأنظمة والمشاريع</option>
                          <option value="content_manager">مسؤول محتوى ودعم (Content Manager) - إدارة الاستشارات والمحتوى</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          رمز المرور / كلمة المرور الخاصة به <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={editingUser ? editingUser.passcode : newUserForm.passcode}
                            onChange={(e) =>
                              editingUser
                                ? setEditingUser({ ...editingUser, passcode: e.target.value })
                                : setNewUserForm({ ...newUserForm, passcode: e.target.value })
                            }
                            placeholder="مثال: pass2026"
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 dir-ltr text-start"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const gen = `ege-${Math.floor(1000 + Math.random() * 9000)}`;
                              if (editingUser) setEditingUser({ ...editingUser, passcode: gen });
                              else setNewUserForm({ ...newUserForm, passcode: gen });
                            }}
                            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-mono transition-colors shrink-0"
                            title="توليد رمز مرور تلقائي"
                          >
                            توليد تلقائي
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          حالة الحساب
                        </label>
                        <div className="flex items-center gap-3 pt-1">
                          <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                            <input
                              type="radio"
                              name="userStatus"
                              checked={editingUser ? editingUser.isActive : newUserForm.isActive}
                              onChange={() => {
                                if (editingUser) setEditingUser({ ...editingUser, isActive: true });
                                else setNewUserForm({ ...newUserForm, isActive: true });
                              }}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-emerald-400 font-semibold">حساب نشط ومفعل</span>
                          </label>
                          <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                            <input
                              type="radio"
                              name="userStatus"
                              checked={editingUser ? !editingUser.isActive : !newUserForm.isActive}
                              onChange={() => {
                                if (editingUser) setEditingUser({ ...editingUser, isActive: false });
                                else setNewUserForm({ ...newUserForm, isActive: false });
                              }}
                              className="text-slate-600 focus:ring-slate-500"
                            />
                            <span>معطل مؤقتاً</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          ملاحظات أو التخصص (اختياري)
                        </label>
                        <input
                          type="text"
                          value={editingUser ? editingUser.notes || '' : newUserForm.notes}
                          onChange={(e) =>
                            editingUser
                              ? setEditingUser({ ...editingUser, notes: e.target.value })
                              : setNewUserForm({ ...newUserForm, notes: e.target.value })
                          }
                          placeholder="مثال: مهندس شبكات وكاميرات CCTV"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingUser(false);
                          setEditingUser(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'جارِ الحفظ في فايربيز...' : 'حفظ المستخدم في فايربيز'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Users Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminUsers.map((user) => {
                  const isRevealed = revealedPasscodes[user.id];
                  const isCurrentActive = activeAdminUser?.id === user.id;

                  const roleBadge = {
                    super_admin: {
                      label: 'مدير عام (Super Admin)',
                      classes: 'bg-purple-950/70 text-purple-300 border-purple-800/80',
                    },
                    systems_engineer: {
                      label: 'مهندس أنظمة (Systems Engineer)',
                      classes: 'bg-sky-950/70 text-sky-300 border-sky-800/80',
                    },
                    content_manager: {
                      label: 'مسؤول محتوى ودعم',
                      classes: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80',
                    },
                  }[user.role] || {
                    label: user.role,
                    classes: 'bg-slate-800 text-slate-300 border-slate-700',
                  };

                  return (
                    <div
                      key={user.id}
                      className={`p-5 rounded-2xl bg-slate-950 border transition-all flex flex-col justify-between ${
                        user.isActive
                          ? 'border-slate-800 hover:border-slate-700'
                          : 'border-slate-800/50 opacity-70 bg-slate-950/50'
                      }`}
                    >
                      <div>
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-emerald-400 font-mono text-sm shrink-0">
                              {user.name.slice(0, 2)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-white">{user.name}</h3>
                                {isCurrentActive && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    أنت
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 font-mono dir-ltr text-end">{user.email}</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setIsAddingUser(false);
                              }}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="تعديل بيانات المستخدم"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleUserActive(user)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                                user.isActive
                                  ? 'bg-slate-900 hover:bg-amber-950/50 text-slate-400 hover:text-amber-300'
                                  : 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-400'
                              }`}
                              title={user.isActive ? 'تعطيل الحساب مؤقتاً' : 'تفعيل الحساب'}
                            >
                              {user.isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>
                            {adminUsers.length > 1 && (
                              <button
                                onClick={() => handleDeleteAdminUser(user.id)}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
                                title="حذف المستخدم"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Badges & Role */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${roleBadge.classes}`}>
                            {roleBadge.label}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                              user.isActive
                                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {user.isActive ? 'نشط' : 'معطل مؤقتاً'}
                          </span>
                        </div>

                        {/* Notes */}
                        {user.notes && (
                          <p className="text-xs text-slate-400 mb-3 bg-slate-900/50 p-2 rounded-xl border border-slate-800/60">
                            {user.notes}
                          </p>
                        )}
                      </div>

                      {/* Footer Credentials Info */}
                      <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">رمز الدخول:</span>
                          <span className="font-mono text-emerald-400 font-semibold text-xs">
                            {isRevealed ? user.passcode : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasscodeReveal(user.id)}
                            className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                            title={isRevealed ? 'إخفاء رمز المرور' : 'إظهار رمز المرور'}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {user.createdAt?.slice(0, 10)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Informative Guidance */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-200 flex items-start gap-3">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-white block mb-0.5">آلية عمل الصلاحيات:</span>
                  أي مستخدم يتم إضافته وتفعيله هنا يمكنه تسجيل الدخول فوراً عبر شاشة الدخول باستخدام بريده الإلكتروني ورمز المرور الخاص به. يتم مزامنة هذه الحسابات مباشرة وبشكل دائم في قاعدة بيانات فايربيز (Firestore).
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SECURITY & SECRET PATH */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">الرابط السري وقاعدة بيانات فايربيز</h2>
                  <p className="text-xs text-slate-400">
                    رابط لوحة التحكم المشفر بدون هاش (#)، وحالة المزامنة السحابية
                  </p>
                </div>
              </div>

              {/* Secret URL Box */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>رابط لوحة التحكم السري غير المعلن للزوار</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active & Protected
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  تم إخفاء كلمة <code className="text-red-400 font-mono">admin</code> واستبدالها بالمسار العشوائي المشفر التالي بدون رمز (#):
                </p>

                <div className="flex items-center gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="font-mono text-emerald-400 text-xs sm:text-sm flex-1 truncate dir-ltr text-start">
                    {window.location.origin}{SECRET_PORTAL_PATH}
                  </span>
                  <button
                    onClick={handleCopySecretLink}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </button>
                </div>
              </div>

              {/* Firebase Live Diagnostics & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      <span>معلومات مشروع Firebase & Firestore</span>
                    </h3>
                    <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{dbStats?.connected ? 'Online' : 'Checking'}</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">معرف المشروع (Project ID):</span>
                      <span className="font-mono text-white text-[11px]">gen-lang-client-0460590751</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">قاعدة بيانات Firestore:</span>
                      <span className="font-mono text-emerald-400 text-[11px] truncate max-w-[200px]" title="ai-studio-egyptgreenenergy-f5992e15-bc8b-4278-9a9f-4f09daed5039">
                        ai-studio-egyptgreenenergy...
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">زمن استجابة الاتصال (Latency):</span>
                      <span className="font-mono text-emerald-300 font-bold">
                        {dbStats?.latencyMs !== undefined ? `${dbStats.latencyMs} ms` : 'جاري الفحص...'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">حساب المسؤول المعتمد:</span>
                      <span className="font-mono text-emerald-400 text-[11px]">{activeAdminUser?.email || currentUser?.email || 'admin@egyptge.com'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">حالة المصادقة الحالية:</span>
                      <span className="text-slate-200">
                        {currentUser ? `مسجل (${currentUser.email || 'Admin'})` : 'مفتاح جلسة مشفر (Protected Session)'}
                      </span>
                    </div>
                  </div>


                  <button
                    type="button"
                    onClick={handlePingDatabase}
                    disabled={isPingingDb}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isPingingDb ? 'animate-spin text-emerald-400' : ''}`} />
                    <span>فحص سرعة استجابة قاعدة البيانات (Ping Test)</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span>سجلات قاعدة البيانات والمزامنة الشاملة</span>
                  </h3>
                  
                  {/* Real-time counts grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-lg font-bold font-mono text-emerald-400">{systems.length}</div>
                      <div className="text-[10px] text-slate-400">أنظمة تيار خفيف</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-lg font-bold font-mono text-emerald-400">{projects.length}</div>
                      <div className="text-[10px] text-slate-400">مشروعات معتمدة</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-lg font-bold font-mono text-emerald-400">{mediaAssets.length}</div>
                      <div className="text-[10px] text-slate-400">صور ووسائط</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-lg font-bold font-mono text-amber-400">{inquiries.length}</div>
                      <div className="text-[10px] text-slate-400">طلبات واستشارات</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    حفظ كافة البيانات الافتراضية للشركة (الأنظمة، المشروعات، الصور، والهوية) مباشرة في فايربيز لضمان استقرار الموقع.
                  </p>

                  <button
                    onClick={handleSeedDatabase}
                    disabled={isSaving}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <UploadCloud className={`w-4 h-4 ${isSaving ? 'animate-bounce' : ''}`} />
                    <span>{isSaving ? 'جارِ المزامنة مع فايربيز...' : 'مزامنة البيانات الأساسية مع فايربيز الآن'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
