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
    <section id="systems" className="py-20 lg:py-28 bg-[#222f30] text-white border-b border-[#4d5757]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Abyssal Ink canvas with Bioluminescent Lime kicker */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#c9cbbe] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e] shrink-0 inline-block" />
            <span>{t.sectionKicker}</span>
          </div>
          <h2
            style={{ textWrap: 'balance' }}
            className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white mb-4"
          >
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-[#c9cbbe] leading-relaxed font-normal">
            {t.subheading}
          </p>
        </div>

        {/* 4 Quick Category Highlights Strip: Outlined flat cards with 1px #4d5757 hairline */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-10">
          <button
            type="button"
            onClick={() => setActiveCategory(activeCategory === 'security' ? 'all' : 'security')}
            className={`p-4 rounded-xl border text-left rtl:text-right transition-all cursor-pointer flat-card ${
              activeCategory === 'security'
                ? 'bg-[#2a3a3b] text-white border-[#cef79e]'
                : 'bg-[#222f30] border-[#4d5757] hover:border-[#c9cbbe] text-[#c9cbbe]'
            }`}
          >
            <Shield className="w-4 h-4 text-[#cef79e] mb-2" />
            <h3 className="text-xs sm:text-sm font-semibold text-white block mb-0.5">{t.categories.security}</h3>
            <span className="text-[11px] block font-mono text-[#c9cbbe]">
              CCTV & Access Control
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory(activeCategory === 'safety' ? 'all' : 'safety')}
            className={`p-4 rounded-xl border text-left rtl:text-right transition-all cursor-pointer flat-card ${
              activeCategory === 'safety'
                ? 'bg-[#2a3a3b] text-white border-[#cef79e]'
                : 'bg-[#222f30] border-[#4d5757] hover:border-[#c9cbbe] text-[#c9cbbe]'
            }`}
          >
            <Flame className="w-4 h-4 text-[#cef79e] mb-2" />
            <h3 className="text-xs sm:text-sm font-semibold text-white block mb-0.5">{t.categories.safety}</h3>
            <span className="text-[11px] block font-mono text-[#c9cbbe]">
              Fire Alarm & Safety
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory(activeCategory === 'connectivity' ? 'all' : 'connectivity')}
            className={`p-4 rounded-xl border text-left rtl:text-right transition-all cursor-pointer flat-card ${
              activeCategory === 'connectivity'
                ? 'bg-[#2a3a3b] text-white border-[#cef79e]'
                : 'bg-[#222f30] border-[#4d5757] hover:border-[#c9cbbe] text-[#c9cbbe]'
            }`}
          >
            <Network className="w-4 h-4 text-[#cef79e] mb-2" />
            <h3 className="text-xs sm:text-sm font-semibold text-white block mb-0.5">{t.categories.connectivity}</h3>
            <span className="text-[11px] block font-mono text-[#c9cbbe]">
              Cat6A, Fiber & IP PBX
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory(activeCategory === 'maintenance' ? 'all' : 'maintenance')}
            className={`p-4 rounded-xl border text-left rtl:text-right transition-all cursor-pointer flat-card ${
              activeCategory === 'maintenance'
                ? 'bg-[#2a3a3b] text-white border-[#cef79e]'
                : 'bg-[#222f30] border-[#4d5757] hover:border-[#c9cbbe] text-[#c9cbbe]'
            }`}
          >
            <Wrench className="w-4 h-4 text-[#cef79e] mb-2" />
            <h3 className="text-xs sm:text-sm font-semibold text-white block mb-0.5">{t.categories.maintenance}</h3>
            <span className="text-[11px] block font-mono text-[#c9cbbe]">
              SLA Engineering Contracts
            </span>
          </button>
        </div>

        {/* Filter Bar: Segmented controls with #4d5757 hairline borders */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-[#4d5757]/60">
          <div className="flex items-center gap-1.5 p-1 bg-[#1c2728] border border-[#4d5757] rounded-xl overflow-x-auto max-w-full">
            {(['all', 'security', 'safety', 'connectivity', 'audio-bms', 'maintenance'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-white text-[#222f30] font-semibold'
                    : 'text-[#c9cbbe] hover:text-white'
                }`}
              >
                {t.categories[cat === 'audio-bms' ? 'audioBms' : cat]}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#c9cbbe] font-mono">
            {filteredItems.length} {currentLang === 'ar' ? 'أنظمة تيار خفيف' : 'ELV Disciplines'}
          </div>
        </div>

        {/* Low Current Systems Cards Grid: Flat #222f30 cards with #4d5757 hairline borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isCurrentlySelected = selectedSystem?.id === item.id;
            return (
              <div
                key={item.id}
                className={`group bg-[#222f30] rounded-2xl border transition-all flex flex-col justify-between flat-card overflow-hidden ${
                  isCurrentlySelected
                    ? 'border-[#cef79e] ring-1 ring-[#cef79e]'
                    : 'border-[#4d5757] hover:border-[#c9cbbe]'
                }`}
              >
                <div>
                  {/* Visual Thumbnail */}
                  <div
                    className="relative h-44 overflow-hidden bg-[#1c2728] cursor-pointer"
                    onClick={() => handleSelectSystem(item)}
                  >
                    <img
                      src={resolveImageUrl(item.image, DEFAULT_CCTV_IMAGE)}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={handleImageError(DEFAULT_CCTV_IMAGE)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#222f30] via-[#222f30]/40 to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 start-3 px-2 py-0.5 rounded-md bg-[#222f30]/90 border border-[#4d5757] text-[10px] font-mono text-[#c9cbbe]">
                      {item.badge}
                    </div>

                    {isCurrentlySelected && (
                      <div className="absolute top-3 end-3 px-2 py-0.5 rounded-md bg-[#cef79e] text-[#222f30] text-[10px] font-mono font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#222f30]" />
                        <span>{currentLang === 'ar' ? 'معروض بالأسفل' : 'Open Below'}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3
                      onClick={() => handleSelectSystem(item)}
                      className="text-base sm:text-lg font-semibold text-white mb-1 group-hover:text-[#cef79e] transition-colors cursor-pointer leading-snug"
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs font-mono text-[#cef79e] mb-4 line-clamp-1">
                      {item.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-[#c9cbbe] leading-relaxed mb-6 line-clamp-3 font-normal">
                      {item.description}
                    </p>

                    {/* Feature Highlights */}
                    <div className="space-y-2 mb-6">
                      {item.features.slice(0, 2).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-[#c9cbbe]">
                          <Check className="w-3.5 h-3.5 text-[#cef79e] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quantitative Specs */}
                    <div className="p-3 bg-[#1c2728] rounded-xl border border-[#4d5757]/80 space-y-1.5 text-xs">
                      {item.specs.slice(0, 2).map((sp, sIdx) => (
                        <div key={sIdx} className="flex items-center justify-between">
                          <span className="text-[#c9cbbe] text-[11px]">{sp.label}:</span>
                          <span className="font-mono text-white text-[11px] tabular-nums font-semibold">{sp.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons: 40x40 Lime Arrow button paired with white CTA */}
                <div className="px-6 pb-6 pt-3 flex items-center justify-between gap-3 border-t border-[#4d5757]/60 mt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectSystem(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#c9cbbe] hover:text-white transition-colors cursor-pointer py-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#cef79e]" />
                    <span>{isCurrentlySelected ? (currentLang === 'ar' ? 'انتقل للملف ↓' : 'Jump to Dossier ↓') : t.exploreDetails}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleInquire(item.title)}
                      className="px-3.5 py-2 text-xs font-semibold bg-white hover:bg-[#f7f7f5] text-[#222f30] rounded-lg transition-colors cursor-pointer"
                    >
                      <span>{currentLang === 'ar' ? 'طلب مقايسة' : 'Request BOQ'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInquire(item.title)}
                      aria-label="Direct inquiry"
                      className="btn-arrow-lime cursor-pointer"
                    >
                      <ArrowIcon className="w-3.5 h-3.5 rtl:rotate-0" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inline In-Page Technical Dossier */}
        {selectedSystem && (
          <div
            ref={dossierRef}
            id="system-technical-dossier"
            tabIndex={-1}
            className="mt-14 bg-[#222f30] rounded-2xl border border-[#cef79e]/60 p-6 sm:p-10 flat-card scroll-mt-28 transition-all relative overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-[#4d5757]/60">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#cef79e] inline-block animate-pulse" />
                <span className="text-xs sm:text-sm font-mono text-[#cef79e]">
                  {currentLang === 'ar'
                    ? `الملف الفني للنظام: ${selectedSystem.title}`
                    : `Technical Specifications: ${selectedSystem.title}`}
                </span>
              </div>
              
              <button
                type="button"
                onClick={handleCloseDossier}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#c9cbbe] hover:text-white bg-[#1c2728] border border-[#4d5757] rounded-lg transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>{currentLang === 'ar' ? 'العودة للأعلى' : 'Back to Systems'}</span>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Media Column */}
              <div className="w-full lg:w-5/12">
                <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden border border-[#4d5757] bg-[#1c2728]">
                  <img
                    src={resolveImageUrl(selectedSystem.image, DEFAULT_CCTV_IMAGE)}
                    alt={selectedSystem.title}
                    referrerPolicy="no-referrer"
                    onError={handleImageError(DEFAULT_CCTV_IMAGE)}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#222f30] via-transparent to-transparent flex items-end p-6">
                    <span className="text-xs font-mono text-[#cef79e] bg-[#222f30]/90 border border-[#4d5757] px-3 py-1 rounded-md">
                      {selectedSystem.badge}
                    </span>
                  </div>
                </div>

                <div className="mt-5 p-5 bg-[#1c2728] rounded-xl border border-[#4d5757] space-y-2.5">
                  <span className="block text-xs font-mono text-[#cef79e] uppercase tracking-wider mb-2">
                    {currentLang === 'ar' ? 'المواصفات القياسية والمقاييس' : 'Standard Specifications'}
                  </span>
                  {selectedSystem.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center justify-between text-xs py-1 border-b border-[#4d5757]/40 last:border-0">
                      <span className="text-[#c9cbbe]">{spec.label}</span>
                      <span className="font-semibold text-white font-mono tabular-nums">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs & Features Column */}
              <div className="w-full lg:w-7/12 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-xs font-mono text-[#cef79e] uppercase tracking-wider bg-[#1c2728] border border-[#4d5757] px-2.5 py-1 rounded-md inline-block">
                        {selectedSystem.category.toUpperCase()}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-medium text-white mt-3">
                        {selectedSystem.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-mono text-[#cef79e] mb-4">
                    {selectedSystem.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-[#c9cbbe] leading-relaxed mb-6 font-normal">
                    {selectedSystem.description}
                  </p>

                  <h4 className="text-xs sm:text-sm font-mono text-white uppercase tracking-wider mb-3">
                    {currentLang === 'ar' ? 'مكونات النظام والمعايير الهندسية' : 'System Architecture & Deliverables'}
                  </h4>

                  <div className="space-y-2.5 mb-8">
                    {selectedSystem.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[#c9cbbe] bg-[#1c2728] p-3 rounded-xl border border-[#4d5757]">
                        <Check className="w-4 h-4 text-[#cef79e] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[#4d5757]/60">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleInquire(selectedSystem.title)}
                      className="px-6 py-3 text-xs sm:text-sm font-semibold text-[#222f30] bg-white hover:bg-[#f7f7f5] rounded-lg transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span>{currentLang === 'ar' ? 'طلب مقايسة فنية لهذا النظام' : 'Request BOQ For This System'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInquire(selectedSystem.title)}
                      aria-label="Direct request"
                      className="btn-arrow-lime cursor-pointer"
                    >
                      <ArrowIcon className="w-4 h-4 rtl:rotate-0" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseDossier}
                    className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-mono text-[#c9cbbe] hover:text-white rounded-lg border border-[#4d5757] hover:border-[#c9cbbe] transition-colors cursor-pointer"
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
