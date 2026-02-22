import { Button } from '@arabiaaislamia/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  pageLabel: string;
  ofLabel: string;
};

export function Pagination({
  page,
  totalPages,
  total,
  onPrev,
  onNext,
  pageLabel,
  ofLabel,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-border px-4 sm:px-6 py-3 text-sm bg-muted/30">
      <span className="text-muted-foreground">
        {pageLabel} {page} {ofLabel} {totalPages} ({total})
      </span>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={page <= 1} onClick={onPrev}>
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Button>
        <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={onNext}>
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
