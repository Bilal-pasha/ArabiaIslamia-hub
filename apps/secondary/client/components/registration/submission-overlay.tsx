'use client';

import { motion } from 'framer-motion';
import { Spinner } from '@arabiaaislamia/ui';

export function SubmissionOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f2744]/80 backdrop-blur-md"
      aria-live="polite"
      aria-busy="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ type: 'tween', duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mx-4 flex max-w-sm flex-col items-center gap-6 rounded-2xl border border-white/20 bg-[rgba(15,39,68,0.95)] px-8 py-10 shadow-2xl shadow-black/30"
      >
        <div className="relative">
          <Spinner size="lg" className="h-12 w-12 text-orange-400" />
          <span className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-orange-400/20" aria-hidden />
        </div>
        <div className="text-center space-y-1">
          <p className="text-lg font-semibold text-white">Submitting your application</p>
          <p className="text-sm text-slate-400">Please wait while we save your details…</p>
        </div>
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:300ms]" />
        </div>
      </motion.div>
    </motion.div>
  );
}
