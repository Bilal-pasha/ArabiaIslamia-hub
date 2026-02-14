'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Spinner } from '@arabiaaislamia/ui';
import { api } from '@/lib/api';
import { useLocale } from '@/lib/locale';
import { LanguageSwitcher } from '@/components/language-switcher';
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
    <div className="min-h-screen flex flex-row">
      {/* RTL: sidebar on the right */}
      <motion.aside
        className="w-56 shrink-0 flex flex-col border-s border-border bg-card/95 backdrop-blur shadow-sm"
        initial={{ x: 24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="p-4 border-b border-border">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <BookOpen className="h-7 w-7 text-primary" aria-hidden />
            <span className="font-semibold text-base">{t('app.library')}</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ href, labelKey, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span>{t(labelKey)}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-2">
          <LanguageSwitcher />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {t('auth.logout')}
          </Button>
        </div>
      </motion.aside>
      <main className="flex-1 min-w-0 p-4 md:p-6 overflow-auto">{children}</main>
    </div>
  );
}
