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
      window.location.href = adminRoutes.signin;
    } catch {
      toast.error('Sign out failed');
      window.location.href = adminRoutes.signin;
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
    <div className="flex min-h-screen w-full min-w-0 overflow-x-hidden bg-gradient-to-br from-slate-800 via-[#1a3254] to-[#256089]">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#0f2744]/95 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-white/10">
            <Image src="/images/Logo.png" alt="Logo" width={28} height={28} className="object-contain" />
          </div>
          <span className="font-semibold text-white">CMS Admin</span>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive(href) ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              <Icon className="size-5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <div className="mb-2 truncate px-3 py-1.5 text-xs text-slate-400" title={user?.email}>
            {user?.email}
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-5 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-white/10 bg-[#0f2744] shadow-xl transition-transform lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-3">
            <Image src="/images/Logo.png" alt="Logo" width={28} height={28} className="object-contain" />
            <span className="font-semibold text-white">CMS Admin</span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded p-2 text-slate-400 hover:bg-white/10 hover:text-white"
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
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive(href) ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              <Icon className="size-5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-5 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/10 bg-white/5 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded p-2 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <h1 className="truncate text-lg font-semibold text-white">{title}</h1>
        </header>
        <main className="min-w-0 flex-1 overflow-auto overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
