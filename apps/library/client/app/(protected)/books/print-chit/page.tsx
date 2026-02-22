'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Button,
  Input,
  Label,
  Spinner,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@arabiaaislamia/ui';
import { api } from '@/lib/api';
import { useLocale } from '@/lib/locale';
import { Printer, Search } from 'lucide-react';

const LANGUAGE_OPTIONS = ['urdu', 'english', 'arabic', 'faarsi', 'other'] as const;

type Book = {
  id: string;
  bookNumber: string;
  title: string;
  author: string | null;
  category: string | null;
  shelfNumber: string | null;
  language: string | null;
  naashirName: string | null;
};

type PrintFormat = 'a4-16';

const FORMAT_OPTIONS: { value: PrintFormat; labelKey: string }[] = [
  { value: 'a4-16', labelKey: 'books.printFormatA4_16' },
];

const CHITS_PER_PAGE = 16; // 4x4 grid on A4

function BookChit({ book, t }: { book: Book; t: (k: string) => string }) {
  const langLabel =
    book.language && LANGUAGE_OPTIONS.includes(book.language as (typeof LANGUAGE_OPTIONS)[number])
      ? t(`books.languageOptions.${book.language}`)
      : book.language ?? '';

  return (
    <div
      className="book-chit flex flex-col rounded-xl border border-emerald-200/80 bg-white shadow-md shadow-emerald-900/5 overflow-hidden print:shadow-none print:border-emerald-300"
      dir="rtl"
    >
      {/* Header: brand gradient with logo + book number */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-linear-to-l from-emerald-600 to-emerald-700">
        <span className="text-sm font-bold tracking-widest text-white tabular-nums">
          {book.bookNumber}
        </span>
        <img
          src="/images/Logo.png"
          alt="Arabia Islamia"
          className="h-6 w-6 object-contain shrink-0 drop-shadow-sm"
        />
      </div>
      {/* Body */}
      <div className="flex-1 pt-3 px-3 space-y-1.5 bg-linear-to-b from-white to-amber-50/30">
        {/* Title */}
        <div className="space-y-3 text-right ">
          <div className="text-[9px] font-bold text-emerald-700 uppercase tracking-wide">
            {t('books.bookTitle')}
          </div>
          <div className="font-bold text-[13px] leading-loose text-slate-900">
            {book.title}
          </div>
        </div>
        
        {/* Author */}
        {book.author && (
          <div className="space-y-3 text-right ">
            <div className="text-[9px] font-bold text-emerald-700 uppercase tracking-wide">
              {t('books.author')}
            </div>
            <div className="text-xs text-slate-700 font-semibold">{book.author}</div>
          </div>
        )}
        
        {/* Metadata grid */}
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
            <div className="flex items-center justify-between gap-2 py-2 border-b border-slate-200/50">
              <span className="font-bold text-slate-600 shrink-0">{t('books.mazmoon')}</span>
              <span className="text-slate-700 font-medium">{book.category}</span>
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

export default function PrintChitPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const bookIdFromUrl = searchParams.get('bookId');
  const shelfFromUrl = searchParams.get('shelfNumber');
  const autoPrint = searchParams.get('autoPrint') === 'true';
  const [shelfNumber, setShelfNumber] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [printFormat, setPrintFormat] = useState<PrintFormat>('a4-16');

  // Single-book print from books table (backward compatibility)
  useEffect(() => {
    if (!bookIdFromUrl) return;
    setLoading(true);
    api
      .get<{ data: Book }>(`/api/books/${bookIdFromUrl}`)
      .then((res) => {
        const b = res.data.data;
        if (b) setBooks([b]);
      })
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false));
  }, [bookIdFromUrl, t]);

  // Auto-load by shelf number from URL (e.g. from Print all chits modal)
  useEffect(() => {
    if (!shelfFromUrl || bookIdFromUrl) return;
    setShelfNumber(shelfFromUrl);
    setLoading(true);
    setError(null);
    api
      .get<{ data: Book[] }>('/api/books', {
        params: { shelfNumber: shelfFromUrl, limit: 500, page: 1 },
      })
      .then((res) => {
        const data = res.data.data ?? [];
        setBooks(data);
        if (data.length === 0) setError(t('books.noBooksForShelf'));
      })
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false));
  }, [shelfFromUrl, bookIdFromUrl, t]);

  // Auto-trigger print when autoPrint=true and books are loaded
  useEffect(() => {
    if (autoPrint && books.length > 0 && !loading) {
      // Small delay to ensure rendering is complete
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPrint, books.length, loading]);

  const loadBooks = useCallback(() => {
    const shelf = shelfNumber.trim();
    if (!shelf) {
      setError(t('books.enterShelfNumber'));
      return;
    }
    setError(null);
    setLoading(true);
    api
      .get<{ data: Book[]; total: number }>(`/api/books`, {
        params: { shelfNumber: shelf, limit: 500, page: 1 },
      })
      .then((res) => {
        const data = res.data.data ?? [];
        setBooks(data);
        if (data.length === 0) setError(t('books.noBooksForShelf'));
      })
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false));
  }, [shelfNumber, t]);

  function handlePrint() {
    window.print();
  }

  const pages = [];
  for (let i = 0; i < books.length; i += CHITS_PER_PAGE) {
    pages.push(books.slice(i, i + CHITS_PER_PAGE));
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/40 p-4 sm:p-6">
      <div className="no-print flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end rounded-xl border border-emerald-200/60 bg-white p-5 shadow-lg shadow-emerald-900/5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="shelf">{t('books.shelfNumber')}</Label>
          <Input
            id="shelf"
            value={shelfNumber}
            onChange={(e) => {
              setShelfNumber(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && loadBooks()}
            placeholder="e.g. A1, 12"
            className="w-full sm:w-40"
            dir="auto"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>{t('books.printFormat')}</Label>
          <Select value={printFormat} onValueChange={(v) => setPrintFormat(v as PrintFormat)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMAT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadBooks} disabled={loading} className="gap-2">
            {loading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Search className="h-4 w-4" aria-hidden />
            )}
            {t('books.loadBooks')}
          </Button>
          <Button
            onClick={handlePrint}
            disabled={books.length === 0}
            variant="default"
            className="gap-2"
          >
            <Printer className="h-4 w-4" aria-hidden />
            {t('books.printChit')}
          </Button>
        </div>
      </div>

      {error && (
        <div className="no-print rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-center text-destructive">
          {error}
        </div>
      )}

      {books.length > 0 && (
        <div id="print-area" className="mx-auto max-w-[210mm] rounded-xl border border-emerald-200/60 bg-white p-5 shadow-lg shadow-emerald-900/5 print:max-w-none print:border-0 print:shadow-none print:p-0 print:rounded-none">
          {pages.map((pageBooks, pageIdx) => (
            <div
              key={pageIdx}
              className="chit-page grid grid-cols-4 gap-3 print:mb-0"
              style={{
                padding: '10mm',
                breakAfter: pageIdx < pages.length - 1 ? 'page' : undefined,
              }}
            >
              {pageBooks.map((book) => (
                <BookChit key={book.id} book={book} t={t} />
              ))}
            </div>
          ))}
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * { visibility: hidden; }
              #print-area, #print-area * { visibility: visible; }
              #print-area {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                background: white !important;
              }
              .chit-page {
                page-break-after: always;
                margin: 0 !important;
                padding: 10mm !important;
              }
              .chit-page:last-child {
                page-break-after: auto;
              }
            }
            @page {
              size: A4;
              margin: 10mm;
            }
          `,
        }}
      />
    </div>
  );
}
