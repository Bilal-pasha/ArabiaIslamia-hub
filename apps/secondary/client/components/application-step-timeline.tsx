'use client';

import { Card, CardContent } from '@arabiaaislamia/ui';
import type { AdmissionApplication } from '@/services/admission/admission.service';

interface ApplicationStepTimelineProps {
  application: AdmissionApplication;
}

type StepStatus = 'completed' | 'pending' | 'rejected' | 'upcoming';

function getStepStatus(
  app: AdmissionApplication,
  stepId: 'submitted' | 'approved' | 'oral' | 'written'
): { status: StepStatus; reason: string | null } {
  switch (stepId) {
    case 'submitted':
      return { status: 'completed', reason: null };

    case 'approved':
      if (app.status === 'approved') return { status: 'completed', reason: null };
      if (app.status === 'rejected') return { status: 'rejected', reason: app.statusReason ?? null };
      return { status: 'pending', reason: null };

    case 'oral':
      if (app.status !== 'approved') return { status: 'upcoming', reason: 'Complete application approval first' };
      if (app.oralTestPassed === true) return { status: 'completed', reason: null };
      if (app.oralTestPassed === false) return { status: 'rejected', reason: null };
      return { status: 'pending', reason: 'Print admit card and attend oral test' };

    case 'written':
      if (app.oralTestPassed !== true) return { status: 'upcoming', reason: 'Pass oral test first' };
      if (app.writtenAdmitEligible === true) return { status: 'completed', reason: null };
      return { status: 'pending', reason: 'Eligibility updated after oral test' };

    default:
      return { status: 'pending', reason: null };
  }
}

const STEPS: { id: 'submitted' | 'approved' | 'oral' | 'written'; title: string }[] = [
  { id: 'submitted', title: 'Application submitted' },
  { id: 'approved', title: 'Application approved' },
  { id: 'oral', title: 'Oral test' },
  { id: 'written', title: 'Written test admit' },
];

export function ApplicationStepTimeline({ application }: ApplicationStepTimelineProps) {
  const pendingIndex = STEPS.findIndex(
    (_, idx) => getStepStatus(application, STEPS[idx].id).status === 'pending'
  );
  const nextStepIndex = pendingIndex >= 0 ? pendingIndex : -1;

  return (
    <Card className="secondary-card mt-6 backdrop-blur-xl border border-white/10">
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4 text-white">Status</h3>
        <ul className="space-y-0">
          {STEPS.map((step, idx) => {
            const { status, reason } = getStepStatus(application, step.id);
            const isNextStep = idx === nextStepIndex;
            const showConnector = idx < STEPS.length - 1;

            return (
              <li key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`shrink-0 size-9 rounded-full flex items-center justify-center text-sm font-medium border-2 ${status === 'completed'
                        ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                        : status === 'rejected'
                          ? 'bg-red-500/20 border-red-400/50 text-red-200'
                          : status === 'pending'
                            ? 'bg-orange-500/20 border-orange-400/50 text-orange-200'
                            : 'bg-white/5 border-white/10 text-slate-500'
                      }`}
                  >
                    {status === 'completed' ? (
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  {showConnector && (
                    <div
                      className={`w-0.5 flex-1 min-h-[24px] mt-1 ${status === 'completed' ? 'bg-emerald-400/30' : 'bg-white/10'
                        }`}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-medium ${status === 'completed'
                          ? 'text-emerald-200'
                          : status === 'rejected'
                            ? 'text-red-200'
                            : status === 'pending'
                              ? 'text-orange-200'
                              : 'text-slate-400'
                        }`}
                    >
                      {step.title}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-200'
                          : status === 'rejected'
                            ? 'bg-red-500/20 text-red-200'
                            : status === 'pending'
                              ? 'bg-orange-500/20 text-orange-200'
                              : 'bg-white/10 text-slate-500'
                        }`}
                    >
                      {status === 'completed'
                        ? 'Done'
                        : status === 'rejected'
                          ? 'Rejected'
                          : status === 'pending'
                            ? (isNextStep ? 'Next step' : 'Pending')
                            : 'Upcoming'}
                    </span>
                  </div>
                  {reason && (
                    <p className="text-sm text-slate-400 mt-1">{reason}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
