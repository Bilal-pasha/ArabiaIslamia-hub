'use client';

import { STEPS } from '@/lib/admission-constants';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full py-6 sm:py-8 px-2 sm:px-4" aria-label="Progress">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          {STEPS.map((s, idx) => {
            const isActive = currentStep === s.id;
            const isCompleted = currentStep > s.id;
            const isLast = idx === STEPS.length - 1;
            return (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center flex-1 select-none">
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={`
                      flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold
                      ${isCompleted ? 'bg-primary text-primary-foreground shadow-sm' : ''}
                      ${isActive ? 'bg-primary text-primary-foreground shadow-md ring-4 ring-primary/25' : ''}
                      ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.icon
                    )}
                  </motion.div>
                  <span className={`mt-2 hidden text-xs font-medium sm:block ${isActive ? 'text-orange-200' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                </div>
                {!isLast && (
                  <div className="mx-1 h-0.5 flex-1 min-w-[12px] sm:min-w-[20px] bg-white/25 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={false}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-center sm:hidden">
          <span className="text-sm font-medium text-white">{STEPS[currentStep - 1]?.title}</span>
          <span className="text-slate-300 text-xs ml-1">— {STEPS[currentStep - 1]?.subtitle}</span>
        </div>
      </div>
    </div>
  );
}
