'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showUrdu?: boolean;
}

export function Logo({ className = '', showUrdu = false }: LogoProps) {
  return (
    <Link href="/" className={`flex flex-col items-center ${className}`}>
      <Image
        src="/images/Logo.png"
        alt="Jamia Arabia Islamia"
        width={120}
        height={60}
        className="h-auto w-full max-w-[120px] object-contain"
        priority
      />
      {showUrdu && (
        <p className="urdutext mt-1 text-center text-lg text-inherit">
          جامعہ عربیہ اسلامیہ <span className="text-xs">اسکاؤٹ کالونی</span>
        </p>
      )}
    </Link>
  );
}
