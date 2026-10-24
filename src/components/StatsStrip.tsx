import React from 'react';
import { Language } from '../types';
import { content } from '../data/translations';
import { Compass, ShieldCheck, Wrench, Clock } from 'lucide-react';

import { SiteSettingsData } from '../services/firebaseService';

interface StatsStripProps {
  currentLang: Language;
  customSettings?: SiteSettingsData | null;
}

export const StatsStrip: React.FC<StatsStripProps> = ({ currentLang, customSettings }) => {
  const t = content[currentLang].stats;

  const pillars = [
    {
      title: customSettings?.stat1Value || t.projectsCount,
      label: (currentLang === 'ar' ? customSettings?.stat1LabelAr : null) || t.projectsLabel,
      desc: (currentLang === 'ar' ? customSettings?.stat1DescAr : null) || t.projectsDesc,
      icon: Compass,
    },
    {
      title: customSettings?.stat2Value || t.satisfactionRate,
      label: (currentLang === 'ar' ? customSettings?.stat2LabelAr : null) || t.satisfactionLabel,
      desc: (currentLang === 'ar' ? customSettings?.stat2DescAr : null) || t.satisfactionDesc,
      icon: ShieldCheck,
    },
    {
      title: customSettings?.stat3Value || t.heritageYears,
      label: (currentLang === 'ar' ? customSettings?.stat3LabelAr : null) || t.heritageLabel,
      desc: (currentLang === 'ar' ? customSettings?.stat3DescAr : null) || t.heritageDesc,
      icon: Wrench,
    },
    {
      title: customSettings?.stat4Value || t.systemsCount,
      label: (currentLang === 'ar' ? customSettings?.stat4LabelAr : null) || t.systemsLabel,
      desc: (currentLang === 'ar' ? customSettings?.stat4DescAr : null) || t.systemsDesc,
      icon: Clock,
    },
  ];

  return (
    <section className="bg-[#0a1122] border-b border-[#1e2e50] text-white py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="flex flex-col border-s border-[#1e2e50] ps-6 first:border-s-0 first:ps-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-[#38bdf8] shrink-0" />
                  <span className="text-xl sm:text-2xl font-bold text-[#22c55e] font-mono tabular-nums tracking-tight">
                    {pillar.title}
                  </span>
                </div>
                <span className="text-xs font-semibold text-white mb-1 tracking-wide">
                  {pillar.label}
                </span>
                <span className="text-xs text-slate-300 leading-relaxed font-normal">
                  {pillar.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
