'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@arabiaaislamia/ui';
import { SecondaryLogo } from '@arabiaaislamia/ui';
import { findByApplicationNumber } from '@/services/admission/admission.service';
import { publicRoutes } from '@/constants/route';
import type { AdmissionApplication } from '@/services/admission/admission.service';

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
        else setError('Application not found or not approved');
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, [applicationNumber]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-destructive">{error ?? 'Not found'}</p>
        <Button asChild>
          <Link href={publicRoutes.status}>Back to status</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 print:p-8">
      <div className="hidden print:block fixed top-4 right-4">
        <Button type="button" size="sm" onClick={handlePrint} className="print:hidden">
          Print
        </Button>
      </div>
      <div className="max-w-lg mx-auto print:max-w-none">
        <div className="border-2 border-slate-800 rounded-lg p-8 print:border-black">
          <div className="text-center mb-8">
            <SecondaryLogo width={100} height={100} className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900">Arabia Islamia</h1>
            <p className="text-slate-600">Secondary Education</p>
            <p className="text-lg font-semibold mt-4 text-slate-800">Oral Test Admit Card</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-muted-foreground">Application Number</span>
              <span className="font-mono font-semibold">{application.applicationNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{application.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-muted-foreground">Class</span>
              <span className="font-medium">{application.requiredClass}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-muted-foreground">Date of birth</span>
              <span className="font-medium">{application.dateOfBirth ?? '—'}</span>
            </div>
            <div className="mt-6 pt-4 border-t border-dashed text-muted-foreground text-xs">
              <p>Exam date and venue will be communicated separately.</p>
              <p className="mt-2">Bring this admit card and a valid ID to the oral test.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center print:hidden">
        <Button onClick={handlePrint}>Print admit card</Button>
        <Button variant="outline" asChild className="ml-3">
          <Link href={publicRoutes.status}>Back to status</Link>
        </Button>
      </div>
    </div>
  );
}
