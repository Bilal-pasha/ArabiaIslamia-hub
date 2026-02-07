'use client';

import { useState, useCallback, useRef } from 'react';
import {
  admissionFormSchema,
  validateStep,
  type AdmissionFormDataWithEmptyEnums,
} from '@/lib/admission-schema';
import { INITIAL_FORM_DATA } from '@/lib/admission-constants';
import { registrationStepper, indexToStepId } from '@/lib/registration-stepper';
import { submitAdmission } from '@/services/admission/admission.service';
import { getPresignedUrl, uploadToPresignedUrl } from '@/services/upload/upload.service';
import { toast } from '@arabiaaislamia/ui';
import type { DocumentFileKey } from '@/components/form-step-documents';

const DOCUMENT_KEYS: DocumentFileKey[] = ['photoFile', 'idFile', 'authorityLetterFile', 'previousResultFile'];
const PERSONAL_FIELDS = ['name', 'fatherName', 'dateOfBirth', 'gender', 'phone', 'email', 'address', 'country', 'state', 'city', 'area', 'language'];
const GUARDIAN_FIELDS = ['guardianName', 'guardianRelation', 'guardianPhone'];
const ACADEMIC_FIELDS = ['requiredClassId', 'accommodationType'];
const DOCUMENT_FIELDS = ['photoFile', 'idFile'];

function getErrorStep(fieldErrors: Record<string, string>): number {
  if (Object.keys(fieldErrors).some((k) => PERSONAL_FIELDS.includes(k))) return 1;
  if (Object.keys(fieldErrors).some((k) => GUARDIAN_FIELDS.includes(k))) return 2;
  if (Object.keys(fieldErrors).some((k) => ACADEMIC_FIELDS.includes(k))) return 3;
  if (Object.keys(fieldErrors).some((k) => DOCUMENT_FIELDS.includes(k))) return 4;
  return 4;
}

export function useRegistrationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const stepper = registrationStepper.useStepper();
  const stepIndex = stepper.state.current.index + 1;
  const stepId = stepper.state.current.data.id;

  const [data, setData] = useState<AdmissionFormDataWithEmptyEnums>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState<string>('');
  const [files, setFiles] = useState<Partial<Record<DocumentFileKey, File | null>>>({});

  const update = useCallback((key: keyof AdmissionFormDataWithEmptyEnums, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  const onFileSelect = useCallback((key: DocumentFileKey, file: File | null) => {
    setFiles((f) => ({ ...f, [key]: file }));
  }, []);

  const next = useCallback(() => {
    const result = validateStep(stepIndex, data as Record<string, unknown>);
    if (!result.success && result.errors) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    stepper.navigation.next();
  }, [stepIndex, data, stepper]);

  const prev = useCallback(() => {
    setErrors({});
    stepper.navigation.prev();
  }, [stepper]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const result = admissionFormSchema.safeParse(data);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const path = issue.path[0]?.toString();
          if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
        }
        setErrors(fieldErrors);
        stepper.navigation.goTo(indexToStepId(getErrorStep(fieldErrors)));
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
        toast.success('Application submitted successfully. Save your application number.');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
        setErrors({ _form: msg });
        stepper.navigation.goTo('documents');
        toast.error(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [data, files, stepper]
  );

  const requestSubmit = useCallback(() => {
    formRef.current?.requestSubmit();
  }, []);

  return {
    formRef,
    step: stepIndex,
    stepId,
    stepper,
    data,
    errors,
    files,
    isSubmitting,
    submitted,
    applicationNumber,
    update,
    onFileSelect,
    next,
    prev,
    handleSubmit,
    requestSubmit,
  };
}
