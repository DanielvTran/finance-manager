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
});

export const incomeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  amount: z
    .string()
    .min(1, "Amount is required")
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive("Amount must be positive").finite("Amount must be a valid number")),
  date: z
    .date()
    .min(new Date("2000-01-01"), "Date cannot be before 2000")
    .max(new Date(), "Date cannot be in the future")
    .default(() => new Date()),
  categoryId: z
    .string()
    .min(1, "Category is required")
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive("Category must be positive").finite("Category must be a valid number")),
});

export const expenseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  amount: z
    .string()
    .min(1, "Amount is required")
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive("Amount must be positive").finite("Amount must be a valid number")),
  date: z
    .date()
    .min(new Date("2000-01-01"), "Date cannot be before 2000")
    .max(new Date(), "Date cannot be in the future")
    .default(() => new Date()),
  categoryId: z
    .string()
    .min(1, "Category is required")
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive("Category must be positive").finite("Category must be a valid number")),
});

export const budgetSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive("Amount must be positive").finite("Amount must be a valid number")),
  categoryId: z
    .string()
    .min(1, "Category is required")
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive("Category must be positive").finite("Category must be a valid number")),
});
