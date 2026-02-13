'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster, ModalProvider } from '@arabiaaislamia/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        {children}
        <Toaster position="top-right" richColors theme="dark" />
      </ModalProvider>
    </QueryClientProvider>
  );
}
