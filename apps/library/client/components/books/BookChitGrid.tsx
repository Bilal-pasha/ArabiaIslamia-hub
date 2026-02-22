'use client';

import { BookChit } from './BookChit';
import type { Book } from '@/types';

const CHITS_PER_PAGE = 16;

type Props = { books: Book[]; t: (k: string) => string };

export function BookChitGrid({ books, t }: Props) {
  const pages: Book[][] = [];
  for (let i = 0; i < books.length; i += CHITS_PER_PAGE) {
    pages.push(books.slice(i, i + CHITS_PER_PAGE));
  }
  return (
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
  );
}
