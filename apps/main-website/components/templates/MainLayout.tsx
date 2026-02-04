'use client';

import { Navbar } from '@/components/organisms';
import { Footer } from '@/components/organisms';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div
      className="flex min-h-screen flex-col bg-gradient-to-br from-amber-50 via-yellow-50/95 to-amber-100/90"
      style={{ backgroundAttachment: 'fixed' }}
    >
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
