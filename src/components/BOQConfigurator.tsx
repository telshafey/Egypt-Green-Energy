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
  Printer,
  Sliders,
  Info,
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

  const densityFactor =
    facilityType === 'office'
      ? 15
      : facilityType === 'hospital' || facilityType === 'healthcare'
      ? 18
      : facilityType === 'factory' || facilityType === 'industrial'
      ? 45
      : facilityType === 'hotel' || facilityType === 'residential'
      ? 25
      : 30;

  const estDrops = selectedModules.includes('cabling')
    ? Math.max(8, Math.round(floorArea / densityFactor))
    : 0;

  const cameraDensity = facilityType === 'commercial' || facilityType === 'healthcare' ? 55 : 85;
  const estCctv = selectedModules.includes('cctv')
    ? Math.max(4, Math.round(floorArea / cameraDensity) + 2)
    : 0;

  const estDoorsCount = selectedModules.includes('access')
    ? Math.max(2, Math.round(floorArea / 280) + 1)
    : 0;

  const estFireDevices = selectedModules.includes('fire')
    ? Math.max(6, Math.round(floorArea / 50))
    : 0;

  const estSpeakers = selectedModules.includes('pa')
    ? Math.max(4, Math.round(floorArea / 70))
    : 0;

  const estBmsPoints = selectedModules.includes('bms')
    ? Math.max(10, Math.round(floorArea / 120) + 8)
    : 0;

  const baseWeeks = Math.max(2, Math.round(floorArea / 600) + Math.ceil(selectedModules.length * 0.8));

  const handleApplyBOQ = () => {
    const facLabel = t.facilityTypes.find((f) => f.id === facilityType)?.label || facilityType;
    const moduleNames = selectedModules
      .map((m) => t.modules.find((mod) => mod.id === m)?.label)
      .filter(Boolean)
      .join('، ');

    const quantitativeParts: string[] = [];
    if (selectedModules.includes('cctv')) quantitativeParts.push(`~${estCctv} كاميرا مراقبة`);
    if (selectedModules.includes('cabling')) quantitativeParts.push(`~${estDrops} نقطة داتا`);
    if (selectedModules.includes('access')) quantitativeParts.push(`~${estDoorsCount} باب مؤمن`);
    if (selectedModules.includes('fire')) quantitativeParts.push(`~${estFireDevices} كاشف حريق`);
    if (selectedModules.includes('pa')) quantitativeParts.push(`~${estSpeakers} مكبر صوت`);
    if (selectedModules.includes('bms')) quantitativeParts.push(`~${estBmsPoints} نقطة تحكم BMS`);

    const summaryText = currentLang === 'ar'
      ? `طلب مراجعة فنية ومقايسة تقديرية استناداً إلى حاسبة المتطلبات:\n• نوع المنشأة: ${facLabel}\n• المساحة التقريبية: ${floorArea.toLocaleString('ar-EG')} م²\n• الأنظمة المختارة (${selectedModules.length}): ${moduleNames || 'لم يُحدد'}\n• المؤشرات الاسترشادية: ${quantitativeParts.join('، ') || 'وفق دراسة المخططات'}\n• المدة المقدرة استرشادياً: ~${baseWeeks} أسابيع عمل (تعتمد على المخططات الهندسية وجدول التوريدات).`
      : `Preliminary Technical Review Request from Requirements Estimator:\n• Facility: ${facLabel}\n• Area: ${floorArea.toLocaleString()} m²\n• Selected Systems (${selectedModules.length}): ${moduleNames || 'None specified'}\n• Indicative Metrics: ${quantitativeParts.join(', ') || 'Subject to drawings'}\n• Indicative Duration: ~${baseWeeks} working weeks (subject to MEP drawings and supply schedules).`;

    if (onPrefillInquiry) {
      onPrefillInquiry(summaryText);
    }
    onNavigate('contact');
  };

  const handlePrint = () => {
    window.print();
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

  const facLabel = t.facilityTypes.find((f) => f.id === facilityType)?.label || facilityType;

  return (
    <section id="configurator" className="py-20 lg:py-28 bg-[#222f30] text-white border-b border-[#4d5757]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
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

        {/* 2-Column Split: Controls vs Calculated Scope Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Inputs & Module Selector */}
          <div className="lg:col-span-7 bg-[#222f30] border border-[#4d5757] rounded-2xl p-6 sm:p-8 flex flex-col justify-between flat-card">
            <div className="space-y-6">
              
              {/* Facility Type Selector */}
              <div>
                <label className="block text-xs font-mono font-medium uppercase tracking-wider text-[#c9cbbe] mb-2.5">
                  {t.facilityTypeLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {t.facilityTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFacilityType(type.id)}
                      className={`p-3 text-xs font-medium rounded-xl text-left rtl:text-right transition-colors cursor-pointer border ${
                        facilityType === type.id
                          ? 'bg-[#2a3a3b] border-[#cef79e] text-white font-semibold'
                          : 'bg-[#1c2728] border-[#4d5757] text-[#c9cbbe] hover:border-[#c9cbbe]'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floor Area Slider & Numeric Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm font-medium text-[#c9cbbe]">
                    {t.scaleLabel}
                  </label>
                  <div className="flex items-center gap-1.5 bg-[#1c2728] px-2.5 py-1 rounded-lg border border-[#4d5757]">
                    <input
                      type="number"
                      min="100"
                      max="25000"
                      step="50"
                      value={floorArea}
                      onChange={(e) => {
                        const val = Math.max(100, Math.min(25000, Number(e.target.value) || 0));
                        setFloorArea(val);
                      }}
                      className="w-20 bg-transparent text-sm sm:text-base font-bold text-[#cef79e] font-mono tabular-nums text-end focus:outline-none"
                    />
                    <span className="text-xs font-mono text-[#c9cbbe]">م²</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="200"
                  max="10000"
                  step="100"
                  value={Math.min(10000, floorArea)}
                  onChange={(e) => setFloorArea(Number(e.target.value))}
                  className="w-full accent-[#cef79e] bg-[#1c2728] h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#c9cbbe] font-mono mt-1">
                  <span>200 م²</span>
                  <span>5,000 م²</span>
                  <span>10,000+ م²</span>
                </div>
              </div>

              {/* Low Current Disciplines Checklist */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono font-medium uppercase tracking-wider text-[#c9cbbe]">
                    {t.modulesTitle}
                  </label>
                  <span className="text-xs text-[#cef79e] font-mono">
                    {selectedModules.length} {currentLang === 'ar' ? 'أنظمة محددة' : 'systems selected'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {t.modules.map((mod) => {
                    const isSelected = selectedModules.includes(mod.id);
                    const ModIcon = moduleIcons[mod.id] || Cpu;
                    return (
                      <div
                        key={mod.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleModule(mod.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleModule(mod.id);
                          }
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isSelected
                            ? 'bg-[#2a3a3b] border-[#cef79e] text-white'
                            : 'bg-[#1c2728] border-[#4d5757] text-[#c9cbbe] hover:border-[#c9cbbe]'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                            isSelected
                              ? 'bg-[#cef79e] border-[#cef79e] text-[#222f30]'
                              : 'border-[#4d5757] bg-[#222f30]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold">
                            <ModIcon className={`w-4 h-4 ${isSelected ? 'text-[#cef79e]' : 'text-[#c9cbbe]'}`} />
                            <span className={isSelected ? 'text-white' : 'text-[#c9cbbe]'}>{mod.label}</span>
                          </div>
                          <span className="text-[11px] text-[#c9cbbe]/80 line-clamp-1 mt-0.5 block">
                            {mod.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <p className="text-xs text-[#c9cbbe] leading-relaxed pt-5 border-t border-[#4d5757]/60 mt-6 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#cef79e] shrink-0 mt-0.5" />
              <span>{t.disclaimer}</span>
            </p>
          </div>

          {/* Right Column: Calculated BOQ Scope Card */}
          <div className="lg:col-span-5 bg-[#1c2728] border border-[#4d5757] rounded-2xl p-6 sm:p-8 flex flex-col justify-between flat-card">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#4d5757]/60">
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-white">
                    {t.resultTitle}
                  </h3>
                  <span className="text-xs text-[#c9cbbe] font-mono">
                    {facLabel} — {floorArea.toLocaleString()} م²
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handlePrint}
                  title={currentLang === 'ar' ? 'طباعة أو تنزيل الملخص الفني (PDF)' : 'Print or Export Summary (PDF)'}
                  className="p-2 rounded-lg bg-[#222f30] hover:bg-[#2a3a3b] text-[#c9cbbe] hover:text-white border border-[#4d5757] transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#cef79e]" />
                </button>
              </div>

              {/* Quantitative Metrics */}
              {selectedModules.length === 0 ? (
                <div className="p-6 rounded-xl bg-[#222f30] border border-[#4d5757] text-center space-y-2 mb-8">
                  <Sliders className="w-8 h-8 text-[#4d5757] mx-auto" />
                  <p className="text-xs sm:text-sm text-[#c9cbbe]">
                    {currentLang === 'ar'
                      ? 'يرجى تحديد نظام واحد على الأقل من القائمة لحساب المؤشرات الاسترشادية.'
                      : 'Please select at least one system to display preliminary scope metrics.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 mb-8">
                  {selectedModules.includes('cctv') && (
                    <div className="p-3.5 rounded-xl bg-[#222f30] border border-[#4d5757] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white font-medium block mb-0.5">{t.estCameras}</span>
                        <span className="text-[11px] text-[#c9cbbe]">
                          {currentLang === 'ar' ? 'كاميرات مراقبة IP داخلية/خارجية' : 'Network IP Cameras'}
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="text-2xl font-bold text-[#cef79e] font-mono tabular-nums">
                          ~{estCctv}
                        </span>
                        <span className="text-xs text-[#c9cbbe] block font-mono">
                          {currentLang === 'ar' ? 'كاميرا' : 'cameras'}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedModules.includes('cabling') && (
                    <div className="p-3.5 rounded-xl bg-[#222f30] border border-[#4d5757] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white font-medium block mb-0.5">{t.estCablingPoints}</span>
                        <span className="text-[11px] text-[#c9cbbe]">
                          {currentLang === 'ar' ? 'كابلات Cat6A وكبائن Racks' : 'Cat6A Drops & Racks'}
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="text-2xl font-bold text-[#cef79e] font-mono tabular-nums">
                          ~{estDrops}
                        </span>
                        <span className="text-xs text-[#c9cbbe] block font-mono">
                          {currentLang === 'ar' ? 'نقطة شبكة' : 'data points'}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedModules.includes('access') && (
                    <div className="p-3.5 rounded-xl bg-[#222f30] border border-[#4d5757] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white font-medium block mb-0.5">{t.estDoors}</span>
                        <span className="text-[11px] text-[#c9cbbe]">
                          {currentLang === 'ar' ? 'قارئات وأقفال كهرومغناطيسية' : 'Card / Biometric Readers & Locks'}
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="text-2xl font-bold text-[#cef79e] font-mono tabular-nums">
                          ~{estDoorsCount}
                        </span>
                        <span className="text-xs text-[#c9cbbe] block font-mono">
                          {currentLang === 'ar' ? 'أبواب مؤمنة' : 'secured doors'}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedModules.includes('fire') && (
                    <div className="p-3.5 rounded-xl bg-[#222f30] border border-[#4d5757] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white font-medium block mb-0.5">
                          {currentLang === 'ar' ? 'كواشف إنذار الحريق المقدرة' : 'Estimated Fire Detectors'}
                        </span>
                        <span className="text-[11px] text-[#c9cbbe]">
                          {currentLang === 'ar' ? 'كواشف دخان وحرارة ومحطات إنذار' : 'Smoke, Heat & Manual Stations'}
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="text-2xl font-bold text-[#cef79e] font-mono tabular-nums">
                          ~{estFireDevices}
                        </span>
                        <span className="text-xs text-[#c9cbbe] block font-mono">
                          {currentLang === 'ar' ? 'عنصر إنذار' : 'devices'}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedModules.includes('pa') && (
                    <div className="p-3.5 rounded-xl bg-[#222f30] border border-[#4d5757] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white font-medium block mb-0.5">
                          {currentLang === 'ar' ? 'السماعات ومكبرات الصوت' : 'Acoustic Speakers'}
                        </span>
                        <span className="text-[11px] text-[#c9cbbe]">
                          {currentLang === 'ar' ? 'سماعات سقفية وحائطية وهورن' : 'Ceiling / Wall / Horn Speakers'}
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="text-2xl font-bold text-[#cef79e] font-mono tabular-nums">
                          ~{estSpeakers}
                        </span>
                        <span className="text-xs text-[#c9cbbe] block font-mono">
                          {currentLang === 'ar' ? 'سماعة' : 'speakers'}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedModules.includes('bms') && (
                    <div className="p-3.5 rounded-xl bg-[#222f30] border border-[#4d5757] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white font-medium block mb-0.5">
                          {currentLang === 'ar' ? 'نقاط التحكم والمراقبة BMS' : 'BMS Supervisory Points'}
                        </span>
                        <span className="text-[11px] text-[#c9cbbe]">
                          {currentLang === 'ar' ? 'نقاط تكييف وإنارة وطاقة I/O' : 'HVAC, Lighting & Power I/O'}
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="text-2xl font-bold text-[#cef79e] font-mono tabular-nums">
                          ~{estBmsPoints}
                        </span>
                        <span className="text-xs text-[#c9cbbe] block font-mono">
                          {currentLang === 'ar' ? 'نقطة I/O' : 'points'}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedModules.includes('sla') && (
                    <div className="p-3.5 rounded-xl bg-[#222f30] border border-[#4d5757] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white font-medium block mb-0.5">
                          {currentLang === 'ar' ? 'خطة الصيانة الدورية (SLA)' : 'Preventative SLA Plan'}
                        </span>
                        <span className="text-[11px] text-[#c9cbbe]">
                          {currentLang === 'ar' ? 'زيارات فحص دورية ودعم فني تعاقدي' : 'Periodic visits & contractual support'}
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="text-lg font-bold text-[#cef79e] font-mono">
                          {currentLang === 'ar' ? 'عقد دوري' : 'Periodic'}
                        </span>
                        <span className="text-xs text-[#c9cbbe] block font-mono">
                          {currentLang === 'ar' ? 'زيارات ربع سنوية' : 'Quarterly'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Indicative Timeline */}
                  <div className="p-3.5 rounded-xl bg-[#222f30] border border-[#4d5757] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-white font-medium block mb-0.5">{t.estTimeline}</span>
                      <span className="text-[11px] text-[#c9cbbe]">
                        {currentLang === 'ar'
                          ? 'مدة استرشادية وفق جدول الأعمال المتفق عليه'
                          : 'Indicative duration based on schedule'}
                      </span>
                    </div>
                    <div className="text-end">
                      <span className="text-2xl font-bold text-[#cef79e] font-mono tabular-nums">
                        {baseWeeks}
                      </span>
                      <span className="text-xs text-[#c9cbbe] block font-mono">
                        {currentLang === 'ar' ? 'أسابيع عمل' : 'working weeks'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Conversion CTA Button: White button paired with 40x40 lime arrow */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyBOQ}
                className="flex-1 py-3.5 px-6 font-semibold text-xs sm:text-sm text-[#222f30] bg-white hover:bg-[#f7f7f5] rounded-lg transition-all cursor-pointer whitespace-nowrap text-center"
              >
                <span>{t.applyCta}</span>
              </button>
              <button
                type="button"
                onClick={handleApplyBOQ}
                aria-label="Submit summary"
                className="btn-arrow-lime cursor-pointer"
              >
                <ArrowIcon className="w-4 h-4 rtl:rotate-0" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
