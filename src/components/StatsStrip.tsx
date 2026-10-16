import React from 'react';
import { Language } from '../types';
import { content } from '../data/translations';
import { CheckCircle2, TrendingUp, History, Cpu } from 'lucide-react';

interface StatsStripProps {
  currentLang: Language;
}

export const StatsStrip: React.FC<StatsStripProps> = ({ currentLang }) => {
  const t = content[currentLang].stats;

  const stats = [
    {
      value: t.projectsCount,
      label: t.projectsLabel,
      desc: t.projectsDesc,
      icon: CheckCircle2,
    },
    {
      value: t.satisfactionRate,
      label: t.satisfactionLabel,
      desc: t.satisfactionDesc,
      icon: TrendingUp,
    },
    {
      value: t.heritageYears,
      label: t.heritageLabel,
      desc: t.heritageDesc,
      icon: History,
    },
    {
      value: t.systemsCount,
      label: t.systemsLabel,
      desc: t.systemsDesc,
      icon: Cpu,
    },
  ];

  return (
    <section className="bg-slate-950 border-b border-slate-800 text-white py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col border-s border-slate-800 ps-6 first:border-s-0 first:ps-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight tabular-nums font-mono">
                    {stat.value}
                  </span>
                </div>
                <span className="text-sm sm:text-base font-semibold text-slate-200 mb-1">
                  {stat.label}
                </span>
                <span className="text-xs text-slate-400 leading-normal">
                  {stat.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
