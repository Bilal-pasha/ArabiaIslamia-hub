'use client';

import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@arabiaaislamia/ui';
import { FormField } from './form-field';
import { CLASSES } from '@/lib/admission-constants';
import type { AdmissionFormDataWithEmptyEnums } from '@/lib/admission-schema';

interface FormStepAcademicProps {
  data: AdmissionFormDataWithEmptyEnums;
  errors: Record<string, string>;
  onUpdate: (key: keyof AdmissionFormDataWithEmptyEnums, value: string) => void;
}

export function FormStepAcademic({ data, errors, onUpdate }: FormStepAcademicProps) {
  return (
    <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 min-w-0 w-full">
      <FormField label="Required Class" required error={errors.requiredClass}>
        <Select value={data.requiredClass} onValueChange={(v) => onUpdate('requiredClass', v)}>
          <SelectTrigger className={`h-10 ${errors.requiredClass ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {CLASSES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Previous School">
        <Input
          value={data.previousSchool ?? ''}
          onChange={(e) => onUpdate('previousSchool', e.target.value)}
          className="h-10"
        />
      </FormField>
      <FormField label="Previous Class">
        <Input
          value={data.previousClass ?? ''}
          onChange={(e) => onUpdate('previousClass', e.target.value)}
          className="h-10"
        />
      </FormField>
      <FormField label="Previous Grade">
        <Select value={data.previousGrade ?? ''} onValueChange={(v) => onUpdate('previousGrade', v)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="very-good">Very Good</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="acceptable">Acceptable</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Hafiz-e-Quran">
        <Select value={data.isHafiz ?? ''} onValueChange={(v) => onUpdate('isHafiz', v)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Accommodation" required error={errors.accommodationType}>
        <Select value={data.accommodationType} onValueChange={(v) => onUpdate('accommodationType', v)}>
          <SelectTrigger className={`h-10 ${errors.accommodationType ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="non-residential">Non-Residential</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
    </div>
  );
}
