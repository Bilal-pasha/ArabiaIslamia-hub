'use client';

import { Skeleton } from '@arabiaaislamia/ui';

/** Shimmer that matches the admit card page layout (header + sections with rows). */
export function AdmitCardSkeleton() {
  return (
    <div className="min-h-screen w-full min-w-0 bg-slate-50 p-4 sm:p-6 overflow-x-hidden">
      <div className="max-w-2xl w-full mx-auto min-w-0">
        <article className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header strip */}
          <div className="bg-[#0f2744] text-white px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="size-14 rounded-lg bg-white/20" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 bg-white/20" />
                  <Skeleton className="h-3 w-24 bg-white/20" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-3 w-20 bg-white/20 ml-auto" />
                <Skeleton className="h-5 w-24 bg-white/20 ml-auto" />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Section: Candidate details */}
            <section>
              <Skeleton className="h-3 w-28 mb-3" />
              <div className="space-y-0">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex justify-between gap-4 border-b border-slate-200 py-2.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Guardian */}
            <section>
              <Skeleton className="h-3 w-20 mb-3" />
              <div className="space-y-0">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between gap-4 border-b border-slate-200 py-2.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                ))}
              </div>
            </section>

            {/* Instructions block */}
            <div className="pt-4 border-t-2 border-dashed border-slate-200">
              <Skeleton className="h-3 w-24 mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
