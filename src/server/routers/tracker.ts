import { router, publicProcedure } from '../trpc';

export const trackerRouter = router({
  // A simple test endpoint to ensure it works
  ping: publicProcedure.query(() => {
    return "Tracker API is connected!";
  }),
});


