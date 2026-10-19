import React from 'react';
import { Language, NavSection } from '../types';
import { content, HERO_IMAGE } from '../data/translations';
import { ArrowLeft, ArrowRight, ShieldCheck, Cpu, Clock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { resolveImageUrl, DEFAULT_HERO_IMAGE } from '../utils/imageHelper';

interface HeroProps {
  currentLang: Language;
  onNavigate: (section: NavSection) => void;
  customTitle?: string;
  customSubtitle?: string;
  customHeroImage?: string;
  customLogoUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({
  currentLang,
  onNavigate,
  customTitle,
  customSubtitle,
  customHeroImage,
  customLogoUrl,
}) => {
  const t = content[currentLang];
  const isRtl = currentLang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const heroImageSrc = resolveImageUrl(customHeroImage, DEFAULT_HERO_IMAGE);
  const displayTitle = customTitle || t.hero.title;
  const displaySubtitle = customSubtitle || t.hero.subtitle;

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[600px] lg:min-h-[680px] flex items-center">
      {/* 16:9 Photographic Background with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImageSrc}
          alt="Low Current Systems and Central Security Operations Center"
          referrerPolicy="no-referrer"
          onError={(e) => {
            if (e.currentTarget.src !== DEFAULT_HERO_IMAGE) {
              e.currentTarget.src = DEFAULT_HERO_IMAGE;
            }
          }}
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
        />
        {/* Measured dark scrim for high-contrast WCAG AA legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/70 rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="max-w-3xl">
          
          {/* Quiet Unboxed Kicker Metadata with Official Emblem */}
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-emerald-400 mb-4 tracking-wide font-mono">
            <BrandLogo variant="emblem" size="sm" logoUrl={customLogoUrl} />
            <span className="uppercase tracking-wider font-semibold">{t.hero.kicker}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="text-slate-300">{currentLang === 'ar' ? 'شركة مصر للطاقة الخضراء ذ.م.م' : 'Egypt Green Energy L.L.C'}</span>
          </div>

          {/* Refined Display Headline with balanced wrapping */}
          <h1
            style={{ textWrap: 'balance' }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.18] mb-6"
          >
            {displayTitle}
          </h1>

          {/* High-legibility value proposition prose */}
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal mb-8 max-w-2xl">
            {displaySubtitle}
          </p>

          {/* Action Points: Single Primary CTA + Secondary Link */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] rounded-xl shadow-lg hover:shadow-emerald-600/25 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowIcon className="w-4 h-4 rtl:rotate-0" />
            </button>

            <button
              onClick={() => onNavigate('systems')}
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm sm:text-base font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md border border-slate-700 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              {t.hero.ctaSecondary}
            </button>

            <button
              onClick={() => onNavigate('configurator')}
              className="inline-flex items-center justify-center px-5 py-3.5 text-sm sm:text-base font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Cpu className="w-4 h-4 inline me-1.5" />
              <span>{t.configurator.heading}</span>
            </button>
          </div>

          {/* Claim-to-Proof Quiet Trust Row: Clean text with typographic separators (NO PILLS) */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.hero.trustBullet1}</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.hero.trustBullet2}</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.hero.trustBullet3}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
