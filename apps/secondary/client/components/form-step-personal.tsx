'use client';

import { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@arabiaaislamia/ui';
import { FormField } from './form-field';
import { COUNTRIES } from '@/lib/admission-constants';
import {
  getStatesForCountry,
  getCitiesForState,
  isOtherCountry,
} from '@/lib/country-state-city';
import type { AdmissionFormDataWithEmptyEnums } from '@/lib/admission-schema';

interface FormStepPersonalProps {
  data: AdmissionFormDataWithEmptyEnums;
  errors: Record<string, string>;
  onUpdate: (key: keyof AdmissionFormDataWithEmptyEnums, value: string) => void;
}

export function FormStepPersonal({ data, errors, onUpdate }: FormStepPersonalProps) {
  const country = data.country ?? '';
  const state = data.state ?? '';
  const isOther = isOtherCountry(country);
  const states = getStatesForCountry(country);
  const cities = getCitiesForState(country, state);
  const showStateDropdown = !isOther && states.length > 0;
  const showCityDropdown = !isOther && cities.length > 0;

  const handleCountryChange = (v: string) => {
    onUpdate('country', v);
    onUpdate('state', '');
    onUpdate('city', '');
  };

  const handleStateChange = (v: string) => {
    onUpdate('state', v);
    onUpdate('city', '');
  };

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
      <FormField label="Email" error={errors.email}>
        <Input
          type="email"
          value={data.email ?? ''}
          onChange={(e) => onUpdate('email', e.target.value)}
          placeholder="Optional"
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
        <Select value={country} onValueChange={handleCountryChange}>
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
      <FormField label="State / Province" required error={errors.state}>
        {showStateDropdown ? (
          <Select value={state} onValueChange={handleStateChange}>
            <SelectTrigger className={`h-10 ${errors.state ? 'border-destructive' : ''}`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {states.map((s) => (
                <SelectItem key={s.state} value={s.state}>
                  {s.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={state}
            onChange={(e) => onUpdate('state', e.target.value)}
            placeholder={isOther ? 'Enter state / province' : 'Select country first'}
            className={`h-10 ${errors.state ? 'border-destructive' : ''}`}
          />
        )}
      </FormField>
      <FormField label="City" required error={errors.city}>
        {showCityDropdown ? (
          <Select value={data.city ?? ''} onValueChange={(v) => onUpdate('city', v)}>
            <SelectTrigger className={`h-10 ${errors.city ? 'border-destructive' : ''}`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={data.city ?? ''}
            onChange={(e) => onUpdate('city', e.target.value)}
            placeholder={isOther || !country ? 'Enter city' : state ? 'Enter city or select state' : 'Select state first'}
            className={`h-10 ${errors.city ? 'border-destructive' : ''}`}
          />
        )}
      </FormField>
      <FormField label="Area" required error={errors.area}>
        <Input
          value={data.area ?? ''}
          onChange={(e) => onUpdate('area', e.target.value)}
          placeholder="e.g. region or locality"
          className={`h-10 ${errors.area ? 'border-destructive' : ''}`}
        />
      </FormField>
      <FormField label="Language" required error={errors.language}>
        <Input
          value={data.language ?? ''}
          onChange={(e) => onUpdate('language', e.target.value)}
          placeholder="e.g. Urdu, Arabic, English"
          className={`h-10 ${errors.language ? 'border-destructive' : ''}`}
        />
      </FormField>
    </div>
  );
}
