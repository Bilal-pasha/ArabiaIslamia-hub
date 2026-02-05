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

export interface CardSkeletonProps {
  /** Number of content lines below the header. Default 4. */
  lines?: number;
  className?: string;
}

function CardSkeleton({ lines = 4, className }: CardSkeletonProps) {
  return (
    <div className={cn('rounded-lg border border-border p-4 space-y-3', className)}>
      <Skeleton className="h-5 w-1/3" />
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          <Skeleton key={i} className="h-4 w-full" style={{ maxWidth: i === lines - 1 ? '75%' : undefined }} />
        ))}
      </div>
    </div>
  );
}
CardSkeleton.displayName = 'CardSkeleton';

/** Shimmer for detail pages: multiple card-shaped blocks (e.g. application detail). */
export interface DetailPageSkeletonProps {
  /** Number of card blocks. Default 5. */
  cards?: number;
  /** Lines per card. Default 4. */
  linesPerCard?: number;
  className?: string;
}

function DetailPageSkeleton({ cards = 5, linesPerCard = 4, className }: DetailPageSkeletonProps) {
  return (
    <div className={cn('space-y-6 max-w-4xl w-full min-w-0', className)}>
      <div className="flex items-center gap-2 flex-wrap">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
      {Array.from({ length: cards }, (_, i) => (
        <CardSkeleton key={i} lines={linesPerCard} />
      ))}
    </div>
  );
}
DetailPageSkeleton.displayName = 'DetailPageSkeleton';

export { Skeleton, TableSkeleton, CardSkeleton, DetailPageSkeleton };
