'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardTitle, Skeleton, toast } from '@arabiaaislamia/ui';
import { Button, Input, Label, PasswordInput } from '@arabiaaislamia/ui';
import { SecondaryLogo } from '@/components/logo';
import { publicRoutes, privateRoutes } from '@/constants/route';
import { apiClient } from '@/utils/axios-instance';

function AdminSigninContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || privateRoutes.applications;
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
    <div className="min-h-screen w-full min-w-0 flex items-center justify-center px-4 py-6 sm:p-6 overflow-x-hidden">
      <div className="w-full max-w-md min-w-0">
        <Card className="secondary-card backdrop-blur-xl border border-white/10 w-full">
          <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
            <div className="flex justify-center mb-6">
              <div className="rounded-xl bg-white/10 border border-white/20 p-3">
                <SecondaryLogo width={72} height={72} className="rounded-lg" />
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl mb-2 text-center text-white">Admin Sign In</CardTitle>
            <p className="text-slate-300 text-sm mb-6 text-center">
              Secondary Admission (Admin Portal)
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="mb-1.5 block text-slate-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="mb-1.5 block text-slate-200">Password</Label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                  toggleClassName="text-slate-400 hover:text-white hover:bg-white/10 focus-visible:ring-white/30"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-300">{error}</p>
              )}
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <p className="mt-4 text-center">
              <Link href={publicRoutes.home} className="text-sm text-orange-300 hover:text-orange-200 hover:underline">
                ← Back to Hub
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SigninFallback() {
  return (
    <div className="min-h-screen w-full min-w-0 flex items-center justify-center px-4 py-6 sm:p-6 overflow-x-hidden">
      <div className="w-full max-w-md min-w-0">
        <Card className="secondary-card backdrop-blur-xl border border-white/10 w-full">
          <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
            <div className="flex justify-center mb-6">
              <Skeleton className="size-20 rounded-lg bg-white/10" />
            </div>
            <Skeleton className="h-7 w-3/4 mx-auto mb-2 bg-white/10" />
            <Skeleton className="h-4 w-1/2 mx-auto mb-6 bg-white/10" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-16 mb-2 bg-white/10" />
                <Skeleton className="h-10 w-full rounded-md bg-white/10" />
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2 bg-white/10" />
                <Skeleton className="h-10 w-full rounded-md bg-white/10" />
              </div>
              <Skeleton className="h-10 w-full rounded-md bg-white/10" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminSigninPage() {
  return (
    <Suspense fallback={<SigninFallback />}>
      <AdminSigninContent />
    </Suspense>
  );
}
