'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  ImageIcon,
  LayoutList,
} from 'lucide-react';
import { toast } from '@arabiaaislamia/ui';
import { apiClient } from '@/utils/axios-instance';
import { adminRoutes } from '@/constants/route';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

function getPageTitle(pathname: string): string {
  if (!pathname) return 'Dashboard';
  if (pathname === adminRoutes.dashboard || pathname === '/admin') return 'Dashboard';
  if (pathname.startsWith(adminRoutes.hero)) return 'Hero carousel';
  if (pathname.startsWith(adminRoutes.sections)) return 'Sections';
  return 'Admin';
}

export function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    apiClient
      .get<{ data: { user: AuthUser } }>('/api/auth/me')
      .then((res) => setUser(res.data.data.user))
      .catch(() => setUser(null));
  }, []);

  const handleSignOut = async () => {
    try {
      await apiClient.post('/api/auth/logout');
      toast.success('Signed out');
      window.location.href = adminRoutes.login;
    } catch {
      toast.error('Sign out failed');
      window.location.href = adminRoutes.login;
    }
  };

  const isActive = (href: string) => {
    if (href === adminRoutes.dashboard) return pathname === href || pathname === '/admin';
    return pathname?.startsWith(href) ?? false;
  };

  const navItems = [
    { href: adminRoutes.dashboard, label: 'Dashboard', icon: LayoutDashboard },
    { href: adminRoutes.hero, label: 'Hero carousel', icon: ImageIcon },
    { href: adminRoutes.sections, label: 'Sections', icon: LayoutList },
  ];

  const title = getPageTitle(pathname ?? '');

  return (
    <div className="flex min-h-screen w-full min-w-0 overflow-x-hidden bg-gradient-to-br from-amber-50 via-yellow-50/95 to-amber-100/90" style={{ backgroundAttachment: 'fixed' }}>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-amber-200/80 bg-white/80 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-amber-200/80 px-4">
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg border border-amber-200 bg-amber-50">
            <Image src="/images/Logo.png" alt="Logo" width={28} height={28} className="object-contain" />
          </div>
          <span className="font-semibold text-amber-950">CMS Admin</span>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive(href) ? 'bg-amber-200/80 text-amber-950' : 'text-amber-800 hover:bg-amber-100 hover:text-amber-950'}`}
            >
              <Icon className="size-5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-amber-200/80 p-3">
          <div className="mb-2 truncate px-3 py-1.5 text-xs text-amber-700" title={user?.email}>
            {user?.email}
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-100 hover:text-amber-950"
          >
            <LogOut className="size-5 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-amber-950/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-amber-200/80 bg-white shadow-xl transition-transform lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-amber-200/80 px-4">
          <div className="flex items-center gap-3">
            <Image src="/images/Logo.png" alt="Logo" width={28} height={28} className="object-contain" />
            <span className="font-semibold text-amber-950">CMS Admin</span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded p-2 text-amber-700 hover:bg-amber-100 hover:text-amber-950"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive(href) ? 'bg-amber-200/80 text-amber-950' : 'text-amber-800 hover:bg-amber-100 hover:text-amber-950'}`}
            >
              <Icon className="size-5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-amber-200/80 p-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-amber-800 hover:bg-amber-100 hover:text-amber-950"
          >
            <LogOut className="size-5 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-amber-200/80 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded p-2 text-amber-800 hover:bg-amber-100 hover:text-amber-950 lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <h1 className="truncate text-lg font-semibold text-amber-950">{title}</h1>
        </header>
        <main className="min-w-0 flex-1 overflow-auto overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
