export type Language = 'ar' | 'en';

export type NavSection = 'home' | 'about' | 'systems' | 'projects' | 'configurator' | 'brands' | 'contact';

export interface LightCurrentSystem {
  id: string;
  category: 'security' | 'safety' | 'connectivity' | 'audio-bms' | 'maintenance';
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  image: string;
  badge: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'surveillance' | 'networks' | 'safety' | 'smart-bms';
  categoryLabel: string;
  location: string;
  year: string;
  deliveryYear?: string;
  clientType: string;
  sector?: string;
  scopeOfWork?: string[];
  scopeSummary?: string;
  handoverCertificate?: string;
  consultantName?: string;
  clientName?: string;
  isFieldRealPhoto?: boolean;
  description: string;
  impactMetrics: { label: string; value: string }[];
  technicalSpecs: { label: string; value: string }[];
  image: string;
}

export interface VendorBrandItem {
  id: string;
  name: string;
  slug: string;
  category: 'cctv' | 'fire' | 'networks' | 'access' | 'telecom' | 'bms' | 'audio';
  logoUrl: string;
  svgContent?: string;
  websiteUrl?: string;
  descriptionAr: string;
  descriptionEn: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuditEventData {
  id: string;
  action: string;
  actorEmail: string;
  entityType: 'settings' | 'systems' | 'projects' | 'vendors' | 'auth' | 'security';
  entityId?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}
