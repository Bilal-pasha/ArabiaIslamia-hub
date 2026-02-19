'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Spinner } from '@arabiaaislamia/ui';
import { api } from '@/lib/api';
import { useLocale } from '@/lib/locale';
import { Printer } from 'lucide-react';

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

export default function PrintChitPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const bookId = searchParams.get('bookId');
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) {
      setError('Book ID required');
      setLoading(false);
      return;
    }
    api
      .get<{ data: Book }>(`/api/books/${bookId}`)
      .then((res) => setBook(res.data.data))
      .catch(() => setError('Failed to load book'))
      .finally(() => setLoading(false));
  }, [bookId]);

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center text-destructive">
        {error ?? 'Book not found'}
      </div>
    );
  }

  const langLabel =
    book.language && LANGUAGE_OPTIONS.includes(book.language as (typeof LANGUAGE_OPTIONS)[number])
      ? t(`books.languageOptions.${book.language}`)
      : book.language ?? '';

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="no-print flex items-center gap-4">
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" aria-hidden />
          {t('books.printChit')}
        </Button>
        <Button variant="outline" onClick={() => window.close()}>
          {t('common.cancel')}
        </Button>
      </div>

      <div
        id="book-chit"
        className="book-chit w-full max-w-[320px] rounded-lg border-2 border-foreground/20 bg-white p-4 shadow-md print:max-w-none print:shadow-none print:border-2"
        dir="auto"
        style={{ minHeight: '140px' }}
      >
        <div className="mb-2 text-center">
          <span className="text-2xl font-bold tracking-wider text-foreground">
            {book.bookNumber}
          </span>
        </div>
        <div className="space-y-1 text-sm">
          <div className="font-semibold leading-tight text-foreground line-clamp-2">
            {book.title}
          </div>
          {book.author && (
            <div className="text-muted-foreground">{book.author}</div>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-0 text-xs text-muted-foreground">
            {book.shelfNumber && (
              <span>{t('books.shelfNumber')}: {book.shelfNumber}</span>
            )}
            {book.category && (
              <span>{t('books.mazmoon')}: {book.category}</span>
            )}
            {langLabel && <span>{langLabel}</span>}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * { visibility: hidden; }
              #book-chit, #book-chit * { visibility: visible; }
              #book-chit {
                position: absolute !important;
                left: 50% !important;
                top: 50% !important;
                transform: translate(-50%, -50%) !important;
                width: 320px !important;
                max-width: 320px !important;
                box-shadow: none !important;
              }
            }
          `,
        }}
      />
    </div>
  );
}
