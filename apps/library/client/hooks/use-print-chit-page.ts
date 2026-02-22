import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBookById } from './use-books';
import { useBooksByShelf } from './use-books';
import type { Book } from '@/types';

export type PrintFormat = 'a4-16';

export function usePrintChitPage(t: (k: string) => string) {
  const searchParams = useSearchParams();
  const bookIdFromUrl = searchParams.get('bookId');
  const shelfFromUrl = searchParams.get('shelfNumber');
  const autoPrint = searchParams.get('autoPrint') === 'true';

  const [shelfNumber, setShelfNumber] = useState(shelfFromUrl ?? '');
  const [appliedShelf, setAppliedShelf] = useState<string | null>(shelfFromUrl);
  const [printFormat, setPrintFormat] = useState<PrintFormat>('a4-16');
  const [localError, setLocalError] = useState<string | null>(null);

  const bookByIdQuery = useBookById(bookIdFromUrl);
  const effectiveShelf = shelfFromUrl || appliedShelf;
  const booksByShelfQuery = useBooksByShelf(effectiveShelf && !bookIdFromUrl ? effectiveShelf : null);

  const isBookMode = !!bookIdFromUrl;
  const isShelfMode = !bookIdFromUrl && !!effectiveShelf;

  const books: Book[] = isBookMode
    ? bookByIdQuery.data
      ? [bookByIdQuery.data]
      : []
    : isShelfMode
      ? booksByShelfQuery.data ?? []
      : [];

  const loading = isBookMode ? bookByIdQuery.isLoading : isShelfMode ? booksByShelfQuery.isLoading : false;
  const queryError = isBookMode
    ? bookByIdQuery.isError
      ? t('common.error')
      : null
    : isShelfMode
      ? booksByShelfQuery.isError
        ? t('common.error')
        : books.length === 0 && !loading && appliedShelf
          ? t('books.noBooksForShelf')
          : null
      : null;
  const error = localError ?? queryError;

  useEffect(() => {
    if (shelfFromUrl && !bookIdFromUrl) {
      setShelfNumber(shelfFromUrl);
      setAppliedShelf(shelfFromUrl);
    }
  }, [shelfFromUrl, bookIdFromUrl]);

  useEffect(() => {
    if (autoPrint && books.length > 0 && !loading) {
      const timer = setTimeout(() => window.print(), 500);
      return () => clearTimeout(timer);
    }
  }, [autoPrint, books.length, loading]);

  const loadBooks = useCallback(() => {
    const shelf = shelfNumber.trim();
    if (!shelf) {
      setLocalError(t('books.enterShelfNumber'));
      return;
    }
    setLocalError(null);
    setAppliedShelf(shelf);
  }, [shelfNumber, t]);

  const handleShelfInputChange = useCallback((value: string) => {
    setShelfNumber(value);
    setLocalError(null);
  }, []);

  return {
    shelfNumber,
    setShelfNumber: handleShelfInputChange,
    printFormat,
    setPrintFormat,
    books,
    loading,
    error,
    loadBooks,
    handlePrint: () => window.print(),
    t,
  };
}
