'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}
Skeleton.displayName = 'Skeleton';

export interface TableSkeletonProps {
  numberOfRows?: number;
  className?: string;
}

const ROW_COL_CLASSES = ['col-span-3', 'col-span-7', 'col-span-2'] as const;

function TableSkeleton({ numberOfRows = 5, className }: TableSkeletonProps) {
  return (
    <div className={cn('w-full mx-auto', className)}>
      <div className="animate-pulse flex flex-col">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border">
          {ROW_COL_CLASSES.map((colClass, i) => (
            <Skeleton key={i} className={cn('h-2.5', colClass)} />
          ))}
        </div>
        {Array.from({ length: numberOfRows }, (_, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b border-border">
            {ROW_COL_CLASSES.map((colClass, j) => (
              <Skeleton key={j} className={cn('h-2', colClass)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
TableSkeleton.displayName = 'TableSkeleton';

export { Skeleton, TableSkeleton };
