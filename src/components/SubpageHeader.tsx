import React from 'react';
import { Language, NavSection } from '../types';
import { content } from '../data/translations';
import { ArrowLeft, ArrowRight, Home, ChevronLeft, ChevronRight } from 'lucide-react';

interface SubpageHeaderProps {
  currentLang: Language;
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  title?: string;
  subtitle?: string;
}

export const SubpageHeader: React.FC<SubpageHeaderProps> = ({
  currentLang,
  activeSection,
  onNavigate,
  title,
  subtitle,
}) => {
  const t = content[currentLang];
  const isRtl = currentLang === 'ar';
  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const sectionTitles: Record<NavSection, { name: string; desc: string }> = {
    home: {
      name: t.nav.home,
      desc: isRtl ? 'الصفحة الرئيسية والتعريف العام' : 'Homepage and General Overview',
    },
    about: {
      name: t.nav.about,
      desc: isRtl
        ? 'التعريف بالشركة والريادة في قطاع أنظمة التيار الخفيف منذ عام 2014'
        : 'Corporate profile and low-current engineering leadership since 2014',
    },
    systems: {
      name: t.nav.systems,
      desc: isRtl
        ? 'الملفات الفنية والمواصفات الهندسية لكافة أنظمة التيار الخفيف (ELV)'
        : 'Engineering specifications and dossiers for all low-current (ELV) disciplines',
    },
    projects: {
      name: t.nav.projects,
      desc: isRtl
        ? 'سجل سابقة الأعمال والتسليمات المعتمدة بشهادات استشاريين وصور حقلية حقيقية'
        : 'Track record of delivered projects with consultant approvals and real field photos',
    },
    configurator: {
      name: t.nav.configurator,
      desc: isRtl
        ? 'حاسبة الكميات التقديرية والمقايسة المبدئية استناداً للمساحة وعدد الغرف'
        : 'Smart engineering requirements calculator based on facility area and room count',
    },
    brands: {
      name: t.nav.brands,
      desc: isRtl
        ? 'الشركاء التقنيون والعلامات التجارية العالمية المعتمدة في مشاريعنا'
        : 'Global technology partners and certified hardware vendors integrated in our sites',
    },
    contact: {
      name: t.nav.contact,
      desc: isRtl
        ? 'تواصل مباشر مع مهندسينا لطلب معاينة الموقع والمقايسات الفنية'
        : 'Direct contact with our engineering team for site surveys and technical BOQs',
    },
  };

  const currentInfo = sectionTitles[activeSection] || sectionTitles.home;
  const displayTitle = title || currentInfo.name;
  const displaySubtitle = subtitle || currentInfo.desc;

  const navItems: { id: NavSection; label: string }[] = [
    { id: 'about', label: t.nav.about },
    { id: 'systems', label: t.nav.systems },
    { id: 'projects', label: t.nav.projects },
    { id: 'configurator', label: t.nav.configurator },
    { id: 'brands', label: t.nav.brands },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <div className="bg-[#080e1c] border-b border-[#1e2e50] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Top Bar: Breadcrumb + Return to Home */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-[#1e2e50]/70 text-xs font-mono">
          <nav className="flex items-center gap-2 text-slate-300 flex-wrap" aria-label="Breadcrumb">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>{t.nav.home}</span>
            </button>
            <ChevronIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-[#22c55e] font-semibold">{currentInfo.name}</span>
          </nav>

          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f1a34] hover:bg-[#16254a] border border-[#1e2e50] hover:border-slate-400 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowIcon className="w-3.5 h-3.5" />
            <span>{isRtl ? 'العودة للصفحة الرئيسية' : 'Return to Home'}</span>
          </button>
        </div>

        {/* Heading & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#38bdf8] uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>{isRtl ? 'صفحة داخلية متخصصة' : 'Dedicated Section'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white mb-2">
              {displayTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              {displaySubtitle}
            </p>
          </div>
        </div>

        {/* Quick Internal Nav Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#22c55e] text-[#0a1122] font-bold shadow-sm'
                    : 'bg-[#0f1a34] text-slate-300 hover:text-white hover:bg-[#16254a] border border-[#1e2e50]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
