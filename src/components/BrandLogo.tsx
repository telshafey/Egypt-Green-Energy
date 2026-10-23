import React, { useState } from 'react';

export interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'emblem';
  textColor?: 'dark' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  logoUrl?: string | null;
  companyNameAr?: string;
  companyNameEn?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'horizontal',
  textColor = 'white',
  size = 'md',
  logoUrl,
  companyNameAr = 'مصر للطاقة الخضراء',
  companyNameEn = 'Egypt Green Energy',
}) => {
  const [imgError, setImgError] = useState(false);

  // Dimensions based on size
  const emblemSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: { ar: 'text-xs', en: 'text-[9px]' },
    md: { ar: 'text-sm sm:text-base font-bold', en: 'text-[11px] sm:text-xs font-semibold' },
    lg: { ar: 'text-lg sm:text-xl font-bold', en: 'text-xs sm:text-sm font-semibold' },
    xl: { ar: 'text-xl sm:text-2xl font-extrabold', en: 'text-sm sm:text-base font-bold' },
  };

  const textColorClasses =
    textColor === 'white'
      ? {
          primary: 'text-white',
          secondary: 'text-[#22c55e]',
          subtext: 'text-slate-300',
        }
      : {
          primary: 'text-[#0a1122]',
          secondary: 'text-[#16a34a]',
          subtext: 'text-[#475569]',
        };

  // Official Transparent Emblem Image
  const activeLogoSrc = !imgError && logoUrl && logoUrl.trim() !== '' 
    ? logoUrl 
    : '/assets/aistudio/logo_emblem.png';

  const EmblemElement = (
    <img
      src={activeLogoSrc}
      alt={companyNameAr}
      onError={() => setImgError(true)}
      className={`${emblemSizes[size]} object-contain shrink-0 filter drop-shadow-sm`}
    />
  );

  if (variant === 'emblem') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{EmblemElement}</div>;
  }

  // Normalize names to avoid repeating LLC and ذ.م.م
  const cleanAr = companyNameAr.replace(/ذ\.?\s*م\.?\s*م\.?/g, '').trim();
  const cleanEn = companyNameEn.replace(/\bL\.?L\.?C\.?\b/gi, '').trim();

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center gap-2.5 ${className}`}>
        {EmblemElement}
        <div className="flex flex-col items-center">
          <span className={`block font-bold tracking-tight ${textColorClasses.primary} ${textSizes[size].ar}`}>
            {cleanAr} <span className="text-xs font-normal opacity-85">ذ.م.م</span>
          </span>
          <span className={`block tracking-wide uppercase font-semibold ${textColorClasses.secondary} ${textSizes[size].en}`}>
            {cleanEn} <span className="font-mono text-[10px]">L.L.C</span>
          </span>
          <span className={`block text-[10px] ${textColorClasses.subtext} font-medium mt-0.5`}>
            قطاع أنظمة التيار الخفيف والحلول التكنولوجية
          </span>
        </div>
      </div>
    );
  }

  // Horizontal lockup (Default for Navbar, Headers & Footer)
  return (
    <div className={`flex items-center gap-3 text-start rtl:text-right ${className}`}>
      {EmblemElement}
      <div className="flex flex-col">
        <span className={`block font-bold tracking-tight whitespace-nowrap leading-tight ${textColorClasses.primary} ${textSizes[size].ar}`}>
          {cleanAr} <span className="text-[11px] font-normal opacity-85">ذ.م.م</span>
        </span>
        <div className="flex items-center gap-1.5 leading-tight">
          <span className={`block tracking-wide whitespace-nowrap font-mono ${textColorClasses.secondary} ${textSizes[size].en}`}>
            {cleanEn} <span className="text-[10px] opacity-80">L.L.C</span>
          </span>
          <span className="text-slate-500 text-[10px] hidden sm:inline">•</span>
          <span className="text-[#38bdf8] text-[10px] hidden sm:inline font-normal">
            أنظمة التيار الخفيف والتكنولوجيا
          </span>
        </div>
      </div>
    </div>
  );
};
