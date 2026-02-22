'use client';

import { useState } from 'react';
import { Button, Input, Label, SearchSelect, DialogHeader, DialogTitle } from '@arabiaaislamia/ui';
import type { UseMutationResult } from '@tanstack/react-query';
import type { BookListItem } from '@/types';

type Props = {
  t: (k: string) => string;
  books: BookListItem[];
  createIssue: UseMutationResult<void, Error, { bookId: string; issuedTo: string; dueAt: string }>;
  onSuccess: () => void;
};

export function IssueBookFormContent(p: Props) {
  const { t, books, createIssue, onSuccess } = p;
  const [form, setForm] = useState({ bookId: '', issuedTo: '', dueAt: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createIssue.mutateAsync({ bookId: form.bookId, issuedTo: form.issuedTo, dueAt: form.dueAt });
    onSuccess();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('issues.issueBook')}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>{t('books.title')}</Label>
            <SearchSelect
              value={form.bookId}
              onValueChange={(v) => setForm((f) => ({ ...f, bookId: v }))}
              options={books.map((b) => ({ value: b.id, label: b.title }))}
              placeholder={t('issues.selectBook')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>{t('issues.issuedTo')}</Label>
            <Input value={form.issuedTo} onChange={(e) => setForm((f) => ({ ...f, issuedTo: e.target.value }))} dir="rtl" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>{t('issues.dueAt')}</Label>
            <Input type="date" value={form.dueAt} onChange={(e) => setForm((f) => ({ ...f, dueAt: e.target.value }))} required />
          </div>
          <Button type="submit" className="py-4" disabled={createIssue.isPending}>
            {t('books.save')}
          </Button>
        </form>
      </div>
    </>
  );
}
