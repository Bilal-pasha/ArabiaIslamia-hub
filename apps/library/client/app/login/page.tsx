'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardContent } from '@arabiaaislamia/ui';
import { fadeInUp, staggerContainer, defaultTransition } from '@arabiaaislamia/animations';
import { useLocale } from '@/lib/locale';
import { api } from '@/lib/api';
import { LanguageSwitcher } from '@/components/language-switcher';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/login', { username, password });
      router.push('/');
      router.refresh();
    } catch {
      setError(t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <motion.div
        className="absolute top-4 end-4"
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={defaultTransition}
      >
        <LanguageSwitcher />
      </motion.div>
      <motion.div
        className="w-full max-w-sm"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        transition={defaultTransition}
      >
        <motion.div variants={fadeInUp}>
          <Card className="shadow-lg border-primary/10 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-border">
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="h-8 w-8 text-primary" aria-hidden />
                <CardTitle className="text-center text-xl urdutext">{t('app.library')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{t('auth.username')}</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    dir="auto"
                    required
                    className="mt-1"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1"
                    disabled={loading}
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
                <Button type="submit" disabled={loading} className="w-full mt-2">
                  {loading ? '...' : t('auth.login')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
