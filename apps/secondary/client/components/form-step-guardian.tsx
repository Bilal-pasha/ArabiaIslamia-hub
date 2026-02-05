'use client';

import { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@arabiaaislamia/ui';
import { FormField } from './form-field';
import { OCCUPATIONS } from '@/lib/admission-constants';
import type { AdmissionFormDataWithEmptyEnums } from '@/lib/admission-schema';

interface FormStepGuardianProps {
  data: AdmissionFormDataWithEmptyEnums;
  errors: Record<string, string>;
  onUpdate: (key: keyof AdmissionFormDataWithEmptyEnums, value: string) => void;
}

export function FormStepGuardian({ data, errors, onUpdate }: FormStepGuardianProps) {
  return (
    <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 min-w-0 w-full">
      <FormField label="Guardian Name" required error={errors.guardianName}>
        <Input
          value={data.guardianName}
          onChange={(e) => onUpdate('guardianName', e.target.value)}
          className={`h-10 ${errors.guardianName ? 'border-destructive' : ''}`}
        />
      </FormField>
      <FormField label="Relation" required error={errors.guardianRelation}>
        <Select value={data.guardianRelation} onValueChange={(v) => onUpdate('guardianRelation', v)}>
          <SelectTrigger className={`h-10 ${errors.guardianRelation ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="father">Father</SelectItem>
            <SelectItem value="mother">Mother</SelectItem>
            <SelectItem value="guardian">Legal Guardian</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Guardian Phone" required error={errors.guardianPhone}>
        <Input
          type="tel"
          value={data.guardianPhone}
          onChange={(e) => onUpdate('guardianPhone', e.target.value)}
          className={`h-10 ${errors.guardianPhone ? 'border-destructive' : ''}`}
        />
      </FormField>
      <FormField label="Guardian Email (optional)" error={errors.guardianEmail}>
        <Input
          type="email"
          value={data.guardianEmail ?? ''}
          onChange={(e) => onUpdate('guardianEmail', e.target.value)}
          placeholder="Optional"
          className={`h-10 ${errors.guardianEmail ? 'border-destructive' : ''}`}
        />
      </FormField>
      <FormField label="Occupation">
        <Select value={data.guardianOccupation ?? ''} onValueChange={(v) => onUpdate('guardianOccupation', v)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {OCCUPATIONS.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Guardian Address" className="sm:col-span-2">
        <Textarea
          rows={2}
          value={data.guardianAddress ?? ''}
          onChange={(e) => onUpdate('guardianAddress', e.target.value)}
        />
      </FormField>
    </div>
  );
}
