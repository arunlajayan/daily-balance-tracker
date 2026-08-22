import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers/_app';

// This exports the strongly-typed hooks you will use in your components
export const trpc = createTRPCReact<AppRouter>();
