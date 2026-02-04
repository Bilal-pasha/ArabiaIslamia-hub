'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { apiClient } from '@/utils/axios-instance';
import { privateRoutes } from '@/constants/route';
import { AdminDashboardLayout } from '@/components/admin-dashboard-layout';

function isSigninPath(pathname: string) {
  return pathname.endsWith('/signin') || pathname.includes('/registration/admin/signin');
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(!isSigninPath(pathname ?? ''));

  useEffect(() => {
    if (!pathname || isSigninPath(pathname)) {
      setChecking(false);
      return;
    }
    apiClient
      .get('/api/auth/me')
      .then(() => setChecking(false))
      .catch(() => {
        const redirect = encodeURIComponent(pathname);
        router.replace(`${privateRoutes.signin}?redirect=${redirect}`);
      });
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-[#1a3254] to-[#256089]">
        <div className="size-10 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
      </div>
    );
  }

  if (pathname && isSigninPath(pathname)) {
    return <>{children}</>;
  }

  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
