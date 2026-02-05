'use client';

import { Card, CardContent } from '@arabiaaislamia/ui';
import type { AdmissionApplication } from '@/services/admission/admission.service';

interface ApplicationStepTimelineProps {
  application: AdmissionApplication;
}

type StepStatus = 'completed' | 'pending' | 'rejected' | 'upcoming';

interface StepResult {
  status: StepStatus;
  reason: string | null;
  detail?: string; // e.g. marks or extra info
}

function getStepStatus(
  app: AdmissionApplication,
  stepId: 'submitted' | 'approved' | 'quran' | 'oral' | 'written_admit' | 'written_test'
): StepResult {
  switch (stepId) {
    case 'submitted':
      return { status: 'completed', reason: null };

    case 'approved':
      if (app.status === 'approved') return { status: 'completed', reason: null };
      if (app.status === 'rejected' || app.status === 'quran_test_failed')
        return { status: 'rejected', reason: app.statusReason ?? null };
      return { status: 'pending', reason: 'Admin will review your application' };

    case 'quran':
      if (app.status !== 'approved') return { status: 'upcoming', reason: 'Application must be approved first' };
      if (app.quranTestPassed === true)
        return {
          status: 'completed',
          reason: null,
          detail: app.quranTestMarks ? `Marks: ${app.quranTestMarks}` : undefined,
        };
      if (app.quranTestPassed === false)
        return {
          status: 'rejected',
          reason: app.quranTestReason ?? 'Not passed',
          detail: app.quranTestMarks ? `Marks: ${app.quranTestMarks}` : undefined,
        };
      return { status: 'pending', reason: 'Quran test result not yet updated' };

    case 'oral':
      if (app.status !== 'approved') return { status: 'upcoming', reason: null };
      if (app.quranTestPassed !== true) return { status: 'upcoming', reason: 'Pass Quran test first' };
      if (app.oralTestPassed === true)
        return {
          status: 'completed',
          reason: null,
          detail: app.oralTestMarks ? `Marks: ${app.oralTestMarks}` : undefined,
        };
      if (app.oralTestPassed === false) return { status: 'rejected', reason: null };
      return { status: 'pending', reason: 'Print admit card and attend oral test' };

    case 'written_admit':
      if (app.oralTestPassed !== true) return { status: 'upcoming', reason: 'Pass oral test first' };
      if (app.writtenAdmitEligible === true) return { status: 'completed', reason: null };
      return { status: 'pending', reason: 'Eligibility updated after oral test' };

    case 'written_test':
      if (app.writtenAdmitEligible !== true) return { status: 'upcoming', reason: 'Become eligible for written test first' };
      if (app.status === 'student') return { status: 'completed', reason: null, detail: 'Admission complete' };
      if (app.writtenTestPassed === true)
        return {
          status: 'completed',
          reason: null,
          detail: app.writtenTestMarks ? `Marks: ${app.writtenTestMarks}` : undefined,
        };
      if (app.writtenTestPassed === false)
        return {
          status: 'rejected',
          reason: app.writtenTestReason ?? null,
          detail: app.writtenTestMarks ? `Marks: ${app.writtenTestMarks}` : undefined,
        };
      return { status: 'pending', reason: 'Written test result not yet updated' };

    default:
      return { status: 'pending', reason: null };
  }
}

const STEPS: { id: 'submitted' | 'approved' | 'quran' | 'oral' | 'written_admit' | 'written_test'; title: string }[] = [
  { id: 'submitted', title: 'Admission submitted' },
  { id: 'approved', title: 'Application approved' },
  { id: 'quran', title: 'Quran test' },
  { id: 'oral', title: 'Oral test' },
  { id: 'written_admit', title: 'Written test admit' },
  { id: 'written_test', title: 'Written test' },
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
            const result = getStepStatus(application, step.id);
            const { status, reason, detail } = result;
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
                            ? isNextStep
                              ? 'Next step'
                              : 'Pending'
                            : 'Upcoming'}
                    </span>
                  </div>
                  {reason && <p className="text-sm text-slate-400 mt-1">{reason}</p>}
                  {detail && <p className="text-sm text-slate-300 mt-0.5">{detail}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

/** Returns a short "last status" label for the application (e.g. for header or summary). */
export function getLastStatusLabel(application: AdmissionApplication): string {
  if (application.status === 'student') return 'Admission complete';
  if (application.status === 'rejected' || application.status === 'quran_test_failed')
    return `Application ${application.status === 'quran_test_failed' ? 'Quran test failed' : 'rejected'}`;
  if (application.writtenTestPassed === false) return 'Written test – not passed';
  if (application.writtenTestPassed === true) return 'Written test passed';
  if (application.writtenAdmitEligible) return 'Written test admit ready';
  if (application.oralTestPassed === false) return 'Oral test – not passed';
  if (application.oralTestPassed === true) return 'Oral test passed';
  if (application.quranTestPassed === false) return 'Quran test – not passed';
  if (application.quranTestPassed === true) return 'Quran test passed';
  if (application.status === 'approved') return 'Application approved';
  return 'Admission submitted';
}
