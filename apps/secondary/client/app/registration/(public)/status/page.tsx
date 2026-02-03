'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { publicRoutes } from '@/constants/route';
import { SecondaryLogo, Button, Input, Label, Card, CardContent, CardTitle } from '@arabiaaislamia/ui';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { findByApplicationNumber } from '@/services/admission/admission.service';
import { MyApplicationView } from '@/components/my-application-view';
import type { AdmissionApplication } from '@/services/admission/admission.service';

export default function AdmissionStatusPage() {
  const [applicationNumber, setApplicationNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'not-found'>('idle');
  const [application, setApplication] = useState<AdmissionApplication | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    setApplication(null);
    try {
      const app = await findByApplicationNumber(applicationNumber.trim());
      if (app) {
        setApplication(app);
        setStatus('found');
      } else {
        setStatus('not-found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('not-found');
    }
  };

  if (status === 'found' && application) {
    return (
      <motion.div
        key="result"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={defaultTransition}
        className="min-h-screen p-6"
      >
        <div className="mx-auto max-w-2xl">
          <MyApplicationView application={application} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="form"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md">
        <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white hover:bg-white/10 mb-6">
          <Link href={publicRoutes.form} className="gap-2 inline-flex items-center text-sm font-medium">
            <svg className="size-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Admission Form
          </Link>
        </Button>
        <Card className="secondary-card backdrop-blur-xl border border-white/20 shadow-xl">
          <CardContent className="pt-8 pb-8 px-6 sm:px-8">
            <div className="flex justify-center mb-6">
              <div className="rounded-xl bg-white/10 border border-white/20 p-3">
                <SecondaryLogo width={72} height={72} className="rounded-lg" />
              </div>
            </div>
            <CardTitle className="font-serif text-2xl sm:text-3xl font-semibold text-center text-white mb-2">
              Check Admission Status
            </CardTitle>
            <p className="text-slate-300 text-sm text-center mb-6">
              Enter your application number to view your admission status.
            </p>
            <form onSubmit={handleCheck} className="space-y-5">
              <div>
                <Label htmlFor="app-id" className="mb-2 block text-slate-300 font-medium">
                  Application Number
                </Label>
                <Input
                  id="app-id"
                  type="text"
                  value={applicationNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApplicationNumber(e.target.value)}
                  placeholder="e.g. ARB-XXXXXX"
                  required
                  className="h-11 bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus-visible:ring-white/30"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-orange-500 hover:bg-orange-400 text-white font-medium"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Checking...' : 'Check Status'}
              </Button>
            </form>
            <AnimatePresence mode="wait">
              {(status === 'not-found' || error) && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-sm text-red-200 rounded-lg bg-red-500/10 border border-red-400/30 px-3 py-2"
                >
                  {error ?? 'No application found with this number. Please verify and try again.'}
                </motion.p>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
