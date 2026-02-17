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
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  TableSkeleton,
  useModal,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@arabiaaislamia/ui';
import { defaultTransition } from '@arabiaaislamia/animations';
import { useLocale } from '@/lib/locale';
import { api } from '@/lib/api';
import { Plus, Eye, Trash2, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';

type Book = {
  id: string;
  title: string;
  author: string | null;
  category: string | null;
  totalCopies: number;
  jillNumber: string | null;
  kitaabNumber: string | null;
  muarafName: string | null;
  naashirName: string | null;
  madahUnvaan: string | null;
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
  madahUnvaan: '',
  shelfNumber: '',
  keefiyat: '',
  milkiyat: '',
  totalCopies: 1,
};

const FILTER_KEYS = ['title', 'author', 'category', 'jillNumber', 'kitaabNumber', 'muarafName', 'naashirName', 'madahUnvaan', 'shelfNumber', 'keefiyat', 'milkiyat'] as const;

function AddBookFormContent({
  t,
  authors,
  categories,
  onSuccess,
}: {
  t: (k: string) => string;
  authors: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  onSuccess: () => void | Promise<void>;
}) {
  const [form, setForm] = useState(initialForm);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const authorVal = form.author || undefined;
    const categoryVal = form.category || undefined;
    await api.post('/api/books', {
      title: form.title,
      author: authorVal || undefined,
      category: categoryVal || undefined,
      jillNumber: form.jillNumber || undefined,
      kitaabNumber: form.kitaabNumber || undefined,
      muarafName: form.muarafName || undefined,
      naashirName: form.naashirName || undefined,
      madahUnvaan: form.madahUnvaan || undefined,
      shelfNumber: form.shelfNumber || undefined,
      keefiyat: form.keefiyat || undefined,
      milkiyat: form.milkiyat || undefined,
      totalCopies: form.totalCopies,
    });
    await onSuccess();
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
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} dir="auto" required className="h-9" />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.jillNumber')}</Label>
            <Input value={form.jillNumber} onChange={(e) => setForm((f) => ({ ...f, jillNumber: e.target.value }))} dir="auto" className="h-9" />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.kitaabNumber')}</Label>
            <Input value={form.kitaabNumber} onChange={(e) => setForm((f) => ({ ...f, kitaabNumber: e.target.value }))} dir="auto" className="h-9" />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.author')}</Label>
            <Select value={form.author || undefined} onValueChange={(v) => setForm((f) => ({ ...f, author: v || '' }))}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder={t('common.search')} />
              </SelectTrigger>
              <SelectContent>
                {authors.map((a) => (
                  <SelectItem key={a.id} value={a.name}>
                    <span dir="auto">{a.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.category')}</Label>
            <Select value={form.category || undefined} onValueChange={(v) => setForm((f) => ({ ...f, category: v || '' }))}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder={t('common.search')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    <span dir="auto">{c.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.muarafName')}</Label>
            <Input value={form.muarafName} onChange={(e) => setForm((f) => ({ ...f, muarafName: e.target.value }))} dir="auto" className="h-9" />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.naashirName')}</Label>
            <Input value={form.naashirName} onChange={(e) => setForm((f) => ({ ...f, naashirName: e.target.value }))} dir="auto" className="h-9" />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.madahUnvaan')}</Label>
            <Input value={form.madahUnvaan} onChange={(e) => setForm((f) => ({ ...f, madahUnvaan: e.target.value }))} dir="auto" className="h-9" />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.shelfNumber')}</Label>
            <Input value={form.shelfNumber} onChange={(e) => setForm((f) => ({ ...f, shelfNumber: e.target.value }))} dir="auto" className="h-9" />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.keefiyat')}</Label>
            <Input value={form.keefiyat} onChange={(e) => setForm((f) => ({ ...f, keefiyat: e.target.value }))} dir="auto" className="h-9" />
          </div>
          <div className={fieldClass}>
            <Label className="text-sm font-medium text-foreground">{t('books.milkiyat')}</Label>
            <Input value={form.milkiyat} onChange={(e) => setForm((f) => ({ ...f, milkiyat: e.target.value }))} dir="auto" className="h-9" />
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
    </>
  );
}

function BookDetailContent({ book, t }: { book: Book; t: (k: string) => string }) {
  const rows: { label: string; value: string | number }[] = [
    { label: t('books.bookTitle'), value: book.title },
    { label: t('books.jillNumber'), value: book.jillNumber ?? '–' },
    { label: t('books.kitaabNumber'), value: book.kitaabNumber ?? '–' },
    { label: t('books.author'), value: book.author ?? '–' },
    { label: t('books.muarafName'), value: book.muarafName ?? '–' },
    { label: t('books.naashirName'), value: book.naashirName ?? '–' },
    { label: t('books.madahUnvaan'), value: book.madahUnvaan ?? '–' },
    { label: t('books.shelfNumber'), value: book.shelfNumber ?? '–' },
    { label: t('books.keefiyat'), value: book.keefiyat ?? '–' },
    { label: t('books.milkiyat'), value: book.milkiyat ?? '–' },
    { label: t('books.category'), value: book.category ?? '–' },
    { label: t('books.totalCopies'), value: book.totalCopies },
    { label: t('books.createdDate'), value: book.createdAt ? new Date(book.createdAt).toLocaleDateString() : '–' },
  ];
  return (
    <div className="space-y-4">
      <DialogHeader className="flex row-reverse">
        <DialogTitle>{t('books.viewDetails')}</DialogTitle>
      </DialogHeader>
      <dl className="grid gap-3 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-2">
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
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});

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

  useEffect(() => {
    api.get('/api/book-authors').then((r) => setAuthors(r.data.data || []));
    api.get('/api/book-categories').then((r) => setCategories(r.data.data || []));
  }, []);

  function openAddBookModal() {
    modal.custom({
      content: (
        <AddBookFormContent
          t={t}
          authors={authors}
          categories={categories}
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

  if (loading && books.length === 0) {
    return (
      <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={defaultTransition}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="h-10 w-36 rounded bg-muted animate-pulse" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 rounded bg-muted/50 animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-0">
            <TableSkeleton numberOfRows={8} className="p-4" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">{t('books.title')}</h1>
        </div>
        <Button onClick={openAddBookModal} className="gap-2 shrink-0 shadow-sm bg-primary text-primary-foreground hover:opacity-90 opacity-100">
          <Plus className="h-4 w-4" aria-hidden />
          {t('books.addBook')}
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-sm font-medium text-muted-foreground">{t('common.filter')}</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {FILTER_KEYS.map((k) => (
              <Input
                key={k}
                placeholder={t(`books.${k}`)}
                value={filters[k] ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, [k]: e.target.value }))}
                dir="auto"
                className="h-9"
              />
            ))}
          </div>
          <Button size="lg" variant="default" onClick={applyFilters} className="px-4 py-2 text-lg font-medium">{t('common.filter')}</Button>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="h-12 px-4 sm:px-6 font-medium bg-muted/50 text-foreground">{t('books.bookTitle')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium bg-muted/50 text-foreground">{t('books.jillNumber')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium bg-muted/50 text-foreground">{t('books.kitaabNumber')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium bg-muted/50 text-foreground">{t('books.author')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium bg-muted/50 text-foreground">{t('books.naashirName')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium bg-muted/50 text-foreground">{t('books.shelfNumber')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium bg-muted/50 text-foreground">{t('books.keefiyat')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium bg-muted/50 text-foreground">{t('books.totalCopies')}</TableHead>
                <TableHead className="w-[60px] sm:w-[72px] bg-muted/50" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-12 px-4">{t('books.empty')}</TableCell>
                </TableRow>
              ) : (
                books.map((b) => (
                  <TableRow key={b.id} className="group">
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
                        <DropdownMenuContent align="start" className="min-w-[140px] bg-white border-border">
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
    </div>
  );
}
