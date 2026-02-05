'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@arabiaaislamia/ui';
import { STEPS } from '@/lib/admission-constants';
import { FormNavigation } from '@/components/form-navigation';
import { FormErrorAlert } from './form-error-alert';
import { RegistrationStepContent } from './registration-step-content';
import type { AdmissionFormDataWithEmptyEnums } from '@/lib/admission-schema';
import type { DocumentFileKey } from '@/components/form-step-documents';

interface RegistrationFormCardProps {
  step: number;
  data: AdmissionFormDataWithEmptyEnums;
  errors: Record<string, string>;
  files: Partial<Record<DocumentFileKey, File | null>>;
  isSubmitting: boolean;
  onUpdate: (key: keyof AdmissionFormDataWithEmptyEnums, value: string) => void;
  onFileSelect: (key: DocumentFileKey, file: File | null) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function RegistrationFormCard({
  step,
  data,
  errors,
  files,
  isSubmitting,
  onUpdate,
  onFileSelect,
  onPrev,
  onNext,
  onSubmit,
}: RegistrationFormCardProps) {
  return (
    <Card className="secondary-card overflow-hidden backdrop-blur-xl border border-white/20 w-full min-w-0">
      <CardHeader className="border-b border-white/15 bg-white/5 pb-6">
        <CardTitle className="text-xl sm:text-2xl font-semibold text-white">
          {STEPS[step - 1]?.title} Information
        </CardTitle>
        <p className="text-slate-300 text-sm mt-0.5">{STEPS[step - 1]?.subtitle}</p>
      </CardHeader>
      <CardContent className="pt-6 sm:pt-8">
        {errors._form && <FormErrorAlert message={errors._form} />}
        <RegistrationStepContent
          step={step}
          data={data}
          errors={errors}
          files={files}
          onUpdate={onUpdate}
          onFileSelect={onFileSelect}
        />
      </CardContent>
      <FormNavigation
        step={step}
        isSubmitting={isSubmitting}
        onPrev={onPrev}
        onNext={onNext}
        onSubmit={onSubmit}
      />
    </Card>
  );
}
