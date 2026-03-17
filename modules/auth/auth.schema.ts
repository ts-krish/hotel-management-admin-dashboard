import { z } from "zod";

export const loginSchema = z.object({
  role: z.enum(["admin", "guest"]),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
