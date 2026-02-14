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
  TableSkeleton,
} from '@arabiaaislamia/ui';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { useLocale } from '@/lib/locale';
import { api } from '@/lib/api';
import { Plus } from 'lucide-react';

type Book = { id: string; title: string; author: string | null; category: string | null; totalCopies: number };

export default function BooksPage() {
  const { t } = useLocale();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', category: '', totalCopies: 1 });

  useEffect(() => {
    api
      .get('/api/books')
      .then((res) => {
        setBooks(res.data.data || []);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/api/books', {
      title: form.title,
      author: form.author || undefined,
      category: form.category || undefined,
      totalCopies: form.totalCopies,
    });
    const res = await api.get('/api/books');
    setBooks(res.data.data || []);
    setForm({ title: '', author: '', category: '', totalCopies: 1 });
    setOpen(false);
  }

  if (loading) {
    return (
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={defaultTransition}
      >
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="h-9 w-28 rounded bg-muted animate-pulse" />
        </div>
        <Card>
          <CardContent className="p-0">
            <TableSkeleton numberOfRows={8} className="p-4" />
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('books.title')}</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-xl">{t('books.pageDesc')}</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shrink-0 shadow-sm">
                <Plus className="h-4 w-4" aria-hidden />
                {t('books.addBook')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('books.addBook')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label>{t('books.bookTitle')}</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    dir="auto"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('books.author')}</Label>
                  <Input
                    value={form.author}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                    dir="auto"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('books.category')}</Label>
                  <Input
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    dir="auto"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('books.totalCopies')}</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.totalCopies}
                    onChange={(e) => setForm((f) => ({ ...f, totalCopies: +e.target.value || 1 }))}
                  />
                </div>
                <Button type="submit">{t('books.save')}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
      <motion.div variants={fadeInUp}>
        <Card className="shadow-sm overflow-hidden border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('books.bookTitle')}</TableHead>
                  <TableHead>{t('books.author')}</TableHead>
                  <TableHead>{t('books.category')}</TableHead>
                  <TableHead>{t('books.totalCopies')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                      {t('books.empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  books.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell dir="auto" className="font-medium">{b.title}</TableCell>
                      <TableCell dir="auto">{b.author ?? '–'}</TableCell>
                      <TableCell dir="auto">{b.category ?? '–'}</TableCell>
                      <TableCell>{b.totalCopies}</TableCell>
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
