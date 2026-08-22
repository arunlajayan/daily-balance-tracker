import { TRPCError } from '@trpc/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import { registerUserSchema } from '@/shared/validators/auth';

export const authRouter = router({
  
  register: publicProcedure
    .input(registerUserSchema)
    .mutation(async ({ input }) => {
      const { email, password, fullName, timezone } = input;

      // 1. Check if the user already exists to prevent database crashes
      const existingUser = await prisma.userProfile.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A user with this email already exists.',
        });
      }

      // 2. Hash the password securely (Cost factor of 12 is industry standard)
      const hashedPassword = await hash(password, 12);

      // 3. Create the user in the database
      const newUser = await prisma.userProfile.create({
        data: {
          email,
          passwordHash: hashedPassword,
          timezone,
        },
      });

      // 4. Return the safe DTO to the frontend (NEVER return the passwordHash)
      return {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        timezone: newUser.timezone,
        message: 'Account created successfully',
      };
    }),
});
