'use client';

import { usePathname } from 'next/navigation';
import { AdminDashboardLayout } from '@/components/admin-dashboard-layout';

function isSigninPath(pathname: string) {
  return pathname.endsWith('/signin') || pathname.includes('/registration/admin/signin');
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname && isSigninPath(pathname)) {
    return <>{children}</>;
  }

  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
