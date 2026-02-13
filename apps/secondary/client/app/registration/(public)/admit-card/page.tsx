'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, SecondaryLogo } from '@arabiaaislamia/ui';
import { apiClient } from '@/utils/axios-instance';
import { admissionEndpoints } from '@/constants/api-endpoints';
import { publicRoutes } from '@/constants/route';

interface AdmitCardData {
  id: string;
  applicationNumber: string;
  name: string;
  fatherName: string;
  class: { id: string; name: string } | null;
  type: string;
}

function AdmitCardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const type = searchParams.get('type') || 'written';
  const [data, setData] = useState<AdmitCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) {
      setError('Missing application ID');
      setLoading(false);
      return;
    }
    const url = admissionEndpoints.admitCard(applicationId, type);
    apiClient
      .get<AdmitCardData>(url)
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load admit card'))
      .finally(() => setLoading(false));
  }, [applicationId, type]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-slate-500">Loading admit card...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-slate-50">
        <p className="text-destructive">{error ?? 'Not found'}</p>
        <Button asChild variant="outline">
          <Link href={publicRoutes.status}>Back to status</Link>
        </Button>
      </div>
    );
  }

  const typeLabel = type === 'written' ? 'Written Test' : type === 'quran' ? 'Quran Test' : type === 'oral' ? 'Oral Test' : type;

  return (
    <div className="min-h-screen w-full min-w-0 bg-slate-50 p-4 sm:p-6 print:bg-white print:p-8 overflow-x-hidden">
      <div className="print:hidden fixed top-4 right-4 z-10 flex gap-2">
        <Button type="button" size="sm" onClick={handlePrint} className="bg-amber-500 hover:bg-amber-400 text-amber-950">
          Print
        </Button>
      </div>

      <div className="max-w-2xl w-full mx-auto min-w-0 print:max-w-none">
        <article className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden print:shadow-none print:rounded-none print:border-2 print:border-slate-800">
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
                <p className="text-lg font-semibold text-orange-400">{typeLabel}</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 print:p-8 space-y-4">
            <div className="flex justify-between gap-4 border-b border-slate-200 py-2">
              <span className="text-slate-500">Application number</span>
              <span className="font-semibold text-slate-900">{data.applicationNumber}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-200 py-2">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-900">{data.name}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-200 py-2">
              <span className="text-slate-500">Father&apos;s name</span>
              <span className="font-medium text-slate-900">{data.fatherName}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-200 py-2">
              <span className="text-slate-500">Class</span>
              <span className="font-medium text-slate-900">{data.class?.name ?? '—'}</span>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Instructions</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Bring this admit card and a valid photo ID to the test.</li>
                <li>• Date and venue will be communicated separately if not already informed.</li>
              </ul>
            </div>
          </div>
        </article>
      </div>

      <div className="mt-8 text-center print:hidden">
        <Button onClick={handlePrint} className="bg-amber-500 hover:bg-amber-400 text-amber-950">Print admit card</Button>
      </div>
    </div>
  );
}

export default function AdmitCardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AdmitCardContent />
    </Suspense>
  );
}
