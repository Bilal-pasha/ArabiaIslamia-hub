'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, toast } from '@arabiaaislamia/ui';
import { apiClient } from '@/utils/axios-instance';
import { publicRoutes, privateRoutes } from '@/constants/route';

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid link. Please use the link from your invite email.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post('/api/auth/set-password', { token, newPassword: password });
      toast.success('Password set. You can now sign in.');
      router.push(privateRoutes.signin);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to set password';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-800 via-[#1a3254] to-[#256089]">
        <Card className="secondary-card border border-white/10 max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-red-300 mb-4">{error}</p>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href={privateRoutes.signin}>Go to sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-800 via-[#1a3254] to-[#256089]">
      <Card className="secondary-card border border-white/10 max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-white">Set your password</CardTitle>
          <p className="text-slate-400 text-sm">Choose a password for your admin account.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/20 text-white mt-1.5"
                placeholder="Min 8 characters"
                required
                minLength={8}
              />
            </div>
            <div>
              <Label htmlFor="confirm" className="text-slate-200">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="bg-white/5 border-white/20 text-white mt-1.5"
                placeholder="Confirm password"
                required
                minLength={8}
              />
            </div>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <Button type="submit" disabled={submitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              {submitting ? 'Setting password...' : 'Set password'}
            </Button>
          </form>
          <p className="mt-4 text-center">
            <Link href={privateRoutes.signin} className="text-sm text-slate-400 hover:text-white">
              Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <SetPasswordForm />
    </Suspense>
  );
}
