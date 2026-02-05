'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        'rounded-lg px-4 py-2 text-base font-semibold text-foreground transition-colors hover:text-primary',
        isActive && 'text-primary',
        className
      )}
    >
      {children}
    </Link>
  );
}
