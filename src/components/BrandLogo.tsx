import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'emblem';
  textColor?: 'dark' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'horizontal',
  textColor = 'white',
  size = 'md',
}) => {
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

  // High-fidelity vector rendition of the official Egypt Green Energy L.L.C emblem
  const Emblem = (
    <svg
      viewBox="0 0 200 200"
      className={`${emblemSizes[size]} shrink-0 drop-shadow-sm`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Blue Ribbon Gradient */}
        <linearGradient id="egeBlueGrad" x1="40" y1="20" x2="130" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="60%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>

        {/* Red Ribbon Gradient */}
        <linearGradient id="egeRedGrad" x1="130" y1="40" x2="170" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="40%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>

        {/* Green Ribbon Gradient */}
        <linearGradient id="egeGreenGrad" x1="40" y1="100" x2="120" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>

        {/* Leaf 1 Gradient */}
        <linearGradient id="leafGrad1" x1="70" y1="90" x2="105" y2="135" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="60%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>

        {/* Leaf 2 Gradient */}
        <linearGradient id="leafGrad2" x1="100" y1="100" x2="145" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
      </defs>

      {/* Hexagonal Ribbon Outer Segments */}
      {/* Top Blue Segment */}
      <path
        d="M 100 15 L 140 38 L 115 75 L 75 52 Z"
        fill="url(#egeBlueGrad)"
      />
      <path
        d="M 100 15 L 60 38 L 40 85 L 75 75 L 85 45 Z"
        fill="#0284c7"
      />

      {/* Right Red Segment */}
      <path
        d="M 140 38 L 175 95 L 175 145 L 140 165 L 130 115 L 145 75 Z"
        fill="url(#egeRedGrad)"
      />

      {/* Bottom/Left Green Segment */}
      <path
        d="M 40 85 L 40 145 L 100 180 L 140 165 L 105 135 L 75 145 L 65 110 Z"
        fill="url(#egeGreenGrad)"
      />

      {/* Inner White Space Canvas */}
      <polygon
        points="75,52 115,75 130,115 105,135 65,110"
        fill="#ffffff"
      />

      {/* Egyptian Flag inside Emblem (Waving shape) */}
      <g transform="translate(82, 60) rotate(12) scale(0.68)">
        {/* Red Stripe */}
        <path
          d="M 0 0 C 18 -6, 32 6, 50 0 L 50 12 C 32 18, 18 6, 0 12 Z"
          fill="#ce1126"
        />
        {/* White Stripe */}
        <path
          d="M 0 12 C 18 6, 32 18, 50 12 L 50 24 C 32 30, 18 18, 0 24 Z"
          fill="#ffffff"
        />
        {/* Golden Eagle of Saladin */}
        <path
          d="M 23 15 Q 25 13, 27 15 Q 28 18, 25 21 Q 22 18, 23 15 Z"
          fill="#c09a35"
        />
        <circle cx="25" cy="17" r="1.5" fill="#c09a35" />
        {/* Black Stripe */}
        <path
          d="M 0 24 C 18 18, 32 30, 50 24 L 50 36 C 32 42, 18 30, 0 36 Z"
          fill="#000000"
        />
      </g>

      {/* Twin Glossy Green Leaves at the base */}
      {/* Left Leaf */}
      <path
        d="M 68 112 C 60 92, 85 85, 102 112 C 95 125, 78 128, 68 112 Z"
        fill="url(#leafGrad1)"
      />
      <path
        d="M 72 110 Q 88 100, 100 112"
        stroke="#86efac"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Right Leaf */}
      <path
        d="M 98 118 C 96 98, 128 92, 138 120 C 128 132, 108 132, 98 118 Z"
        fill="url(#leafGrad2)"
      />
      <path
        d="M 102 116 Q 120 108, 134 118"
        stroke="#bbf7d0"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === 'emblem') {
    return <div className={`inline-flex items-center ${className}`}>{Emblem}</div>;
  }

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

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center gap-3 ${className}`}>
        {Emblem}
        <div className="flex flex-col items-center">
          <span className={`block font-bold tracking-tight ${textColorClasses.primary} ${textSizes[size].ar}`}>
            مصر للطاقة الخضراء <span className="text-xs font-normal opacity-85">ذ.م.م</span>
          </span>
          <span className={`block tracking-wide uppercase font-semibold ${textColorClasses.secondary} ${textSizes[size].en}`}>
            Egypt Green Energy <span className="font-mono text-[10px]">L.L.C</span>
          </span>
        </div>
      </div>
    );
  }

  // Horizontal lockup (Default for Navbar & headers)
  return (
    <div className={`flex items-center gap-3 text-start rtl:text-right ${className}`}>
      {Emblem}
      <div className="flex flex-col">
        <span className={`block font-bold tracking-tight whitespace-nowrap leading-tight ${textColorClasses.primary} ${textSizes[size].ar}`}>
          مصر للطاقة الخضراء <span className="text-[11px] font-normal opacity-85">ذ.م.م</span>
        </span>
        <span className={`block tracking-wide whitespace-nowrap leading-tight ${textColorClasses.secondary} ${textSizes[size].en}`}>
          Egypt Green Energy <span className="text-[10px] font-mono">L.L.C</span>
        </span>
      </div>
    </div>
  );
};
