'use client';

import { useState } from 'react';
import Link from 'next/link';
import { publicRoutes } from '../../constants/route';
import { SecondaryLogo, Button, Input, Label, Card, CardHeader, CardTitle, CardContent } from '@arabiaaislamia/ui';

export default function AdmissionStatusPage() {
  const [applicationId, setApplicationId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'not-found'>('idle');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 800));
    setStatus('not-found');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-accent/30 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button variant="ghost" size="sm" asChild>
          <Link href={publicRoutes.form} className="gap-2 inline-flex items-center mb-8">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Admission Form
          </Link>
        </Button>
        <Card>
          <CardContent className="pt-8">
            <div className="flex justify-center mb-6">
              <SecondaryLogo width={80} height={80} />
            </div>
            <CardTitle className="font-serif text-2xl mb-2 text-center">Check Admission Status</CardTitle>
            <p className="text-muted-foreground text-sm mb-6 text-center">
              Enter your application number to view your admission status.
            </p>
            <form onSubmit={handleCheck} className="space-y-4">
              <div>
                <Label htmlFor="app-id" className="mb-1.5 block">Application Number</Label>
                <Input
                  id="app-id"
                  type="text"
                  value={applicationId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApplicationId(e.target.value)}
                  placeholder="e.g. ARB-XXXXXX"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={status === 'loading'}>
                {status === 'loading' ? 'Checking...' : 'Check Status'}
              </Button>
            </form>
            {status === 'not-found' && (
              <p className="mt-4 text-sm text-destructive">
                No application found with this number. Please verify and try again.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
