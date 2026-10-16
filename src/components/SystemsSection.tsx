import React, { useState } from 'react';
import { Language, NavSection, LightCurrentSystem } from '../types';
import { content } from '../data/translations';
import {
  Shield,
  Flame,
  Network,
  Volume2,
  Wrench,
  Check,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface SystemsSectionProps {
  currentLang: Language;
  onNavigate: (section: NavSection) => void;
  onSelectSystemForBOQ?: (systemTitle: string) => void;
}

export const SystemsSection: React.FC<SystemsSectionProps> = ({
  currentLang,
  onNavigate,
  onSelectSystemForBOQ,
}) => {
  const t = content[currentLang].systems;
  const isRtl = currentLang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [activeCategory, setActiveCategory] = useState<
    'all' | 'security' | 'safety' | 'connectivity' | 'audio-bms' | 'maintenance'
  >('all');
  const [selectedSystem, setSelectedSystem] = useState<LightCurrentSystem | null>(null);

  const filteredItems = activeCategory === 'all'
    ? t.items
    : t.items.filter((item) => {
        if (activeCategory === 'audio-bms') {
          return item.category === 'audio-bms';
        }
        return item.category === activeCategory;
      });

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

        {/* Filter Bar: Segmented controls (permitted under Section 1.A) */}
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
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Subtle Technical Standard Tag */}
                  <div className="absolute bottom-3 start-3 text-xs font-mono font-semibold text-emerald-300 drop-shadow-sm">
                    {item.badge}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
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
                  onClick={() => setSelectedSystem(item)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  {t.exploreDetails}
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
          ))}
        </div>

        {/* Inline In-Page Technical Dossier (NO POPUPS) */}
        {selectedSystem && (
          <div className="mt-12 bg-white rounded-2xl border border-emerald-600/40 p-6 sm:p-8 shadow-lg scroll-mt-24 transition-all">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Media Column */}
              <div className="w-full lg:w-5/12">
                <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={selectedSystem.image}
                    alt={selectedSystem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                    <span className="text-xs font-mono font-semibold text-emerald-300 uppercase tracking-wider">
                      {selectedSystem.badge}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {currentLang === 'ar' ? 'المواصفات القياسية' : 'Standard Specifications'}
                  </span>
                  {selectedSystem.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-slate-600">{spec.label}</span>
                      <span className="font-semibold text-slate-900 font-mono tabular-nums">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs & Features Column */}
              <div className="w-full lg:w-7/12 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                        {selectedSystem.category.toUpperCase()}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                        {selectedSystem.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedSystem(null)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      {currentLang === 'ar' ? 'إغلاق التفاصيل' : 'Close Details'}
                    </button>
                  </div>

                  <p className="text-sm font-medium text-emerald-700 mb-4">
                    {selectedSystem.subtitle}
                  </p>

                  <p className="text-sm text-slate-700 leading-relaxed mb-6">
                    {selectedSystem.description}
                  </p>

                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 font-mono">
                    {currentLang === 'ar' ? 'مكونات النظام والمعايير الهندسية' : 'System Architecture & Deliverables'}
                  </h4>

                  <div className="space-y-2.5 mb-8">
                    {selectedSystem.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      const title = selectedSystem.title;
                      setSelectedSystem(null);
                      handleInquire(title);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <span>{currentLang === 'ar' ? 'طلب مقايسة لهذا النظام' : 'Request BOQ For This System'}</span>
                    <ArrowIcon className="w-4 h-4 rtl:rotate-0" />
                  </button>

                  <button
                    onClick={() => setSelectedSystem(null)}
                    className="px-4 py-3 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {t.backToList}
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
