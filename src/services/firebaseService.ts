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
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { LightCurrentSystem, ProjectItem } from '../types';
import { content, HERO_IMAGE, CCTV_IMAGE, CABLING_IMAGE, ACCESS_IMAGE, DATACENTER_IMAGE, ENERGY_IMAGE, BIOTECH_IMAGE, JOJOBA_IMAGE } from '../data/translations';

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
  whatsAppNumber: string;
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
    title: 'Clean Energy & Solar Microgrid',
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
  whatsAppNumber: '201007196485',
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

export async function updateInquiryStatus(inquiryId: string, status: 'new' | 'in_progress' | 'completed'): Promise<void> {
  const path = `inquiries/${inquiryId}`;
  try {
    await updateDoc(doc(db, 'inquiries', inquiryId), { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
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

// 6. Master Seed / Sync Initial Data to Firestore
export async function seedInitialFirestoreData(): Promise<{ success: boolean; message: string }> {
  try {
    // Save settings
    await setDoc(doc(db, 'settings', 'general'), {
      ...DEFAULT_SITE_SETTINGS,
      updatedAt: new Date().toISOString(),
    });

    // Save systems
    for (const sys of content.ar.systems.items) {
      await setDoc(doc(db, 'systems', sys.id), {
        ...sys,
        updatedAt: new Date().toISOString(),
      });
    }

    // Save projects
    for (const proj of content.ar.projects.items) {
      await setDoc(doc(db, 'projects', proj.id), {
        ...proj,
        updatedAt: new Date().toISOString(),
      });
    }

    // Save media assets
    for (const asset of DEFAULT_MEDIA_ASSETS) {
      await setDoc(doc(db, 'media_assets', asset.id), asset);
    }

    return {
      success: true,
      message: 'تمت مزامنة وتهيئة كافة البيانات والأنظمة والمشروعات والصور في فايربيز بنجاح!',
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'حدث خطأ أثناء المزامنة مع فايربيز',
    };
  }
}
