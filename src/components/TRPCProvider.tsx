'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { getTRPCClient, trpc } from '@/utils/trpc';

export default function TRPCProvider({ children }: { children: React.ReactNode }) {
  // We use state to ensure the query client is only created once per user session
  const [queryClient] = useState(() => new QueryClient());
  
   const [trpcClient] = useState(() => getTRPCClient('/api/trpc'));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

