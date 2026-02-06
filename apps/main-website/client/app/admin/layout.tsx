'use client';

import { usePathname } from 'next/navigation';
import { AdminDashboardLayout } from '@/components/admin-dashboard-layout';
import { adminRoutes } from '@/constants/route';

function isLoginPath(pathname: string) {
  return pathname === adminRoutes.login || pathname.startsWith(`${adminRoutes.login}/`);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname && isLoginPath(pathname)) {
    return <>{children}</>;
  }

  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
