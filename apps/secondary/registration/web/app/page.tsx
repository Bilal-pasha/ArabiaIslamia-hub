'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  SecondaryLogo,
  Button,
  Input,
  Label,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Alert,
  AlertTitle,
  AlertDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@arabiaaislamia/ui';

const STEPS = [
  { id: 1, title: 'Personal Info', subtitle: 'Student details' },
  { id: 2, title: 'Guardian Info', subtitle: 'Parent/Guardian' },
  { id: 3, title: 'Academic Info', subtitle: 'Course & previous education' },
  { id: 4, title: 'Documents', subtitle: 'Attach required files' },
];

const DEPARTMENTS = [
  'Arabic Dars-e-Nizami',
  'Secondary Education System',
  'Darul Quran',
  'Huffaz Courses',
  'Primary',
];

const CLASSES = [
  'Primary Level',
  'Level One',
  'Level Two',
  'Level Three',
  'Level Four',
  'Level Five',
  'Level Six',
  'Quran Memorization',
  'Quran Recitation (Nazira)',
  'Quran Memorization Review',
  'Tajweed Quran',
  'Foundation Level',
  'Grade 9',
  'Grade 10',
  'Matriculation',
];

const MADHABS = ['Hanafi', "Shafi'i", 'Maliki', 'Hanbali'];

const OCCUPATIONS = [
  'Teacher',
  'Trader',
  'Government Employee',
  'Imam/Khatib',
  'Doctor',
  'Engineer',
  'Driver',
  'Laborer',
  'Farmer',
  'Business Owner',
  'Other',
];

const COUNTRIES = [
  'Pakistan',
  'India',
  'Bangladesh',
  'Afghanistan',
  'Saudi Arabia',
  'UAE',
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Other',
];

type FormData = {
  name: string;
  fatherName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  idNumber: string;
  address: string;
  permanentAddress: string;
  country: string;
  state: string;
  city: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianOccupation: string;
  guardianAddress: string;
  department: string;
  requiredClass: string;
  previousSchool: string;
  previousClass: string;
  previousGrade: string;
  isHafiz: string;
  accommodationType: string;
  madhab: string;
  photoFile: string;
  idFile: string;
  authorityLetterFile: string;
  previousResultFile: string;
};

const initialData: FormData = {
  name: '',
  fatherName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  email: '',
  idNumber: '',
  address: '',
  permanentAddress: '',
  country: '',
  state: '',
  city: '',
  guardianName: '',
  guardianRelation: '',
  guardianPhone: '',
  guardianEmail: '',
  guardianOccupation: '',
  guardianAddress: '',
  department: '',
  requiredClass: '',
  previousSchool: '',
  previousClass: '',
  previousGrade: '',
  isHafiz: '',
  accommodationType: '',
  madhab: '',
  photoFile: '',
  idFile: '',
  authorityLetterFile: '',
  previousResultFile: '',
};

function FormField({
  label,
  children,
  required,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}{required && ' *'}</Label>
      {children}
    </div>
  );
}

export default function AdmissionFormPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof FormData, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-sky-50/30 flex items-center justify-center p-6">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="pt-8">
            <div className="flex justify-center mb-6">
              <SecondaryLogo width={96} height={96} />
            </div>
            <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl text-foreground mb-2">Application Submitted</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for applying. You will receive a confirmation message shortly. The admission office may contact you for further details. Keep your application number safe.
            </p>
            <p className="text-sm text-muted-foreground">Application #ARB-{Date.now().toString(36).toUpperCase()}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <SecondaryLogo width={64} height={64} className="flex-shrink-0" />
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Online Admission Form</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Arabia Islamia — Secondary Education</p>
              </div>
            </div>
            <Button variant="link" asChild>
              <Link href="/status" className="gap-2 inline-flex items-center">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Check Admission Status
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <Alert className="mb-8 border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-600">
          <AlertTitle>Instructions</AlertTitle>
          <AlertDescription>
            <ul className="mt-1 space-y-1 text-amber-800">
              <li>• Please read all fields before entering information. Ensure all information matches your documents.</li>
              <li>• Provide an active mobile number and correct email address.</li>
              <li>• After submission, you will receive a confirmation. The admission office may contact you. Keep your application number safe.</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s) => (
            <Button
              key={s.id}
              type="button"
              variant={step === s.id ? 'default' : step > s.id ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setStep(s.id)}
              className="flex-shrink-0"
            >
              {s.title}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="pb-20">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Full Name" required>
                    <Input value={data.name} onChange={(e) => update('name', e.target.value)} placeholder="As per identity document" required />
                  </FormField>
                  <FormField label="Father's Name" required>
                    <Input value={data.fatherName} onChange={(e) => update('fatherName', e.target.value)} required />
                  </FormField>
                  <FormField label="Date of Birth" required>
                    <Input type="date" value={data.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} required />
                  </FormField>
                  <FormField label="Gender" required>
                    <Select value={data.gender} onValueChange={(v) => update('gender', v)} required>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Phone Number" required>
                    <Input type="tel" value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Active mobile number" required />
                  </FormField>
                  <FormField label="Email" required>
                    <Input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} required />
                  </FormField>
                  <FormField label="ID / Passport Number" className="sm:col-span-2">
                    <Input value={data.idNumber} onChange={(e) => update('idNumber', e.target.value)} />
                  </FormField>
                  <FormField label="Current Address" required className="sm:col-span-2">
                    <Textarea rows={2} value={data.address} onChange={(e) => update('address', e.target.value)} required />
                  </FormField>
                  <FormField label="Permanent Address" className="sm:col-span-2">
                    <Textarea rows={2} value={data.permanentAddress} onChange={(e) => update('permanentAddress', e.target.value)} />
                  </FormField>
                  <FormField label="Country" required>
                    <Select value={data.country} onValueChange={(v) => update('country', v)} required>
                      <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="State / Province">
                    <Input value={data.state} onChange={(e) => update('state', e.target.value)} />
                  </FormField>
                  <FormField label="City">
                    <Input value={data.city} onChange={(e) => update('city', e.target.value)} />
                  </FormField>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Guardian / Parent Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Guardian Name" required>
                    <Input value={data.guardianName} onChange={(e) => update('guardianName', e.target.value)} required />
                  </FormField>
                  <FormField label="Relation" required>
                    <Select value={data.guardianRelation} onValueChange={(v) => update('guardianRelation', v)} required>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="father">Father</SelectItem>
                        <SelectItem value="mother">Mother</SelectItem>
                        <SelectItem value="guardian">Legal Guardian</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Guardian Phone" required>
                    <Input type="tel" value={data.guardianPhone} onChange={(e) => update('guardianPhone', e.target.value)} required />
                  </FormField>
                  <FormField label="Guardian Email">
                    <Input type="email" value={data.guardianEmail} onChange={(e) => update('guardianEmail', e.target.value)} />
                  </FormField>
                  <FormField label="Occupation">
                    <Select value={data.guardianOccupation} onValueChange={(v) => update('guardianOccupation', v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {OCCUPATIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Guardian Address" className="sm:col-span-2">
                    <Textarea rows={2} value={data.guardianAddress} onChange={(e) => update('guardianAddress', e.target.value)} />
                  </FormField>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Academic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Department / Section" required>
                    <Select value={data.department} onValueChange={(v) => update('department', v)} required>
                      <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Required Class" required>
                    <Select value={data.requiredClass} onValueChange={(v) => update('requiredClass', v)} required>
                      <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                      <SelectContent>
                        {CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Previous School">
                    <Input value={data.previousSchool} onChange={(e) => update('previousSchool', e.target.value)} />
                  </FormField>
                  <FormField label="Previous Class">
                    <Input value={data.previousClass} onChange={(e) => update('previousClass', e.target.value)} />
                  </FormField>
                  <FormField label="Previous Grade / Result">
                    <Select value={data.previousGrade} onValueChange={(v) => update('previousGrade', v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="very-good">Very Good</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="acceptable">Acceptable</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Hafiz-e-Quran">
                    <Select value={data.isHafiz} onValueChange={(v) => update('isHafiz', v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Accommodation Type" required>
                    <Select value={data.accommodationType} onValueChange={(v) => update('accommodationType', v)} required>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="non-residential">Non-Residential</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="School of Thought (Madhab)">
                    <Select value={data.madhab} onValueChange={(v) => update('madhab', v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {MADHABS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Required Documents</CardTitle>
                <AlertDescription>1. Photo &nbsp; 2. Passport or ID &nbsp; 3. Authority Letter &nbsp; 4. Previous Class Result</AlertDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { key: 'photoFile' as const, label: 'Photograph', accept: 'image/*' },
                    { key: 'idFile' as const, label: 'Passport / ID Card', accept: 'image/*,.pdf' },
                    { key: 'authorityLetterFile' as const, label: 'Authority Letter', accept: 'image/*,.pdf' },
                    { key: 'previousResultFile' as const, label: 'Previous Class Result', accept: 'image/*,.pdf' },
                  ].map(({ key, label, accept }) => (
                    <FormField key={key} label={label}>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-md cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors">
                        <input type="file" accept={accept} className="hidden" onChange={(e) => update(key, e.target.files?.[0]?.name ?? '')} />
                        <svg className="size-10 text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-sm text-muted-foreground">{data[key] || 'Click to upload'}</span>
                      </label>
                    </FormField>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between mt-8 gap-4">
            <Button type="button" variant="ghost" onClick={prev} disabled={step === 1}>
              Previous
            </Button>
            {step < 4 ? (
              <Button type="button" onClick={next}>Next</Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
