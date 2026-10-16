import React from 'react';
import { Language } from '../types';
import { content } from '../data/translations';
import { Award } from 'lucide-react';

interface PartnersSectionProps {
  currentLang: Language;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ currentLang }) => {
  const t = content[currentLang].partners;

  return (
    <section className="py-14 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subtle Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>{t.sectionKicker}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            {t.heading}
          </h3>
        </div>

        {/* Brand Grid / Marquee Representation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {t.brands.map((brand, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors flex items-center justify-center text-center group"
            >
              <span className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-emerald-700 transition-colors">
                {brand}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
