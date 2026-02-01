'use client';

import { FormField } from './form-field';
import type { AdmissionFormData } from '../lib/admission-schema';

const DOCUMENT_FIELDS = [
  { key: 'photoFile' as const, label: 'Photograph', accept: 'image/*' },
  { key: 'idFile' as const, label: 'Passport / ID', accept: 'image/*,.pdf' },
  { key: 'authorityLetterFile' as const, label: 'Authority Letter', accept: 'image/*,.pdf' },
  { key: 'previousResultFile' as const, label: 'Previous Result', accept: 'image/*,.pdf' },
];

interface FormStepDocumentsProps {
  data: AdmissionFormData;
  onUpdate: (key: keyof AdmissionFormData, value: string) => void;
}

export function FormStepDocuments({ data, onUpdate }: FormStepDocumentsProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-6">
        1. Photo &nbsp; 2. Passport/ID &nbsp; 3. Authority Letter &nbsp; 4. Previous Result
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {DOCUMENT_FIELDS.map(({ key, label, accept }) => (
          <FormField key={key} label={label}>
            <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-input rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group">
              <input
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => onUpdate(key, e.target.files?.[0]?.name ?? '')}
              />
              <svg
                className="size-10 text-muted-foreground mb-2 group-hover:text-primary transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span className="text-sm text-muted-foreground group-hover:text-foreground">
                {data[key] || 'Click to upload'}
              </span>
            </label>
          </FormField>
        ))}
      </div>
    </div>
  );
}
