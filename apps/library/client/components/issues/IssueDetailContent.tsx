'use client';

import { DialogHeader, DialogTitle } from '@arabiaaislamia/ui';
import type { BookIssue } from '@/types';

type Props = { issue: BookIssue; t: (k: string) => string };

export function IssueDetailContent({ issue, t }: Props) {
  const rows: { label: string; value: string }[] = [
    { label: t('books.title'), value: issue.book?.title ?? issue.bookId },
    { label: t('issues.issuedTo'), value: issue.issuedTo },
    { label: t('issues.issued'), value: issue.issuedAt ? new Date(issue.issuedAt).toLocaleDateString() : '–' },
    { label: t('issues.dueAt'), value: issue.dueAt },
    { label: t('issues.status'), value: issue.status === 'issued' ? t('issues.issued') : t('issues.returned') },
    { label: t('issues.returned'), value: issue.returnedAt ? new Date(issue.returnedAt).toLocaleDateString() : '–' },
  ];
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>{t('issues.viewDetails')}</DialogTitle>
      </DialogHeader>
      <dl className="grid gap-3 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-2">
            <dt className="font-medium text-muted-foreground min-w-[120px]">{r.label}</dt>
            <dd dir="rtl" className="text-foreground">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
