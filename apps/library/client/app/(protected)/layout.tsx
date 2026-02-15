'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Spinner } from '@arabiaaislamia/ui';
import { api } from '@/lib/api';
import { useLocale } from '@/lib/locale';
import { LanguageSwitcher } from '@/components/language-switcher';
import { MainLogo } from '@/components/main-logo';
import { BookOpen, LayoutDashboard, BookMarked, ClipboardList, LogOut } from 'lucide-react';

const navItems = [
  { href: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/books', labelKey: 'nav.books', icon: BookMarked },
  { href: '/issues', labelKey: 'nav.issues', icon: ClipboardList },
] as const;

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api
      .get('/api/auth/me')
      .then(() => setReady(true))
      .catch(() => {
        window.location.href = '/login';
      });
  }, []);

  async function handleLogout() {
    await api.post('/api/auth/logout');
    window.location.href = '/login';
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <Spinner className="h-8 w-8 text-primary" />
        <p className="text-muted-foreground text-sm">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-row bg-gradient-to-b from-background to-muted/30">
      {/* RTL: sidebar on the right */}
      <motion.aside
        className="w-60 shrink-0 flex flex-col border-s border-border bg-card/98 shadow-lg shadow-black/5 backdrop-blur"
        initial={{ x: 24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="p-4 border-b border-border">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg p-2 -m-2 text-foreground hover:bg-accent hover:text-primary transition-colors"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <MainLogo width={32} height={32} className="rounded-md object-contain" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="font-semibold text-base leading-tight">{t('app.library')}</span>
              <span className="text-xs text-muted-foreground">Jamia Arabia Islamia</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ href, labelKey, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-white/20' : 'bg-muted/80'}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span>{t(labelKey)}</span>
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-border p-3">
          <LanguageSwitcher />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 rounded-xl border-border hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {t('auth.logout')}
          </Button>
        </div>
      </motion.aside>
      <main className="min-w-0 flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}
