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
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/15 bg-white/5 backdrop-blur-xl py-3 px-3 sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:border-0 sm:bg-transparent sm:p-4 sm:px-0">
      <div className="flex flex-wrap justify-end gap-2 sm:gap-4 sm:px-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={step === 1}
          className="min-w-[90px] sm:min-w-[120px] disabled:opacity-50 text-sm sm:text-base"
        >
          Previous
        </Button>
        {step < 4 ? (
          <Button type="button" onClick={onNext} className="min-w-[90px] sm:min-w-[120px] bg-amber-500 hover:bg-amber-400 text-amber-950 border-0 font-medium text-sm sm:text-base">
            Next
          </Button>
        ) : (
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={onSubmit}
            className="min-w-[120px] sm:min-w-[160px] bg-amber-500 hover:bg-amber-400 text-amber-950 border-0 font-medium text-sm sm:text-base"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        )}
      </div>
    </div>
  );
}
