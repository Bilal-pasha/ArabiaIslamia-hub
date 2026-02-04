'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Spinner } from '@arabiaaislamia/ui';
import { fadeInUp, staggerContainer, defaultTransition } from '@arabiaaislamia/animations';
import {
  admissionFormSchema,
  validateStep,
  type AdmissionFormDataWithEmptyEnums,
} from '@/lib/admission-schema';
import { STEPS, INITIAL_FORM_DATA } from '@/lib/admission-constants';
import { StepIndicator } from '@/components/step-indicator';
import { AdmissionHeader } from '@/components/admission-header';
import { InstructionsAlert } from '@/components/instructions-alert';
import { AdmissionSuccess } from '@/components/admission-success';
import { FormNavigation } from '@/components/form-navigation';
import { FormStepPersonal } from '@/components/form-step-personal';
import { FormStepGuardian } from '@/components/form-step-guardian';
import { FormStepAcademic } from '@/components/form-step-academic';
import { FormStepDocuments } from '@/components/form-step-documents';
import { submitAdmission } from '@/services/admission/admission.service';
import { getPresignedUrl, uploadToPresignedUrl } from '@/services/upload/upload.service';
import type { DocumentFileKey } from '@/components/form-step-documents';

const DOCUMENT_KEYS: DocumentFileKey[] = ['photoFile', 'idFile', 'authorityLetterFile', 'previousResultFile'];

const PERSONAL_FIELDS = ['name', 'fatherName', 'dateOfBirth', 'gender', 'phone', 'email', 'address', 'country'];
const GUARDIAN_FIELDS = ['guardianName', 'guardianRelation', 'guardianPhone'];
const ACADEMIC_FIELDS = ['requiredClass', 'accommodationType'];

function getErrorStep(fieldErrors: Record<string, string>): number {
  if (Object.keys(fieldErrors).some((k) => PERSONAL_FIELDS.includes(k))) return 1;
  if (Object.keys(fieldErrors).some((k) => GUARDIAN_FIELDS.includes(k))) return 2;
  if (Object.keys(fieldErrors).some((k) => ACADEMIC_FIELDS.includes(k))) return 3;
  return 4;
}

export default function AdmissionFormPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AdmissionFormDataWithEmptyEnums>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState<string>('');
  const [files, setFiles] = useState<Partial<Record<DocumentFileKey, File | null>>>({});

  const update = useCallback((key: keyof AdmissionFormDataWithEmptyEnums, value: string) => {
    setData((d: AdmissionFormDataWithEmptyEnums) => ({ ...d, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  const onFileSelect = useCallback((key: DocumentFileKey, file: File | null) => {
    setFiles((f) => ({ ...f, [key]: file }));
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
    try {
      const submitData = { ...result.data };
      for (const key of DOCUMENT_KEYS) {
        const file = files[key];
        if (file) {
          try {
            const { url, key: r2Key } = await getPresignedUrl(key, file.name, file.type);
            await uploadToPresignedUrl(url, file);
            submitData[key] = r2Key;
          } catch {
            submitData[key] = file.name;
          }
        }
      }
      const { applicationNumber: appNum } = await submitAdmission(submitData);
      setApplicationNumber(appNum);
      setSubmitted(true);
    } catch (err) {
      setErrors({ _form: err instanceof Error ? err.message : 'Submission failed. Please try again.' });
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return <AdmissionSuccess applicationNumber={applicationNumber} />;
  }

  return (
    <>
      <AnimatePresence>
        {isSubmitting && (
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
        )}
      </AnimatePresence>
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      className="min-h-screen w-full min-w-0 overflow-x-hidden"
    >
      <AdmissionHeader />

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 max-w-4xl w-full min-w-0">
        <InstructionsAlert />

        <div className="mb-6 sm:mb-8">
          <StepIndicator currentStep={step} />
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="pb-24 sm:pb-8">
          <Card className="secondary-card overflow-hidden backdrop-blur-xl border border-white/20 w-full min-w-0">
            <CardHeader className="border-b border-white/15 bg-white/5 pb-6">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-white">
                {STEPS[step - 1]?.title} Information
              </CardTitle>
              <p className="text-slate-300 text-sm mt-0.5">{STEPS[step - 1]?.subtitle}</p>
            </CardHeader>
            <CardContent className="pt-6 sm:pt-8">
              <AnimatePresence mode="wait">
                {errors._form && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 rounded-lg border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  >
                    {errors._form}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                key={step}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-1"
              >
                {step === 1 && <FormStepPersonal data={data} errors={errors} onUpdate={update} />}
                {step === 2 && <FormStepGuardian data={data} errors={errors} onUpdate={update} />}
                {step === 3 && <FormStepAcademic data={data} errors={errors} onUpdate={update} />}
                {step === 4 && <FormStepDocuments data={data} files={files} onUpdate={update} onFileSelect={onFileSelect} />}
              </motion.div>
            </CardContent>
            <FormNavigation
              step={step}
              isSubmitting={isSubmitting}
              onPrev={prev}
              onNext={next}
              onSubmit={() => formRef.current?.requestSubmit()}
            />
          </Card>

        </form>
      </main>
    </motion.div>
    </>
  );
}
