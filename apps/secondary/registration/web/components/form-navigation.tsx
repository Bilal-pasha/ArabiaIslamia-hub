'use client';

import { Button } from '@arabiaaislamia/ui';

interface FormNavigationProps {
  step: number;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function FormNavigation({ step, isSubmitting, onPrev, onNext }: FormNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 py-4 px-4 sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:border-0 sm:bg-transparent sm:py-6 sm:px-0">
      <div className="flex justify-end px-4 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={step === 1}
          className="min-w-[100px] sm:min-w-[120px]"
        >
          Previous
        </Button>
        {step < 4 ? (
          <Button type="button" onClick={onNext} className="min-w-[100px] sm:min-w-[120px]">
            Next
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting} className="min-w-[140px] sm:min-w-[160px]">
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        )}
      </div>
    </div>
  );
}
