'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Button,
  SearchSelect,
} from '@arabiaaislamia/ui';
import type { BookIssue, BookListItem } from '@/types';

type EditIssueModalProps = {
  open: boolean;
  issue: BookIssue | null;
  books: BookListItem[];
  onClose: () => void;
  onUpdate: (id: string, data: { bookId?: string; issuedTo?: string; dueAt?: string }) => Promise<void>;
  onSuccess: () => void;
  t: (k: string) => string;
};

export function EditIssueModal({
  open,
  issue,
  books,
  onClose,
  onUpdate,
  onSuccess,
  t,
}: EditIssueModalProps) {
  const [form, setForm] = useState({ bookId: '', issuedTo: '', dueAt: '' });

  useEffect(() => {
    if (issue) {
      const dueAt = issue.dueAt ? new Date(issue.dueAt).toISOString().slice(0, 10) : '';
      setForm({
        bookId: issue.bookId ?? '',
        issuedTo: issue.issuedTo ?? '',
        dueAt,
      });
    }
  }, [issue]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!issue) return;
    await onUpdate(issue.id, {
      bookId: form.bookId || undefined,
      issuedTo: form.issuedTo,
      dueAt: form.dueAt,
    });
    onSuccess();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex row-reverse pb-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold">{t('issues.editIssue')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="flex flex-col gap-4 pt-4">
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
          <div className="pt-2 border-t border-border">
            <Button type="submit" className="w-full py-4">{t('books.save')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
