import React, { useState } from 'react';
import { Language } from '../types';
import { content } from '../data/translations';
import { Award, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

interface PartnersSectionProps {
  currentLang: Language;
}

interface PartnerBrandItem {
  id: string;
  name: string;
  category: 'cctv' | 'fire' | 'networks' | 'access' | 'telecom';
  specialtyAr: string;
  specialtyEn: string;
  statusAr: string;
  statusEn: string;
  renderLogo: () => React.ReactNode;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ currentLang }) => {
  const t = content[currentLang].partners;
  const isRtl = currentLang === 'ar';
  const [activeCategory, setActiveCategory] = useState<'all' | 'cctv' | 'fire' | 'networks' | 'access' | 'telecom'>('all');

  const partners: PartnerBrandItem[] = [
    {
      id: 'hikvision',
      name: 'Hikvision',
      category: 'cctv',
      specialtyAr: 'كاميرات مراقبة 4K وذكاء اصطناعي VCA',
      specialtyEn: '4K IP Cameras & AI Analytics',
      statusAr: 'شريك معتمد',
      statusEn: 'Certified Partner',
      renderLogo: () => (
        <svg viewBox="0 0 160 48" className="h-9 w-auto max-w-[130px]" aria-label="Hikvision">
          {/* Hikvision authentic stylized red + dark charcoal vector logo */}
          <rect x="2" y="10" width="8" height="28" rx="2" fill="#D32F2F" />
          <path d="M18 10h6v11h14V10h6v28h-6V26H24v12h-6V10z" fill="#D32F2F" />
          <path d="M50 10h6v28h-6V10z" fill="#D32F2F" />
          <path d="M64 10h6v12l10-12h8l-11 13 12 15h-8l-9-12v12h-6V10z" fill="#1E293B" />
          <path d="M94 28c1 3 4 5 8 5 3 0 5-1 6-3l5 3c-2 4-6 6-11 6-8 0-14-6-14-14s6-14 14-14c8 0 13 6 13 14h-18zm8-7c-4 0-6 3-7 5h13c0-2-2-5-6-5z" fill="#1E293B" />
          <path d="M120 10h6v28h-6V10z" fill="#1E293B" />
          <path d="M132 30l4-2c1 3 3 5 6 5 2 0 4-1 4-3 0-2-2-3-5-4l-4-1c-5-2-7-5-7-9 0-4 4-8 10-8 6 0 9 3 11 7l-4 2c-1-2-3-4-6-4-3 0-4 1-4 2 0 2 2 3 5 4l4 1c5 2 8 5 8 9 0 5-4 9-11 9-6 0-10-3-12-7z" fill="#1E293B" />
        </svg>
      ),
    },
    {
      id: 'dahua',
      name: 'Dahua Technology',
      category: 'cctv',
      specialtyAr: 'أنظمة المراقبة والخوادم المرئية NVR',
      specialtyEn: 'Video Surveillance & NVR Systems',
      statusAr: 'موزع معتمد',
      statusEn: 'Authorized Distributor',
      renderLogo: () => (
        <svg viewBox="0 0 160 48" className="h-9 w-auto max-w-[130px]" aria-label="Dahua">
          {/* Dahua double red arcs emblem + typography */}
          <path d="M16 8 C28 8 36 16 36 24 C36 32 28 40 16 40 C10 40 4 36 2 30 C5 31 9 32 13 32 C21 32 27 27 27 24 C27 21 21 16 13 16 C9 16 5 17 2 18 C4 12 10 8 16 8 Z" fill="#E53935" />
          <circle cx="20" cy="24" r="5" fill="#E53935" />
          <text x="44" y="32" fontFamily="system-ui, -apple-system, sans-serif" fontSize="22" fontWeight="800" fill="#0F172A" letterSpacing="-0.5">
            dahua
          </text>
        </svg>
      ),
    },
    {
      id: 'cisco',
      name: 'Cisco Systems',
      category: 'networks',
      specialtyAr: 'سويتشات الشبكات والـ Core Switches',
      specialtyEn: 'Enterprise Switches & Routing',
      statusAr: 'حلول معتمدة',
      statusEn: 'Enterprise Ready',
      renderLogo: () => (
        <svg viewBox="0 0 140 48" className="h-9 w-auto max-w-[115px]" aria-label="Cisco">
          {/* Cisco iconic Bridge Soundwaves */}
          <g fill="#049FD9">
            <rect x="14" y="24" width="4" height="6" rx="2" />
            <rect x="24" y="16" width="4" height="14" rx="2" />
            <rect x="34" y="22" width="4" height="8" rx="2" />
            <rect x="44" y="10" width="4" height="20" rx="2" />
            <rect x="54" y="16" width="4" height="14" rx="2" />
            <rect x="64" y="24" width="4" height="6" rx="2" />
            <rect x="74" y="10" width="4" height="20" rx="2" />
            <rect x="84" y="22" width="4" height="8" rx="2" />
            <rect x="94" y="16" width="4" height="14" rx="2" />
            <rect x="104" y="24" width="4" height="6" rx="2" />
          </g>
          <text x="60" y="44" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="900" fill="#0F172A" letterSpacing="2">
            CISCO
          </text>
        </svg>
      ),
    },
    {
      id: 'schneider',
      name: 'Schneider Electric',
      category: 'networks',
      specialtyAr: 'أنظمة إدارة المباني BMS والكبائن',
      specialtyEn: 'Smart BMS & Enterprise Racks',
      statusAr: 'شريك تكاملي',
      statusEn: 'Integration Partner',
      renderLogo: () => (
        <svg viewBox="0 0 170 48" className="h-9 w-auto max-w-[135px]" aria-label="Schneider Electric">
          {/* Schneider Electric signature Green Flash + Typography */}
          <circle cx="18" cy="24" r="14" fill="#3DCD58" />
          <path d="M14 14l8 10h-6l4 10-10-12h6z" fill="#ffffff" />
          <text x="38" y="22" fontFamily="system-ui, -apple-system, sans-serif" fontSize="13" fontWeight="bold" fill="#0F172A">
            Schneider
          </text>
          <text x="38" y="34" fontFamily="system-ui, -apple-system, sans-serif" fontSize="10" fontWeight="700" fill="#3DCD58" letterSpacing="1">
            Electric
          </text>
        </svg>
      ),
    },
    {
      id: 'honeywell',
      name: 'Honeywell',
      category: 'fire',
      specialtyAr: 'أنظمة إنذار الحريق والتحكم الذكي',
      specialtyEn: 'Fire Alarm & Building Automation',
      statusAr: 'معتمد دفاع مدني',
      statusEn: 'Civil Defense Certified',
      renderLogo: () => (
        <svg viewBox="0 0 160 48" className="h-9 w-auto max-w-[130px]" aria-label="Honeywell">
          {/* Honeywell Bold Red Typography */}
          <text x="80" y="33" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="24" fontWeight="900" fill="#EE3124" letterSpacing="-0.5">
            Honeywell
          </text>
        </svg>
      ),
    },
    {
      id: 'notifier',
      name: 'Notifier by Honeywell',
      category: 'fire',
      specialtyAr: 'لوحات إنذار حريق معنونة ذكية',
      specialtyEn: 'Addressable Fire Panels & NFPA 72',
      statusAr: 'معتمد دولياً',
      statusEn: 'NFPA 72 Rated',
      renderLogo: () => (
        <svg viewBox="0 0 160 48" className="h-9 w-auto max-w-[130px]" aria-label="Notifier">
          {/* Notifier Flame/Shield Emblem */}
          <path d="M12 28 C12 20 22 10 22 10 C22 10 32 20 32 28 C32 34 27 38 22 38 C17 38 12 34 12 28 Z" fill="#D32F2F" />
          <path d="M18 30 C18 25 22 20 22 20 C22 20 26 25 26 30 C26 33 24 35 22 35 C20 35 18 33 18 30 Z" fill="#FFA000" />
          <text x="40" y="31" fontFamily="system-ui, -apple-system, sans-serif" fontSize="18" fontWeight="800" fill="#0F172A" letterSpacing="0.5">
            NOTIFIER
          </text>
        </svg>
      ),
    },
    {
      id: 'legrand',
      name: 'Legrand',
      category: 'networks',
      specialtyAr: 'كابلات شبكات Cat6A ومسارات الداتا',
      specialtyEn: 'Structured Cabling & Containment',
      statusAr: 'مواصفة قياسية',
      statusEn: 'TIA-568 Compliant',
      renderLogo: () => (
        <svg viewBox="0 0 150 48" className="h-9 w-auto max-w-[120px]" aria-label="Legrand">
          {/* Legrand Red Square Mark */}
          <rect x="8" y="10" width="28" height="28" rx="4" fill="#E53935" />
          <path d="M15 16h5v12h9v5H15V16z" fill="#ffffff" />
          <text x="44" y="32" fontFamily="system-ui, -apple-system, sans-serif" fontSize="20" fontWeight="bold" fill="#0F172A">
            legrand
          </text>
        </svg>
      ),
    },
    {
      id: 'panduit',
      name: 'Panduit',
      category: 'networks',
      specialtyAr: 'كبائن خوادم وكابلات ألياف ضوئية',
      specialtyEn: 'Server Racks & Fiber Backbones',
      statusAr: 'جاهزية الداتا سنتر',
      statusEn: 'Data Center Grade',
      renderLogo: () => (
        <svg viewBox="0 0 150 48" className="h-9 w-auto max-w-[120px]" aria-label="Panduit">
          {/* Panduit Corporate Triangle Logo */}
          <polygon points="10,36 24,10 38,36" fill="#005A9C" />
          <polygon points="17,32 24,18 31,32" fill="#ffffff" />
          <text x="46" y="32" fontFamily="system-ui, -apple-system, sans-serif" fontSize="19" fontWeight="900" fill="#005A9C" letterSpacing="0.5">
            PANDUIT
          </text>
        </svg>
      ),
    },
    {
      id: 'zkteco',
      name: 'ZKTeco',
      category: 'access',
      specialtyAr: 'بوابات مرور أفراد وبصمة وجه',
      specialtyEn: 'Biometric Turnstiles & Access Control',
      statusAr: 'توريد وتركيب معتمد',
      statusEn: 'Turnkey Solution',
      renderLogo: () => (
        <svg viewBox="0 0 150 48" className="h-9 w-auto max-w-[120px]" aria-label="ZKTeco">
          {/* ZKTeco Green Shield Emblem */}
          <circle cx="20" cy="24" r="14" fill="#7CB342" />
          <path d="M13 24l5 5 10-10" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="42" y="31" fontFamily="system-ui, -apple-system, sans-serif" fontSize="20" fontWeight="bold" fill="#33691E">
            ZK<tspan fill="#0F172A">Teco</tspan>
          </text>
        </svg>
      ),
    },
    {
      id: 'suprema',
      name: 'Suprema',
      category: 'access',
      specialtyAr: 'أنظمة تحكم في الأبواب فائقة الدقة',
      specialtyEn: 'High-Security Biometrics & RFID',
      statusAr: 'أعلى اعتماد أمني',
      statusEn: 'High Security Tier',
      renderLogo: () => (
        <svg viewBox="0 0 150 48" className="h-9 w-auto max-w-[120px]" aria-label="Suprema">
          {/* Suprema Red Biometric Wave */}
          <circle cx="18" cy="24" r="12" fill="none" stroke="#D32F2F" strokeWidth="3" />
          <circle cx="18" cy="24" r="6" fill="#D32F2F" />
          <text x="36" y="32" fontFamily="system-ui, -apple-system, sans-serif" fontSize="19" fontWeight="800" fill="#0F172A" letterSpacing="0.5">
            suprema
          </text>
        </svg>
      ),
    },
    {
      id: 'grandstream',
      name: 'Grandstream',
      category: 'telecom',
      specialtyAr: 'سنترالات IP PBX وهواتف شبكية',
      specialtyEn: 'IP PBX & Unified Communications',
      statusAr: 'حلول اتصالات ذكية',
      statusEn: 'VoIP Telecom Leader',
      renderLogo: () => (
        <svg viewBox="0 0 160 48" className="h-9 w-auto max-w-[130px]" aria-label="Grandstream">
          {/* Grandstream Waves Emblem */}
          <circle cx="18" cy="24" r="13" fill="#0288D1" />
          <path d="M12 24c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="18" cy="24" r="2.5" fill="#ffffff" />
          <text x="38" y="26" fontFamily="system-ui, -apple-system, sans-serif" fontSize="13" fontWeight="bold" fill="#0F172A">
            GRANDSTREAM
          </text>
          <text x="38" y="36" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8" fontWeight="700" fill="#0288D1" letterSpacing="1">
            CONNECTING THE WORLD
          </text>
        </svg>
      ),
    },
    {
      id: 'yealink',
      name: 'Yealink',
      category: 'telecom',
      specialtyAr: 'هواتف المكاتب وأنظمة الفيديو كونفرانس',
      specialtyEn: 'Enterprise IP Phones & Video Teams',
      statusAr: 'معدات أصلية معتمدة',
      statusEn: 'Enterprise Certified',
      renderLogo: () => (
        <svg viewBox="0 0 150 48" className="h-9 w-auto max-w-[120px]" aria-label="Yealink">
          {/* Yealink Green Mark */}
          <circle cx="16" cy="20" r="5" fill="#43A047" />
          <circle cx="28" cy="28" r="5" fill="#43A047" />
          <line x1="16" y1="20" x2="28" y2="28" stroke="#43A047" strokeWidth="2.5" />
          <text x="38" y="32" fontFamily="system-ui, -apple-system, sans-serif" fontSize="21" fontWeight="bold" fill="#0F172A">
            Yealink
          </text>
        </svg>
      ),
    },
  ];

  const filteredPartners = activeCategory === 'all'
    ? partners
    : partners.filter((p) => p.category === activeCategory);

  return (
    <section className="py-16 sm:py-20 bg-slate-50/50 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>{t.sectionKicker}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
            {t.heading}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {t.subheading}
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {currentLang === 'ar' ? 'جميع الشركاء (12)' : 'All Partners (12)'}
          </button>
          <button
            onClick={() => setActiveCategory('cctv')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
              activeCategory === 'cctv'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {currentLang === 'ar' ? 'المراقبة والأمن' : 'CCTV & Security'}
          </button>
          <button
            onClick={() => setActiveCategory('fire')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
              activeCategory === 'fire'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {currentLang === 'ar' ? 'إنذار الحريق' : 'Fire Alarm'}
          </button>
          <button
            onClick={() => setActiveCategory('networks')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
              activeCategory === 'networks'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {currentLang === 'ar' ? 'الشبكات والـ BMS' : 'Networks & BMS'}
          </button>
          <button
            onClick={() => setActiveCategory('access')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
              activeCategory === 'access'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {currentLang === 'ar' ? 'التحكم بالدخول' : 'Access Control'}
          </button>
          <button
            onClick={() => setActiveCategory('telecom')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
              activeCategory === 'telecom'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {currentLang === 'ar' ? 'السنترالات والاتصالات' : 'IP Telephony'}
          </button>
        </div>

        {/* Brand Grid: LOGO STRICTLY POSITIONED ON TOP, NAME UNDERNEATH */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {filteredPartners.map((brand) => (
            <div
              key={brand.id}
              className="flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group text-center"
            >
              {/* 1. TOP ELEMENT: Crisp, Clean Logo Box Centered On Top */}
              <div className="w-full h-16 sm:h-18 flex items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-emerald-50/50 border border-slate-100 group-hover:border-emerald-200 transition-colors mb-3.5 overflow-hidden">
                {brand.renderLogo()}
              </div>

              {/* 2. MIDDLE ELEMENT: Brand Name Positioned Directly Below Logo */}
              <div className="w-full">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight">
                  {brand.name}
                </h3>

                {/* 3. Specialty Description Underneath */}
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-snug mt-1.5 line-clamp-2">
                  {currentLang === 'ar' ? brand.specialtyAr : brand.specialtyEn}
                </p>
              </div>

              {/* 4. Verified Tier Tag At Bottom */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 w-full flex items-center justify-center gap-1 text-[10px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>{currentLang === 'ar' ? brand.statusAr : brand.statusEn}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Standards Compliance Strip */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-700 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">
              {currentLang === 'ar'
                ? 'جميع المهمات والمعدات الموردة بمشروعاتنا أصلية 100% معتمدة ومطابقة لاشتراطات الدفاع المدني والجهاز القومي لتنظيم الاتصالات (NTRA).'
                : 'All supplied systems are 100% genuine Tier-1 hardware, fully compliant with Egyptian Civil Defense and NTRA standards.'}
            </span>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500 shrink-0">
            {currentLang === 'ar' ? 'ضمان رسمي معتمد' : 'Authorized OEM Warranty'}
          </span>
        </div>

      </div>
    </section>
  );
};
