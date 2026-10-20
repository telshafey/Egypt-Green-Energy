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
          secondary: 'text-emerald-400',
        }
      : {
          primary: 'text-slate-900',
          secondary: 'text-emerald-700',
        };

  // Professional Vector Emblem for Egypt Green Energy (EGE)
  const DefaultVectorEmblem = (
    <svg
      viewBox="0 0 100 100"
      className={`${emblemSizes[size]} shrink-0 drop-shadow-sm`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Egypt Green Energy Official Emblem"
    >
      <defs>
        {/* Outer Ring Emerald Gradient */}
        <linearGradient id="egeOuterRing" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Gold Accent Gradient */}
        <linearGradient id="egeGoldAccent" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Inner Core Gradient */}
        <linearGradient id="egeCoreBg" x1="50" y1="10" x2="50" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>

        {/* Green Leaf Glow */}
        <linearGradient id="egeLeafGlow" x1="30" y1="40" x2="70" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Outer Precision Ring */}
      <circle cx="50" cy="50" r="48" stroke="url(#egeOuterRing)" strokeWidth="3" />
      <circle cx="50" cy="50" r="45" stroke="url(#egeGoldAccent)" strokeWidth="1" strokeDasharray="2 3" opacity="0.8" />

      {/* Core Background Medallion */}
      <circle cx="50" cy="50" r="44" fill="url(#egeCoreBg)" />

      {/* Sunburst Solar Radiance at Top */}
      <g stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.85">
        <line x1="50" y1="14" x2="50" y2="20" />
        <line x1="36" y1="18" x2="40" y2="23" />
        <line x1="64" y1="18" x2="60" y2="23" />
        <line x1="26" y1="28" x2="31" y2="31" />
        <line x1="74" y1="28" x2="69" y2="31" />
      </g>
      <circle cx="50" cy="26" r="4.5" fill="#f59e0b" />

      {/* Heraldic Egyptian Falcon / Eagle Wings & Shield */}
      <path
        d="M 50 33 L 57 41 L 76 38 C 70 47, 62 52, 54 55 L 50 63 L 46 55 C 38 52, 30 47, 24 38 L 43 41 Z"
        fill="url(#egeGoldAccent)"
      />
      {/* Eagle Wing Detail Feathers */}
      <path
        d="M 32 42 Q 41 46, 48 48 M 68 42 Q 59 46, 52 48"
        stroke="#78350f"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Egyptian Tricolor Ribbon Heart */}
      <g transform="translate(42, 47)">
        {/* Red Stripe */}
        <rect x="0" y="0" width="16" height="3" rx="0.5" fill="#ef4444" />
        {/* White Stripe */}
        <rect x="0" y="3" width="16" height="3" fill="#ffffff" />
        {/* Black Stripe */}
        <rect x="0" y="6" width="16" height="3" rx="0.5" fill="#0f172a" />
        {/* Golden Central Eagle Ingot */}
        <circle cx="8" cy="4.5" r="1.2" fill="#d97706" />
      </g>

      {/* Dual Sustainable Green Energy Leaves at Base */}
      <path
        d="M 50 66 C 42 66, 32 72, 30 81 C 41 83, 49 76, 50 66 Z"
        fill="url(#egeLeafGlow)"
      />
      <path
        d="M 50 66 C 58 66, 68 72, 70 81 C 59 83, 51 76, 50 66 Z"
        fill="url(#egeLeafGlow)"
      />
      {/* Leaf Central Ribs */}
      <path d="M 50 68 Q 42 74, 34 78" stroke="#a7f3d0" strokeWidth="1" strokeLinecap="round" />
      <path d="M 50 68 Q 58 74, 66 78" stroke="#a7f3d0" strokeWidth="1" strokeLinecap="round" />

      {/* Base Foundation Dot */}
      <circle cx="50" cy="85" r="2" fill="#10b981" />
    </svg>
  );

  // Render Image or Vector Emblem
  const hasCustomImage = Boolean(logoUrl && logoUrl.trim() !== '' && !imgError);

  const EmblemElement = hasCustomImage ? (
    <img
      src={logoUrl!}
      alt={companyNameAr}
      onError={() => setImgError(true)}
      className={`${emblemSizes[size]} object-contain shrink-0 drop-shadow-sm`}
    />
  ) : (
    DefaultVectorEmblem
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
          <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
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
          <span className={`block tracking-wide whitespace-nowrap ${textColorClasses.secondary} ${textSizes[size].en}`}>
            {cleanEn} <span className="text-[10px] font-mono">L.L.C</span>
          </span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">•</span>
          <span className="text-emerald-400 text-[10px] hidden sm:inline font-normal">
            قطاع أنظمة التيار الخفيف والحلول التكنولوجية
          </span>
        </div>
      </div>
    </div>
  );
};
