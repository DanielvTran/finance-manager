import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email").trim().max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(255),
});
