'use client';

import { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@arabiaaislamia/ui';
import {
  admissionFormSchema,
  validateStep,
  type AdmissionFormData,
} from '../lib/admission-schema';
import { STEPS, INITIAL_FORM_DATA } from '../lib/admission-constants';
import { StepIndicator } from '../components/step-indicator';
import { AdmissionHeader } from '../components/admission-header';
import { InstructionsAlert } from '../components/instructions-alert';
import { AdmissionSuccess } from '../components/admission-success';
import { FormNavigation } from '../components/form-navigation';
import { FormStepPersonal } from '../components/form-step-personal';
import { FormStepGuardian } from '../components/form-step-guardian';
import { FormStepAcademic } from '../components/form-step-academic';
import { FormStepDocuments } from '../components/form-step-documents';

const PERSONAL_FIELDS = ['name', 'fatherName', 'dateOfBirth', 'gender', 'phone', 'email', 'address', 'country'];
const GUARDIAN_FIELDS = ['guardianName', 'guardianRelation', 'guardianPhone'];
const ACADEMIC_FIELDS = ['department', 'requiredClass', 'accommodationType'];

function getErrorStep(fieldErrors: Record<string, string>): number {
  if (Object.keys(fieldErrors).some((k) => PERSONAL_FIELDS.includes(k))) return 1;
  if (Object.keys(fieldErrors).some((k) => GUARDIAN_FIELDS.includes(k))) return 2;
  if (Object.keys(fieldErrors).some((k) => ACADEMIC_FIELDS.includes(k))) return 3;
  return 4;
}

export default function AdmissionFormPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AdmissionFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = useCallback((key: keyof AdmissionFormData, value: string) => {
    setData((d: AdmissionFormData) => ({ ...d, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  const next = () => {
    const result = validateStep(step, data as Record<string, unknown>);
    if (!result.success && result.errors) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, 4));
  };

  const prev = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = admissionFormSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0]?.toString();
        if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      setStep(getErrorStep(fieldErrors));
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return <AdmissionSuccess />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-amber-50/10">
      <AdmissionHeader />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <InstructionsAlert />

        <div className="mb-6 sm:mb-8">
          <StepIndicator currentStep={step} onStepClick={setStep} />
        </div>

        <form onSubmit={handleSubmit} className="pb-24">
          <Card className="overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1),0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30 shadow-lg bg-gray-50 pb-6">
              <CardTitle className="font-serif text-xl sm:text-2xl">
                {STEPS[step - 1]?.title} Information
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-0.5">{STEPS[step - 1]?.subtitle}</p>
            </CardHeader>
            <CardContent className="pt-6 sm:pt-8">
              {step === 1 && <FormStepPersonal data={data} errors={errors} onUpdate={update} />}
              {step === 2 && <FormStepGuardian data={data} errors={errors} onUpdate={update} />}
              {step === 3 && <FormStepAcademic data={data} errors={errors} onUpdate={update} />}
              {step === 4 && <FormStepDocuments data={data} onUpdate={update} />}
            </CardContent>
            <FormNavigation
              step={step}
              isSubmitting={isSubmitting}
              onPrev={prev}
              onNext={next}
            />
          </Card>

        </form>
      </main>
    </div>
  );
}
