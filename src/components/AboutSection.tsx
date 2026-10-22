import React from 'react';
import { Language } from '../types';
import { content, HERO_IMAGE } from '../data/translations';
import { resolveImageUrl, handleImageError, DEFAULT_HERO_IMAGE } from '../utils/imageHelper';
import { Compass, Target, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AboutSectionProps {
  currentLang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ currentLang }) => {
  const t = content[currentLang].about;

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#f7f7f5] text-[#222f30] border-b border-[#c9cbbe]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Bone White canvas with Abyssal Ink typography */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#4d5757] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e] shrink-0 inline-block" />
            <span>{t.sectionKicker}</span>
          </div>
          <h2
            style={{ textWrap: 'balance' }}
            className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#222f30] mb-4"
          >
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-[#4d5757] leading-relaxed font-normal">
            {t.subheading}
          </p>
        </div>

        {/* 2-Column Split: Story & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-16">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 text-[#4d5757] text-base leading-relaxed font-normal">
            <p>{t.p1}</p>
            <p>{t.p2}</p>

            {/* Vision & Mission Cards: Paper white flat cards with #c9cbbe hairline border */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-6 rounded-2xl bg-white border border-[#c9cbbe] flat-card">
                <div className="w-10 h-10 rounded-lg bg-[#f7f7f5] border border-[#c9cbbe] flex items-center justify-center text-[#222f30] mb-3">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#222f30] mb-2">
                  {t.visionTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#4d5757] leading-relaxed font-normal">
                  {t.visionText}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#c9cbbe] flat-card">
                <div className="w-10 h-10 rounded-lg bg-[#f7f7f5] border border-[#c9cbbe] flex items-center justify-center text-[#222f30] mb-3">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#222f30] mb-2">
                  {t.missionTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#4d5757] leading-relaxed font-normal">
                  {t.missionText}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Visual in dark rounded frame */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden border border-[#c9cbbe] h-full min-h-[360px] bg-[#222f30]">
              <img
                src={resolveImageUrl(HERO_IMAGE, DEFAULT_HERO_IMAGE)}
                alt="Egypt Green Energy Low Current Systems Engineering"
                referrerPolicy="no-referrer"
                onError={handleImageError(DEFAULT_HERO_IMAGE)}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#222f30] via-[#222f30]/60 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <div className="flex items-center gap-2 text-xs font-mono text-[#cef79e] mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e] shrink-0 inline-block" />
                  <ShieldCheck className="w-4 h-4" />
                  <span>{currentLang === 'ar' ? 'قطاع هندسي متكامل' : 'Integrated Engineering Division'}</span>
                </div>
                <h4 className="text-lg sm:text-xl font-medium mb-2 text-white">
                  {currentLang === 'ar' ? 'حلول وأنظمة التيار الخفيف (ELV)' : 'Turnkey Low Current Systems'}
                </h4>
                <p className="text-xs sm:text-sm text-[#c9cbbe] leading-relaxed font-normal">
                  {currentLang === 'ar'
                    ? 'دراسة المخططات الهندسية وتوريد وتركيب وبرمجة الأنظمة مع تقديم خدمات الصيانة التعاقدية.'
                    : 'Engineering layout assessment, equipment procurement, site execution, and contractual SLA support.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Engineering Standards: Flat Paper White Cards */}
        <div className="pt-10 border-t border-[#c9cbbe]">
          <div className="max-w-3xl mb-8">
            <h3 className="text-xl sm:text-2xl font-medium text-[#222f30] mb-2">
              {t.valuesTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#4d5757]">
              {currentLang === 'ar'
                ? 'منهجية العمل والالتزامات الهندسية المتبعة في دراسة وتنفيذ وتسليم المشروعات'
                : 'Engineering execution methodologies and compliance standards observed across all projects'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.values.map((v, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#c9cbbe] flat-card flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#f7f7f5] border border-[#c9cbbe] text-[#222f30] flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-4 h-4 text-[#222f30]" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#222f30] mb-2">
                    {v.title}
                  </h4>
                  <p className="text-xs text-[#4d5757] leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
