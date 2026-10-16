import React, { useState } from 'react';
import { Language } from '../types';
import { content, HERO_IMAGE } from '../data/translations';
import { Compass, Target, CheckCircle2, Award, Calendar } from 'lucide-react';

interface AboutSectionProps {
  currentLang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ currentLang }) => {
  const t = content[currentLang].about;
  const [selectedMilestone, setSelectedMilestone] = useState(2); // Default to 2014 incorporation

  return (
    <section id="about" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
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

        {/* 2-Column Split: Story & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mb-20">
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
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
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
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.missionText}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Visual & Heritage Spotlight */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-full min-h-[360px] shadow-sm">
              <img
                src={HERO_IMAGE}
                alt="Egypt Low Current Systems and Technical Heritage"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                  <Award className="w-4 h-4" />
                  <span>1980 — 2026</span>
                </div>
                <h4 className="text-xl font-bold mb-2">
                  {currentLang === 'ar' ? '44 عاماً من الريادة الهندسية' : '44 Years of Engineering Leadership'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentLang === 'ar'
                    ? 'من المقاولات المتخصصة في الثمانينات إلى ريادة أنظمة التيار الخفيف والبنية التحتية التكنولوجية للمدن الذكية.'
                    : 'From specialized contracting in the 1980s to turnkey low current and smart building technology.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Timeline: 1980 to 2026 */}
        <div className="pt-10 border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1 font-mono">
                <Calendar className="w-4 h-4" />
                <span>{t.timelineTitle}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {t.timelineSub}
              </h3>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {currentLang === 'ar' ? 'اختر العام لاستعراض تفاصيل المحطة' : 'Click a year to view milestone details'}
            </div>
          </div>

          {/* Milestone Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-1.5 bg-slate-100 rounded-xl mb-6">
            {t.timeline.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMilestone(idx)}
                className={`py-3 px-2 text-center rounded-lg transition-all cursor-pointer ${
                  selectedMilestone === idx
                    ? 'bg-white text-emerald-800 shadow-sm font-bold border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
                }`}
              >
                <span className="block text-base sm:text-lg font-mono tabular-nums">
                  {item.year}
                </span>
                <span className="block text-[11px] truncate mt-0.5">
                  {item.title}
                </span>
              </button>
            ))}
          </div>

          {/* Active Milestone Card */}
          {t.timeline[selectedMilestone] && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
                    {t.timeline[selectedMilestone].year}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">|</span>
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                    {t.timeline[selectedMilestone].title}
                  </h4>
                </div>
                <div className="text-xs text-emerald-800 bg-emerald-100/70 border border-emerald-200 rounded px-2.5 py-1 font-medium font-mono">
                  {t.timeline[selectedMilestone].highlight}
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
                {t.timeline[selectedMilestone].description}
              </p>
            </div>
          )}
        </div>

        {/* Core Values */}
        <div className="pt-16 mt-16 border-t border-slate-200">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8">
            {t.valuesTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.values.map((val, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <h4 className="text-base font-bold text-slate-900">{val.title}</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
