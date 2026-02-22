'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  Card,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  TableSkeleton,
  useModal,
  SearchSelect,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from '@arabiaaislamia/ui';
import { defaultTransition, fadeInUp, staggerContainer } from '@arabiaaislamia/animations';
import { useLocale } from '@/lib/locale';
import { api } from '@/lib/api';
import { Plus, Eye, Trash2, ChevronLeft, ChevronRight, MoreVertical, Printer } from 'lucide-react';

const LANGUAGE_OPTIONS = ['urdu', 'english', 'arabic', 'faarsi', 'other'] as const;

type Book = {
  id: string;
  bookNumber: string;
  title: string;
  author: string | null;
  category: string | null;
  totalCopies: number;
  jillNumber: string | null;
  kitaabNumber: string | null;
  muarafName: string | null;
  naashirName: string | null;
  language: string | null;
  shelfNumber: string | null;
  keefiyat: string | null;
  milkiyat: string | null;
  createdAt?: string;
};

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

const FILTER_KEYS = ['bookNumber', 'title', 'author', 'category', 'jillNumber', 'kitaabNumber', 'muarafName', 'naashirName', 'language', 'shelfNumber', 'keefiyat', 'milkiyat'] as const;

function AddBookFormContent({
  t,
  onSuccess,
}: {
  t: (k: string) => string;
  onSuccess: (bookId?: string) => void | Promise<void>;
}) {
  const [form, setForm] = useState(initialForm);
  const [addMoreOpen, setAddMoreOpen] = useState(false);
  const [addMoreType, setAddMoreType] = useState<'author' | 'category' | 'nashir'>('author');
  const [addMoreValue, setAddMoreValue] = useState('');
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [nashirs, setNashirs] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    api.get('/api/book-authors').then((r) => setAuthors(r.data.data || []));
    api.get('/api/book-categories').then((r) => setCategories(r.data.data || []));
    api.get('/api/book-nashirs').then((r) => setNashirs(r.data.data || []));
  }, []);

  function openAddMore(type: 'author' | 'category' | 'nashir') {
    setAddMoreType(type);
    setAddMoreValue('');
    setAddMoreOpen(true);
  }

  async function handleAddMore(e: React.FormEvent) {
    e.preventDefault();
    const name = addMoreValue.trim();
    if (!name) return;
    try {
      if (addMoreType === 'author') {
        await api.post('/api/book-authors', { name });
        const res = await api.get<{ data: { id: string; name: string }[] }>('/api/book-authors');
        setAuthors(res.data.data || []);
        setForm((f) => ({ ...f, author: name }));
      } else if (addMoreType === 'category') {
        await api.post('/api/book-categories', { name });
        const res = await api.get<{ data: { id: string; name: string }[] }>('/api/book-categories');
        setCategories(res.data.data || []);
        setForm((f) => ({ ...f, category: name }));
      } else {
        await api.post('/api/book-nashirs', { name });
        const res = await api.get<{ data: { id: string; name: string }[] }>('/api/book-nashirs');
        setNashirs(res.data.data || []);
        setForm((f) => ({ ...f, naashirName: name }));
      }
      setAddMoreOpen(false);
    } catch {
      // Error handled by API
    }
  }

  const addMoreLabel =
    addMoreType === 'author'
      ? t('settings.authorName')
      : addMoreType === 'category'
        ? t('settings.categoryName')
        : t('settings.nashirName');

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const authorVal = form.author || undefined;
    const categoryVal = form.category || undefined;
    const naashirVal = form.naashirName || undefined;
    const res = await api.post<{ data: { id: string } }>('/api/books', {
      title: form.title,
      author: authorVal || undefined,
      category: categoryVal || undefined,
      jillNumber: form.jillNumber || undefined,
      kitaabNumber: form.kitaabNumber || undefined,
      muarafName: form.muarafName || undefined,
      naashirName: naashirVal || undefined,
      language: form.language || undefined,
      shelfNumber: form.shelfNumber || undefined,
      keefiyat: form.keefiyat || undefined,
      milkiyat: form.milkiyat || undefined,
      totalCopies: form.totalCopies,
    });
    const bookId = res.data?.data?.id;
    await onSuccess(bookId);
  }

  const fieldClass = 'flex flex-col gap-1.5';
  return (
    <>
      <DialogHeader className="flex row-reverse pb-4 border-b border-border">
        <DialogTitle className="text-lg font-semibold">{t('books.addBook')}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleAdd} className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-1 pt-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          <div className={`${fieldClass} col-span-2`}>
            <Label className="text-sm font-medium text-foreground">{t('books.bookTitle')}</Label>
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} dir="rtl" required className="h-9" />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.jillNumber')}</Label>
            <Input value={form.jillNumber} onChange={(e) => setForm((f) => ({ ...f, jillNumber: e.target.value }))} dir="rtl" className="h-9" />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.kitaabNumber')}</Label>
            <Input value={form.kitaabNumber} onChange={(e) => setForm((f) => ({ ...f, kitaabNumber: e.target.value }))} dir="rtl" className="h-9" />
          </div>
          <div className={fieldClass}>
            <div className="flex items-center justify-between gap-2">
              <Label className="text-sm font-medium text-foreground">{t('books.author')}</Label>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs shrink-0 text-primary hover:text-primary/90 hover:bg-primary/5" onClick={() => openAddMore('author')}>
                + {t('books.addMore')}
              </Button>
            </div>
            <SearchSelect
              value={form.author || ''}
              onValueChange={(v) => setForm((f) => ({ ...f, author: v }))}
              options={authors.map((a) => ({ value: a.name, label: a.name }))}
              placeholder={t('common.search')}
              emptyMessage={t('common.noResults')}
              className="h-9"
            />
          </div>
          <div className={fieldClass}>
            <div className="flex items-center justify-between gap-2">
              <Label className="text-sm font-medium text-foreground">{t('books.mazmoon')}</Label>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs shrink-0 text-primary hover:text-primary/90 hover:bg-primary/5" onClick={() => openAddMore('category')}>
                + {t('books.addMore')}
              </Button>
            </div>
            <SearchSelect
              value={form.category || ''}
              onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              options={categories.map((c) => ({ value: c.name, label: c.name }))}
              placeholder={t('common.search')}
              emptyMessage={t('common.noResults')}
              className="h-9"
            />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.language')}</Label>
            <SearchSelect
              value={form.language || ''}
              onValueChange={(v) => setForm((f) => ({ ...f, language: v }))}
              options={LANGUAGE_OPTIONS.map((l) => ({ value: l, label: t(`books.languageOptions.${l}`) }))}
              placeholder={t('books.selectLanguage')}
              emptyMessage={t('common.noResults')}
              className="h-9"
            />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.muarafName')}</Label>
            <Input value={form.muarafName} onChange={(e) => setForm((f) => ({ ...f, muarafName: e.target.value }))} dir="rtl" className="h-9" />
          </div>
          <div className={fieldClass}>
            <div className="flex items-center justify-between gap-2">
              <Label className="text-sm font-medium text-foreground">{t('books.naashirName')}</Label>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs shrink-0 text-primary hover:text-primary/90 hover:bg-primary/5" onClick={() => openAddMore('nashir')}>
                + {t('books.addMore')}
              </Button>
            </div>
            <SearchSelect
              value={form.naashirName || ''}
              onValueChange={(v) => setForm((f) => ({ ...f, naashirName: v }))}
              options={nashirs.map((n) => ({ value: n.name, label: n.name }))}
              placeholder={t('common.search')}
              emptyMessage={t('common.noResults')}
              className="h-9"
            />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.shelfNumber')}</Label>
            <Input value={form.shelfNumber} onChange={(e) => setForm((f) => ({ ...f, shelfNumber: e.target.value }))} dir="rtl" className="h-9" />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.keefiyat')}</Label>
            <Input value={form.keefiyat} onChange={(e) => setForm((f) => ({ ...f, keefiyat: e.target.value }))} dir="rtl" className="h-9" />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.milkiyat')}</Label>
            <Input value={form.milkiyat} onChange={(e) => setForm((f) => ({ ...f, milkiyat: e.target.value }))} dir="rtl" className="h-9" />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.totalCopies')}</Label>
            <Input type="number" min={1} value={form.totalCopies} onChange={(e) => setForm((f) => ({ ...f, totalCopies: +e.target.value || 1 }))} className="h-9" />
          </div>
        </div>
        <div className="pt-2 border-t border-border">
          <Button type="submit" className="w-full py-5 font-medium">{t('books.save')}</Button>
        </div>
      </form>

      <Dialog open={addMoreOpen} onOpenChange={setAddMoreOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{addMoreLabel}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMore} className="flex flex-col gap-4 pt-2">
            <Input
              value={addMoreValue}
              onChange={(e) => setAddMoreValue(e.target.value)}
              dir="rtl"
              placeholder={addMoreLabel}
              className="h-9"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setAddMoreOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">{t('common.add')}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function BookDetailContent({ book, t }: { book: Book; t: (k: string) => string }) {
  const rows: { label: string; value: string | number }[] = [
    { label: t('books.bookNumber'), value: book.bookNumber },
    { label: t('books.bookTitle'), value: book.title },
    { label: t('books.jillNumber'), value: book.jillNumber ?? '–' },
    { label: t('books.kitaabNumber'), value: book.kitaabNumber ?? '–' },
    { label: t('books.author'), value: book.author ?? '–' },
    { label: t('books.muarafName'), value: book.muarafName ?? '–' },
    { label: t('books.naashirName'), value: book.naashirName ?? '–' },
    { label: t('books.language'), value: book.language ? (LANGUAGE_OPTIONS.includes(book.language as (typeof LANGUAGE_OPTIONS)[number]) ? t(`books.languageOptions.${book.language}`) : book.language) : '–' },
    { label: t('books.shelfNumber'), value: book.shelfNumber ?? '–' },
    { label: t('books.keefiyat'), value: book.keefiyat ?? '–' },
    { label: t('books.milkiyat'), value: book.milkiyat ?? '–' },
    { label: t('books.mazmoon'), value: book.category ?? '–' },
    { label: t('books.totalCopies'), value: book.totalCopies },
    { label: t('books.createdDate'), value: book.createdAt ? new Date(book.createdAt).toLocaleDateString() : '–' },
  ];
  return (
    <div className="space-y-4">
      <DialogHeader className="flex row-reverse">
        <DialogTitle>{t('books.viewDetails')}</DialogTitle>
      </DialogHeader>
      <dl className="grid gap-3 text-sm divide-y divide-border/80">
        {rows.map((r, i) => (
          <div key={r.label+ i} className="flex gap-2 py-3">
            <dt className="font-medium text-muted-foreground min-w-[140px]">{r.label}</dt>
            <dd dir="auto" className="text-foreground">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function BooksPage() {
  const { t } = useLocale();
  const modal = useModal();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [printAllModalOpen, setPrintAllModalOpen] = useState(false);
  const [printCategory, setPrintCategory] = useState<'shelf' | ''>('');
  const [printShelfNumber, setPrintShelfNumber] = useState('');
  const [printLoading, setPrintLoading] = useState(false);

  const fetchBooks = useCallback(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '10');
    FILTER_KEYS.forEach((k) => {
      const v = filters[k];
      if (v?.trim()) params.set(k, v.trim());
    });
    api.get(`/api/books?${params}`)
      .then((res) => {
        setBooks(res.data.data || []);
        setTotal(res.data.total ?? 0);
        setTotalPages(res.data.totalPages ?? 1);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [page, filters]);

  useEffect(() => {
    setLoading(true);
    fetchBooks();
  }, [fetchBooks]);

  function openAddBookModal() {
    modal.custom({
      content: (
        <AddBookFormContent
          t={t}
          onSuccess={async () => {
            fetchBooks();
            modal.close();
          }}
        />
      ),
      contentClassName: 'min-w-[60%]',
      showClose: true,
    });
  }

  function openViewModal(book: Book) {
    modal.custom({
      content: <BookDetailContent book={book} t={t} />,
      contentClassName: 'sm:max-w-lg',
      showClose: true,
    });
  }

  function openDeleteConfirm(book: Book) {
    modal.confirmation({
      title: t('books.delete'),
      description: t('books.deleteConfirm'),
      confirmText: t('common.confirm'),
      cancelText: t('common.cancel'),
      variant: 'destructive',
      onConfirm: async () => {
        await api.delete(`/api/books/${book.id}`);
        fetchBooks();
      },
    });
  }

  function applyFilters() {
    setPage(1);
  }

  function openPrintAllModal() {
    setPrintCategory('');
    setPrintShelfNumber('');
    setPrintAllModalOpen(true);
  }

  async function handlePrintAllChits() {
    if (printCategory !== 'shelf' || !printShelfNumber.trim()) return;
    const shelf = printShelfNumber.trim();
    
    setPrintLoading(true);
    try {
      // Fetch books for the shelf
      const res = await api.get<{ data: Book[] }>('/api/books', {
        params: { shelfNumber: shelf, limit: 500, page: 1 },
      });
      const booksData = res.data.data ?? [];
      
      if (booksData.length === 0) {
        alert(t('books.noBooksForShelf'));
        setPrintLoading(false);
        return;
      }
      
      // Navigate to print page with shelf number (will auto-load and can be printed)
      const shelfParam = encodeURIComponent(shelf);
      window.location.href = `/books/print-chit?shelfNumber=${shelfParam}&autoPrint=true`;
    } catch (error) {
      alert(t('common.error'));
      setPrintLoading(false);
    }
  }

  if (loading && books.length === 0) {
    return (
      <motion.div
        className="space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        transition={defaultTransition}
      >
        <motion.div variants={fadeInUp} className="flex justify-between items-center flex-wrap gap-4">
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="h-10 w-36 rounded bg-muted animate-pulse" />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-9 rounded bg-muted/80 animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card>
            <CardContent className="p-0">
              <TableSkeleton numberOfRows={8} className="p-4" />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      transition={defaultTransition}
    >
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">{t('books.title')}</h1>
        </div>
        <Button onClick={openAddBookModal} className="gap-2 shrink-0 shadow-sm bg-primary text-primary-foreground hover:opacity-90 opacity-100">
          <Plus className="h-4 w-4" aria-hidden />
          {t('books.addBook')}
        </Button>
      </motion.div>

      <motion.div variants={fadeInUp}>
      <Card className="border-border/80">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-sm font-medium text-muted-foreground">{t('common.filter')}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={openPrintAllModal} className="gap-2 shrink-0">
                <Printer className="h-4 w-4" aria-hidden />
                {t('books.printAllChits')}
              </Button>
              <Button variant="default" onClick={applyFilters} className="shrink-0">{t('common.filter')}</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {FILTER_KEYS.map((k, i) => (
              <Input
                key={k + i}
                placeholder={t(`books.${k}`)}
                dir="rtl"
                value={filters[k] ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, [k]: e.target.value }))}
                className="h-9 leading-loose bg-white/80 border-border focus:bg-white"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={printAllModalOpen} onOpenChange={setPrintAllModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('books.printAllChits')}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <Label>{t('books.printCategory')}</Label>
              <Select value={printCategory} onValueChange={(v) => setPrintCategory(v as 'shelf' | '')}>
                <SelectTrigger className="h-9 bg-white">
                  <SelectValue placeholder={t('books.selectPrintCategory')} />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value="shelf">{t('books.printByShelf')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {printCategory === 'shelf' && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="print-shelf">{t('books.shelfNumber')}</Label>
                <Input
                  id="print-shelf"
                  value={printShelfNumber}
                  onChange={(e) => setPrintShelfNumber(e.target.value)}
                  placeholder="e.g. A1, 12"
                  dir="auto"
                  className="h-9"
                />
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setPrintAllModalOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handlePrintAllChits}
                disabled={printCategory !== 'shelf' || !printShelfNumber.trim() || printLoading}
                className="gap-2"
              >
                {printLoading ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <Printer className="h-4 w-4" aria-hidden />
                )}
                {t('books.printChit')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </motion.div>

      <motion.div variants={fadeInUp}>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('books.bookNumber')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('books.bookTitle')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('books.jillNumber')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('books.kitaabNumber')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('books.author')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('books.naashirName')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('books.shelfNumber')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('books.keefiyat')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('books.totalCopies')}</TableHead>
                <TableHead className="w-[60px] sm:w-[72px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-12 px-4">{t('books.empty')}</TableCell>
                </TableRow>
              ) : (
                books.map((b, i) => (
                  <TableRow key={b.id + i} className="group">
                    <TableCell className="py-4 px-4 sm:px-6 font-mono text-sm text-foreground align-middle">
                      {b.bookNumber}
                    </TableCell>
                    <TableCell dir="auto" className="py-4 px-4 sm:px-6 font-medium text-foreground align-middle">
                      {b.title}
                    </TableCell>
                    <TableCell dir="auto" className="py-4 px-4 sm:px-6 text-foreground align-middle">{b.jillNumber ?? '–'}</TableCell>
                    <TableCell dir="auto" className="py-4 px-4 sm:px-6 text-foreground align-middle">{b.kitaabNumber ?? '–'}</TableCell>
                    <TableCell dir="auto" className="py-4 px-4 sm:px-6 text-foreground align-middle">{b.author ?? '–'}</TableCell>
                    <TableCell dir="auto" className="py-4 px-4 sm:px-6 text-foreground align-middle">{b.naashirName ?? '–'}</TableCell>
                    <TableCell dir="auto" className="py-4 px-4 sm:px-6 text-foreground align-middle">{b.shelfNumber ?? '–'}</TableCell>
                    <TableCell dir="auto" className="py-4 px-4 sm:px-6 text-foreground align-middle">{b.keefiyat ?? '–'}</TableCell>
                    <TableCell className="py-4 px-4 sm:px-6 text-foreground align-middle">{b.totalCopies}</TableCell>
                    <TableCell className="py-2 px-4 sm:px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-9 w-9 p-0" aria-label={t('common.view')}>
                            <MoreVertical className="h-4 w-4" aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="min-w-[140px]">
                          <DropdownMenuItem onClick={() => openViewModal(b)} className="gap-2">
                            <Eye className="h-4 w-4" aria-hidden />
                            {t('books.viewDetails')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteConfirm(b)}
                            className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                            {t('books.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 sm:px-6 py-3 text-sm bg-muted/30">
            <span className="text-muted-foreground">{t('common.page')} {page} {t('common.of')} {totalPages} ({total})</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </Button>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>
        )}
      </Card>
      </motion.div>
    </motion.div>
  );
}
