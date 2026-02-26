import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@arabiaaislamia/ui';
import { Eye, Pencil, Trash2, MoreVertical } from 'lucide-react';
import type { Book } from '@/types';

type BooksTableProps = {
  books: Book[];
  onView: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  t: (k: string) => string;
};

export function BooksTable({ books, onView, onEdit, onDelete, t }: BooksTableProps) {
  return (
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
              <TableCell colSpan={10} className="text-center text-muted-foreground py-12 px-4">
                {t('books.empty')}
              </TableCell>
            </TableRow>
          ) : (
            books.map((b) => (
              <TableRow key={b.id} className="group">
                <TableCell className="py-4 px-4 sm:px-6 font-mono text-sm text-foreground align-middle">
                  {b.bookNumber}
                </TableCell>
                <TableCell dir="auto" className="py-4 px-4 sm:px-6 font-medium text-foreground align-middle">
                  {b.title}
                </TableCell>
                <TableCell dir="auto" className="py-4 px-4 sm:px-6 text-foreground align-middle">
                  {b.jillNumber ?? '–'}
                </TableCell>
                <TableCell dir="auto" className="py-4 px-4 sm:px-6 text-foreground align-middle">
                  {b.kitaabNumber ?? '–'}
                </TableCell>
                <TableCell dir="auto" className="py-4 px-4 sm:px-6 text-foreground align-middle">
                  {b.author ?? '–'}
                </TableCell>
                <TableCell dir="auto" className="py-4 px-4 sm:px-6 text-foreground align-middle">
                  {b.naashirName ?? '–'}
                </TableCell>
                <TableCell dir="auto" className="py-4 px-4 sm:px-6 text-foreground align-middle">
                  {b.shelfNumber ?? '–'}
                </TableCell>
                <TableCell dir="auto" className="py-4 px-4 sm:px-6 text-foreground align-middle">
                  {b.keefiyat ?? '–'}
                </TableCell>
                <TableCell className="py-4 px-4 sm:px-6 text-foreground align-middle">
                  {b.totalCopies}
                </TableCell>
                <TableCell className="py-2 px-4 sm:px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-9 w-9 p-0" aria-label={t('common.view')}>
                        <MoreVertical className="h-4 w-4" aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[140px]">
                      <DropdownMenuItem onClick={() => onView(b)} className="gap-2">
                        <Eye className="h-4 w-4" aria-hidden />
                        {t('books.viewDetails')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(b)} className="gap-2">
                        <Pencil className="h-4 w-4" aria-hidden />
                        {t('books.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(b)}
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
  );
}
