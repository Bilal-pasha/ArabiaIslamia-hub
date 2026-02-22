import { Card, CardContent, TableSkeleton } from '@arabiaaislamia/ui';

type PageSkeletonProps = {
  filterFields?: number;
  tableRows?: number;
};

export function PageSkeleton({ filterFields = 4, tableRows = 8 }: PageSkeletonProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="h-10 w-36 rounded bg-muted animate-pulse" />
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: filterFields }).map((_, i) => (
              <div key={i} className="h-9 rounded bg-muted/80 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <TableSkeleton numberOfRows={tableRows} className="p-4" />
        </CardContent>
      </Card>
    </div>
  );
}
