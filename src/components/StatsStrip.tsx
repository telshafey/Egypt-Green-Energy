import React from 'react';
import { Language } from '../types';
import { content } from '../data/translations';
import { Compass, ShieldCheck, Wrench, Clock } from 'lucide-react';

interface StatsStripProps {
  currentLang: Language;
}

export const StatsStrip: React.FC<StatsStripProps> = ({ currentLang }) => {
  const t = content[currentLang].stats;

  const pillars = [
    {
      title: t.projectsCount,
      label: t.projectsLabel,
      desc: t.projectsDesc,
      icon: Compass,
    },
    {
      title: t.satisfactionRate,
      label: t.satisfactionLabel,
      desc: t.satisfactionDesc,
      icon: ShieldCheck,
    },
    {
      title: t.heritageYears,
      label: t.heritageLabel,
      desc: t.heritageDesc,
      icon: Wrench,
    },
    {
      title: t.systemsCount,
      label: t.systemsLabel,
      desc: t.systemsDesc,
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
