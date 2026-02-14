'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SecondaryLogo } from '@/components/logo';
import { Card, CardContent, Button } from '@arabiaaislamia/ui';
import { scaleIn, defaultTransition } from '@arabiaaislamia/animations';
import { publicRoutes } from '@/constants/route';

interface AdmissionSuccessProps {
  applicationNumber: string;
}

export function AdmissionSuccess({ applicationNumber }: AdmissionSuccessProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      transition={defaultTransition}
      className="min-h-screen w-full min-w-0 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden"
    >
      <Card className="secondary-card max-w-lg w-full min-w-0 overflow-hidden backdrop-blur-xl border border-white/10">
        <div className="bg-gradient-to-r from-[#0f2744] to-[#1e4a6f] px-6 py-8 text-center border-b border-white/10">
          <SecondaryLogo width={80} height={80} className="mx-auto mb-4 rounded-lg" />
          <div className="inline-flex items-center justify-center size-14 rounded-full bg-amber-500/30 text-amber-200 border-2 border-amber-400/50">
            <svg className="size-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <CardContent className="pt-8 pb-8">
          <h1 className="font-serif text-2xl sm:text-3xl text-white mb-2">Application Submitted</h1>
          <p className="text-slate-300 mb-6 text-sm sm:text-base">
            Thank you for applying. You will receive a confirmation shortly. Keep your application number safe.
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-mono font-medium text-amber-200 bg-amber-500/20 py-2 px-4 rounded-lg inline-block border border-amber-400/30 mb-6">
              #{applicationNumber}
            </p>
            <Button asChild className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-amber-950 font-medium">
              <Link href={publicRoutes.home}>Back to home</Link>
            </Button>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
