import React from "react";
import { Skeleton, TableSkeleton } from "@arabiaaislamia/ui";

export const FallBackComponent = () => {
  return (
    <div className="h-screen w-screen flex overflow-x-hidden">
      {/* Sidebar shimmer */}
      <aside className="hidden lg:block w-64 border-r border-gray-200 bg-white shrink-0 p-4 space-y-2">
        <Skeleton className="h-10 w-3/4 rounded" />
        <Skeleton className="h-8 w-full rounded" />
        <Skeleton className="h-8 w-full rounded" />
        <Skeleton className="h-8 w-full rounded" />
        <Skeleton className="h-8 w-2/3 rounded" />
      </aside>
      {/* Main content shimmer */}
      <main className="flex-1 min-w-0 bg-gray-50 p-4 sm:p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <TableSkeleton numberOfRows={8} />
      </main>
    </div>
  );
};
