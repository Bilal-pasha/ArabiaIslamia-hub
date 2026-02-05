'use client';

import { useState, useCallback, useRef } from 'react';
import {
  admissionFormSchema,
  validateStep,
  type AdmissionFormDataWithEmptyEnums,
} from '@/lib/admission-schema';
import { INITIAL_FORM_DATA } from '@/lib/admission-constants';
import { submitAdmission } from '@/services/admission/admission.service';
import { getPresignedUrl, uploadToPresignedUrl } from '@/services/upload/upload.service';
import type { DocumentFileKey } from '@/components/form-step-documents';

const DOCUMENT_KEYS: DocumentFileKey[] = ['photoFile', 'idFile', 'authorityLetterFile', 'previousResultFile'];
const PERSONAL_FIELDS = ['name', 'fatherName', 'dateOfBirth', 'gender', 'phone', 'email', 'address', 'country', 'state', 'city', 'area', 'language'];
const GUARDIAN_FIELDS = ['guardianName', 'guardianRelation', 'guardianPhone'];
const ACADEMIC_FIELDS = ['requiredClass', 'accommodationType'];

function getErrorStep(fieldErrors: Record<string, string>): number {
  if (Object.keys(fieldErrors).some((k) => PERSONAL_FIELDS.includes(k))) return 1;
  if (Object.keys(fieldErrors).some((k) => GUARDIAN_FIELDS.includes(k))) return 2;
  if (Object.keys(fieldErrors).some((k) => ACADEMIC_FIELDS.includes(k))) return 3;
  return 4;
}

export function useRegistrationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
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
    const result = validateStep(step, data as Record<string, unknown>);
    if (!result.success && result.errors) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, 4));
  }, [step, data]);

  const prev = useCallback(() => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }, []);

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
    },
    [data, files]
  );

  const requestSubmit = useCallback(() => {
    formRef.current?.requestSubmit();
  }, []);

  return {
    formRef,
    step,
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
