'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardTitle, Skeleton, toast } from '@arabiaaislamia/ui';
import { Button, Input, Label, PasswordInput } from '@arabiaaislamia/ui';
import { adminRoutes, publicRoutes } from '@/constants/route';
import { apiClient } from '@/utils/axios-instance';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || adminRoutes.dashboard;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiClient.post('/api/auth/login', { email, password });
      toast.success('Signed in successfully');
      router.push(redirect);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full min-w-0 items-center justify-center overflow-x-hidden bg-gradient-to-br from-amber-50 via-yellow-50/95 to-amber-100/90 px-4 py-6 sm:p-6" style={{ backgroundAttachment: 'fixed' }}>
      <div className="w-full min-w-0 max-w-md">
        <Card className="w-full border border-amber-200/80 bg-white/95 shadow-lg shadow-amber-900/5 backdrop-blur-sm">
          <CardContent className="px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8">
            <div className="mb-6 flex justify-center">
              <Image
                src="/images/Logo.png"
                alt="Jamia Arabia Islamia"
                width={80}
                height={40}
                className="h-auto w-24 object-contain"
              />
            </div>
            <CardTitle className="mb-2 text-center text-xl text-amber-950 sm:text-2xl">
              CMS Admin Login
            </CardTitle>
            <p className="mb-6 text-center text-sm text-amber-700">
              Main website content management
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="mb-1.5 block text-amber-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 border-amber-200 bg-white text-amber-950 placeholder:text-amber-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="mb-1.5 block text-amber-900">
                  Password
                </Label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 border-amber-200 bg-white text-amber-950 placeholder:text-amber-500"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Log in'}
              </Button>
            </form>
            <p className="mt-4 text-center">
              <Link
                href={publicRoutes.home}
                className="text-sm text-primary hover:underline"
              >
                ← Back to website
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="flex min-h-screen w-full min-w-0 items-center justify-center overflow-x-hidden bg-gradient-to-br from-amber-50 via-yellow-50/95 to-amber-100/90 px-4 py-6 sm:p-6" style={{ backgroundAttachment: 'fixed' }}>
      <div className="w-full min-w-0 max-w-md">
        <Card className="w-full border border-amber-200/80 bg-white/95 shadow-lg">
          <CardContent className="px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8">
            <div className="mb-6 flex justify-center">
              <Skeleton className="size-20 rounded-lg bg-amber-200/50" />
            </div>
            <Skeleton className="mx-auto mb-2 h-7 w-3/4 bg-amber-200/50" />
            <Skeleton className="mx-auto mb-6 h-4 w-1/2 bg-amber-200/50" />
            <div className="space-y-4">
              <div>
                <Skeleton className="mb-2 h-4 w-16 bg-amber-200/50" />
                <Skeleton className="h-10 w-full rounded-md bg-amber-200/50" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-20 bg-amber-200/50" />
                <Skeleton className="h-10 w-full rounded-md bg-amber-200/50" />
              </div>
              <Skeleton className="h-10 w-full rounded-md bg-amber-200/50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginContent />
    </Suspense>
  );
}
