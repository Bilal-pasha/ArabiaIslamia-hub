'use client';

import { Button } from '@arabiaaislamia/ui';

interface FormNavigationProps {
  step: number;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit?: () => void;
}

export function FormNavigation({ step, isSubmitting, onPrev, onNext, onSubmit }: FormNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/15 bg-white/5 backdrop-blur-xl py-4 px-4 sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:border-0 sm:bg-transparent sm:py-6 sm:px-0">
      <div className="flex justify-end px-4 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={step === 1}
          className="min-w-[100px] sm:min-w-[120px] border-white/25 text-white hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:text-slate-500"
        >
          Previous
        </Button>
        {step < 4 ? (
          <Button type="button" onClick={onNext} className="min-w-[100px] sm:min-w-[120px] bg-orange-500 hover:bg-orange-400 text-white border-0 font-medium">
            Next
          </Button>
        ) : (
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={onSubmit}
            className="min-w-[140px] sm:min-w-[160px] bg-orange-500 hover:bg-orange-400 text-white border-0 font-medium"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        )}
      </div>
    </div>
  );
}
