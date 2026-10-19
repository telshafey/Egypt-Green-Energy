import React, { useState } from 'react';
import { Language, NavSection } from '../types';
import { content } from '../data/translations';
import {
  Cpu,
  Video,
  Flame,
  KeyRound,
  Network,
  PhoneCall,
  Volume2,
  Building,
  Wrench,
  Check,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface BOQConfiguratorProps {
  currentLang: Language;
  onNavigate: (section: NavSection) => void;
  onPrefillInquiry?: (details: string) => void;
}

export const BOQConfigurator: React.FC<BOQConfiguratorProps> = ({
  currentLang,
  onNavigate,
  onPrefillInquiry,
}) => {
  const t = content[currentLang].configurator;
  const isRtl = currentLang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [facilityType, setFacilityType] = useState<string>('office');
  const [floorArea, setFloorArea] = useState<number>(1200); // 1200 m2
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'cctv',
    'fire',
    'access',
    'cabling',
    'pbx',
    'sla',
  ]);

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // Realistic Egyptian low-current engineering formulas based on Egyptian building codes:
  // Office: ~1 data drop per 15 m2; Factory: ~1 drop per 40 m2; Hospital: ~1 drop per 18 m2
  const densityFactor =
    facilityType === 'office'
      ? 15
      : facilityType === 'hospital'
      ? 18
      : facilityType === 'factory'
      ? 45
      : facilityType === 'hotel'
      ? 25
      : 30;

  const estDrops = selectedModules.includes('cabling')
    ? Math.max(12, Math.round(floorArea / densityFactor))
    : 0;

  // CCTV: approx 1 camera per 50 - 90 m2 depending on facility
  const cameraDensity = facilityType === 'mall' || facilityType === 'hospital' ? 55 : 85;
  const estCctv = selectedModules.includes('cctv')
    ? Math.max(6, Math.round(floorArea / cameraDensity) + 4)
    : 0;

  // Access control doors: based on size & facility
  const estDoorsCount = selectedModules.includes('access')
    ? Math.max(2, Math.round(floorArea / 250) + 2)
    : 0;

  // Timeline estimate (in weeks)
  const baseWeeks = Math.max(2, Math.round(floorArea / 500) + selectedModules.length);

  const handleApplyBOQ = () => {
    const facLabel = t.facilityTypes.find((f) => f.id === facilityType)?.label || facilityType;
    const moduleNames = selectedModules
      .map((m) => t.modules.find((mod) => mod.id === m)?.label)
      .filter(Boolean)
      .join('، ');

    const summaryText = currentLang === 'ar'
      ? `طلب مقايسة فنية ومعاينة مجانية استناداً إلى حاسبة أنظمة التيار الخفيف:\n• نوع المنشأة: ${facLabel}\n• المساحة التقريبية: ${floorArea.toLocaleString('ar-EG')} م²\n• الأنظمة المختارة: ${moduleNames}\n• المقايسة التقديرية: ~${estCctv} كاميرا مراقبة، ~${estDrops} نقطة داتا، ~${estDoorsCount} باب مؤمن.`
      : `BOQ & Site Inspection Request from Low Current Configurator:\n• Facility: ${facLabel}\n• Approximate Area: ${floorArea.toLocaleString()} m²\n• Target Systems: ${moduleNames}\n• Preliminary Estimate: ~${estCctv} CCTV cameras, ~${estDrops} Data points, ~${estDoorsCount} Access doors.`;

    if (onPrefillInquiry) {
      onPrefillInquiry(summaryText);
    }
    onNavigate('contact');
  };

  const moduleIcons: Record<string, React.ElementType> = {
    cctv: Video,
    fire: Flame,
    access: KeyRound,
    cabling: Network,
    pbx: PhoneCall,
    pa: Volume2,
    bms: Building,
    sla: Wrench,
  };

  return (
    <section id="configurator" className="py-20 lg:py-28 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2 font-mono">
            <Cpu className="w-4 h-4" />
            <span>{t.sectionKicker}</span>
          </div>
          <h2
            style={{ textWrap: 'balance' }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4"
          >
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {t.subheading}
          </p>
        </div>

        {/* 2-Column Split: Configurator Controls vs Live Scope Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Interactive Inputs & Module Selector */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-6">
              
              {/* Facility Type Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                  {t.facilityTypeLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {t.facilityTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFacilityType(type.id)}
                      className={`p-3 text-xs sm:text-sm font-medium rounded-xl text-left rtl:text-right transition-colors cursor-pointer border ${
                        facilityType === type.id
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-semibold shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floor Area Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm font-medium text-slate-300">
                    {t.scaleLabel}
                  </label>
                  <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono tabular-nums">
                    {floorArea.toLocaleString()} m²
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="10000"
                  step="100"
                  value={floorArea}
                  onChange={(e) => setFloorArea(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                  <span>200 m²</span>
                  <span>5,000 m²</span>
                  <span>10,000+ m²</span>
                </div>
              </div>

              {/* Low Current Disciplines Checklist */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 font-mono">
                  {t.modulesTitle}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {t.modules.map((mod) => {
                    const isSelected = selectedModules.includes(mod.id);
                    const ModIcon = moduleIcons[mod.id] || Cpu;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => toggleModule(mod.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-emerald-950/30 border-emerald-600/70 text-white'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold">
                            <ModIcon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                            <span className={isSelected ? 'text-white' : 'text-slate-200'}>{mod.label}</span>
                          </div>
                          <span className="text-[11px] text-slate-300 line-clamp-1 mt-0.5 block">
                            {mod.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-5 border-t border-slate-800 mt-6">
              {t.disclaimer}
            </p>
          </div>

          {/* Right Column: Calculated BOQ Scope Card */}
          <div className="lg:col-span-5 bg-emerald-950/30 border border-emerald-800/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-emerald-800/40">
                <h3 className="text-base sm:text-lg font-bold text-emerald-200">
                  {t.resultTitle}
                </h3>
                <span className="text-xs font-mono text-emerald-400">
                  NFPA & TIA Specs
                </span>
              </div>

              {/* 4 Quantitative Output Metrics */}
              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-200 font-semibold block mb-0.5">{t.estCameras}</span>
                    <span className="text-xs text-slate-400">4K IP Indoor/Outdoor</span>
                  </div>
                  <div className="text-end">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                      ~{estCctv}
                    </span>
                    <span className="text-xs text-emerald-400 block font-mono font-bold">كاميرا</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-200 font-semibold block mb-0.5">{t.estCablingPoints}</span>
                    <span className="text-xs text-slate-400">Cat6A Drops & Patch Racks</span>
                  </div>
                  <div className="text-end">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                      ~{estDrops}
                    </span>
                    <span className="text-xs text-emerald-400 block font-mono font-bold">نقطة شبكة</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-200 font-semibold block mb-0.5">{t.estDoors}</span>
                    <span className="text-xs text-slate-400">Facial & Magnetic Locks</span>
                  </div>
                  <div className="text-end">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                      ~{estDoorsCount}
                    </span>
                    <span className="text-xs text-emerald-400 block font-mono font-bold">أبواب مؤمنة</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-200 font-semibold block mb-0.5">{t.estTimeline}</span>
                    <span className="text-xs text-slate-400">توريد وتركيب وبرمجة معتمدة</span>
                  </div>
                  <div className="text-end">
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono tabular-nums">
                      {baseWeeks}
                    </span>
                    <span className="text-xs text-emerald-400 block font-mono font-bold">أسابيع عمل</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Conversion CTA Button */}
            <button
              onClick={handleApplyBOQ}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <span>{t.applyCta}</span>
              <ArrowIcon className="w-4 h-4 rtl:rotate-0" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
