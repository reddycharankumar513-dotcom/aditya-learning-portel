import React from 'react';

interface LearnovaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const LearnovaLogo: React.FC<LearnovaLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Abstract Intelligent Growth Glyph (SVG) */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(128,101,255,0.6)]"
        >
          <defs>
            <linearGradient id="learnova_grad_primary" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8065FF" />
              <stop offset="100%" stopColor="#32C8F5" />
            </linearGradient>
            <linearGradient id="learnova_grad_inner" x1="12" y1="12" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A68BFF" />
              <stop offset="100%" stopColor="#32C8F5" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Hexagonal Intelligent Core Frame */}
          <path
            d="M22 3L39 12.8V31.2L22 41L5 31.2V12.8L22 3Z"
            stroke="url(#learnova_grad_primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          />

          {/* Ascending Career Stepping Ladder / Diamond Vector */}
          <path
            d="M22 10L32 17.5L22 25L12 17.5L22 10Z"
            fill="url(#learnova_grad_inner)"
            fillOpacity="0.3"
            stroke="url(#learnova_grad_inner)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Central Neural Node / Spark of Intelligence */}
          <circle cx="22" cy="22" r="3.5" fill="#32C8F5" filter="url(#glow)" />

          {/* Upward Growth Arrow Apex */}
          <path
            d="M17 31L22 26L27 31"
            stroke="#8065FF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className={`font-heading font-extrabold tracking-tight text-white ${textSizes[size]}`}>
            LEARN<span className="text-[#8065FF]">OVA</span>
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#32C8F5] ml-1 mb-2 animate-pulse shadow-[0_0_8px_#32C8F5]"></span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-wider uppercase text-learnova-text-secondary font-medium -mt-1">
            Learn • Build • Prove • Get Hired
          </span>
        )}
      </div>
    </div>
  );
};
