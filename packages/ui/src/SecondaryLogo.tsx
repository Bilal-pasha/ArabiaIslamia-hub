'use client';

import Image from 'next/image';

import logo from './assets/arabia-secondary-logo.jpeg';

export interface SecondaryLogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function SecondaryLogo({
  width = 120,
  height = 120,
  className = '',
  priority = false,
}: SecondaryLogoProps) {
  return (
    <Image
      src={logo}
      alt="Arabia Islamia Secondary Education"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
