'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ModalProvider } from '@arabiaaislamia/ui';
import { LocaleProvider } from '@/lib/locale';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <LocaleProvider>{children}</LocaleProvider>
      </ModalProvider>
    </QueryClientProvider>
  );
}
