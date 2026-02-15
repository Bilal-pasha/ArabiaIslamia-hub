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
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  TableSkeleton,
  useModal,
} from '@arabiaaislamia/ui';
import { defaultTransition } from '@arabiaaislamia/animations';
import { useLocale } from '@/lib/locale';
import { api } from '@/lib/api';
import { Plus } from 'lucide-react';

type Book = { id: string; title: string; author: string | null; category: string | null; totalCopies: number };

function AddBookFormContent({
  t,
  onSuccess,
}: {
  t: (k: string) => string;
  onSuccess: () => void | Promise<void>;
}) {
  const [form, setForm] = useState({ title: '', author: '', category: '', totalCopies: 1 });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/api/books', {
      title: form.title,
      author: form.author || undefined,
      category: form.category || undefined,
      totalCopies: form.totalCopies,
    });
    await onSuccess();
  }

  return (
    <>
      <DialogHeader className='flex row-reverse' >
        <DialogTitle>{t('books.addBook')}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleAdd} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Label>{t('books.bookTitle')}</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            dir="auto"
            required
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label>{t('books.author')}</Label>
          <Input
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            dir="auto"
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label>{t('books.category')}</Label>
          <Input
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            dir="auto"
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label>{t('books.totalCopies')}</Label>
          <Input
            type="number"
            min={1}
            value={form.totalCopies}
            onChange={(e) => setForm((f) => ({ ...f, totalCopies: +e.target.value || 1 }))}
          />
        </div>
        <Button type="submit" className='py-4'>{t('books.save')}</Button>
      </form>
    </>
  );
}

export default function BooksPage() {
  const { t } = useLocale();
  const modal = useModal();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/books')
      .then((res) => {
        setBooks(res.data.data || []);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  function openAddBookModal() {
    modal.custom({
      content: (
        <AddBookFormContent
          t={t}
          onSuccess={async () => {
            const res = await api.get('/api/books');
            setBooks(res.data.data || []);
            modal.close();
          }}
        />
      ),
      contentClassName: 'sm:max-w-md',
      showClose: true,
    });
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
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className='flex flex-col gap-4'>
            <h1 className="text-2xl font-bold text-foreground">{t('books.title')}</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-xl">{t('books.pageDesc')}</p>
          </div>
          <Button
            onClick={openAddBookModal}
            className="gap-2 shrink-0 shadow-sm bg-primary text-primary-foreground hover:opacity-90 opacity-100"
          >
            <Plus className="h-4 w-4" aria-hidden />
            {t('books.addBook')}
          </Button>
        </div>
      </div>
      <div>
        <Card className="library-data-card bg-white text-black shadow-sm border border-border">
          <CardContent className="p-0">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground">{t('books.bookTitle')}</TableHead>
                  <TableHead className="text-foreground">{t('books.author')}</TableHead>
                  <TableHead className="text-foreground">{t('books.category')}</TableHead>
                  <TableHead className="text-foreground">{t('books.totalCopies')}</TableHead>
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
                      <TableCell dir="auto" className="font-medium text-foreground">{b.title}</TableCell>
                      <TableCell dir="auto" className="text-foreground">{b.author ?? '–'}</TableCell>
                      <TableCell dir="auto" className="text-foreground">{b.category ?? '–'}</TableCell>
                      <TableCell className="text-foreground">{b.totalCopies}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
