import { useState, useCallback } from 'react';
import { useModal } from '@arabiaaislamia/ui';
import { useBooksList, useBooksCreate, useBooksDelete } from './use-books';
import { useBookAuthors, useBookAuthorsCreate } from './use-book-authors';
import { useBookCategories, useBookCategoriesCreate } from './use-book-categories';
import { useBookNashirs, useBookNashirsCreate } from './use-book-nashirs';
import { booksService } from '@/services';
import type { Book } from '@/types';

const FILTER_KEYS = [
  'bookNumber', 'title', 'author', 'category', 'jillNumber', 'kitaabNumber',
  'muarafName', 'naashirName', 'language', 'shelfNumber', 'keefiyat', 'milkiyat',
] as const;

export function useBooksPage(t: (k: string) => string) {
  const modal = useModal();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [viewBook, setViewBook] = useState<Book | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printCategory, setPrintCategory] = useState<'shelf' | ''>('');
  const [printShelfNumber, setPrintShelfNumber] = useState('');
  const [printLoading, setPrintLoading] = useState(false);

  const filterObj = Object.fromEntries(
    FILTER_KEYS.map((k) => [k, filters[k] ?? '']).filter(([, v]) => v?.trim())
  ) as Record<string, string>;

  const booksQuery = useBooksList(page, filterObj);
  const authorsQuery = useBookAuthors();
  const categoriesQuery = useBookCategories();
  const nashirsQuery = useBookNashirs();
  const createBook = useBooksCreate();
  const deleteBook = useBooksDelete();
  const createAuthor = useBookAuthorsCreate();
  const createCategory = useBookCategoriesCreate();
  const createNashir = useBookNashirsCreate();

  const books = booksQuery.data?.data ?? [];
  const totalPages = booksQuery.data?.totalPages ?? 1;
  const total = booksQuery.data?.total ?? 0;

  const openAddBook = useCallback(() => setAddBookOpen(true), []);
  const closeAddBook = useCallback(() => setAddBookOpen(false), []);
  const openViewBook = useCallback((book: Book) => setViewBook(book), []);
  const closeViewBook = useCallback(() => setViewBook(null), []);

  const openDeleteConfirm = useCallback(
    (book: Book) => {
      modal.confirmation({
        title: t('books.delete'),
        description: t('books.deleteConfirm'),
        confirmText: t('common.confirm'),
        cancelText: t('common.cancel'),
        variant: 'destructive',
        onConfirm: async () => {
          await deleteBook.mutateAsync(book.id);
        },
      });
    },
    [modal, deleteBook, t]
  );

  const openPrintModal = useCallback(() => {
    setPrintCategory('');
    setPrintShelfNumber('');
    setPrintModalOpen(true);
  }, []);

  const handlePrintAll = useCallback(async () => {
    if (printCategory !== 'shelf' || !printShelfNumber.trim()) return;
    setPrintLoading(true);
    try {
      const data = await booksService.getByShelf(printShelfNumber.trim());
      if (data.length === 0) {
        alert(t('books.noBooksForShelf'));
        return;
      }
      const shelf = encodeURIComponent(printShelfNumber.trim());
      window.location.href = `/books/print-chit?shelfNumber=${shelf}&autoPrint=true`;
    } catch {
      alert(t('common.error'));
    } finally {
      setPrintLoading(false);
    }
  }, [printCategory, printShelfNumber, t]);

  const applyFilters = useCallback(() => setPage(1), []);

  const handleAddBookSuccess = useCallback(async () => {
    await booksQuery.refetch();
    closeAddBook();
  }, [booksQuery, closeAddBook]);

  return {
    page,
    setPage,
    filters,
    setFilters,
    filterKeys: FILTER_KEYS,
    books,
    total,
    totalPages,
    loading: booksQuery.isLoading,
    authors: authorsQuery.data ?? [],
    categories: categoriesQuery.data ?? [],
    nashirs: nashirsQuery.data ?? [],
    createBook,
    createAuthor,
    createCategory,
    createNashir,
    addBookOpen,
    openAddBook,
    closeAddBook,
    viewBook,
    openViewBook,
    closeViewBook,
    openDeleteConfirm,
    openPrintModal,
    printModalOpen,
    setPrintModalOpen,
    printCategory,
    setPrintCategory,
    printShelfNumber,
    setPrintShelfNumber,
    printLoading,
    handlePrintAll,
    applyFilters,
    handleAddBookSuccess,
  };
}
