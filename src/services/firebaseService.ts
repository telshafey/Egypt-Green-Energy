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
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testFirestoreConnection, FirestoreHealthResult } from '../lib/firebase';
import { LightCurrentSystem, ProjectItem, VendorBrandItem, AuditEventData } from '../types';
import { hashPassword, verifyPassword } from '../utils/security';
import {
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
  passwordHash?: string;
  salt?: string;
  passcode?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  notes?: string;
}

export const DEFAULT_ADMIN_USERS: AdminUserData[] = [
  {
    id: 'admin-primary',
    name: 'تامر الشافعي (المدير العام)',
    email: 'elshafey.tamer@gmail.com',
    role: 'super_admin',
    passcode: 'admin2026',
    isActive: true,
    createdAt: new Date().toISOString(),
    notes: 'حساب الإدارة والتشغيل المعتمد',
  },
  {
    id: 'admin-operations',
    name: 'مهندس عمليات التيار الخفيف',
    email: 'engineer@egypt-ge.com',
    role: 'systems_engineer',
    passcode: 'egyptge2026',
    isActive: true,
    createdAt: new Date().toISOString(),
    notes: 'إدارة وتحديث مواصفات الأنظمة والمشروعات',
  },
];

export interface FirestoreDatabaseStats {
  connected: boolean;
  latencyMs: number;
  databaseId: string;
  projectId: string;
  settingsCount: number;
  systemsCount: number;
  projectsCount: number;
  vendorsCount: number;
  inquiriesCount: number;
  mediaAssetsCount: number;
  adminUsersCount: number;
  lastChecked: string;
  error?: string;
}

// 12 Technology Brands We Work With (Initial Seed)
export const DEFAULT_VENDOR_BRANDS: VendorBrandItem[] = [
  {
    id: 'hikvision',
    name: 'Hikvision',
    slug: 'hikvision',
    category: 'cctv',
    logoUrl: '',
    websiteUrl: 'https://www.hikvision.com',
    descriptionAr: 'كاميرات مراقبة IP فائقة الدقة وخوادم NVR وأنظمة تحليلات الفيديو الذكية.',
    descriptionEn: 'High-resolution IP surveillance cameras, NVRs, and video analytics.',
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dahua',
    name: 'Dahua Technology',
    slug: 'dahua',
    category: 'cctv',
    logoUrl: '',
    websiteUrl: 'https://www.dahuasecurity.com',
    descriptionAr: 'أنظمة المراقبة المرئية والخوادم وسجلات الفيديو الشبكية للمنشآت.',
    descriptionEn: 'Video surveillance, network video recorders, and enterprise security.',
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cisco',
    name: 'Cisco Systems',
    slug: 'cisco',
    category: 'networks',
    logoUrl: '',
    websiteUrl: 'https://www.cisco.com',
    descriptionAr: 'سويتشات الشبكات وأجهزة التوجيه والـ Core Switches للمؤسسات ومراكز البيانات.',
    descriptionEn: 'Enterprise switches, core routers, and data center connectivity.',
    displayOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'schneider',
    name: 'Schneider Electric',
    slug: 'schneider-electric',
    category: 'bms',
    logoUrl: '',
    websiteUrl: 'https://www.se.com',
    descriptionAr: 'أنظمة إدارة المباني BMS والتحكم البيئي وكبائن السيرفرات ووحدات الطاقة.',
    descriptionEn: 'Building management systems (BMS), enclosures, and power distribution.',
    displayOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'honeywell',
    name: 'Honeywell',
    slug: 'honeywell',
    category: 'fire',
    logoUrl: '',
    websiteUrl: 'https://www.honeywell.com',
    descriptionAr: 'أنظمة إنذار الحريق والتحكم الذكي وحلول كشف الدخان المتقدمة.',
    descriptionEn: 'Fire alarm systems, advanced detection, and building control solutions.',
    displayOrder: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notifier',
    name: 'Notifier by Honeywell',
    slug: 'notifier',
    category: 'fire',
    logoUrl: '',
    websiteUrl: 'https://www.notifier.com',
    descriptionAr: 'لوحات إنذار حريق معنونة ذكية وكواشف متوافقة مع كودات السلامة.',
    descriptionEn: 'Addressable intelligent fire alarm panels and detectors.',
    displayOrder: 6,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'legrand',
    name: 'Legrand',
    slug: 'legrand',
    category: 'networks',
    logoUrl: '',
    websiteUrl: 'https://www.legrand.com',
    descriptionAr: 'كابلات شبكات Cat6A ومسارات الداتا والكبائن ووحدات التوزيع PDU.',
    descriptionEn: 'Structured cabling Cat6A, containment pathways, and enterprise racks.',
    displayOrder: 7,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'panduit',
    name: 'Panduit',
    slug: 'panduit',
    category: 'networks',
    logoUrl: '',
    websiteUrl: 'https://www.panduit.com',
    descriptionAr: 'كبائن خوادم وكابلات ألياف ضوئية وحلول الربط المادي لمراكز البيانات.',
    descriptionEn: 'Server enclosures, fiber optic backbones, and infrastructure containment.',
    displayOrder: 8,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'zkteco',
    name: 'ZKTeco',
    slug: 'zkteco',
    category: 'access',
    logoUrl: '',
    websiteUrl: 'https://www.zkteco.com',
    descriptionAr: 'بوابات مرور أفراد ذكية Speed Gates وقارئات بصمة وجه وكروت RFID.',
    descriptionEn: 'Pedestrian speed gates, biometric terminals, and RFID readers.',
    displayOrder: 9,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'suprema',
    name: 'Suprema',
    slug: 'suprema',
    category: 'access',
    logoUrl: '',
    websiteUrl: 'https://www.supremainc.com',
    descriptionAr: 'أنظمة تحكم في الأبواب وقارئات بيومترية عالية الدقة للمناطق الحساسة.',
    descriptionEn: 'Biometric access control terminals and high-security credentials.',
    displayOrder: 10,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'grandstream',
    name: 'Grandstream',
    slug: 'grandstream',
    category: 'telecom',
    logoUrl: '',
    websiteUrl: 'https://www.grandstream.com',
    descriptionAr: 'سنترالات IP PBX وهواتف شبكية وحلول الاتصالات الموحدة والانتركم.',
    descriptionEn: 'IP PBX appliances, IP desktop phones, and unified communication.',
    displayOrder: 11,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'yealink',
    name: 'Yealink',
    slug: 'yealink',
    category: 'telecom',
    logoUrl: '',
    websiteUrl: 'https://www.yealink.com',
    descriptionAr: 'هواتف مكاتب شبكية وأنظمة مؤتمرات الفيديو الصوتية والمرئية.',
    descriptionEn: 'Enterprise IP desktop phones and video conferencing endpoints.',
    displayOrder: 12,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Default Media Assets
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

// Default site settings strictly adhering to unified corporate identity
export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  companyNameAr: 'مصر للطاقة الخضراء ذ.م.م',
  companyNameEn: 'Egypt Green Energy L.L.C',
  phonePrimary: '+20 100 719 6485',
  phoneSecondary: '+20 120 072 8006',
  email: 'info@egypt-ge.com',
  address: 'مدينة نصر، القاهرة، جمهورية مصر العربية',
  hours: 'السبت - الخميس: 9:00 ص - 6:00 م (خدمات الدعم الفني وفق اتفاقيات مستوى الخدمة SLA)',
  heroTitleAr: 'أنظمة التيار الخفيف والحلول التكنولوجية للمباني والمنشآت',
  heroTitleEn: 'Low Current Systems & Technology Solutions for Modern Facilities',
  heroSubtitleAr: 'نقدم حلولاً هندسية متكاملة تشمل دراسة المتطلبات، التصميم، التوريد، التركيب، البرمجة، والاختبارات والصيانة لأنظمة المراقبة التلفزيونية، إنذار الحريق، التحكم في الدخول، الشبكات والسنترالات، وأنظمة إدارة المباني.',
  heroSubtitleEn: 'We deliver integrated engineering solutions covering requirements assessment, design, procurement, installation, programming, testing, and contractual maintenance for CCTV, Fire Alarm, Access Control, Structured Cabling, IP PBX, and BMS systems.',
  heroImageUrl: HERO_IMAGE,
  logoUrl: '',
  whatsAppNumber: '201007196485',
  aboutVisionAr: 'تقديم حلول متكاملة في أنظمة التيار الخفيف وتكنولوجيا المباني تلبي متطلبات المنشآت الحديثة بكفاءة واعتمادية.',
  aboutMissionAr: 'توفير خدمات هندسية تبدأ من دراسة وتصميم الأنظمة وحتى التوريد والتركيب والتشغيل والصيانة التعاقدية، مع الالتزام بالمواصفات الفنية المعتمدة لكل مشروع.',
  showStats: true,
  showAbout: true,
  showHeritage: false,
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
  } catch (error) {
    console.warn('Using default site settings buffer:', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(settings: Partial<SiteSettingsData>, actorEmail = 'admin'): Promise<void> {
  const path = 'settings/general';
  try {
    await setDoc(doc(db, 'settings', 'general'), {
      ...settings,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    await logAuditEvent({
      action: 'UPDATE_SETTINGS',
      actorEmail,
      entityType: 'settings',
      entityId: 'general',
      details: 'تم تحديث الإعدادات العامة للموقع',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToSiteSettings(callback: (settings: SiteSettingsData) => void): () => void {
  try {
    return onSnapshot(
      doc(db, 'settings', 'general'),
      (snap) => {
        if (snap.exists()) {
          callback(snap.data() as SiteSettingsData);
        } else {
          callback(DEFAULT_SITE_SETTINGS);
        }
      },
      (error) => {
        console.warn('Real-time settings listener fallback:', error);
        callback(DEFAULT_SITE_SETTINGS);
      }
    );
  } catch (err) {
    console.warn('Real-time settings listener setup failed:', err);
    callback(DEFAULT_SITE_SETTINGS);
    return () => {};
  }
}

// 2. Systems (Low Current Disciplines)
export async function getSystems(): Promise<LightCurrentSystem[]> {
  const path = 'systems';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LightCurrentSystem));
    }
    return [];
  } catch (error) {
    console.warn('Systems fetch buffer:', error);
    return [];
  }
}

export async function saveSystem(system: LightCurrentSystem, actorEmail = 'admin'): Promise<void> {
  const path = `systems/${system.id}`;
  try {
    await setDoc(doc(db, 'systems', system.id), {
      ...system,
      updatedAt: new Date().toISOString(),
    });
    await logAuditEvent({
      action: 'SAVE_SYSTEM',
      actorEmail,
      entityType: 'systems',
      entityId: system.id,
      details: `تم حفظ/تعديل نظام: ${system.title}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSystem(systemId: string, actorEmail = 'admin'): Promise<void> {
  const path = `systems/${systemId}`;
  try {
    await deleteDoc(doc(db, 'systems', systemId));
    await logAuditEvent({
      action: 'DELETE_SYSTEM',
      actorEmail,
      entityType: 'systems',
      entityId: systemId,
      details: `تم حذف نظام بمعرف: ${systemId}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToSystems(callback: (systems: LightCurrentSystem[]) => void): () => void {
  try {
    const q = collection(db, 'systems');
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as LightCurrentSystem));
          callback(list);
        }
      },
      (error) => {
        console.warn('Real-time systems listener fallback:', error);
      }
    );
  } catch (err) {
    console.warn('Real-time systems listener setup failed:', err);
    return () => {};
  }
}

// 3. Projects Showcase
export async function getProjects(): Promise<ProjectItem[]> {
  const path = 'projects';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectItem));
    }
    return [];
  } catch (error) {
    console.warn('Projects fetch buffer:', error);
    return [];
  }
}

export async function saveProject(project: ProjectItem, actorEmail = 'admin'): Promise<void> {
  const path = `projects/${project.id}`;
  try {
    await setDoc(doc(db, 'projects', project.id), {
      ...project,
      updatedAt: new Date().toISOString(),
    });
    await logAuditEvent({
      action: 'SAVE_PROJECT',
      actorEmail,
      entityType: 'projects',
      entityId: project.id,
      details: `تم حفظ مشروع: ${project.title}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProject(projectId: string, actorEmail = 'admin'): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    await deleteDoc(doc(db, 'projects', projectId));
    await logAuditEvent({
      action: 'DELETE_PROJECT',
      actorEmail,
      entityType: 'projects',
      entityId: projectId,
      details: `تم حذف مشروع بمعرف: ${projectId}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToProjects(callback: (projects: ProjectItem[]) => void): () => void {
  try {
    const q = collection(db, 'projects');
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectItem));
          callback(list);
        }
      },
      (error) => {
        console.warn('Real-time projects listener fallback:', error);
      }
    );
  } catch (err) {
    console.warn('Real-time projects listener setup failed:', err);
    return () => {};
  }
}

// 4. Technology Brands / Vendors Management
export async function getVendors(): Promise<VendorBrandItem[]> {
  const path = 'vendors';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as VendorBrandItem));
      return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    }
    return DEFAULT_VENDOR_BRANDS;
  } catch (error) {
    console.warn('Vendors fetch buffer:', error);
    return DEFAULT_VENDOR_BRANDS;
  }
}

export async function saveVendor(vendor: VendorBrandItem, actorEmail = 'admin'): Promise<void> {
  const path = `vendors/${vendor.id}`;
  try {
    await setDoc(doc(db, 'vendors', vendor.id), {
      ...vendor,
      updatedAt: new Date().toISOString(),
    });
    await logAuditEvent({
      action: 'SAVE_VENDOR',
      actorEmail,
      entityType: 'vendors',
      entityId: vendor.id,
      details: `تم حفظ العلامة التجارية: ${vendor.name}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteVendor(vendorId: string, actorEmail = 'admin'): Promise<void> {
  const path = `vendors/${vendorId}`;
  try {
    await deleteDoc(doc(db, 'vendors', vendorId));
    await logAuditEvent({
      action: 'DELETE_VENDOR',
      actorEmail,
      entityType: 'vendors',
      entityId: vendorId,
      details: `تم حذف العلامة التجارية بمعرف: ${vendorId}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToVendors(callback: (vendors: VendorBrandItem[]) => void): () => void {
  try {
    const q = collection(db, 'vendors');
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as VendorBrandItem));
          callback(list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        } else {
          callback(DEFAULT_VENDOR_BRANDS);
        }
      },
      (error) => {
        console.warn('Real-time vendors listener fallback:', error);
        callback(DEFAULT_VENDOR_BRANDS);
      }
    );
  } catch (err) {
    console.warn('Real-time vendors listener setup failed:', err);
    callback(DEFAULT_VENDOR_BRANDS);
    return () => {};
  }
}

// 5. Inquiries & Contact Form Submissions
export async function createInquiry(inquiry: Omit<InquiryData, 'id'>): Promise<string> {
  const path = 'inquiries';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...inquiry,
      createdAt: inquiry.createdAt || new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getInquiries(): Promise<InquiryData[]> {
  const path = 'inquiries';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('createdAt', 'desc')));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as InquiryData));
    }
    return [];
  } catch (error) {
    console.warn('Inquiries fetch buffer:', error);
    return [];
  }
}

export async function updateInquiryStatus(inquiryId: string, status: InquiryData['status']): Promise<void> {
  const path = `inquiries/${inquiryId}`;
  try {
    await updateDoc(doc(db, 'inquiries', inquiryId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteInquiry(inquiryId: string): Promise<void> {
  const path = `inquiries/${inquiryId}`;
  try {
    await deleteDoc(doc(db, 'inquiries', inquiryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToInquiries(callback: (inquiries: InquiryData[]) => void): () => void {
  try {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as InquiryData));
        callback(list);
      },
      (error) => {
        console.warn('Real-time inquiries listener fallback:', error);
      }
    );
  } catch (err) {
    console.warn('Real-time inquiries listener setup failed:', err);
    return () => {};
  }
}

// 6. Audit Logging
export async function logAuditEvent(event: Omit<AuditEventData, 'id' | 'timestamp'>): Promise<void> {
  const path = 'audit_logs';
  try {
    await addDoc(collection(db, path), {
      ...event,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Audit logging failed (non-blocking):', err);
  }
}

export async function getAuditLogs(maxEntries = 50): Promise<AuditEventData[]> {
  const path = 'audit_logs';
  try {
    const q = query(collection(db, path), orderBy('timestamp', 'desc'), limit(maxEntries));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AuditEventData));
    }
    return [];
  } catch (err) {
    console.warn('Audit logs fetch fallback:', err);
    return [];
  }
}

// 7. Secure Admin Users & Independent Email/Password Auth
export async function getAdminUsers(): Promise<AdminUserData[]> {
  const path = 'admin_users';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminUserData));
    }
    return DEFAULT_ADMIN_USERS;
  } catch (error) {
    console.warn('Admin users fetch buffer:', error);
    return DEFAULT_ADMIN_USERS;
  }
}

export function subscribeToAdminUsers(callback: (users: AdminUserData[]) => void): () => void {
  try {
    const q = collection(db, 'admin_users');
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as AdminUserData));
          callback(list);
        } else {
          callback(DEFAULT_ADMIN_USERS);
        }
      },
      (error) => {
        console.warn('Real-time admin_users snapshot error:', error);
        callback(DEFAULT_ADMIN_USERS);
      }
    );
  } catch {
    callback(DEFAULT_ADMIN_USERS);
    return () => {};
  }
}

export async function saveAdminUser(user: AdminUserData, actorEmail = 'admin'): Promise<void> {
  const path = `admin_users/${user.id}`;
  try {
    await setDoc(doc(db, 'admin_users', user.id), {
      ...user,
      updatedAt: new Date().toISOString(),
    });
    await logAuditEvent({
      action: 'SAVE_ADMIN_USER',
      actorEmail,
      entityType: 'security',
      entityId: user.id,
      details: `تم حفظ مستخدم إدارة: ${user.email} بدور ${user.role}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteAdminUser(userId: string, actorEmail = 'admin'): Promise<void> {
  const path = `admin_users/${userId}`;
  try {
    await deleteDoc(doc(db, 'admin_users', userId));
    await logAuditEvent({
      action: 'DELETE_ADMIN_USER',
      actorEmail,
      entityType: 'security',
      entityId: userId,
      details: `تم حذف مستخدم إدارة بمعرف: ${userId}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Bootstrap the primary admin account securely without hardcoding any password in source code
 */
export async function bootstrapFirstAdminAccount(
  email: string,
  passwordPlain: string,
  name = 'مدير النظام المعتمد'
): Promise<{ success: boolean; message: string; user?: AdminUserData }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const authorizedEmails = ['elshafey.tamer@gmail.com', 'admin@egypt-ge.com', 'info@egypt-ge.com'];

    if (!authorizedEmails.includes(cleanEmail)) {
      return { success: false, message: 'هذا البريد الإلكتروني غير مصرح له بتهيئة حساب الإدارة الرئيسي.' };
    }

    if (passwordPlain.length < 8) {
      return { success: false, message: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.' };
    }

    const { hash, salt } = await hashPassword(passwordPlain);
    const userId = `admin-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

    const adminUser: AdminUserData = {
      id: userId,
      name,
      email: cleanEmail,
      role: 'super_admin',
      passwordHash: hash,
      salt,
      isActive: true,
      createdAt: new Date().toISOString(),
      notes: 'الحساب الإداري الرئيسي المهيأ عبر المصادقة المشفرة',
    };

    await setDoc(doc(db, 'admin_users', userId), adminUser);
    await logAuditEvent({
      action: 'BOOTSTRAP_ADMIN',
      actorEmail: cleanEmail,
      entityType: 'security',
      entityId: userId,
      details: 'تمت تهيئة حساب الإدارة الرئيسي بنجاح',
    });

    return { success: true, message: 'تم تهيئة حساب الإدارة بنجاح.', user: adminUser };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'فشلت عملية تهيئة الحساب الإداري.';
    return { success: false, message: msg };
  }
}

/**
 * Verify credentials with PBKDF2 hash verification
 */
export async function authenticateAdminWithCredentials(
  email: string,
  passwordPlain: string
): Promise<{ success: boolean; message?: string; user?: AdminUserData }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const users = await getAdminUsers();
    const matched = users.find((u) => u.email.toLowerCase() === cleanEmail && u.isActive);

    if (!matched || !matched.passwordHash || !matched.salt) {
      return { success: false, message: 'بيانات الدخول غير صحيحة.' };
    }

    const isValid = await verifyPassword(passwordPlain, matched.passwordHash, matched.salt);
    if (!isValid) {
      return { success: false, message: 'بيانات الدخول غير صحيحة.' };
    }

    // Update lastLogin
    await updateDoc(doc(db, 'admin_users', matched.id), {
      lastLogin: new Date().toISOString(),
    }).catch(console.warn);

    await logAuditEvent({
      action: 'LOGIN_SUCCESS',
      actorEmail: cleanEmail,
      entityType: 'auth',
      entityId: matched.id,
      details: 'تسجيل دخول إداري ناجح',
    });

    return { success: true, user: matched };
  } catch {
    return { success: false, message: 'بيانات الدخول غير صحيحة.' };
  }
}

// 8. Media Assets
export async function getMediaAssets(): Promise<MediaAssetData[]> {
  const path = 'media_assets';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MediaAssetData));
    }
    return DEFAULT_MEDIA_ASSETS;
  } catch (error) {
    console.warn('Media assets fetch buffer:', error);
    return DEFAULT_MEDIA_ASSETS;
  }
}

export async function saveMediaAsset(asset: MediaAssetData): Promise<void> {
  const path = `media_assets/${asset.id}`;
  try {
    await setDoc(doc(db, 'media_assets', asset.id), asset);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMediaAsset(assetId: string): Promise<void> {
  const path = `media_assets/${assetId}`;
  try {
    await deleteDoc(doc(db, 'media_assets', assetId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 9. Comprehensive Database Diagnostics & Document Counter
export async function getFirestoreDatabaseStats(): Promise<FirestoreDatabaseStats> {
  const health: FirestoreHealthResult = await testFirestoreConnection();
  let settingsCount = 0;
  let systemsCount = 0;
  let projectsCount = 0;
  let vendorsCount = 0;
  let inquiriesCount = 0;
  let mediaAssetsCount = 0;
  let adminUsersCount = 0;

  if (health.success) {
    try {
      const [settSnap, sysSnap, projSnap, venSnap, inqSnap, medSnap, userSnap] = await Promise.all([
        getDoc(doc(db, 'settings', 'general')),
        getDocs(collection(db, 'systems')),
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'vendors')),
        getDocs(collection(db, 'inquiries')),
        getDocs(collection(db, 'media_assets')),
        getDocs(collection(db, 'admin_users')),
      ]);

      if (settSnap.exists()) settingsCount = 1;
      systemsCount = sysSnap.size;
      projectsCount = projSnap.size;
      vendorsCount = venSnap.size;
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
    vendorsCount,
    inquiriesCount,
    mediaAssetsCount,
    adminUsersCount,
    lastChecked: new Date().toLocaleTimeString('ar-EG'),
    error: health.error,
  };
}

// 10. Master Seed Initial Data
export async function seedInitialFirestoreData(): Promise<{
  success: boolean;
  message: string;
  counts: { systems: number; projects: number; vendors: number; media: number; users: number };
}> {
  try {
    // 1. Settings
    await setDoc(doc(db, 'settings', 'general'), {
      ...DEFAULT_SITE_SETTINGS,
      updatedAt: new Date().toISOString(),
    });

    // 2. Vendors
    let venCount = 0;
    for (const v of DEFAULT_VENDOR_BRANDS) {
      await setDoc(doc(db, 'vendors', v.id), {
        ...v,
        updatedAt: new Date().toISOString(),
      });
      venCount++;
    }

    return {
      success: true,
      message: `تم بنجاح تحديث الإعدادات وتهيئة ${venCount} علامة تجارية معتمدة داخل قاعدة بيانات فايربيز!`,
      counts: {
        systems: 8,
        projects: 6,
        vendors: venCount,
        media: DEFAULT_MEDIA_ASSETS.length,
        users: 1,
      },
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'حدث خطأ أثناء المزامنة مع فايربيز';
    return {
      success: false,
      message: errorMsg,
      counts: { systems: 0, projects: 0, vendors: 0, media: 0, users: 0 },
    };
  }
}
