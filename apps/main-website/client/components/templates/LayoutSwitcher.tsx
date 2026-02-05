'use client';

import { usePathname } from 'next/navigation';
import { MainLayout } from './MainLayout';

export function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;
  if (isAdmin) return <>{children}</>;
  return <MainLayout>{children}</MainLayout>;
}
