import { router } from '../trpc';
import { authRouter } from './auth';
import { dailyTracker } from './tracker';

export const appRouter = router({
  auth: authRouter,
  tracker: dailyTracker,
});

// Export the type definition of the API so the frontend knows what routes exist
export type AppRouter = typeof appRouter;
