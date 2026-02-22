'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@arabiaaislamia/ui';
import type { UseMutationResult } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Eye, MoreVertical, Plus, Trash2 } from 'lucide-react';

type Entity = { id: string; name: string };

type Props = {
  items: Entity[];
  page: number;
  totalPages: number;
  onPageChange: (updater: (p: number) => number) => void;
  createMutation: UseMutationResult<void, Error, string>;
  onDelete: (item: Entity) => void;
  onView: (item: Entity) => void;
  labelKey: string;
  placeholderKey: string;
  emptyKey: string;
  pageSize: number;
  t: (k: string) => string;
};

export function SettingsEntityTab(props: Props) {
  const { items, page, totalPages, onPageChange, createMutation, onDelete, onView, labelKey, placeholderKey, emptyKey, pageSize, t } = props;
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    createMutation.mutate(value.trim(), {
      onSuccess: () => setValue(''),
    });
  };

  const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <Label className="mb-2 block font-medium text-card-foreground/90">{t(labelKey)}</Label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} dir="rtl" placeholder={t(placeholderKey)} />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="gap-2 w-full sm:w-auto" disabled={createMutation.isPending}>
              <Plus className="h-4 w-4 shrink-0" aria-hidden />
              {t('common.add')}
            </Button>
          </div>
        </form>
        <div className="rounded-lg border border-border overflow-hidden">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 px-4 text-center">{t(emptyKey)}</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-border">
                    <TableHead className="h-12 px-4 sm:px-6 font-medium">{t(labelKey)}</TableHead>
                    <TableHead className="w-[60px] sm:w-[72px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.id} className="group">
                      <TableCell dir="rtl" className="py-4 px-4 sm:px-6 align-middle">
                        {item.name}
                      </TableCell>
                      <TableCell className="py-2 px-4 sm:px-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-9 w-9 p-0" aria-label={t('common.view')}>
                              <MoreVertical className="h-4 w-4" aria-hidden />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-[140px]">
                            <DropdownMenuItem onClick={() => onView(item)} className="gap-2">
                              <Eye className="h-4 w-4" aria-hidden />
                              {t('common.view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(item)}
                              className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden />
                              {t('books.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {items.length > pageSize && (
                <div className="flex items-center justify-between border-t border-border px-4 sm:px-6 py-3 text-sm bg-muted/30">
                  <span className="text-muted-foreground">
                    {t('common.page')} {page} {t('common.of')} {totalPages} ({items.length})
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => onPageChange((p) => Math.max(1, p - 1))}>
                      <ChevronLeft className="h-4 w-4" aria-hidden />
                    </Button>
                    <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => onPageChange((p) => p + 1)}>
                      <ChevronRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
