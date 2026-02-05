'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ClipboardList,
  Users,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import { Button, SecondaryLogo } from '@arabiaaislamia/ui';
import { apiClient } from '@/utils/axios-instance';
import { publicRoutes, privateRoutes } from '@/constants/route';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

function getPageTitle(pathname: string): string {
  if (!pathname) return 'Dashboard';
  if (pathname === privateRoutes.dashboard || pathname === '/registration/admin') return 'Dashboard';
  if (pathname.startsWith(privateRoutes.users)) return 'Users';
  if (pathname === privateRoutes.applications) return 'Applications';
  if (pathname.match(/\/applications\/[^/]+$/)) return 'Application detail';
  if (pathname === privateRoutes.students) return 'Students';
  if (pathname.match(/\/students\/[^/]+$/)) return 'Student detail';
  return 'Admin';
}

export function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
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
      window.location.href = privateRoutes.signin;
    } catch {
      window.location.href = privateRoutes.signin;
    }
  };

  const isActive = (href: string) => {
    if (href === privateRoutes.dashboard) return pathname === href || pathname === '/registration/admin';
    return pathname.startsWith(href);
  };

  const navItems = [
    { href: privateRoutes.dashboard, label: 'Dashboard', icon: LayoutDashboard },
    { href: privateRoutes.applications, label: 'Applications', icon: ClipboardList },
    { href: privateRoutes.students, label: 'Students', icon: GraduationCap },
    ...(user?.role === 'superadmin'
      ? [{ href: privateRoutes.users, label: 'Users', icon: Users }]
      : []),
  ];

  const title = getPageTitle(pathname ?? '');

  return (
    <div className="flex min-h-screen w-full min-w-0 overflow-x-hidden bg-gradient-to-br from-slate-800 via-[#1a3254] to-[#256089]">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/10 bg-[#0f2744]/95 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-white/10 border border-white/20">
            <SecondaryLogo width={28} height={28} className="rounded" />
          </div>
          <span className="font-semibold text-white">Admin</span>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive(href)
                ? 'bg-white/15 text-white'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              <Icon className="size-5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <div className="mb-2 px-3 py-1.5 text-xs text-slate-400 truncate" title={user?.email}>
            {user?.email}
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="size-5 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar - mobile */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 flex-col border-r border-white/10 bg-[#0f2744] shadow-xl transition-transform lg:hidden flex ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-3">
            <SecondaryLogo width={28} height={28} className="rounded" />
            <span className="font-semibold text-white">Admin</span>
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
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive(href)
                ? 'bg-white/15 text-white'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
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

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/10 bg-white/5 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded p-2 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <h1 className="text-lg font-semibold text-white truncate">{title}</h1>
        </header>
        <main className="flex-1 overflow-auto overflow-x-hidden p-4 sm:p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}
