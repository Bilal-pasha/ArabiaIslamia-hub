'use client';

import Image from 'next/image';

export interface MainLogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Main website logo (Jamia Arabia Islamia) for the library app.
 * Uses the logo from public/images/Logo.png.
 */
export function MainLogo({ width = 80, height = 80, className, priority }: MainLogoProps) {
  return (
    <Image
      src="/images/Logo.png"
      alt="Jamia Arabia Islamia"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
