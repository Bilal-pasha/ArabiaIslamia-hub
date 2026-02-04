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
      <Label className="mb-1.5 block text-sm font-medium text-card-foreground/90">
        {label}
        {required && <span className="text-amber-400 ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="mt-1 text-sm text-red-200">{error}</p>}
    </div>
  );
}
