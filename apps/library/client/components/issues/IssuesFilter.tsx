'use client';

import { Button, Card, CardContent, Input, Label, SearchSelect } from '@arabiaaislamia/ui';
import type { BookListItem } from '@/types';

type Props = {
  filters: { status: string; issuedTo: string; bookId: string };
  onFilterChange: (k: 'status' | 'issuedTo' | 'bookId', v: string) => void;
  onApply: () => void;
  books: BookListItem[];
  t: (k: string) => string;
};

export function IssuesFilter(p: Props) {
  const { filters, onFilterChange, books, onApply, t } = p;
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="text-sm font-medium text-muted-foreground">{t('common.filter')}</div>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs mb-3 block font-medium text-card-foreground/90">{t('issues.status')}</Label>
            <SearchSelect
              value={filters.status}
              onValueChange={(v) => onFilterChange('status', v)}
              options={[
                { value: 'all', label: t('issues.filterAll') },
                { value: 'issued', label: t('issues.issued') },
                { value: 'returned', label: t('issues.returned') },
              ]}
              placeholder={t('issues.status')}
              triggerClassName="w-36 h-9"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs mb-3 block font-medium text-card-foreground/90">{t('issues.issuedTo')}</Label>
            <Input
              value={filters.issuedTo}
              onChange={(e) => onFilterChange('issuedTo', e.target.value)}
              dir="rtl"
              placeholder={t('issues.issuedTo')}
              className="w-40 h-9"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs mb-3 block font-medium text-card-foreground/90">{t('issues.selectBook')}</Label>
            <SearchSelect
              value={filters.bookId || 'all'}
              onValueChange={(v) => onFilterChange('bookId', v)}
              options={[{ value: 'all', label: t('issues.filterAll') }, ...books.map((b) => ({ value: b.id, label: b.title }))]}
              placeholder={t('issues.selectBook')}
              triggerClassName="w-48 h-9"
            />
          </div>
          <Button size="lg" variant="default" onClick={onApply} className="px-4 py-2 text-lg font-medium">
            {t('common.filter')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
