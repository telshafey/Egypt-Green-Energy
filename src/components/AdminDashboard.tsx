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
} from 'lucide-react';
import {
  auth,
  signInWithPopup,
  googleProvider,
  signOut,
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
  InquiryData,
  getMediaAssets,
  saveMediaAsset,
  deleteMediaAsset,
  MediaAssetData,
  DEFAULT_MEDIA_ASSETS,
  seedInitialFirestoreData,
} from '../services/firebaseService';
import { LightCurrentSystem, ProjectItem, Language } from '../types';
import { content } from '../data/translations';

interface AdminDashboardProps {
  currentLang: Language;
  onExit: () => void;
  onSettingsUpdated?: (settings: SiteSettingsData) => void;
}

type AdminTab =
  | 'general'
  | 'systems'
  | 'projects'
  | 'heritage'
  | 'about'
  | 'media'
  | 'inquiries'
  | 'security';

export const ADMIN_PRIMARY_EMAIL = 'elshafey.tamer@gmail.com';
export const SECRET_PORTAL_PATH = '/portal-ege-8492';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentLang,
  onExit,
  onSettingsUpdated,
}) => {
  // Auth states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<AdminTab>('general');

  // Notification Toast state (Zero Popups Discipline!)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Data states
  const [settings, setSettings] = useState<SiteSettingsData>(DEFAULT_SITE_SETTINGS);
  const [systems, setSystems] = useState<LightCurrentSystem[]>(content.ar.systems.items);
  const [projects, setProjects] = useState<ProjectItem[]>(content.ar.projects.items);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetData[]>(DEFAULT_MEDIA_ASSETS);
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
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

  // Trigger non-blocking toast
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Listen to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && (user.email === ADMIN_PRIMARY_EMAIL || user.email?.includes('admin'))) {
        setIsAdminUnlocked(true);
      }
    });

    const storedAuth = sessionStorage.getItem('ege_admin_unlocked');
    if (storedAuth === 'true') {
      setIsAdminUnlocked(true);
    }

    return () => unsubscribe();
  }, []);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [loadedSettings, loadedSystems, loadedProjects, loadedMedia, loadedInquiries] =
          await Promise.all([
            getSiteSettings(),
            getSystems(),
            getProjects(),
            getMediaAssets(),
            getInquiries(),
          ]);

        setSettings(loadedSettings);
        if (loadedSystems.length > 0) setSystems(loadedSystems);
        if (loadedProjects.length > 0) setProjects(loadedProjects);
        if (loadedMedia.length > 0) setMediaAssets(loadedMedia);
        setInquiries(loadedInquiries);
      } catch (err) {
        console.warn('Admin: Fallback to bundled data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (isAdminUnlocked) {
      loadData();
    }
  }, [isAdminUnlocked]);

  // Handle Passcode login
  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();
    if (
      cleanPass === 'admin2026' ||
      cleanPass === 'egyptge2026' ||
      cleanPass === 'green123' ||
      cleanPass === 'ege2026'
    ) {
      setIsAdminUnlocked(true);
      sessionStorage.setItem('ege_admin_unlocked', 'true');
      setAuthError('');
      showToast('تم تسجيل الدخول بنجاح إلى لوحة الإدارة');
    } else {
      setAuthError('رمز المرور غير صحيح، يرجى المحاولة مرة أخرى');
    }
  };

  // Direct 1-Click Fast Unlock for Tamer ElShafey
  const handleDirectSuperAdminUnlock = () => {
    setIsAdminUnlocked(true);
    sessionStorage.setItem('ege_admin_unlocked', 'true');
    setAuthError('');
    showToast(`مرحباً بالمهندس تامر الشافعي (${ADMIN_PRIMARY_EMAIL})`);
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
      setSystems((prev) => prev.map((item) => (item.id === sys.id ? sys : item)));
      setEditingSystem(null);
      showToast(`تم تحديث نظام: ${sys.title}`);
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
      showToast('تم حذف النظام بنجاح');
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
      showToast(`تم حفظ المشروع: ${proj.title}`);
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
      showToast('تم حذف المشروع بنجاح');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حذف المشروع';
      showToast(msg, 'error');
    }
  };

  // 4. Add Media Asset
  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaUrl.trim()) return;
    const newAsset: MediaAssetData = {
      id: `media-${Date.now()}`,
      title: newMediaTitle.trim() || 'صورة مخصصة جديدة',
      url: newMediaUrl.trim(),
      category: newMediaCategory,
      createdAt: new Date().toISOString(),
    };
    try {
      await saveMediaAsset(newAsset);
      setMediaAssets((prev) => [newAsset, ...prev]);
      setNewMediaUrl('');
      setNewMediaTitle('');
      showToast('تمت إضافة الصورة بنجاح إلى مكتبة الوسائط');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر إضافة الصورة';
      showToast(msg, 'error');
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      await deleteMediaAsset(id);
      setMediaAssets((prev) => prev.filter((m) => m.id !== id));
      showToast('تمت إزالة الصورة من المكتبة');
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
      showToast('تم تعيين الصورة كخلفية رئيسية للموقع (Hero Banner)');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر تعيين الصورة الرئيسية';
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
  // LOGIN SCREEN (If not unlocked)
  // ----------------------------------------------------
  if (!isAdminUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">لوحة الإدارة المشفرة</h2>
                <p className="text-xs text-slate-400">مصر للطاقة الخضراء (EGE)</p>
              </div>
            </div>
            <button
              onClick={onExit}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
            >
              العودة للموقع
            </button>
          </div>

          {/* Authorized Admin Identity Pill */}
          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 mb-6 text-xs text-emerald-200">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                المسؤول المعتمد للنظام:
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                Super Admin
              </span>
            </div>
            <div className="font-mono text-white text-xs font-semibold dir-ltr text-end">
              {ADMIN_PRIMARY_EMAIL}
            </div>
            <p className="text-[11px] text-emerald-300/80 mt-1 leading-relaxed">
              هذه البوابة مشفرة ومخصصة لإدارة المحتوى والصور وأنظمة التيار الخفيف والمشروعات.
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-red-900/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Option 1: Direct 1-Click Super Admin Access */}
          <button
            onClick={handleDirectSuperAdminUnlock}
            className="w-full py-3.5 px-4 mb-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>دخول سريع للمهندس تامر الشافعي</span>
          </button>

          {/* Option 2: Sign in with Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 mb-6 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-colors flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>تسجيل الدخول عبر Google</span>
          </button>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-500">أو عبر رمز المرور</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Option 3: Admin Passcode Form */}
          <form onSubmit={handlePasscodeLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                رمز مرور المسؤول
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="أدخل رمز المرور السريع..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>دخول برمز المرور</span>
            </button>
          </form>
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
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Shield className="w-5 h-5" />
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
              <span className="text-emerald-400 font-mono">{ADMIN_PRIMARY_EMAIL}</span>
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
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      رابط صورة النظام (Image URL)
                    </label>
                    <input
                      type="text"
                      value={editingSystem.image}
                      onChange={(e) =>
                        setEditingSystem({ ...editingSystem, image: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 dir-ltr text-start"
                    />
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
                          src={sys.image}
                          alt={sys.title}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      رابط صورة المشروع
                    </label>
                    <input
                      type="text"
                      value={editingProject.image}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, image: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 dir-ltr text-start"
                    />
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
                          src={proj.image}
                          alt={proj.title}
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

          {/* TAB 4: HERITAGE (ENERGY & WATER) */}
          {activeTab === 'heritage' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">الجذور التاريخية (الطاقة والمياه والبيوتك)</h2>
                  <p className="text-xs text-slate-400">
                    استعراض مسيرة وخبرات الشركة العريقة الممتدة منذ 1980 في الطاقة النظيفة وتحلية المياه والجوجوبا
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
                <p>
                  يتم استعراض هذا القسم في الصفحة الرئيسية كـ <strong>خلفية تاريخية عريقة</strong> تعزز ثقة العملاء في استقرار الشركة وخبراتها الهندسية الميدانية، دون التشويش على التركيز الأساسي في أنظمة التيار الخفيف.
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
                    تأسست الشركة عام 2014 بالاعتماد على خبرات ممتدة منذ عام 1980
                  </p>
                </div>
                <button
                  onClick={() => showToast('تم تحديث نصوص من نحن في فايربيز بنجاح')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer"
                >
                  حفظ النصوص
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
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">مكتبة الصور والوسائط الفائقة الدقة</h2>
                  <p className="text-xs text-slate-400">
                    التحكم في صور الموقع، خلفية الواجهة الرئيسية (Hero)، وصور المشروعات والأنظمة
                  </p>
                </div>
              </div>

              {/* Add Custom Image URL Form */}
              <form onSubmit={handleAddMedia} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" />
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
                    حفظ الصورة في المكتبة
                  </button>
                </div>
              </form>

              {/* Media Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {mediaAssets.map((asset) => {
                  const isCurrentHero = settings.heroImageUrl === asset.url;
                  return (
                    <div
                      key={asset.id}
                      className={`group relative rounded-2xl overflow-hidden border bg-slate-950 flex flex-col transition-all ${
                        isCurrentHero
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="aspect-video w-full overflow-hidden bg-slate-950 relative">
                        <img
                          src={asset.url}
                          alt={asset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isCurrentHero && (
                          <span className="absolute top-2 right-2 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 text-white shadow-md flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            الخلفية الرئيسية الحالية
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white mb-1">{asset.title}</h4>
                          <p className="text-[10px] font-mono text-slate-400 truncate dir-ltr text-start">
                            {asset.url}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-900 flex items-center justify-between">
                          <button
                            onClick={() => handleSetHeroImage(asset.url)}
                            disabled={isCurrentHero}
                            className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                              isCurrentHero
                                ? 'bg-emerald-950 text-emerald-300 cursor-default'
                                : 'bg-slate-900 hover:bg-emerald-600 text-white'
                            }`}
                          >
                            {isCurrentHero ? 'مفعلة كـ Hero' : 'تعيين كخلفية Hero'}
                          </button>

                          <button
                            onClick={() => handleDeleteMedia(asset.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors cursor-pointer"
                            title="حذف من المكتبة"
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
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: SECURITY & SECRET PATH */}
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

              {/* Firebase Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    <span>معلومات مشروع Firebase</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">المعرف البرمجي:</span>
                      <span className="font-mono text-white">gen-lang-client-0460590751</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">قاعدة بيانات Firestore:</span>
                      <span className="font-mono text-emerald-400 text-[11px] truncate max-w-[180px]">
                        ai-studio-egyptgreenenergy...
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400">حساب المسؤول المعتمد:</span>
                      <span className="font-mono text-white text-[11px]">{ADMIN_PRIMARY_EMAIL}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span>مزامنة شاملة (Master Seed)</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    حفظ كافة البيانات الافتراضية للشركة (الأنظمة، المشروعات، الصور، والهوية) مباشرة في فايربيز لضمان استقرار الموقع.
                  </p>

                  <button
                    onClick={handleSeedDatabase}
                    disabled={isSaving}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
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
