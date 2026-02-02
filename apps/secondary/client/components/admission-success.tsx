'use client';

import { motion } from 'framer-motion';
import { SecondaryLogo, Card, CardContent } from '@arabiaaislamia/ui';
import { scaleIn, defaultTransition } from '@arabiaaislamia/animations';

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
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20 flex items-center justify-center p-4 sm:p-6"
    >
      <Card className="max-w-lg w-full overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12),0_4px_12px_-4px_rgba(0,0,0,0.08)] bg-card/95 backdrop-blur">
        <div className="bg-gradient-to-r from-[#0f2744] to-[#1e4a6f] px-6 py-8 text-center">
          <SecondaryLogo width={80} height={80} className="mx-auto mb-4 rounded-lg" />
          <div className="inline-flex items-center justify-center size-14 rounded-full bg-primary/20 text-primary border-2 border-primary/40">
            <svg className="size-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <CardContent className="pt-8 pb-8">
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground mb-2">Application Submitted</h1>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            Thank you for applying. You will receive a confirmation shortly. Keep your application number safe.
          </p>
          <p className="text-sm font-mono font-medium text-primary bg-primary/10 py-2 px-4 rounded-lg inline-block">
            #{applicationNumber}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
