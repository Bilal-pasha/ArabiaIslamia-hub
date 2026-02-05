'use client';

import { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@arabiaaislamia/ui';
import { FormField } from './form-field';
import { COUNTRIES } from '@/lib/admission-constants';
import type { AdmissionFormDataWithEmptyEnums } from '@/lib/admission-schema';

interface FormStepPersonalProps {
  data: AdmissionFormDataWithEmptyEnums;
  errors: Record<string, string>;
  onUpdate: (key: keyof AdmissionFormDataWithEmptyEnums, value: string) => void;
}

export function FormStepPersonal({ data, errors, onUpdate }: FormStepPersonalProps) {
  return (
    <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 min-w-0 w-full">
      <FormField label="Full Name" required error={errors.name}>
        <Input
          value={data.name}
          onChange={(e) => onUpdate('name', e.target.value)}
          placeholder="As per ID document"
          className={`h-10 ${errors.name ? 'border-destructive' : ''}`}
        />
      </FormField>
      <FormField label="Father's Name" required error={errors.fatherName}>
        <Input
          value={data.fatherName}
          onChange={(e) => onUpdate('fatherName', e.target.value)}
          className={`h-10 ${errors.fatherName ? 'border-destructive' : ''}`}
        />
      </FormField>
      <FormField label="Date of Birth" required error={errors.dateOfBirth}>
        <Input
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => onUpdate('dateOfBirth', e.target.value)}
          className={`h-10 ${errors.dateOfBirth ? 'border-destructive' : ''}`}
        />
      </FormField>
      <FormField label="Gender" required error={errors.gender}>
        <Select value={data.gender} onValueChange={(v) => onUpdate('gender', v)}>
          <SelectTrigger className={`h-10 ${errors.gender ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Phone" required error={errors.phone}>
        <Input
          type="tel"
          value={data.phone}
          onChange={(e) => onUpdate('phone', e.target.value)}
          placeholder="Active mobile"
          className={`h-10 ${errors.phone ? 'border-destructive' : ''}`}
        />
      </FormField>
      <FormField label="Email" required error={errors.email}>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => onUpdate('email', e.target.value)}
          className={`h-10 ${errors.email ? 'border-destructive' : ''}`}
        />
      </FormField>
      <FormField label="ID / Passport / CRC" className="sm:col-span-2">
        <Input value={data.idNumber ?? ''} onChange={(e) => onUpdate('idNumber', e.target.value)} className="h-10" />
      </FormField>
      <FormField label="Current Address" required error={errors.address} className="sm:col-span-2">
        <Textarea
          rows={2}
          value={data.address}
          onChange={(e) => onUpdate('address', e.target.value)}
          className={errors.address ? 'border-destructive' : ''}
        />
      </FormField>
      <FormField label="Permanent Address" className="sm:col-span-2">
        <Textarea
          rows={2}
          value={data.permanentAddress ?? ''}
          onChange={(e) => onUpdate('permanentAddress', e.target.value)}
        />
      </FormField>
      <FormField label="Country" required error={errors.country}>
        <Select value={data.country} onValueChange={(v) => onUpdate('country', v)}>
          <SelectTrigger className={`h-10 ${errors.country ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="State / Province">
        <Input value={data.state ?? ''} onChange={(e) => onUpdate('state', e.target.value)} className="h-10" />
      </FormField>
      <FormField label="City">
        <Input value={data.city ?? ''} onChange={(e) => onUpdate('city', e.target.value)} className="h-10" />
      </FormField>
      <FormField label="Area">
        <Input value={data.area ?? ''} onChange={(e) => onUpdate('area', e.target.value)} className="h-10" placeholder="e.g. region or locality" />
      </FormField>
      <FormField label="Language">
        <Input value={data.language ?? ''} onChange={(e) => onUpdate('language', e.target.value)} className="h-10" placeholder="e.g. Urdu, Arabic, English" />
      </FormField>
    </div>
  );
}
