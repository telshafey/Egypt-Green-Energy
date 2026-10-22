import React, { useState } from 'react';
import { Language, VendorBrandItem } from '../types';
import { content } from '../data/translations';
import { Award, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

interface PartnersSectionProps {
  currentLang: Language;
  customVendors?: VendorBrandItem[];
}

interface PartnerBrandItem {
  id: string;
  name: string;
  category: 'cctv' | 'fire' | 'networks' | 'access' | 'telecom';
  specialtyAr: string;
  specialtyEn: string;
  statusAr: string;
  statusEn: string;
  logoUrl?: string;
  renderLogo: () => React.ReactNode;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ currentLang, customVendors }) => {
  const t = content[currentLang].partners;
  const isRtl = currentLang === 'ar';
  const [activeCategory, setActiveCategory] = useState<'all' | 'cctv' | 'fire' | 'networks' | 'access' | 'telecom'>('all');

  const defaultPartners: PartnerBrandItem[] = [
    {
      id: 'hikvision',
      name: 'Hikvision',
      category: 'cctv',
      specialtyAr: 'كاميرات مراقبة IP وخوادم NVR وتحليلات الفيديو',
      specialtyEn: 'IP Cameras, NVRs & Video Analytics',
      statusAr: 'أنظمة مراقبة مرئية',
      statusEn: 'Video Surveillance',
      logoUrl: '/assets/logos/hikvision.svg',
      renderLogo: () => (
        <svg viewBox="0 0 160 48" className="h-8 w-auto max-w-[120px]" aria-label="Hikvision">
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
      specialtyAr: 'أنظمة المراقبة والخوادم المرئية NVR للمنشآت',
      specialtyEn: 'Video Surveillance & NVR Storage',
      statusAr: 'مراقبة وخوادم NVR',
      statusEn: 'Surveillance & Storage',
      logoUrl: '/assets/logos/dahua.svg',
      renderLogo: () => (
        <svg viewBox="0 0 160 48" className="h-8 w-auto max-w-[120px]" aria-label="Dahua">
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
      specialtyAr: 'سويتشات الشبكات وأجهزة التوجيه للشركات',
      specialtyEn: 'Enterprise Switches & Routing',
      statusAr: 'شبكات وسويتشات',
      statusEn: 'Enterprise Networks',
      logoUrl: '/assets/logos/cisco.svg',
      renderLogo: () => (
        <svg viewBox="0 0 140 48" className="h-8 w-auto max-w-[115px]" aria-label="Cisco">
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
      specialtyEn: 'Smart BMS & Enterprise Enclosures',
      statusAr: 'إدارة المباني BMS',
      statusEn: 'Smart Building BMS',
      logoUrl: '/assets/logos/schneider.svg',
      renderLogo: () => (
        <svg viewBox="0 0 170 48" className="h-8 w-auto max-w-[130px]" aria-label="Schneider Electric">
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
      statusAr: 'أنظمة إنذار الحريق',
      statusEn: 'Fire Alarm Systems',
      logoUrl: '/assets/logos/honeywell.svg',
      renderLogo: () => (
        <svg viewBox="0 0 160 48" className="h-8 w-auto max-w-[125px]" aria-label="Honeywell">
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
      specialtyAr: 'لوحات إنذار حريق معنونة وكواشف ذكية',
      specialtyEn: 'Addressable Fire Panels & Detectors',
      statusAr: 'إنذار حريق معنون',
      statusEn: 'Addressable Fire Alarm',
      logoUrl: '/assets/logos/notifier.svg',
      renderLogo: () => (
        <svg viewBox="0 0 160 48" className="h-8 w-auto max-w-[125px]" aria-label="Notifier">
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
      statusAr: 'كابلات وبنية شبكات',
      statusEn: 'Structured Cabling',
      logoUrl: '/assets/logos/legrand.svg',
      renderLogo: () => (
        <svg viewBox="0 0 150 48" className="h-8 w-auto max-w-[115px]" aria-label="Legrand">
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
      statusAr: 'كبائن وروابط ألياف',
      statusEn: 'Racks & Fiber',
      logoUrl: '/assets/logos/panduit.svg',
      renderLogo: () => (
        <svg viewBox="0 0 150 48" className="h-8 w-auto max-w-[115px]" aria-label="Panduit">
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
      specialtyAr: 'بوابات مرور أفراد وقارئات تحكم بالدخول',
      specialtyEn: 'Turnstiles & Access Control Readers',
      statusAr: 'بوابات وتحكم بالدخول',
      statusEn: 'Access & Turnstiles',
      logoUrl: '/assets/logos/zkteco.svg',
      renderLogo: () => (
        <svg viewBox="0 0 150 48" className="h-8 w-auto max-w-[115px]" aria-label="ZKTeco">
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
      specialtyAr: 'أنظمة تحكم متطورة في الأبواب والمداخل',
      specialtyEn: 'Biometric Access Control & RFID',
      statusAr: 'أجهزة تحكم بيومترية',
      statusEn: 'Biometric Access',
      logoUrl: '/assets/logos/suprema.svg',
      renderLogo: () => (
        <svg viewBox="0 0 150 48" className="h-8 w-auto max-w-[115px]" aria-label="Suprema">
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
      statusAr: 'سنترالات وهواتف IP',
      statusEn: 'IP PBX Telephony',
      logoUrl: '/assets/logos/grandstream.svg',
      renderLogo: () => (
        <svg viewBox="0 0 160 48" className="h-8 w-auto max-w-[125px]" aria-label="Grandstream">
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
      specialtyAr: 'هواتف المكاتب وأنظمة المؤتمرات الصوتية',
      specialtyEn: 'Enterprise IP Phones & Conferencing',
      statusAr: 'هواتف شبكية ومؤتمرات',
      statusEn: 'IP Telephony',
      logoUrl: '/assets/logos/yealink.svg',
      renderLogo: () => (
        <svg viewBox="0 0 150 48" className="h-8 w-auto max-w-[115px]" aria-label="Yealink">
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

  // Merge custom vendors from Firestore if available
  const activeCustomVendors = customVendors ? customVendors.filter((v) => v.isActive !== false) : [];

  const effectivePartners = activeCustomVendors.length > 0
    ? activeCustomVendors.map((cv) => {
        const fallback = defaultPartners.find((dp) => dp.id === cv.id || dp.name.toLowerCase() === cv.name.toLowerCase());
        return {
          id: cv.id,
          name: cv.name,
          category: (cv.category as PartnerBrandItem['category']) || 'cctv',
          specialtyAr: cv.descriptionAr || fallback?.specialtyAr || 'حلول وأنظمة متكاملة',
          specialtyEn: cv.descriptionEn || fallback?.specialtyEn || 'Integrated Systems',
          statusAr: fallback?.statusAr || 'أنظمة تيار خفيف',
          statusEn: fallback?.statusEn || 'Low Current Systems',
          logoUrl: cv.logoUrl || fallback?.logoUrl || `/assets/logos/${cv.id}.svg`,
          renderLogo: fallback?.renderLogo || (() => (
            <span className="text-sm font-bold text-slate-700">{cv.name}</span>
          )),
        };
      })
    : defaultPartners;

  const filteredPartners = activeCategory === 'all'
    ? effectivePartners
    : effectivePartners.filter((p) => p.category === activeCategory);

  return (
    <section className="py-16 sm:py-20 bg-[#f7f7f5] text-[#222f30] border-b border-[#c9cbbe] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#4d5757] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e] shrink-0 inline-block" />
            <span>{t.sectionKicker}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#222f30] mb-3">
            {t.heading}
          </h2>
          <p className="text-sm sm:text-base text-[#4d5757] leading-relaxed font-normal">
            {t.subheading}
          </p>
        </div>

        {/* Filter Segmented Controls: On #e7e8e1 with #c9cbbe border */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 mb-10">
          {[
            { id: 'all', label: currentLang === 'ar' ? 'جميع العلامات التجارية' : 'All Brands' },
            { id: 'cctv', label: currentLang === 'ar' ? 'المراقبة والأمن' : 'CCTV & Security' },
            { id: 'fire', label: currentLang === 'ar' ? 'إنذار الحريق' : 'Fire Alarm' },
            { id: 'networks', label: currentLang === 'ar' ? 'الشبكات والـ BMS' : 'Networks & BMS' },
            { id: 'access', label: currentLang === 'ar' ? 'التحكم بالدخول' : 'Access Control' },
            { id: 'telecom', label: currentLang === 'ar' ? 'السنترالات والاتصالات' : 'IP Telephony' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-white text-[#222f30] font-semibold border border-[#c9cbbe]'
                  : 'bg-[#e7e8e1] text-[#4d5757] hover:text-[#222f30] border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Brand Grid: Flat Paper White Cards with 1px #c9cbbe hairline border */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredPartners.map((brand) => (
            <div
              key={brand.id}
              className="flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-[#c9cbbe] hover:border-[#4d5757] transition-all flat-card text-center"
            >
              {/* 1. Uniform Neutral Logo Box - Object Fit Contain */}
              <div className="w-full h-16 sm:h-18 flex items-center justify-center p-2 rounded-xl bg-[#f7f7f5] border border-[#c9cbbe] mb-3.5 overflow-hidden">
                {'logoUrl' in brand && brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  brand.renderLogo()
                )}
              </div>

              {/* 2. Brand Name */}
              <div className="w-full">
                <h3 className="text-xs sm:text-sm font-semibold text-[#222f30] tracking-tight">
                  {brand.name}
                </h3>

                {/* 3. Specialty Description */}
                <p className="text-[11px] text-[#4d5757] font-normal leading-snug mt-1.5 line-clamp-2">
                  {currentLang === 'ar' ? brand.specialtyAr : brand.specialtyEn}
                </p>
              </div>

              {/* 4. Category Tag At Bottom */}
              <div className="mt-3.5 pt-2.5 border-t border-[#c9cbbe] w-full flex items-center justify-center gap-1 text-[10px] font-mono text-[#4d5757]">
                <span>{currentLang === 'ar' ? brand.statusAr : brand.statusEn}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Concise Vendor Integration Statement (P0-5) */}
        <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-white border border-[#c9cbbe] flat-card text-center">
          <p className="text-xs sm:text-sm text-[#4d5757] leading-relaxed font-normal max-w-3xl mx-auto">
            {currentLang === 'ar'
              ? 'نعمل على اختيار وتوريد ودمج أنظمة من علامات تجارية متنوعة وفق المتطلبات الفنية لكل مشروع، مع مراعاة توافر المنتجات وشروط الضمان الخاصة بالموردين.'
              : 'We select, procure, and integrate systems from various brands according to each project\'s technical requirements, taking into account product availability and suppliers\' warranty terms.'}
          </p>
        </div>

      </div>
    </section>
  );
};
