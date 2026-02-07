'use client';

import { motion } from 'framer-motion';
import { staggerContainer } from '@arabiaaislamia/animations';
import { FormStepPersonal } from '@/components/form-step-personal';
import { FormStepGuardian } from '@/components/form-step-guardian';
import { FormStepAcademic } from '@/components/form-step-academic';
import { FormStepDocuments } from '@/components/form-step-documents';
import type { AdmissionFormDataWithEmptyEnums } from '@/lib/admission-schema';
import type { DocumentFileKey } from '@/components/form-step-documents';

interface RegistrationStepContentProps {
  stepId: string;
  data: AdmissionFormDataWithEmptyEnums;
  errors: Record<string, string>;
  files: Partial<Record<DocumentFileKey, File | null>>;
  onUpdate: (key: keyof AdmissionFormDataWithEmptyEnums, value: string) => void;
  onFileSelect: (key: DocumentFileKey, file: File | null) => void;
}

export function RegistrationStepContent({
  stepId,
  data,
  errors,
  files,
  onUpdate,
  onFileSelect,
}: RegistrationStepContentProps) {
  return (
    <motion.div
      key={stepId}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-1"
    >
      {stepId === 'personal' && <FormStepPersonal data={data} errors={errors} onUpdate={onUpdate} />}
      {stepId === 'guardian' && <FormStepGuardian data={data} errors={errors} onUpdate={onUpdate} />}
      {stepId === 'academic' && <FormStepAcademic data={data} errors={errors} onUpdate={onUpdate} />}
      {stepId === 'documents' && (
        <FormStepDocuments
          data={data}
          files={files}
          errors={errors}
          onUpdate={onUpdate}
          onFileSelect={onFileSelect}
        />
      )}
    </motion.div>
  );
}
