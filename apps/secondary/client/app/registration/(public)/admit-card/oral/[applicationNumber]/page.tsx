'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, SecondaryLogo, toast } from '@arabiaaislamia/ui';
import { AdmitCardSkeleton } from '@/components/AdmitCardSkeleton';
import { findByApplicationNumber } from '@/services/admission/admission.service';
import { publicRoutes } from '@/constants/route';
import type { AdmissionApplication } from '@/services/admission/admission.service';

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-200 py-2.5 last:border-b-0 print:border-slate-300">
      <span className="text-slate-500 shrink-0 print:text-slate-600">{label}</span>
      <span className="font-medium text-slate-900 text-right print:text-black">{value ?? '—'}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 last:mb-0">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 print:text-slate-600 print:mb-2">
        {title}
      </h3>
      <div className="space-y-0">{children}</div>
    </section>
  );
}

export default function OralAdmitCardPage() {
  const params = useParams();
  const applicationNumber = params.applicationNumber as string;
  const [application, setApplication] = useState<AdmissionApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    findByApplicationNumber(decodeURIComponent(applicationNumber))
      .then((app) => {
        if (app && app.status === 'approved') setApplication(app);
        else {
          setError('Application not found or not approved');
          toast.error('Application not found or not approved');
        }
      })
      .catch(() => {
        setError('Failed to load');
        toast.error('Failed to load');
      })
      .finally(() => setLoading(false));
  }, [applicationNumber]);

  const handlePrint = () => window.print();

  if (loading) {
    return <AdmitCardSkeleton />;
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-destructive">{error ?? 'Not found'}</p>
        <Button asChild className="bg-amber-500 hover:bg-amber-400 text-amber-950">
          <Link href={publicRoutes.status}>Back to status</Link>
        </Button>
      </div>
    );
  }

  const fullAddress = [application.address, application.city, application.state, application.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="min-h-screen w-full min-w-0 bg-slate-50 p-4 sm:p-6 print:bg-white print:p-8 overflow-x-hidden">
      <div className="print:hidden fixed top-4 right-4 z-10 flex gap-2">
        <Button type="button" size="sm" onClick={handlePrint} className="bg-amber-500 hover:bg-amber-400 text-amber-950">
          Print
        </Button>
      </div>

      <div className="max-w-2xl w-full mx-auto min-w-0 print:max-w-none">
        <article className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden print:shadow-none print:rounded-none print:border-2 print:border-slate-800">
          {/* Header strip */}
          <div className="bg-[#0f2744] text-white px-6 py-4 print:py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <SecondaryLogo width={56} height={56} className="rounded-lg bg-white/10 p-1 shrink-0" />
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Arabia Islamia</h1>
                  <p className="text-sm text-slate-300">Secondary Education</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-slate-400">Admit Card</p>
                <p className="text-lg font-semibold text-orange-400">Oral Test</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 print:p-8">
            {/* Candidate details */}
            <Section title="Candidate details">
              <Row label="Application number" value={application.applicationNumber} />
              <Row label="Name" value={application.name} />
              <Row label="Father's name" value={application.fatherName} />
              <Row label="Date of birth" value={application.dateOfBirth} />
              <Row label="Gender" value={application.gender} />
              <Row label="Phone" value={application.phone} />
              <Row label="Email" value={application.email} />
              <Row label="Class applying for" value={application.class?.name ?? '—'} />
              <Row label="Address" value={fullAddress || application.address} />
            </Section>

            <Section title="Guardian">
              <Row label="Guardian name" value={application.guardianName} />
              <Row label="Relation" value={application.guardianRelation} />
              <Row label="Guardian phone" value={application.guardianPhone} />
            </Section>

            <Section title="Admission & test">
              <Row label="Application status" value="Approved" />
              <Row label="Admit" value="Oral test" />
              {application.oralTestMarks != null && application.oralTestMarks !== '' && (
                <Row label="Oral test marks (if recorded)" value={application.oralTestMarks} />
              )}
            </Section>

            {/* Instructions */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200 print:border-slate-400">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 print:text-slate-600">
                Instructions
              </h3>
              <ul className="text-sm text-slate-600 space-y-1 print:text-slate-700">
                <li>• Oral test date and venue will be communicated separately.</li>
                <li>• Bring this admit card and a valid photo ID to the oral test.</li>
                <li>• Keep this card safe; you may need to show it at the exam centre.</li>
              </ul>
            </div>

            {/* Signature line for physical use */}
            <div className="mt-8 pt-6 flex justify-end">
              <div className="w-48 border-b border-slate-400 pt-8 text-center text-xs text-slate-500">
                Authorised signature
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="mt-8 text-center print:hidden flex flex-wrap justify-center gap-2">
        <Button onClick={handlePrint} className="bg-amber-500 hover:bg-amber-400 text-amber-950">Print admit card</Button>
        <Button variant="outline" asChild className="hover:border-amber-400/50 hover:text-amber-300">
          <Link href={publicRoutes.status}>Back to status</Link>
        </Button>
      </div>
    </div>
  );
}
