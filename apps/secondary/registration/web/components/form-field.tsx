'use client';

import { Label } from '@arabiaaislamia/ui';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  className?: string;
}

export function FormField({ label, children, required, error, className = '' }: FormFieldProps) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
