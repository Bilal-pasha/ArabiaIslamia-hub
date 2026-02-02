'use client';

import Link from 'next/link';
import { SecondaryLogo, Button } from '@arabiaaislamia/ui';
import { publicRoutes, privateRoutes } from '@/constants/route';

export function AdmissionHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0f2744] to-[#1e4a6f] p-1.5 shadow-md">
              <SecondaryLogo width={48} height={48} className="rounded-lg" />
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">Online Admission</h1>
              <p className="text-muted-foreground text-xs sm:text-sm">Arabia Islamia — Secondary Education</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary">
              <Link href={publicRoutes.status} className="inline-flex items-center gap-2">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Check Status
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={privateRoutes.applications} className="inline-flex items-center gap-2">
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
