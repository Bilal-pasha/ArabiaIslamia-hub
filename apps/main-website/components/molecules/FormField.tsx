'use client';

import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/atoms';
import { Label } from '@/components/atoms';
import { Textarea } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  label?: string;
  name: Path<TFieldValues>;
  error?: string;
  type?: 'text' | 'email' | 'number';
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  rows?: number;
  register?: UseFormRegister<TFieldValues>;
}

export function FormField<TFieldValues extends FieldValues = FieldValues>({
  label,
  name,
  error,
  type = 'text',
  placeholder,
  required,
  className,
  inputClassName,
  multiline,
  rows = 3,
  register,
}: FormFieldProps<TFieldValues>) {
  const commonProps = register
    ? { ...register(name) }
    : { name, id: name };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="text-foreground">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
      )}
      {multiline ? (
        <Textarea
          id={name}
          placeholder={placeholder}
          rows={rows}
          className={cn('resize-none', inputClassName)}
          {...commonProps}
        />
      ) : (
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          className={inputClassName}
          {...commonProps}
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
