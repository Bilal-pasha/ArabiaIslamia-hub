'use client';

import { Card, CardContent } from '@arabiaaislamia/ui';
import { Badge } from '@arabiaaislamia/ui';
import type { AdmissionApplication } from '@/services/admission/admission.service';

interface ApplicationStepTimelineProps {
  application: AdmissionApplication;
}

const STEPS = [
  {
    id: 'submitted',
    title: 'Application submitted',
    status: () => 'completed' as const,
    reason: () => null,
  },
  {
    id: 'review',
    title: 'Application review',
    status: (app: AdmissionApplication) => {
      if (app.status === 'pending') return 'pending' as const;
      if (app.status === 'approved') return 'completed' as const;
      return 'rejected' as const;
    },
    reason: (app: AdmissionApplication) => app.statusReason ?? null,
  },
  {
    id: 'oral',
    title: 'Oral test',
    status: (app: AdmissionApplication) => {
      if (app.oralTestPassed === true) return 'completed' as const;
      if (app.oralTestPassed === false) return 'rejected' as const;
      if (app.status === 'approved') return 'pending' as const;
      return 'pending' as const;
    },
    reason: () => null,
  },
  {
    id: 'written',
    title: 'Written test admit',
    status: (app: AdmissionApplication) => {
      if (app.writtenAdmitEligible) return 'completed' as const;
      if (app.oralTestPassed === true) return 'pending' as const;
      return 'pending' as const;
    },
    reason: () => null,
  },
];

export function ApplicationStepTimeline({ application }: ApplicationStepTimelineProps) {
  return (
    <Card className="secondary-card mt-6 backdrop-blur-xl border border-white/10">
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4 text-white">Application steps</h3>
        <ul className="space-y-4">
          {STEPS.map((step, idx) => {
            const stepStatus = step.status(application);
            const reason = step.reason(application);
            return (
              <li key={step.id} className="flex gap-4 items-start">
                <div
                  className={`shrink-0 size-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepStatus === 'completed'
                      ? 'bg-emerald-500/30 text-emerald-200'
                      : stepStatus === 'rejected'
                        ? 'bg-red-500/20 text-red-200'
                        : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {stepStatus === 'completed' ? (
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-200">{step.title}</span>
                    <Badge
                      variant={
                        stepStatus === 'completed'
                          ? 'approved'
                          : stepStatus === 'rejected'
                            ? 'rejected'
                            : 'pending'
                      }
                    >
                      {stepStatus === 'completed' ? 'Done' : stepStatus === 'rejected' ? 'Rejected' : 'Pending'}
                    </Badge>
                  </div>
                  {reason && <p className="text-sm text-slate-400 mt-1">{reason}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
