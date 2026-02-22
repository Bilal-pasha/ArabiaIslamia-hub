import { Button, Card, CardContent, Input } from '@arabiaaislamia/ui';
import { Printer } from 'lucide-react';

type BooksFilterProps = {
  filterKeys: readonly string[];
  filters: Record<string, string>;
  onFilterChange: (k: string, v: string) => void;
  onApply: () => void;
  onPrintAll: () => void;
  t: (k: string) => string;
};

export function BooksFilter({
  filterKeys,
  filters,
  onFilterChange,
  onApply,
  onPrintAll,
  t,
}: BooksFilterProps) {
  return (
    <Card className="border-border/80">
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-medium text-muted-foreground">{t('common.filter')}</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onPrintAll} className="gap-2 shrink-0">
              <Printer className="h-4 w-4" aria-hidden />
              {t('books.printAllChits')}
            </Button>
            <Button variant="default" onClick={onApply} className="shrink-0">
              {t('common.filter')}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filterKeys.map((k) => (
            <Input
              key={k}
              placeholder={t(`books.${k}`)}
              dir="rtl"
              value={filters[k] ?? ''}
              onChange={(e) => onFilterChange(k, e.target.value)}
              className="h-9 leading-loose bg-white/80 border-border focus:bg-white"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
