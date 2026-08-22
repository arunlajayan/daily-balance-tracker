import { router } from '../trpc';
import { authRouter } from './auth';
import { trackerRouter } from './tracker';

export const appRouter = router({
  auth: authRouter,
  tracker: trackerRouter,
});

// Export the type definition of the API so the frontend knows what routes exist
export type AppRouter = typeof appRouter;
