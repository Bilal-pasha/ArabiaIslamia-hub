'use client';

import Link from 'next/link';
import { ClipboardList, Building2, Home } from 'lucide-react';
import { SecondaryLogo, Button } from '@arabiaaislamia/ui';
import { publicRoutes, privateRoutes } from '@/constants/route';

export function AdmissionHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/10">
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 max-w-7xl">
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="flex size-10 sm:size-14 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-white/10 border border-white/20 p-1.5 shadow-lg">
              <SecondaryLogo width={36} height={36} className="rounded-lg sm:w-12 sm:h-12" />
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-lg sm:text-xl lg:text-2xl font-semibold text-white truncate">Online Admission</h1>
              <p className="text-slate-300 text-xs sm:text-sm">Arabia Islamia — Secondary Education</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0 flex-wrap">
            <Button variant="outline" size="sm" asChild className="hover:border-amber-400/50 hover:text-amber-300">
              <Link href={publicRoutes.home} className="inline-flex items-center gap-2 text-current">
                <Home className="size-4" />
                Back to main menu
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="hover:border-amber-400/50 hover:text-amber-300">
              <Link href={publicRoutes.status} className="inline-flex items-center gap-2 text-current">
                <ClipboardList className="size-4" />
                Check Status
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="hover:border-amber-400/50 hover:text-amber-300">
              <Link href={privateRoutes.applications} className="inline-flex items-center gap-2 text-current">
                <Building2 className="size-4" />
                Admin
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
