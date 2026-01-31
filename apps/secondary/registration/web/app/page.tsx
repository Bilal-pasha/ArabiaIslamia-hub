'use client';

import { useState } from 'react';
import Link from 'next/link';

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
  // Personal
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
  // Guardian
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianOccupation: string;
  guardianAddress: string;
  // Academic
  department: string;
  requiredClass: string;
  previousSchool: string;
  previousClass: string;
  previousGrade: string;
  isHafiz: string;
  accommodationType: string;
  madhab: string;
  // Documents (file names for now)
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
    // TODO: Submit to API when backend is ready
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-slate-800 mb-2">Application Submitted</h1>
          <p className="text-slate-600 mb-6">
            Thank you for applying. You will receive a confirmation message shortly. The admission office may contact you for further details. Please keep your application number safe for follow-up.
          </p>
          <p className="text-sm text-slate-500">Application #ARB-{Date.now().toString(36).toUpperCase()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-slate-800">Online Admission Form</h1>
              <p className="text-slate-500 text-sm mt-0.5">Arabia Islamia — Secondary Education</p>
            </div>
            <Link
              href="/status"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Check Admission Status
            </Link>
          </div>
        </div>
      </header>

      {/* Instructions */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 mb-8">
          <h3 className="font-semibold text-amber-900 mb-2">Instructions</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Please read all fields before entering information. Ensure all information is correct and matches your documents.</li>
            <li>• Provide an active mobile number and correct email address.</li>
            <li>• After submission, you will receive a confirmation message. The admission office may contact you. Keep your application number safe.</li>
          </ul>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-left transition-colors ${
                step === s.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : step > s.id
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <span className="font-medium text-sm">{s.title}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="pb-20">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
              <h2 className="font-serif text-xl text-slate-800 mb-6">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={data.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                    placeholder="As per identity document"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Father&apos;s Name *</label>
                  <input
                    type="text"
                    required
                    value={data.fatherName}
                    onChange={(e) => update('fatherName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={data.dateOfBirth}
                    onChange={(e) => update('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender *</label>
                  <select
                    required
                    value={data.gender}
                    onChange={(e) => update('gender', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={data.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                    placeholder="Active mobile number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={data.email}
                    onChange={(e) => update('email', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">ID / Passport Number</label>
                  <input
                    type="text"
                    value={data.idNumber}
                    onChange={(e) => update('idNumber', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={data.address}
                    onChange={(e) => update('address', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition resize-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Permanent Address</label>
                  <textarea
                    rows={2}
                    value={data.permanentAddress}
                    onChange={(e) => update('permanentAddress', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Country *</label>
                  <select
                    required
                    value={data.country}
                    onChange={(e) => update('country', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">State / Province</label>
                  <input
                    type="text"
                    value={data.state}
                    onChange={(e) => update('state', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input
                    type="text"
                    value={data.city}
                    onChange={(e) => update('city', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Step 2: Guardian */}
          {step === 2 && (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
              <h2 className="font-serif text-xl text-slate-800 mb-6">Guardian / Parent Information</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={data.guardianName}
                    onChange={(e) => update('guardianName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Relation *</label>
                  <select
                    required
                    value={data.guardianRelation}
                    onChange={(e) => update('guardianRelation', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  >
                    <option value="">Select</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Legal Guardian</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Guardian Phone *</label>
                  <input
                    type="tel"
                    required
                    value={data.guardianPhone}
                    onChange={(e) => update('guardianPhone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Guardian Email</label>
                  <input
                    type="email"
                    value={data.guardianEmail}
                    onChange={(e) => update('guardianEmail', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Occupation</label>
                  <select
                    value={data.guardianOccupation}
                    onChange={(e) => update('guardianOccupation', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  >
                    <option value="">Select</option>
                    {OCCUPATIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Guardian Address</label>
                  <textarea
                    rows={2}
                    value={data.guardianAddress}
                    onChange={(e) => update('guardianAddress', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition resize-none"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Step 3: Academic */}
          {step === 3 && (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
              <h2 className="font-serif text-xl text-slate-800 mb-6">Academic Information</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Department / Section *</label>
                  <select
                    required
                    value={data.department}
                    onChange={(e) => update('department', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Required Class *</label>
                  <select
                    required
                    value={data.requiredClass}
                    onChange={(e) => update('requiredClass', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  >
                    <option value="">Select Class</option>
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Previous School</label>
                  <input
                    type="text"
                    value={data.previousSchool}
                    onChange={(e) => update('previousSchool', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Previous Class</label>
                  <input
                    type="text"
                    value={data.previousClass}
                    onChange={(e) => update('previousClass', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Previous Grade / Result</label>
                  <select
                    value={data.previousGrade}
                    onChange={(e) => update('previousGrade', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  >
                    <option value="">Select</option>
                    <option value="excellent">Excellent</option>
                    <option value="very-good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="acceptable">Acceptable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Hafiz-e-Quran</label>
                  <select
                    value={data.isHafiz}
                    onChange={(e) => update('isHafiz', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  >
                    <option value="">Select</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Accommodation Type *</label>
                  <select
                    required
                    value={data.accommodationType}
                    onChange={(e) => update('accommodationType', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  >
                    <option value="">Select</option>
                    <option value="residential">Residential</option>
                    <option value="non-residential">Non-Residential</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">School of Thought (Madhab)</label>
                  <select
                    value={data.madhab}
                    onChange={(e) => update('madhab', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  >
                    <option value="">Select</option>
                    {MADHABS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* Step 4: Documents */}
          {step === 4 && (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
              <h2 className="font-serif text-xl text-slate-800 mb-2">Required Documents</h2>
              <p className="text-slate-500 text-sm mb-6">1. Photo &nbsp; 2. Passport or ID &nbsp; 3. Authority Letter &nbsp; 4. Previous Class Result</p>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { key: 'photoFile' as const, label: 'Photograph', accept: 'image/*' },
                  { key: 'idFile' as const, label: 'Passport / ID Card', accept: 'image/*,.pdf' },
                  { key: 'authorityLetterFile' as const, label: 'Authority Letter', accept: 'image/*,.pdf' },
                  { key: 'previousResultFile' as const, label: 'Previous Class Result', accept: 'image/*,.pdf' },
                ].map(({ key, label, accept }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors">
                      <input
                        type="file"
                        accept={accept}
                        className="hidden"
                        onChange={(e) => update(key, e.target.files?.[0]?.name ?? '')}
                      />
                      <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-sm text-slate-500">{data[key] || 'Click to upload'}</span>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 gap-4">
            <button
              type="button"
              onClick={prev}
              disabled={step === 1}
              className="px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={next}
                className="px-6 py-2.5 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg disabled:opacity-70 transition"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
