import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@arabiaaislamia/ui';
import type { Book } from '@/types';

const LANGUAGE_OPTIONS = ['urdu', 'english', 'arabic', 'faarsi', 'other'] as const;

type BookDetailModalProps = {
  book: Book | null;
  onClose: () => void;
  t: (k: string) => string;
};

export function BookDetailModal({ book, onClose, t }: BookDetailModalProps) {
  if (!book) return null;
  const langLabel = book.language && LANGUAGE_OPTIONS.includes(book.language as (typeof LANGUAGE_OPTIONS)[number])
    ? t(`books.languageOptions.${book.language}`)
    : book.language ?? '–';
  const rows = [
    { label: t('books.bookNumber'), value: book.bookNumber },
    { label: t('books.bookTitle'), value: book.title },
    { label: t('books.jillNumber'), value: book.jillNumber ?? '–' },
    { label: t('books.kitaabNumber'), value: book.kitaabNumber ?? '–' },
    { label: t('books.author'), value: book.author ?? '–' },
    { label: t('books.muarafName'), value: book.muarafName ?? '–' },
    { label: t('books.naashirName'), value: book.naashirName ?? '–' },
    { label: t('books.language'), value: langLabel },
    { label: t('books.shelfNumber'), value: book.shelfNumber ?? '–' },
    { label: t('books.keefiyat'), value: book.keefiyat ?? '–' },
    { label: t('books.milkiyat'), value: book.milkiyat ?? '–' },
    { label: t('books.mazmoon'), value: book.category ?? '–' },
    { label: t('books.totalCopies'), value: book.totalCopies ?? '–' },
    { label: t('books.createdDate'), value: book.createdAt ? new Date(book.createdAt).toLocaleDateString() : '–' },
  ];
  return (
    <Dialog open={!!book} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex row-reverse">
          <DialogTitle>{t('books.viewDetails')}</DialogTitle>
        </DialogHeader>
        <dl className="grid gap-3 text-sm divide-y divide-border/80">
          {rows.map((r, i) => (
            <div key={i} className="flex gap-2 py-3">
              <dt className="font-medium text-muted-foreground min-w-[140px]">{r.label}</dt>
              <dd dir="auto" className="text-foreground">{r.value}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
