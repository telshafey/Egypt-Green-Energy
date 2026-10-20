import React from 'react';
import { Language } from '../types';
import { SunMedium, Droplets, Leaf, History, ArrowUpRight } from 'lucide-react';
import { ENERGY_IMAGE, BIOTECH_IMAGE, JOJOBA_IMAGE } from '../data/translations';
import { resolveImageUrl, handleImageError, DEFAULT_ENERGY_IMAGE } from '../utils/imageHelper';

interface HeritageOverviewProps {
  currentLang: Language;
}

export const HeritageOverview: React.FC<HeritageOverviewProps> = ({ currentLang }) => {
  const isAr = currentLang === 'ar';

  const heritageItems = [
    {
      id: 'energy',
      icon: SunMedium,
      title: isAr ? 'هندسة الطاقة المتجددة والشمسية' : 'Renewable Solar Power Heritage',
      tag: isAr ? 'منظومات كهروضوئية وميكروجريد' : 'Solar PV & Hybrid Microgrids',
      desc: isAr
        ? 'سجل تنفيذي موثق في تصميم وتشغيل محطات الطاقة الكهروضوئية للقطاعات الصناعية، والمحطات الهجينة المستقلة في واحة سيوة لتوفير ملايين اللترات من الديزل.'
        : 'Demonstrated track record commissioning industrial rooftop solar PV arrays and autonomous off-grid microgrids in Siwa Oasis, displacing diesel fuel.',
      image: ENERGY_IMAGE,
      specs: isAr ? '14.8+ ميجاوات منجزة' : '14.8+ MW Installed',
    },
    {
      id: 'water',
      icon: Droplets,
      title: isAr ? 'حلول المياه والتحلية والضخ الشمسي' : 'Water, Desalination & Hydroponics',
      tag: isAr ? 'معالجة المياه وتوفير 90% استهلاك' : 'Solar Pumping & 90% Water Savings',
      desc: isAr
        ? 'تجهيز آبار المياه الجوفية بمنظومات ضخ تعمل بالطاقة الشمسية، ومحطات تحلية المياه للبيئات القاسية، مع أنظمة الزراعة المائية المتطورة لترشيد الموارد المائية.'
        : 'Solar-powered groundwater extraction, reverse osmosis desalination in remote terrain, and vertical hydroponics slashing water consumption by 90%.',
      image: BIOTECH_IMAGE,
      specs: isAr ? '14,000 م³ مياه يومياً' : '14,000 m³/day Pumped',
    },
    {
      id: 'biofuel',
      icon: Leaf,
      title: isAr ? 'الطاقة الحيوية ومزارع الجوجوبا' : 'Bio-Energy, Jojoba & Desert Greening',
      tag: isAr ? 'استصلاح الأراضي والزيوت النظيفة' : 'Desert Biofuels & Algae Bioreactors',
      desc: isAr
        ? 'استصلاح مئات الأفدنة الصحراوية بمزارع الجوجوبا المقاومة للملوحة لإنتاج زيوت المحركات والوقود الحيوي، وتطوير مفاعلات استزراع الطحالب الخضراء للكتلة الحيوية.'
        : 'Arid land reclamation with drought-tolerant jojoba plantations for industrial bio-lubricants and biofuel refining, coupled with closed microalgae photobioreactors.',
      image: JOJOBA_IMAGE,
      specs: isAr ? '500+ فدان مستصلح' : '500+ Acres Reclaimed',
    },
  ];

  return (
    <section className="py-18 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Frame as Historical Heritage & Engineering Depth */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2 font-mono">
              <History className="w-4 h-4" />
              <span>
                {isAr
                  ? 'سجل المشروعات في الطاقة النظيفة والبيئة'
                  : 'Projects Record in Clean Energy & Environment'}
              </span>
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3"
            >
              {isAr
                ? 'مشروعاتنا التأسيسية في الطاقة المتجددة، المياه، والتكنولوجيا الحيوية'
                : 'Our Foundation in Renewable Energy, Water & Biotechnology'}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {isAr
                ? 'إلى جانب نشاطنا الأساسي في قطاع أنظمة التيار الخفيف وتكنولوجيا المباني، تمتلك شركة مصر للطاقة الخضراء سجلاً ميدانياً موثقاً في محطات الطاقة الشمسية، وحلول ضخ وتحلية المياه، والمشروعات البيئية.'
                : 'Alongside our core specialization in Low Current systems, Egypt Green Energy L.L.C possesses documented project execution in solar power arrays, water desalination, and environmental technologies.'}
            </p>
          </div>

          <div className="shrink-0 text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
            <span className="block font-bold text-slate-900">
              {isAr ? 'مصر للطاقة الخضراء ذ.م.م' : 'Egypt Green Energy L.L.C'}
            </span>
            <span className="block text-[11px] text-slate-600 font-medium">
              {isAr ? 'تأسست الشركة عام 2014' : 'Established in 2014'}
            </span>
          </div>
        </div>

        {/* 3 Compact Historical Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {heritageItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Visual Header */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={resolveImageUrl(item.image, DEFAULT_ENERGY_IMAGE)}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={handleImageError(DEFAULT_ENERGY_IMAGE)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent flex items-end p-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <Icon className="w-4 h-4 text-emerald-400" />
                        <span>{item.tag}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Quiet Footer Metric */}
                <div className="px-5 pb-5 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono text-emerald-800">
                  <span className="font-bold">{item.specs}</span>
                  <span className="text-slate-600 text-[11px] font-medium">
                    {isAr ? 'سجل معتمد' : 'Verified Track Record'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
