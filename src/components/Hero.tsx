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
    <section className="relative overflow-hidden bg-[#222f30] text-white min-h-[600px] lg:min-h-[680px] flex items-center border-b border-[#4d5757]/60">
      {/* Photographic Background with Abyssal Ink Scrim */}
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
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform motion-safe:duration-1000 opacity-30"
        />
        {/* Measured dark green scrim for high-contrast WCAG AA legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#222f30] via-[#222f30]/95 to-[#222f30]/80 rtl:bg-gradient-to-l" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="max-w-3xl">
          
          {/* Quiet Unboxed Kicker Metadata with 6px Bioluminescent Lime Dot */}
          <div className="flex items-center gap-2.5 text-xs font-mono text-[#c9cbbe] mb-5 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e] shrink-0 inline-block" />
            <span className="uppercase tracking-wider font-semibold text-white">{t.hero.kicker}</span>
            <span aria-hidden="true" className="text-[#4d5757]">·</span>
            <span className="text-[#c9cbbe]">{currentLang === 'ar' ? 'مصر للطاقة الخضراء ذ.م.م' : 'Egypt Green Energy L.L.C'}</span>
          </div>

          {/* Refined Display Headline: Architectural flat weight with tight leading */}
          <h1
            style={{ textWrap: 'balance' }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.15] mb-6"
          >
            {displayTitle}
          </h1>

          {/* High-legibility value proposition prose */}
          <p className="text-base sm:text-lg text-[#c9cbbe] leading-relaxed font-normal mb-8 max-w-2xl">
            {displaySubtitle}
          </p>

          {/* Action Points: Exactly Two Actions — White primary with 40x40 Lime arrow + Ghost button */}
          <div className="flex flex-wrap items-center gap-3.5 mb-10">
            <div className="inline-flex items-center gap-2">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center justify-center px-6 py-3.5 text-xs sm:text-sm font-semibold text-[#222f30] bg-white hover:bg-[#f7f7f5] active:scale-[0.99] rounded-lg transition-all cursor-pointer whitespace-nowrap"
              >
                <span>{t.hero.ctaPrimary}</span>
              </button>
              <button
                onClick={() => onNavigate('contact')}
                aria-label="Direct action"
                className="w-10 h-10 rounded-lg bg-[#cef79e] hover:bg-[#bde88a] text-[#222f30] flex items-center justify-center transition-all cursor-pointer shrink-0"
              >
                <ArrowIcon className="w-4 h-4 rtl:rotate-0" />
              </button>
            </div>

            <button
              onClick={() => onNavigate('systems')}
              className="inline-flex items-center justify-center px-5 py-3.5 text-xs sm:text-sm font-medium text-white hover:text-white bg-transparent hover:bg-[#2a3a3b]/50 border border-[#4d5757] hover:border-[#c9cbbe] rounded-lg transition-all cursor-pointer whitespace-nowrap"
            >
              {t.hero.ctaSecondary}
            </button>
          </div>

          {/* Claim-to-Proof Quiet Trust Row: Clean text with 6px lime dots and hairline divider */}
          <div className="pt-6 border-t border-[#4d5757]/60 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#c9cbbe] font-normal">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e] shrink-0 inline-block" />
              <ShieldCheck className="w-4 h-4 text-[#cef79e] shrink-0" />
              <span>{t.hero.trustBullet1}</span>
            </div>
            <span aria-hidden="true" className="text-[#4d5757]">·</span>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#cef79e] shrink-0" />
              <span>{t.hero.trustBullet2}</span>
            </div>
            <span aria-hidden="true" className="text-[#4d5757]">·</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#cef79e] shrink-0" />
              <span>{t.hero.trustBullet3}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
