'use client';

import { STEPS } from '../lib/admission-constants';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full py-8 px-2 sm:px-4" aria-label="Progress">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          {STEPS.map((s, idx) => {
            const isActive = currentStep === s.id;
            const isCompleted = currentStep > s.id;
            const isLast = idx === STEPS.length - 1;
            return (
              <div key={s.id} className="flex flex-1 items-center">
                <button
                  type="button"
                  onClick={() => onStepClick(s.id)}
                  className="cursor-pointer group flex flex-col items-center flex-1"
                >
                  <div
                    className={`
                      flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300
                      ${isCompleted ? 'bg-primary text-primary-foreground shadow-md' : ''}
                      ${isActive ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg scale-110' : ''}
                      ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground group-hover:bg-muted/80' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <svg className="size-5 sm:size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.icon
                    )}
                  </div>
                  <span className={`mt-2 hidden text-xs font-medium sm:block ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {s.title}
                  </span>
                </button>
                {!isLast && (
                  <div className="mx-1 h-0.5 flex-1 min-w-[8px] sm:min-w-[24px]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-primary' : 'bg-muted'}`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-center sm:hidden">
          <span className="text-sm font-medium text-foreground">{STEPS[currentStep - 1]?.title}</span>
          <span className="text-muted-foreground text-xs ml-1">— {STEPS[currentStep - 1]?.subtitle}</span>
        </div>
      </div>
    </div>
  );
}
