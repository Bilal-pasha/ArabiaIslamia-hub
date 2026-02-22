'use client';

import { useState } from 'react';
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
import type { Author, Category, Nashir } from '@/types';

const LANGUAGE_OPTIONS = ['urdu', 'english', 'arabic', 'faarsi', 'other'] as const;

const initialForm = {
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
};

type AddBookModalProps = {
  open: boolean;
  onClose: () => void;
  authors: Author[];
  categories: Category[];
  nashirs: Nashir[];
  onCreateBook: (data: Record<string, unknown>) => Promise<{ id?: string }>;
  onCreateAuthor: (name: string) => Promise<void>;
  onCreateCategory: (name: string) => Promise<void>;
  onCreateNashir: (name: string) => Promise<void>;
  onSuccess: () => void;
  t: (k: string) => string;
};

export function AddBookModal({
  open,
  onClose,
  authors,
  categories,
  nashirs,
  onCreateBook,
  onCreateAuthor,
  onCreateCategory,
  onCreateNashir,
  onSuccess,
  t,
}: AddBookModalProps) {
  const [form, setForm] = useState(initialForm);
  const [addMoreOpen, setAddMoreOpen] = useState(false);
  const [addMoreType, setAddMoreType] = useState<'author' | 'category' | 'nashir'>('author');
  const [addMoreValue, setAddMoreValue] = useState('');

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await onCreateBook({
      ...form,
      author: form.author || undefined,
      category: form.category || undefined,
      naashirName: form.naashirName || undefined,
    });
    onSuccess();
    onClose();
  }

  async function handleAddMore(e: React.FormEvent) {
    e.preventDefault();
    const name = addMoreValue.trim();
    if (!name) return;
    if (addMoreType === 'author') {
      await onCreateAuthor(name);
      setForm((f) => ({ ...f, author: name }));
    } else if (addMoreType === 'category') {
      await onCreateCategory(name);
      setForm((f) => ({ ...f, category: name }));
    } else {
      await onCreateNashir(name);
      setForm((f) => ({ ...f, naashirName: name }));
    }
    setAddMoreOpen(false);
    setAddMoreValue('');
  }

  const fieldClass = 'flex flex-col gap-1.5';
  const addMoreLabel =
    addMoreType === 'author' ? t('settings.authorName') : addMoreType === 'category' ? t('settings.categoryName') : t('settings.nashirName');

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="min-w-[60%]">
          <DialogHeader className="flex row-reverse pb-4 border-b border-border">
            <DialogTitle className="text-lg font-semibold">{t('books.addBook')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-1 pt-4">
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
                <div className="flex justify-between">
                  <Label>{t('books.author')}</Label>
                  <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setAddMoreType('author'); setAddMoreValue(''); setAddMoreOpen(true); }}>
                    + {t('books.addMore')}
                  </Button>
                </div>
                <SearchSelect value={form.author} onValueChange={(v) => setForm((f) => ({ ...f, author: v }))} options={authors.map((a) => ({ value: a.name, label: a.name }))} placeholder={t('common.search')} emptyMessage={t('common.noResults')} className="h-9" />
              </div>
              <div className={fieldClass}>
                <div className="flex justify-between">
                  <Label>{t('books.mazmoon')}</Label>
                  <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setAddMoreType('category'); setAddMoreValue(''); setAddMoreOpen(true); }}>
                    + {t('books.addMore')}
                  </Button>
                </div>
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
                <div className="flex justify-between">
                  <Label>{t('books.naashirName')}</Label>
                  <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setAddMoreType('nashir'); setAddMoreValue(''); setAddMoreOpen(true); }}>
                    + {t('books.addMore')}
                  </Button>
                </div>
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
      <Dialog open={addMoreOpen} onOpenChange={setAddMoreOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{addMoreLabel}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMore} className="flex flex-col gap-4 pt-2">
            <Input value={addMoreValue} onChange={(e) => setAddMoreValue(e.target.value)} dir="rtl" placeholder={addMoreLabel} className="h-9" autoFocus />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setAddMoreOpen(false)}>{t('common.cancel')}</Button>
              <Button type="submit">{t('common.add')}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
