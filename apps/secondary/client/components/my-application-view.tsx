'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@arabiaaislamia/ui';
import { Button, Badge } from '@arabiaaislamia/ui';
import { SecondaryLogo } from '@arabiaaislamia/ui';
import { publicRoutes } from '@/constants/route';
import type { AdmissionApplication } from '@/services/admission/admission.service';
import { ApplicationStepTimeline, getLastStatusLabel } from './application-step-timeline';

interface MyApplicationViewProps {
  application: AdmissionApplication;
}

function getStatusVariant(status: string): 'pending' | 'approved' | 'rejected' {
  if (status === 'approved' || status === 'student') return 'approved';
  if (status === 'rejected' || status === 'quran_test_failed') return 'rejected';
  return 'pending';
}

function formatStatusBadge(status: string): string {
  if (status === 'student') return 'Admission complete';
  if (status === 'quran_test_failed') return 'Quran test failed';
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function MyApplicationView({ application }: MyApplicationViewProps) {
  const isApproved = application.status === 'approved';
  const isRejected = application.status === 'rejected';
  const canPrintOralAdmit = isApproved;
  const canDownloadWrittenAdmit =
    application.oralTestPassed === true && application.writtenAdmitEligible === true;

  return (
    <div className="space-y-6 w-full min-w-0 overflow-x-hidden">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href={publicRoutes.status} className="gap-2 inline-flex items-center">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Check another application
        </Link>
      </Button>

      <Card className="secondary-card backdrop-blur-xl border border-white/10">
        <CardHeader className="border-b border-white/10 bg-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/10 p-1.5 shadow-lg">
                <SecondaryLogo width={48} height={48} className="rounded-lg" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">{application.name}</CardTitle>
                <p className="text-sm text-slate-300">
                  {application.applicationNumber} · {application.requiredClass}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Last status: {getLastStatusLabel(application)}
                </p>
              </div>
            </div>
            <Badge variant={getStatusVariant(application.status)} className="shrink-0">
              {formatStatusBadge(application.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isApproved && (
            <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 p-4 mb-6">
              <p className="font-medium text-emerald-200">Application approved</p>
              <p className="text-sm text-emerald-100/90 mt-1">
                Admin has approved your admission application. Each step (Quran test, oral test, written test) is updated separately. You can print your oral test admit card below once eligible; after passing the oral test you can download the written test admit card.
              </p>
            </div>
          )}
          {isRejected && application.statusReason && (
            <div className="rounded-lg border border-red-400/40 bg-red-500/10 p-4 mb-6">
              <p className="font-medium text-red-200">Application rejected</p>
              <p className="text-sm text-red-100/90 mt-1">{application.statusReason}</p>
            </div>
          )}
          {application.status === 'pending' && (
            <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 p-4 mb-6">
              <p className="font-medium text-amber-200">Admission submitted</p>
              <p className="text-sm text-amber-100/90 mt-1">
                Your application has been submitted. Admin will approve the admission application; then each step (Quran test, oral test, written test) will be updated separately. Check back later for updates.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {canPrintOralAdmit && (
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href={`/registration/admit-card/oral/${encodeURIComponent(application.applicationNumber)}`}>
                  Print oral test admit card
                </Link>
              </Button>
            )}
            {canDownloadWrittenAdmit && (
              <Button variant="secondary" asChild className="bg-sky-500/20 text-sky-200 hover:bg-sky-500/30 border border-sky-400/30">
                <Link href={`/registration/admit-card/written/${encodeURIComponent(application.applicationNumber)}`}>
                  Download written test admit card
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ApplicationStepTimeline application={application} />
    </div>
  );
}
