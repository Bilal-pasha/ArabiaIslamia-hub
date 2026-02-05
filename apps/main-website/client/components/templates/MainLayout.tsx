'use client';

import { Navbar } from '@/client/components/organisms';
import { Footer } from '@/client/components/organisms';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div
      className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden bg-gradient-to-br from-amber-50 via-yellow-50/95 to-amber-100/90"
      style={{ backgroundAttachment: 'fixed' }}
    >
      <Navbar />
      <main className="flex-1 w-full min-w-0 overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
}
