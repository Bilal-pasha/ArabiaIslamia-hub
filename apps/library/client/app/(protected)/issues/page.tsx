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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  TableSkeleton,
  useModal,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@arabiaaislamia/ui';
import { defaultTransition } from '@arabiaaislamia/animations';
import { useLocale } from '@/lib/locale';
import { api } from '@/lib/api';
import { Plus, Eye, Trash2, ChevronLeft, ChevronRight, MoreVertical, RotateCcw } from 'lucide-react';

type Book = { id: string; title: string };
type BookIssue = {
  id: string;
  bookId: string;
  book?: Book;
  issuedTo: string;
  issuedAt: string;
  dueAt: string;
  returnedAt: string | null;
  status: string;
};

function IssueBookFormContent({
  t,
  books,
  onSuccess,
}: {
  t: (k: string) => string;
  books: Book[];
  onSuccess: () => void | Promise<void>;
}) {
  const [form, setForm] = useState({ bookId: '', issuedTo: '', dueAt: '' });

  async function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/api/book-issues', { bookId: form.bookId, issuedTo: form.issuedTo, dueAt: form.dueAt });
    await onSuccess();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('issues.issueBook')}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleIssue} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Label>{t('books.title')}</Label>
          <Select value={form.bookId} onValueChange={(v) => setForm((f) => ({ ...f, bookId: v }))} required>
            <SelectTrigger>
              <SelectValue placeholder="کتاب منتخب کریں" />
            </SelectTrigger>
            <SelectContent>
              {books.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  <span dir="auto">{b.title}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-4">
          <Label>{t('issues.issuedTo')}</Label>
          <Input value={form.issuedTo} onChange={(e) => setForm((f) => ({ ...f, issuedTo: e.target.value }))} dir="auto" required />
        </div>
        <div className="flex flex-col gap-4">
          <Label>{t('issues.dueAt')}</Label>
          <Input type="date" value={form.dueAt} onChange={(e) => setForm((f) => ({ ...f, dueAt: e.target.value }))} required />
        </div>
        <Button type="submit" className="py-4">
          {t('books.save')}
        </Button>
      </form>
    </>
  );
}

function IssueDetailContent({ issue, t }: { issue: BookIssue; t: (k: string) => string }) {
  const rows: { label: string; value: string }[] = [
    { label: t('books.title'), value: issue.book?.title ?? issue.bookId },
    { label: t('issues.issuedTo'), value: issue.issuedTo },
    { label: t('issues.issued'), value: issue.issuedAt ? new Date(issue.issuedAt).toLocaleDateString() : '–' },
    { label: t('issues.dueAt'), value: issue.dueAt },
    { label: t('issues.status'), value: issue.status === 'issued' ? t('issues.issued') : t('issues.returned') },
    { label: t('issues.returned'), value: issue.returnedAt ? new Date(issue.returnedAt).toLocaleDateString() : '–' },
  ];
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>{t('issues.viewDetails')}</DialogTitle>
      </DialogHeader>
      <dl className="grid gap-3 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-2">
            <dt className="font-medium text-muted-foreground min-w-[120px]">{r.label}</dt>
            <dd dir="auto" className="text-foreground">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function IssuesPage() {
  const { t } = useLocale();
  const modal = useModal();
  const [issues, setIssues] = useState<BookIssue[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<{ status: string; issuedTo: string; bookId: string }>({ status: 'all', issuedTo: '', bookId: '' });

  const fetchIssues = useCallback(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '10');
    if (filters.status !== 'all') params.set('status', filters.status);
    if (filters.issuedTo?.trim()) params.set('issuedTo', filters.issuedTo.trim());
    if (filters.bookId && filters.bookId !== 'all') params.set('bookId', filters.bookId);
    api.get(`/api/book-issues?${params}`)
      .then((res) => {
        setIssues(res.data.data || []);
        setTotal(res.data.total ?? 0);
        setTotalPages(res.data.totalPages ?? 1);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [page, filters]);

  useEffect(() => {
    setLoading(true);
    fetchIssues();
  }, [fetchIssues]);

  useEffect(() => {
    api.get('/api/books?limit=1000&page=1').then((r) => setBooks(r.data.data || []));
  }, []);

  function openIssueBookModal() {
    modal.custom({
      content: (
        <IssueBookFormContent
          t={t}
          books={books}
          onSuccess={async () => {
            fetchIssues();
            modal.close();
          }}
        />
      ),
      contentClassName: 'sm:max-w-md',
      showClose: true,
    });
  }

  function openViewModal(issue: BookIssue) {
    modal.custom({
      content: <IssueDetailContent issue={issue} t={t} />,
      contentClassName: 'sm:max-w-md',
      showClose: true,
    });
  }

  function openDeleteConfirm(issue: BookIssue) {
    modal.confirmation({
      title: t('books.delete'),
      description: t('issues.deleteConfirm'),
      confirmText: t('common.confirm'),
      cancelText: t('common.cancel'),
      variant: 'destructive',
      onConfirm: async () => {
        await api.delete(`/api/book-issues/${issue.id}`);
        fetchIssues();
      },
    });
  }

  async function handleReturn(id: string) {
    await api.post(`/api/book-issues/${id}/return`);
    fetchIssues();
  }

  function applyFilters() {
    setPage(1);
  }

  if (loading && issues.length === 0) {
    return (
      <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={defaultTransition}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="h-10 w-36 rounded bg-muted animate-pulse" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="h-20 rounded bg-muted/50 animate-pulse" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-0">
            <TableSkeleton numberOfRows={6} className="p-4" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">{t('issues.title')}</h1>
        </div>
        <Button onClick={openIssueBookModal} className="gap-2 shrink-0 shadow-sm bg-primary text-primary-foreground hover:opacity-90 opacity-100">
          <Plus className="h-4 w-4" aria-hidden />
          {t('issues.issueBook')}
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-sm font-medium text-muted-foreground">{t('common.filter')}</div>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs mb-3 block text-sm font-medium text-card-foreground/90">{t('issues.status')}</Label>
              <Select value={filters.status} onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}>
                <SelectTrigger className="w-36 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('issues.filterAll')}</SelectItem>
                  <SelectItem value="issued">{t('issues.issued')}</SelectItem>
                  <SelectItem value="returned">{t('issues.returned')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs mb-3 block text-sm font-medium text-card-foreground/90">{t('issues.issuedTo')}</Label>
              <Input
                value={filters.issuedTo}
                onChange={(e) => setFilters((f) => ({ ...f, issuedTo: e.target.value }))}
                dir="auto"
                placeholder={t('issues.issuedTo')}
                className="w-40 h-9"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs mb-3 block text-sm font-medium text-card-foreground/90">{t('issues.selectBook')}</Label>
              <Select value={filters.bookId || 'all'} onValueChange={(v) => setFilters((f) => ({ ...f, bookId: v }))}>
                <SelectTrigger className="w-48 h-9">
                  <SelectValue placeholder={t('issues.filterAll')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('issues.filterAll')}</SelectItem>
                  {books.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      <span dir="auto">{b.title}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button size="lg" variant="default" onClick={applyFilters} className="px-4 py-2 text-lg font-medium">{t('common.filter')}</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="h-12 px-4 sm:px-6 font-medium bg-muted/50 text-foreground">{t('books.title')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium bg-muted/50 text-foreground">{t('issues.issuedTo')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium bg-muted/50 text-foreground">{t('issues.dueAt')}</TableHead>
                <TableHead className="h-12 px-4 sm:px-6 font-medium bg-muted/50 text-foreground">{t('issues.status')}</TableHead>
                <TableHead className="w-[60px] sm:w-[72px] bg-muted/50" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-12 px-4">{t('issues.empty')}</TableCell>
                </TableRow>
              ) : (
                issues.map((i) => (
                  <TableRow key={i.id} className="" dir="rtl">
                    <TableCell className="py-4 px-4 sm:px-6 font-medium text-foreground text-justify">
                      {i.book?.title ?? i.bookId}
                    </TableCell>
                    <TableCell className="py-4 px-4 sm:px-6 text-foreground text-justify">{i.issuedTo}</TableCell>
                    <TableCell className="py-4 px-4 sm:px-6 text-foreground text-justify">{i.dueAt}</TableCell>
                    <TableCell className="py-4 px-4 sm:px-6 text-justify">
                      <Badge variant={i.status === 'issued' ? 'default' : 'secondary'}>
                        {i.status === 'issued' ? t('issues.issued') : t('issues.returned')}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 px-4 sm:px-6 text-justify">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-9 w-9 p-0" aria-label={t('common.view')}>
                            <MoreVertical className="h-4 w-4" aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="min-w-[160px] bg-white border-border">
                          <DropdownMenuItem onClick={() => openViewModal(i)} className="gap-2">
                            <Eye className="h-4 w-4" aria-hidden />
                            {t('issues.viewDetails')}
                          </DropdownMenuItem>
                          {i.status === 'issued' && (
                            <DropdownMenuItem onClick={() => handleReturn(i.id)} className="gap-2">
                              <RotateCcw className="h-4 w-4" aria-hidden />
                              {t('issues.return')}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => openDeleteConfirm(i)}
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
