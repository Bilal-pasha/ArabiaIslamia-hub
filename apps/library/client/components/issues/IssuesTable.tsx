'use client';

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@arabiaaislamia/ui';
import type { BookIssue } from '@/types';
import { Eye, MoreVertical, RotateCcw, Trash2 } from 'lucide-react';

type Props = {
  issues: BookIssue[];
  onView: (issue: BookIssue) => void;
  onReturn: (id: string) => void;
  onDelete: (issue: BookIssue) => void;
  t: (k: string) => string;
};

export function IssuesTable({ issues, onView, onReturn, onDelete, t }: Props) {
  return (
    <Table className="min-w-[640px]">
      <TableHeader>
        <TableRow className="hover:bg-transparent border-b border-border">
          <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('books.title')}</TableHead>
          <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('issues.issuedTo')}</TableHead>
          <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('issues.dueAt')}</TableHead>
          <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('issues.status')}</TableHead>
          <TableHead className="w-[60px] sm:w-[72px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-12 px-4">{t('issues.empty')}</TableCell>
          </TableRow>
        ) : (
          issues.map((i) => (
            <TableRow key={i.id} dir="rtl">
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
                  <DropdownMenuContent align="start" className="min-w-[160px]">
                    <DropdownMenuItem onClick={() => onView(i)} className="gap-2">
                      <Eye className="h-4 w-4" aria-hidden />
                      {t('issues.viewDetails')}
                    </DropdownMenuItem>
                    {i.status === 'issued' && (
                      <DropdownMenuItem onClick={() => onReturn(i.id)} className="gap-2">
                        <RotateCcw className="h-4 w-4" aria-hidden />
                        {t('issues.return')}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(i)} className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10">
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
  );
}
