import React, { useState, useRef } from 'react';
import { Language, NavSection, LightCurrentSystem } from '../types';
import { content } from '../data/translations';
import { resolveImageUrl, handleImageError, DEFAULT_CCTV_IMAGE } from '../utils/imageHelper';
import {
  Shield,
  Flame,
  Network,
  Wrench,
  Check,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  FileText,
  Sparkles,
} from 'lucide-react';

interface SystemsSectionProps {
  currentLang: Language;
  onNavigate: (section: NavSection) => void;
  onSelectSystemForBOQ?: (systemTitle: string) => void;
  customSystems?: LightCurrentSystem[];
}

export const SystemsSection: React.FC<SystemsSectionProps> = ({
  currentLang,
  onNavigate,
  onSelectSystemForBOQ,
  customSystems,
}) => {
  const t = content[currentLang].systems;
  const isRtl = currentLang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [activeCategory, setActiveCategory] = useState<
    'all' | 'security' | 'safety' | 'connectivity' | 'audio-bms' | 'maintenance'
  >('all');
  const [selectedSystem, setSelectedSystem] = useState<LightCurrentSystem | null>(null);

  // Ref to technical dossier to transport visitor directly to reading the content
  const dossierRef = useRef<HTMLDivElement | null>(null);

  const systemsList = (customSystems && customSystems.length > 0) ? customSystems : t.items;

  const filteredItems = activeCategory === 'all'
    ? systemsList
    : systemsList.filter((item) => {
        if (activeCategory === 'audio-bms') {
          return item.category === 'audio-bms';
        }
        return item.category === activeCategory;
      });

  const handleSelectSystem = (item: LightCurrentSystem) => {
    setSelectedSystem(item);
    // Transport visitor directly to reading the content immediately
    setTimeout(() => {
      if (dossierRef.current) {
        dossierRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleCloseDossier = () => {
    setSelectedSystem(null);
    const systemsEl = document.getElementById('systems');
    if (systemsEl) {
      systemsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInquire = (systemTitle: string) => {
    if (onSelectSystemForBOQ) {
      onSelectSystemForBOQ(systemTitle);
    }
    onNavigate('contact');
  };

  return (
    <section id="systems" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs sm:text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2 font-mono">
            {t.sectionKicker}
          </div>
          <h2
            style={{ textWrap: 'balance' }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-4"
          >
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {t.subheading}
          </p>
        </div>

        {/* 4 Quick Category Highlights Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <button
            onClick={() => setActiveCategory(activeCategory === 'security' ? 'all' : 'security')}
            className={`p-4 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
              activeCategory === 'security'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
            }`}
          >
            <Shield className="w-5 h-5 text-emerald-500 mb-2" />
            <h3 className="text-sm font-bold block mb-0.5">{t.categories.security}</h3>
            <span className="text-[11px] text-slate-400 block">CCTV & Access Control</span>
          </button>

          <button
            onClick={() => setActiveCategory(activeCategory === 'safety' ? 'all' : 'safety')}
            className={`p-4 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
              activeCategory === 'safety'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
            }`}
          >
            <Flame className="w-5 h-5 text-amber-500 mb-2" />
            <h3 className="text-sm font-bold block mb-0.5">{t.categories.safety}</h3>
            <span className="text-[11px] text-slate-400 block">Fire Alarm & NFPA 72</span>
          </button>

          <button
            onClick={() => setActiveCategory(activeCategory === 'connectivity' ? 'all' : 'connectivity')}
            className={`p-4 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
              activeCategory === 'connectivity'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
            }`}
          >
            <Network className="w-5 h-5 text-sky-500 mb-2" />
            <h3 className="text-sm font-bold block mb-0.5">{t.categories.connectivity}</h3>
            <span className="text-[11px] text-slate-400 block">Cat6A, Fiber & IP PBX</span>
          </button>

          <button
            onClick={() => setActiveCategory(activeCategory === 'maintenance' ? 'all' : 'maintenance')}
            className={`p-4 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
              activeCategory === 'maintenance'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
            }`}
          >
            <Wrench className="w-5 h-5 text-emerald-500 mb-2" />
            <h3 className="text-sm font-bold block mb-0.5">{t.categories.maintenance}</h3>
            <span className="text-[11px] text-slate-400 block">24/7 SLA Engineering</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.categories.all}
            </button>
            <button
              onClick={() => setActiveCategory('security')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'security'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.categories.security}
            </button>
            <button
              onClick={() => setActiveCategory('safety')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'safety'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.categories.safety}
            </button>
            <button
              onClick={() => setActiveCategory('connectivity')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'connectivity'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.categories.connectivity}
            </button>
            <button
              onClick={() => setActiveCategory('audio-bms')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'audio-bms'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.categories.audioBms}
            </button>
            <button
              onClick={() => setActiveCategory('maintenance')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'maintenance'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.categories.maintenance}
            </button>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            {filteredItems.length} {currentLang === 'ar' ? 'أنظمة تيار خفيف' : 'ELV Disciplines'}
          </div>
        </div>

        {/* Low Current Systems Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const isCurrentlySelected = selectedSystem?.id === item.id;
            return (
              <div
                key={item.id}
                className={`group bg-white rounded-2xl border overflow-hidden transition-all flex flex-col justify-between ${
                  isCurrentlySelected
                    ? 'border-emerald-600 ring-2 ring-emerald-600/30 shadow-md bg-emerald-50/10'
                    : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Visual Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => handleSelectSystem(item)}>
                    <img
                      src={resolveImageUrl(item.image, DEFAULT_CCTV_IMAGE)}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={handleImageError(DEFAULT_CCTV_IMAGE)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    {/* Subtle Technical Standard Tag */}
                    <div className="absolute bottom-3 start-3 text-xs font-mono font-semibold text-emerald-300 drop-shadow-sm">
                      {item.badge}
                    </div>

                    {isCurrentlySelected && (
                      <div className="absolute top-3 end-3 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{currentLang === 'ar' ? 'قيد القراءة بالأسفل' : 'Open Below'}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3
                      onClick={() => handleSelectSystem(item)}
                      className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mb-4 line-clamp-1">
                      {item.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                      {item.description}
                    </p>

                    {/* Feature Highlights */}
                    <div className="space-y-2 mb-6">
                      {item.features.slice(0, 2).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quantitative Specs */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                      {item.specs.slice(0, 2).map((sp, sIdx) => (
                        <div key={sIdx} className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-500">{sp.label}:</span>
                          <span className="font-semibold text-slate-900 font-mono tabular-nums">{sp.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-3 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => handleSelectSystem(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer py-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isCurrentlySelected ? (currentLang === 'ar' ? 'انتقل للمحتوى ↓' : 'Jump to Dossier ↓') : t.exploreDetails}</span>
                  </button>
                  <button
                    onClick={() => handleInquire(item.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{currentLang === 'ar' ? 'طلب مقايسة' : 'Request BOQ'}</span>
                    <ArrowIcon className="w-3 h-3 rtl:rotate-0" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inline In-Page Technical Dossier (NO POPUPS - DIRECT IN-PAGE TRANSPORT) */}
        {selectedSystem && (
          <div
            ref={dossierRef}
            id="system-technical-dossier"
            tabIndex={-1}
            className="mt-14 bg-white rounded-3xl border-2 border-emerald-600/60 p-6 sm:p-10 shadow-2xl scroll-mt-28 transition-all relative overflow-hidden"
          >
            {/* Direct Notice Bar to assure visitor they have been transported directly to the content */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-800">
                  {currentLang === 'ar'
                    ? `جاري قراءة الملف والمواصفات الفنية للنظام: ${selectedSystem.title}`
                    : `Currently Reviewing Specifications: ${selectedSystem.title}`}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCloseDossier}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>{currentLang === 'ar' ? 'العودة لقائمة الأنظمة' : 'Back to Systems'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Media Column */}
              <div className="w-full lg:w-5/12">
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md bg-slate-900">
                  <img
                    src={resolveImageUrl(selectedSystem.image, DEFAULT_CCTV_IMAGE)}
                    alt={selectedSystem.title}
                    referrerPolicy="no-referrer"
                    onError={handleImageError(DEFAULT_CCTV_IMAGE)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-6">
                    <span className="text-xs font-mono font-semibold text-emerald-300 uppercase tracking-wider bg-slate-900/60 backdrop-blur-sm px-3 py-1 rounded-lg">
                      {selectedSystem.badge}
                    </span>
                  </div>
                </div>

                <div className="mt-5 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <span className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {currentLang === 'ar' ? 'المواصفات القياسية والمقاييس' : 'Standard Specifications'}
                  </span>
                  {selectedSystem.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center justify-between text-xs sm:text-sm py-1 border-b border-slate-200/60 last:border-0">
                      <span className="text-slate-600">{spec.label}</span>
                      <span className="font-semibold text-slate-900 font-mono tabular-nums">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs & Features Column */}
              <div className="w-full lg:w-7/12 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
                        {selectedSystem.category.toUpperCase()}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                        {selectedSystem.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-emerald-700 mb-4">
                    {selectedSystem.subtitle}
                  </p>

                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
                    {selectedSystem.description}
                  </p>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 font-mono">
                    {currentLang === 'ar' ? 'مكونات النظام والمعايير الهندسية' : 'System Architecture & Deliverables'}
                  </h4>

                  <div className="space-y-3 mb-8">
                    {selectedSystem.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-sm text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => {
                      const title = selectedSystem.title;
                      handleInquire(title);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <span>{currentLang === 'ar' ? 'طلب مقايسة فنية لهذا النظام' : 'Request BOQ For This System'}</span>
                    <ArrowIcon className="w-4 h-4 rtl:rotate-0" />
                  </button>

                  <button
                    onClick={handleCloseDossier}
                    className="inline-flex items-center gap-1.5 px-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>{t.backToList}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
