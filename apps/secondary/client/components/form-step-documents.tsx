'use client';

import { useRef } from 'react';
import { FormField } from './form-field';
import { motion, AnimatePresence } from 'framer-motion';
import type { AdmissionFormData } from '@/lib/admission-schema';

const DOCUMENT_FIELDS = [
  { key: 'photoFile' as const, label: 'Photograph', accept: 'image/*' },
  { key: 'idFile' as const, label: 'Passport / ID', accept: 'image/*,.pdf' },
  { key: 'authorityLetterFile' as const, label: 'Authority Letter', accept: 'image/*,.pdf' },
  { key: 'previousResultFile' as const, label: 'Previous Result', accept: 'image/*,.pdf' },
];

const DOCUMENT_KEYS = ['photoFile', 'idFile', 'authorityLetterFile', 'previousResultFile'] as const;

export type DocumentFileKey = (typeof DOCUMENT_KEYS)[number];

interface FormStepDocumentsProps {
  data: AdmissionFormData;
  files: Partial<Record<DocumentFileKey, File | null>>;
  onUpdate: (key: keyof AdmissionFormData, value: string) => void;
  onFileSelect: (key: DocumentFileKey, file: File | null) => void;
}

export function FormStepDocuments({ data, files, onUpdate, onFileSelect }: FormStepDocumentsProps) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        1. Photo &nbsp; 2. Passport/ID &nbsp; 3. Authority Letter &nbsp; 4. Previous Result
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {DOCUMENT_FIELDS.map(({ key, label, accept }) => {
          const hasFile = !!data[key];
          return (
            <FormField key={key} label={label}>
              <div className="relative">
                <label
                  className={`
                    flex flex-col items-center justify-center w-full min-h-[120px] sm:min-h-[140px] rounded-xl border-2 border-dashed transition-all duration-200
                    ${hasFile
                      ? 'border-primary/50 bg-primary/5 cursor-default'
                      : 'border-input hover:border-primary/50 hover:bg-primary/5 cursor-pointer group'
                    }
                  `}
                >
                  <input
                    ref={(el) => { inputRefs.current[key] = el; }}
                    type="file"
                    accept={accept}
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      onFileSelect(key, file);
                      onUpdate(key, file ? file.name : '');
                    }}
                  />
                  {hasFile ? (
                    <div className="flex flex-col items-center gap-2 px-4 text-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary/15">
                        <svg className="size-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-foreground break-all line-clamp-2" title={data[key]!}>
                        {data[key]}
                      </span>
                      <span className="text-xs text-muted-foreground">Click to replace</span>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="size-10 text-muted-foreground mb-2 group-hover:text-primary transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground">Click to upload</span>
                    </>
                  )}
                </label>
                <AnimatePresence>
                  {hasFile && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={(e) => {
                        e.preventDefault();
                        onFileSelect(key, null);
                        onUpdate(key, '');
                        if (inputRefs.current[key]) inputRefs.current[key]!.value = '';
                      }}
                      className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 transition-colors"
                    >
                      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </FormField>
          );
        })}
      </div>
    </div>
  );
}
