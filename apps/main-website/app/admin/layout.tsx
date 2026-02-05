'use client';

import { usePathname } from 'next/navigation';
import { AdminDashboardLayout } from '@/components/admin-dashboard-layout';
import { adminRoutes } from '@/constants/route';

function isSigninPath(pathname: string) {
  return (
    pathname === adminRoutes.signin ||
    pathname.includes('/admin/signin')
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname && isSigninPath(pathname)) {
    return <>{children}</>;
  }

  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
