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
import type { Book, Author, Category, Nashir } from '@/types';

const LANGUAGE_OPTIONS = ['urdu', 'english', 'arabic', 'faarsi', 'other'] as const;

type EditBookModalProps = {
  open: boolean;
  book: Book | null;
  onClose: () => void;
  authors: Author[];
  categories: Category[];
  nashirs: Nashir[];
  onUpdate: (id: string, data: Partial<Book>) => Promise<void>;
  onSuccess: () => void;
  t: (k: string) => string;
};

export function EditBookModal({
  open,
  book,
  onClose,
  authors,
  categories,
  nashirs,
  onUpdate,
  onSuccess,
  t,
}: EditBookModalProps) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '',
    jillNumber: '',
    kitaabNumber: '',
    muarafName: '',
    naashirName: '',
    language: '',
    shelfNumber: '',
    keefiyat: '',
    milkiyat: '',
    totalCopies: 1,
  });

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title ?? '',
        author: book.author ?? '',
        category: book.category ?? '',
        jillNumber: book.jillNumber ?? '',
        kitaabNumber: book.kitaabNumber ?? '',
        muarafName: book.muarafName ?? '',
        naashirName: book.naashirName ?? '',
        language: book.language ?? '',
        shelfNumber: book.shelfNumber ?? '',
        keefiyat: book.keefiyat ?? '',
        milkiyat: book.milkiyat ?? '',
        totalCopies: book.totalCopies ?? 1,
      });
    }
  }, [book]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!book) return;
    await onUpdate(book.id, {
      ...form,
      author: form.author || undefined,
      category: form.category || undefined,
      naashirName: form.naashirName || undefined,
    });
    onSuccess();
    onClose();
  }

  const fieldClass = 'flex flex-col gap-1.5';

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="min-w-[60%]">
        <DialogHeader className="flex row-reverse pb-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold">{t('books.edit')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-1 pt-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <div className={`${fieldClass} col-span-2`}>
              <Label>{t('books.bookTitle')}</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} dir="rtl" required className="h-9" />
            </div>
            <div className={fieldClass}>
              <Label>{t('books.jillNumber')}</Label>
              <Input value={form.jillNumber} onChange={(e) => setForm((f) => ({ ...f, jillNumber: e.target.value }))} dir="rtl" className="h-9" />
            </div>
            <div className={fieldClass}>
              <Label>{t('books.kitaabNumber')}</Label>
              <Input value={form.kitaabNumber} onChange={(e) => setForm((f) => ({ ...f, kitaabNumber: e.target.value }))} dir="rtl" className="h-9" />
            </div>
            <div className={fieldClass}>
              <Label>{t('books.author')}</Label>
              <SearchSelect value={form.author} onValueChange={(v) => setForm((f) => ({ ...f, author: v }))} options={authors.map((a) => ({ value: a.name, label: a.name }))} placeholder={t('common.search')} emptyMessage={t('common.noResults')} className="h-9" />
            </div>
            <div className={fieldClass}>
              <Label>{t('books.mazmoon')}</Label>
              <SearchSelect value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))} options={categories.map((c) => ({ value: c.name, label: c.name }))} placeholder={t('common.search')} emptyMessage={t('common.noResults')} className="h-9" />
            </div>
            <div className={fieldClass}>
              <Label>{t('books.language')}</Label>
              <SearchSelect value={form.language} onValueChange={(v) => setForm((f) => ({ ...f, language: v }))} options={LANGUAGE_OPTIONS.map((l) => ({ value: l, label: t(`books.languageOptions.${l}`) }))} placeholder={t('books.selectLanguage')} emptyMessage={t('common.noResults')} className="h-9" />
            </div>
            <div className={fieldClass}>
              <Label>{t('books.muarafName')}</Label>
              <Input value={form.muarafName} onChange={(e) => setForm((f) => ({ ...f, muarafName: e.target.value }))} dir="rtl" className="h-9" />
            </div>
            <div className={fieldClass}>
              <Label>{t('books.naashirName')}</Label>
              <SearchSelect value={form.naashirName} onValueChange={(v) => setForm((f) => ({ ...f, naashirName: v }))} options={nashirs.map((n) => ({ value: n.name, label: n.name }))} placeholder={t('common.search')} emptyMessage={t('common.noResults')} className="h-9" />
            </div>
            <div className={fieldClass}>
              <Label>{t('books.shelfNumber')}</Label>
              <Input value={form.shelfNumber} onChange={(e) => setForm((f) => ({ ...f, shelfNumber: e.target.value }))} dir="rtl" className="h-9" />
            </div>
            <div className={fieldClass}>
              <Label>{t('books.keefiyat')}</Label>
              <Input value={form.keefiyat} onChange={(e) => setForm((f) => ({ ...f, keefiyat: e.target.value }))} dir="rtl" className="h-9" />
            </div>
            <div className={fieldClass}>
              <Label>{t('books.milkiyat')}</Label>
              <Input value={form.milkiyat} onChange={(e) => setForm((f) => ({ ...f, milkiyat: e.target.value }))} dir="rtl" className="h-9" />
            </div>
            <div className={fieldClass}>
              <Label>{t('books.totalCopies')}</Label>
              <Input type="number" min={1} value={form.totalCopies} onChange={(e) => setForm((f) => ({ ...f, totalCopies: +e.target.value || 1 }))} className="h-9" />
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <Button type="submit" className="w-full py-5 font-medium">{t('books.save')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
