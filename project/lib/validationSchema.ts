import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "First name must be at least 2 characters").optional(),
  description: z.string().min(2, "Description must be at least 2 characters").optional(),
});

export const incomeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  amount: z.number(),
  date: z.date(),
  categoryId: z.number(),
});
