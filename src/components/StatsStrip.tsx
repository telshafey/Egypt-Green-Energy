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
    <section className="bg-slate-950 border-b border-slate-800 text-white py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="flex flex-col border-s border-slate-800 ps-6 first:border-s-0 first:ps-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                    {pillar.title}
                  </span>
                </div>
                <span className="text-sm font-bold text-emerald-400 mb-1">
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
