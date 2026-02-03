'use client';

import Link from 'next/link';
import { SecondaryLogo, Button } from '@arabiaaislamia/ui';
import { publicRoutes, privateRoutes } from '@/constants/route';

export function AdmissionHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/10">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/20 p-1.5 shadow-lg">
              <SecondaryLogo width={48} height={48} className="rounded-lg" />
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-semibold text-white">Online Admission</h1>
              <p className="text-slate-300 text-xs sm:text-sm">Arabia Islamia — Secondary Education</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild className="border-orange-400/40 text-orange-200 hover:bg-orange-500/20 hover:text-white hover:border-orange-400/60">
              <Link href={publicRoutes.status} className="inline-flex items-center gap-2 text-current">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Check Status
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="border-sky-400/40 text-sky-200 hover:bg-sky-500/20 hover:text-white hover:border-sky-400/60">
              <Link href={privateRoutes.applications} className="inline-flex items-center gap-2 text-current">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Admin
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
