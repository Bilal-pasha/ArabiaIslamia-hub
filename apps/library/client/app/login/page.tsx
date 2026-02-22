'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Input, Label, PasswordInput, Card, CardHeader, CardTitle, CardContent } from '@arabiaaislamia/ui';
import { fadeInUp, staggerContainer, defaultTransition } from '@arabiaaislamia/animations';
import { useLocale } from '@/lib/locale';
import { useLogin } from '@/hooks/use-login';
import { LanguageSwitcher } from '@/components/language-switcher';
import { MainLogo } from '@/components/main-logo';

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useLogin(() => {
    router.push('/');
    router.refresh();
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch {
      setError(t('auth.invalidCredentials'));
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden p-4">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background via-40% to-secondary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(142_76%_26%_/_.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(45_93%_47%_/_.06)_0%,transparent_45%)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='%23000' d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }} />
      </div>
      <motion.div className="absolute top-4 end-4 z-10" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={defaultTransition}>
        <LanguageSwitcher />
      </motion.div>
      <motion.div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8" variants={staggerContainer} initial="hidden" animate="visible" transition={defaultTransition}>
        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center justify-center rounded-2xl border border-primary/15 bg-card/80 p-4 shadow-xl shadow-primary/5 backdrop-blur-sm">
            <MainLogo width={80} height={80} className="rounded-xl" priority />
          </div>
        </motion.div>
        <motion.div variants={fadeInUp} className="w-full">
          <Card className="overflow-hidden border border-border/80 shadow-xl shadow-black/5">
            <CardHeader className="border-b border-border bg-muted/30 pb-4">
              <CardTitle className="text-center text-lg font-medium text-foreground">{t('auth.login')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{t('auth.username')}</Label>
                  <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} dir="rtl" required placeholder={t('auth.usernamePlaceholder')} className="mt-1 transition-colors focus-visible:ring-2" disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} dir="rtl" required placeholder={t('auth.passwordPlaceholder')} className="mt-1 transition-colors focus-visible:ring-2" disabled={loading} />
                </div>
                {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</motion.p>}
                <Button type="submit" disabled={loading} className="mt-2 w-full font-medium shadow-sm">{loading ? '...' : t('auth.login')}</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
