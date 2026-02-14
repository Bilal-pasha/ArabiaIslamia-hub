'use client';

import { useState, useEffect } from 'react';
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
  DialogTrigger,
  DialogContent,
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
} from '@arabiaaislamia/ui';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { useLocale } from '@/lib/locale';
import { api } from '@/lib/api';
import { Plus } from 'lucide-react';

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

export default function IssuesPage() {
  const { t } = useLocale();
  const [issues, setIssues] = useState<BookIssue[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [form, setForm] = useState({ bookId: '', issuedTo: '', dueAt: '' });

  useEffect(() => {
    Promise.all([api.get('/api/books'), api.get('/api/book-issues')])
      .then(([booksRes, issuesRes]) => {
        setBooks(booksRes.data.data || []);
        setIssues(issuesRes.data.data || []);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  async function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/api/book-issues', {
      bookId: form.bookId,
      issuedTo: form.issuedTo,
      dueAt: form.dueAt,
    });
    const res = await api.get('/api/book-issues');
    setIssues(res.data.data || []);
    setForm({ bookId: '', issuedTo: '', dueAt: '' });
    setOpen(false);
  }

  async function handleReturn(id: string) {
    await api.post(`/api/book-issues/${id}/return`);
    const res = await api.get('/api/book-issues');
    setIssues(res.data.data || []);
  }

  const filtered =
    statusFilter === 'all' ? issues : issues.filter((i) => i.status === statusFilter);

  if (loading) {
    return (
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={defaultTransition}
      >
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="flex gap-2">
            <div className="h-9 w-28 rounded bg-muted animate-pulse" />
            <div className="h-9 w-32 rounded bg-muted animate-pulse" />
          </div>
        </div>
        <Card>
          <CardContent className="p-0">
            <TableSkeleton numberOfRows={6} className="p-4" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
      transition={defaultTransition}
    >
      <motion.div className="space-y-2" variants={fadeInUp}>
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('issues.title')}</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-xl">{t('issues.pageDesc')}</p>
          </div>
          <div className="flex gap-2 items-center flex-wrap shrink-0">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder={t('issues.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('issues.filterAll')}</SelectItem>
                <SelectItem value="issued">{t('issues.issued')}</SelectItem>
                <SelectItem value="returned">{t('issues.returned')}</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-sm">
                  <Plus className="h-4 w-4" aria-hidden />
                  {t('issues.issueBook')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('issues.issueBook')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleIssue} className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <Label>{t('books.title')}</Label>
                    <Select
                      value={form.bookId}
                      onValueChange={(v) => setForm((f) => ({ ...f, bookId: v }))}
                      required
                    >
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
                  <div className="space-y-2">
                    <Label>{t('issues.issuedTo')}</Label>
                    <Input
                      value={form.issuedTo}
                      onChange={(e) => setForm((f) => ({ ...f, issuedTo: e.target.value }))}
                      dir="auto"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('issues.dueAt')}</Label>
                    <Input
                      type="date"
                      value={form.dueAt}
                      onChange={(e) => setForm((f) => ({ ...f, dueAt: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit">{t('books.save')}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>
      <motion.div variants={fadeInUp}>
        <Card className="shadow-sm overflow-hidden border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('books.title')}</TableHead>
                  <TableHead>{t('issues.issuedTo')}</TableHead>
                  <TableHead>{t('issues.dueAt')}</TableHead>
                  <TableHead>{t('issues.status')}</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                      {t('issues.empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell dir="auto" className="font-medium">
                        {i.book?.title ?? i.bookId}
                      </TableCell>
                      <TableCell dir="auto">{i.issuedTo}</TableCell>
                      <TableCell>{i.dueAt}</TableCell>
                      <TableCell>
                        <Badge variant={i.status === 'issued' ? 'default' : 'secondary'}>
                          {i.status === 'issued' ? t('issues.issued') : t('issues.returned')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {i.status === 'issued' && (
                          <Button size="sm" variant="outline" onClick={() => handleReturn(i.id)}>
                            {t('issues.return')}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
