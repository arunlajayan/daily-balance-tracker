import { TRPCError } from '@trpc/server';
import bcrypt, { hash } from 'bcryptjs';
import { router, publicProcedure } from '../trpc';
import { PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken";
import { z } from 'zod'
const prisma = new PrismaClient()
import { loginUserSchema, registerUserSchema } from '@/shared/validators/auth';


const JWT_SECRET = process.env.JWT_SECRET || "fallback-dev-secret";
const JWT_ACCESS_EXPIRY = "1m";   // Short-lived access token
const JWT_REFRESH_EXPIRY = "7d";   // Long-lived refresh token
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
          fullName,
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

 

  login: publicProcedure
    .input(loginUserSchema)
    .mutation(async ({ input }) => {
      const { email, password } = input

      const existingUser = await prisma.userProfile.findUnique({
        where: { email },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'user not register',
        });
      }

      const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);
      if (!isPasswordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const accessToken = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        JWT_SECRET,
        { expiresIn: JWT_ACCESS_EXPIRY, algorithm: "HS256" }
      );

      const refreshToken = jwt.sign(
        { userId: existingUser.id, type: "refresh" },
        JWT_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRY, algorithm: "HS256" }
      );

      await prisma.userProfile.update({
        where: { id: existingUser.id },
        data: { refreshToken },
      });


      return {
        accessToken,
        refreshToken,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          fullName: existingUser.fullName,
          timezone: existingUser.timezone,
        },
      };
    }),

    refresh: publicProcedure
    .input(z.object({ refreshToken: z.string() }))
    .mutation(async ({ input }) => {
      const decoded =jwt.verify(input.refreshToken, JWT_SECRET) as { userId: string; email?: string; type?: string };
      if (decoded.type !== "refresh") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid token type" });
      }

      const user = await prisma.userProfile.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, refreshToken: true },
      });

      if (!user || user.refreshToken !== input.refreshToken) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or revoked refresh token" });
      }

      // Issue new access token + rotate refresh token
      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_ACCESS_EXPIRY }
      );

      const newRefreshToken = jwt.sign(
        { userId: user.id, type: "refresh" },
        JWT_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRY }
      );

      await prisma.userProfile.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }),

  //    me: publicProcedure.query(async ({ ctx }) => {
  //   const user = await prisma.userProfile.findUnique({
  //     where: { id: ctx.userId },
  //     select: {
  //       id: true,
  //       email: true,
  //       fullName: true,
  //       timezone: true,
  //       emailVerified: true,
  //       createdAt: true,
  //     },
  //   });

  //   if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  //   return user;
  // }),

});
