export type Language = 'ar' | 'en';

export type NavSection = 'home' | 'about' | 'systems' | 'projects' | 'configurator' | 'contact';

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
  clientName?: string;
  scopeOfWork?: string[];
  handoverCertificate?: string;
  consultantName?: string;
  isFieldRealPhoto?: boolean;
  description: string;
  impactMetrics: { label: string; value: string }[];
  technicalSpecs: { label: string; value: string }[];
  image: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  highlight: string;
}
