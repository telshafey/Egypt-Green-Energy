import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testFirestoreConnection, FirestoreHealthResult } from '../lib/firebase';
import { LightCurrentSystem, ProjectItem } from '../types';
import {
  content,
  HERO_IMAGE,
  CCTV_IMAGE,
  CABLING_IMAGE,
  ACCESS_IMAGE,
  DATACENTER_IMAGE,
  ENERGY_IMAGE,
  BIOTECH_IMAGE,
  JOJOBA_IMAGE,
} from '../data/translations';

export interface SiteSettingsData {
  companyNameAr: string;
  companyNameEn: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  address: string;
  hours: string;
  heroTitleAr: string;
  heroTitleEn: string;
  heroSubtitleAr: string;
  heroSubtitleEn: string;
  heroImageUrl?: string;
  logoUrl?: string;
  whatsAppNumber: string;
  aboutVisionAr?: string;
  aboutMissionAr?: string;
  showStats?: boolean;
  showAbout?: boolean;
  showHeritage?: boolean;
  showSystems?: boolean;
  showProjects?: boolean;
  showConfigurator?: boolean;
  showPartners?: boolean;
  showContact?: boolean;
  updatedAt?: string;
}

export interface InquiryData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  service?: string;
  message: string;
  status: 'new' | 'in_progress' | 'completed';
  source?: string;
  createdAt: string;
}

export interface MediaAssetData {
  id: string;
  title: string;
  url: string;
  category: string;
  createdAt: string;
}

export interface AdminUserData {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'systems_engineer' | 'content_manager';
  passcode: string;
  isActive: boolean;
  createdAt: string;
  notes?: string;
}

export interface FirestoreDatabaseStats {
  connected: boolean;
  latencyMs: number;
  databaseId: string;
  projectId: string;
  settingsCount: number;
  systemsCount: number;
  projectsCount: number;
  inquiriesCount: number;
  mediaAssetsCount: number;
  adminUsersCount: number;
  lastChecked: string;
  error?: string;
}

export const DEFAULT_ADMIN_USERS: AdminUserData[] = [
  {
    id: 'admin-master',
    name: 'مدير النظام الرئيسي',
    email: 'admin@egyptge.com',
    role: 'super_admin',
    passcode: 'admin2026',
    isActive: true,
    createdAt: new Date().toISOString(),
    notes: 'الحساب الرئيسي للوحة التحكم وإدارة الصلاحيات',
  },
];

// Default Seed Assets
export const DEFAULT_MEDIA_ASSETS: MediaAssetData[] = [
  {
    id: 'hero-command',
    title: 'Operations Center & Video Wall',
    url: HERO_IMAGE,
    category: 'operations',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cctv-4k',
    title: 'Commercial 4K IP CCTV Cameras',
    url: CCTV_IMAGE,
    category: 'cctv',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cabling-rack',
    title: 'Cat6A Structured Cabling & Fiber Rack',
    url: CABLING_IMAGE,
    category: 'cabling',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'access-speed-gates',
    title: 'Biometric Optical Speed Gates',
    url: ACCESS_IMAGE,
    category: 'access',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'telephony-datacenter',
    title: 'Enterprise Server Room & IP PBX',
    url: DATACENTER_IMAGE,
    category: 'it',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'solar-microgrid',
    title: 'Solar Energy & Microgrid Infrastructure',
    url: ENERGY_IMAGE,
    category: 'energy',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'biotech-hydroponics',
    title: 'Water Desalination & Hydroponics',
    url: BIOTECH_IMAGE,
    category: 'water',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'jojoba-biofuel',
    title: 'Desert Jojoba & Biofuel Plantation',
    url: JOJOBA_IMAGE,
    category: 'biofuel',
    createdAt: new Date().toISOString(),
  },
];

// Default site settings
export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  companyNameAr: 'مصر للطاقة الخضراء ذ.م.م',
  companyNameEn: 'Egypt Green Energy L.L.C',
  phonePrimary: '+20 100 719 6485',
  phoneSecondary: '+20 120 072 8006',
  email: 'info@egyptge.com',
  address: 'مدينة نصر، القاهرة، جمهورية مصر العربية',
  hours: 'السبت - الخميس: 9:00 ص - 6:00 م (خدمة طوارئ 24/7 لعقود SLA)',
  heroTitleAr: 'أنظمة التيار الخفيف والحلول التكنولوجية الذكية للمباني والشركات',
  heroTitleEn: 'Turnkey Low Current Systems & Smart Infrastructure Engineering',
  heroSubtitleAr: 'نصمم وننفذ حلول التيار الخفيف المتكاملة: شبكات المراقبة بالكاميرات (CCTV)، إنذار الحريق، التحكم في الأبواب (Access Control)، الكابلات الهيكلية والألياف الضوئية، السنترالات الموحدة، مع عقود صيانة معتمدة 24/7.',
  heroSubtitleEn: 'We engineer, commission, and maintain end-to-end Low Current (ELV) solutions: 4K IP CCTV surveillance, addressable fire alarm, biometric access control, structured cabling & fiber optics, IP telephony, and building management systems (BMS) with 24/7 managed SLA support.',
  heroImageUrl: HERO_IMAGE,
  logoUrl: '',
  whatsAppNumber: '201007196485',
  aboutVisionAr: 'إدراك الحاجة المتزايدة لتكنولوجيا البنية التحتية والأنظمة الذكية والطاقة المتجددة في عالم اليوم، وتوفير حلول هندسية موثوقة ومستدامة بمعايير عالمية.',
  aboutMissionAr: 'تصميم وتوريد وتركيب وصيانة أحدث أنظمة التيار الخفيف (ELV) والاتصالات، ودمجها مع الخبرات التاريخية في الطاقة والمياه لإنجاز منشآت ذكية آمنة وموفرة للطاقة.',
  showStats: true,
  showAbout: true,
  showHeritage: true,
  showSystems: true,
  showProjects: true,
  showConfigurator: true,
  showPartners: true,
  showContact: true,
};

// 1. Fetch & Save Site Settings
export async function getSiteSettings(): Promise<SiteSettingsData> {
  const path = 'settings/general';
  try {
    const snap = await getDoc(doc(db, 'settings', 'general'));
    if (snap.exists()) {
      return snap.data() as SiteSettingsData;
    }
    return DEFAULT_SITE_SETTINGS;
  } catch (err) {
    console.warn('Using local default settings due to Firestore fetch state:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export function subscribeToSiteSettings(callback: (settings: SiteSettingsData) => void): () => void {
  return onSnapshot(
    doc(db, 'settings', 'general'),
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as SiteSettingsData);
      }
    },
    (err) => {
      console.warn('Settings subscription fallback:', err);
    }
  );
}

export async function saveSiteSettings(settings: SiteSettingsData): Promise<void> {
  const path = 'settings/general';
  try {
    await setDoc(doc(db, 'settings', 'general'), {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// 2. Systems
export async function getSystems(): Promise<LightCurrentSystem[]> {
  const path = 'systems';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as LightCurrentSystem);
    }
    return content.ar.systems.items;
  } catch (err) {
    console.warn('Fallback to bundled systems:', err);
    return content.ar.systems.items;
  }
}

export function subscribeToSystems(callback: (systems: LightCurrentSystem[]) => void): () => void {
  return onSnapshot(
    collection(db, 'systems'),
    (snap) => {
      if (!snap.empty) {
        callback(snap.docs.map((d) => d.data() as LightCurrentSystem));
      }
    },
    (err) => {
      console.warn('Systems subscription fallback:', err);
    }
  );
}

export async function saveSystem(system: LightCurrentSystem): Promise<void> {
  const path = `systems/${system.id}`;
  try {
    await setDoc(doc(db, 'systems', system.id), {
      ...system,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteSystem(systemId: string): Promise<void> {
  const path = `systems/${systemId}`;
  try {
    await deleteDoc(doc(db, 'systems', systemId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 3. Projects
export async function getProjects(): Promise<ProjectItem[]> {
  const path = 'projects';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as ProjectItem);
    }
    return content.ar.projects.items;
  } catch (err) {
    console.warn('Fallback to bundled projects:', err);
    return content.ar.projects.items;
  }
}

export function subscribeToProjects(callback: (projects: ProjectItem[]) => void): () => void {
  return onSnapshot(
    collection(db, 'projects'),
    (snap) => {
      if (!snap.empty) {
        callback(snap.docs.map((d) => d.data() as ProjectItem));
      }
    },
    (err) => {
      console.warn('Projects subscription fallback:', err);
    }
  );
}

export async function saveProject(project: ProjectItem): Promise<void> {
  const path = `projects/${project.id}`;
  try {
    await setDoc(doc(db, 'projects', project.id), {
      ...project,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 4. Inquiries
export async function createInquiry(inquiry: Omit<InquiryData, 'id'>): Promise<string> {
  const path = 'inquiries';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...inquiry,
      status: inquiry.status || 'new',
      createdAt: inquiry.createdAt || new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function getInquiries(): Promise<InquiryData[]> {
  const path = 'inquiries';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as InquiryData[];
  } catch (err) {
    console.warn('Could not fetch inquiries:', err);
    return [];
  }
}

export function subscribeToInquiries(callback: (inquiries: InquiryData[]) => void): () => void {
  const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      callback(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as InquiryData[]
      );
    },
    (err) => {
      console.warn('Inquiries subscription fallback:', err);
    }
  );
}

export async function updateInquiryStatus(inquiryId: string, status: 'new' | 'in_progress' | 'completed'): Promise<void> {
  const path = `inquiries/${inquiryId}`;
  try {
    await updateDoc(doc(db, 'inquiries', inquiryId), { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteInquiry(inquiryId: string): Promise<void> {
  const path = `inquiries/${inquiryId}`;
  try {
    await deleteDoc(doc(db, 'inquiries', inquiryId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 5. Media Assets
export async function getMediaAssets(): Promise<MediaAssetData[]> {
  const path = 'media_assets';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as MediaAssetData);
    }
    return DEFAULT_MEDIA_ASSETS;
  } catch (err) {
    console.warn('Fallback to default media assets:', err);
    return DEFAULT_MEDIA_ASSETS;
  }
}

export async function saveMediaAsset(asset: MediaAssetData): Promise<void> {
  const path = `media_assets/${asset.id}`;
  try {
    await setDoc(doc(db, 'media_assets', asset.id), asset);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteMediaAsset(assetId: string): Promise<void> {
  const path = `media_assets/${assetId}`;
  try {
    await deleteDoc(doc(db, 'media_assets', assetId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 6. Admin Users & Access Management
export async function getAdminUsers(): Promise<AdminUserData[]> {
  const path = 'admin_users';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminUserData));
    }
    return DEFAULT_ADMIN_USERS;
  } catch (err) {
    console.warn('Fallback to default admin users:', err);
    return DEFAULT_ADMIN_USERS;
  }
}

export async function saveAdminUser(user: AdminUserData): Promise<void> {
  const path = `admin_users/${user.id}`;
  try {
    await setDoc(doc(db, 'admin_users', user.id), {
      ...user,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteAdminUser(userId: string): Promise<void> {
  const path = `admin_users/${userId}`;
  try {
    await deleteDoc(doc(db, 'admin_users', userId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export function subscribeToAdminUsers(callback: (users: AdminUserData[]) => void): () => void {
  try {
    const q = collection(db, 'admin_users');
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as AdminUserData));
          callback(list);
        } else {
          callback(DEFAULT_ADMIN_USERS);
        }
      },
      (error) => {
        console.warn('Real-time admin users subscription fallback:', error);
        callback(DEFAULT_ADMIN_USERS);
      }
    );
  } catch (err) {
    console.warn('Real-time admin users subscription setup failed:', err);
    callback(DEFAULT_ADMIN_USERS);
    return () => {};
  }
}

// 7. Comprehensive Database Diagnostics & Document Counter
export async function getFirestoreDatabaseStats(): Promise<FirestoreDatabaseStats> {
  const health: FirestoreHealthResult = await testFirestoreConnection();
  let settingsCount = 0;
  let systemsCount = 0;
  let projectsCount = 0;
  let inquiriesCount = 0;
  let mediaAssetsCount = 0;
  let adminUsersCount = 0;

  if (health.success) {
    try {
      const [settSnap, sysSnap, projSnap, inqSnap, medSnap, userSnap] = await Promise.all([
        getDoc(doc(db, 'settings', 'general')),
        getDocs(collection(db, 'systems')),
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'inquiries')),
        getDocs(collection(db, 'media_assets')),
        getDocs(collection(db, 'admin_users')),
      ]);

      if (settSnap.exists()) settingsCount = 1;
      systemsCount = sysSnap.size;
      projectsCount = projSnap.size;
      inquiriesCount = inqSnap.size;
      mediaAssetsCount = medSnap.size;
      adminUsersCount = userSnap.size;
    } catch (err) {
      console.warn('Diagnostic counts fallback:', err);
    }
  }

  return {
    connected: health.success,
    latencyMs: health.latencyMs,
    databaseId: health.databaseId,
    projectId: health.projectId,
    settingsCount,
    systemsCount,
    projectsCount,
    inquiriesCount,
    mediaAssetsCount,
    adminUsersCount,
    lastChecked: new Date().toLocaleTimeString('ar-EG'),
    error: health.error,
  };
}

// 8. Master Seed / Sync Initial Data to Firestore
export async function seedInitialFirestoreData(): Promise<{
  success: boolean;
  message: string;
  counts: { systems: number; projects: number; media: number; users: number };
}> {
  try {
    // 1. Save settings
    await setDoc(doc(db, 'settings', 'general'), {
      ...DEFAULT_SITE_SETTINGS,
      updatedAt: new Date().toISOString(),
    });

    // 2. Save all 8 low-current systems
    let sysCount = 0;
    for (const sys of content.ar.systems.items) {
      await setDoc(doc(db, 'systems', sys.id), {
        ...sys,
        updatedAt: new Date().toISOString(),
      });
      sysCount++;
    }

    // 3. Save all 6 landmark projects
    let projCount = 0;
    for (const proj of content.ar.projects.items) {
      await setDoc(doc(db, 'projects', proj.id), {
        ...proj,
        updatedAt: new Date().toISOString(),
      });
      projCount++;
    }

    // 4. Save default media assets
    let medCount = 0;
    for (const asset of DEFAULT_MEDIA_ASSETS) {
      await setDoc(doc(db, 'media_assets', asset.id), asset);
      medCount++;
    }

    // 5. Save default admin users if not exist
    let userCount = 0;
    for (const user of DEFAULT_ADMIN_USERS) {
      await setDoc(doc(db, 'admin_users', user.id), {
        ...user,
        updatedAt: new Date().toISOString(),
      });
      userCount++;
    }

    return {
      success: true,
      message: `تم بنجاح رفع ومزامنة الإعدادات العامة، و ${sysCount} أنظمة تيار خفيف، و ${projCount} مشروعات معتمدة، و ${medCount} صور وسائط، و ${userCount} مستخدمي إدارة داخل قاعدة بيانات فايربيز!`,
      counts: {
        systems: sysCount,
        projects: projCount,
        media: medCount,
        users: userCount,
      },
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'حدث خطأ أثناء المزامنة مع فايربيز';
    return {
      success: false,
      message: errorMsg,
      counts: { systems: 0, projects: 0, media: 0, users: 0 },
    };
  }
}

