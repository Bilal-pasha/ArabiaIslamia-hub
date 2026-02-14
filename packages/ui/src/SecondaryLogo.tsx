'use client';

import Image from 'next/image';
import Link from 'next/link';
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
  const secondaryAppUrl = process.env.NEXT_PUBLIC_SECONDARY_APP_URL;
  return (
    <Link href={secondaryAppUrl ?? ''} title="Arabia Islamia Secondary Education Logo" aria-label="Arabia Islamia Secondary Education Logo" className='cursor-pointer'>
      <Image
        src={logo}
        alt="Arabia Islamia Secondary Education Logo"
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    </Link>
  );
}
