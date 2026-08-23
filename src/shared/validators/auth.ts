import { z } from 'zod';

export const registerUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name is required"),
  timezone: z.string().default("UTC"),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Infer the TypeScript type to use in your frontend forms
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
