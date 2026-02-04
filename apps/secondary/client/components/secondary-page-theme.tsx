'use client';

import { ReactNode, useEffect } from 'react';

const HUB_BG = 'bg-gradient-to-br from-slate-800 via-[#1a3254] to-[#256089]';
const HUB_GLOW_TOP = 'bg-[radial-gradient(ellipse_at_top_right,_rgba(77,163,199,0.22)_0%,_transparent_50%)]';
const HUB_GLOW_BOTTOM = 'bg-[radial-gradient(ellipse_at_bottom_left,_rgba(232,93,44,0.12)_0%,_transparent_50%)]';

interface SecondaryPageThemeProps {
  children: ReactNode;
  className?: string;
}

export function SecondaryPageTheme({ children, className = '' }: SecondaryPageThemeProps) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'secondary');
    return () => document.documentElement.removeAttribute('data-theme');
  }, []);

  return (
    <div
      data-theme="secondary"
      className={`min-h-screen text-white ${HUB_BG} ${className}`}
    >
      <div className="relative overflow-hidden min-h-screen">
        <div className={`absolute inset-0 ${HUB_GLOW_TOP}`} aria-hidden />
        <div className={`absolute inset-0 ${HUB_GLOW_BOTTOM}`} aria-hidden />
        <div className="relative min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
