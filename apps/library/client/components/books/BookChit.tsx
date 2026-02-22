'use client';

import type { Book } from '@/types';

const LANGUAGE_OPTIONS = ['urdu', 'english', 'arabic', 'faarsi', 'other'] as const;

type Props = { book: Book; t: (k: string) => string };

export function BookChit({ book, t }: Props) {
  const langLabel =
    book.language && LANGUAGE_OPTIONS.includes(book.language as (typeof LANGUAGE_OPTIONS)[number])
      ? t(`books.languageOptions.${book.language}`)
      : book.language ?? '';

  return (
    <div
      className="book-chit flex flex-col rounded-xl border border-emerald-200/80 bg-white shadow-md shadow-emerald-900/5 overflow-hidden print:shadow-none print:border-emerald-300"
      dir="rtl"
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-linear-to-l from-emerald-600 to-emerald-700">
        <span className="text-sm font-bold tracking-widest text-white tabular-nums">{book.bookNumber}</span>
        <img src="/images/Logo.png" alt="Arabia Islamia" className="h-6 w-6 object-contain shrink-0 drop-shadow-sm" />
      </div>
      <div className="flex-1 p-3 space-y-1.5 bg-linear-to-b from-white to-amber-50/30">
        <div className="space-y-3 text-right">
          <div className="text-[9px] font-bold text-emerald-700 uppercase tracking-wide">{t('books.bookTitle')}</div>
          <div className="font-bold text-[13px] leading-loose text-slate-900">{book.title}</div>
        </div>
        {book.author && (
          <div className="space-y-3 text-right">
            <div className="text-[9px] font-bold text-emerald-700 uppercase tracking-wide">{t('books.author')}</div>
            <div className="text-xs text-slate-700 font-semibold">{book.author}</div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-0 pt-1 text-[10px] border-t border-slate-200/60">
          {book.shelfNumber && (
            <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-200/50">
              <span className="font-bold text-amber-700">{t('books.shelfNumber')}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200/60">
                {book.shelfNumber}
              </span>
            </div>
          )}
          {book.category && (
            <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-200/50">
              <span className="font-bold text-slate-600 shrink-0">{t('books.mazmoon')}</span>
              <span className="text-slate-700 font-medium line-clamp-1">{book.category}</span>
            </div>
          )}
          {langLabel && (
            <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-200/50 last:border-b-0">
              <span className="font-bold text-slate-600 shrink-0">{t('books.language')}</span>
              <span className="text-slate-700 font-medium italic">{langLabel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
