import React from 'react';
import { Language } from '../types';
import { content, HERO_IMAGE } from '../data/translations';
import { resolveImageUrl, handleImageError, DEFAULT_HERO_IMAGE } from '../utils/imageHelper';
import { Compass, Target, ShieldCheck, Wrench, CheckCircle2 } from 'lucide-react';

interface AboutSectionProps {
  currentLang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ currentLang }) => {
  const t = content[currentLang].about;

  return (
    <section id="about" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs sm:text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2 font-mono">
            {t.sectionKicker}
          </div>
          <h2
            style={{ textWrap: 'balance' }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-4"
          >
            {t.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            {t.subheading}
          </p>
        </div>

        {/* 2-Column Split: Story & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mb-16">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 text-slate-700 text-base leading-relaxed">
            <p>{t.p1}</p>
            <p>{t.p2}</p>

            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 mb-3">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {t.visionTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {t.visionText}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 mb-3">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {t.missionTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {t.missionText}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Visual & Clean Incorporation Spotlight */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-full min-h-[360px] shadow-sm bg-slate-900">
              <img
                src={resolveImageUrl(HERO_IMAGE, DEFAULT_HERO_IMAGE)}
                alt="Egypt Green Energy Low Current Systems Engineering"
                referrerPolicy="no-referrer"
                onError={handleImageError(DEFAULT_HERO_IMAGE)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{currentLang === 'ar' ? 'كيان هندسي رسمي' : 'Corporate Engineering Entity'}</span>
                </div>
                <h4 className="text-xl font-bold mb-2 text-white">
                  {currentLang === 'ar' ? 'تأسست الشركة عام 2014' : 'Established in 2014'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {currentLang === 'ar'
                    ? 'كيان مصري مسجل رسمياً لتقديم حلول أنظمة التيار الخفيف وتكنولوجيا المباني الذكية، وفقاً للسجل التجاري والبطاقة الضريبية المعتمدة.'
                    : 'A formal Egyptian corporate entity providing turnkey Low Current systems and building technologies, operating under certified commercial registration.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Engineering Standards (Replaces timeline) */}
        <div className="pt-10 border-t border-slate-200">
          <div className="max-w-3xl mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              {t.valuesTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {currentLang === 'ar'
                ? 'منهجية العمل والالتزامات الهندسية المتبعة في دراسة وتنفيذ وتسليم المشروعات'
                : 'Engineering execution methodologies and compliance standards observed across all projects'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.values.map((v, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">
                    {v.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
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
