// CHANGED: Replaced Zod with Yup for validation schema
// Before: import { z } from "zod"
// After:  import * as Yup from "yup"
import * as Yup from "yup";

export const loginSchema = Yup.object({
  // Before: z.email("Invalid email")
  // After:  Yup.string().email(...) — Yup separates type and format validators
  email: Yup.string().email("Invalid email").required("Email is required"),
  // Before: z.string().min(6, "...")
  // After:  Yup.string().min(6, "...") — direct equivalent
  password: Yup.string()
    .min(6, "Password must be 6 character long.")
    .required("Password is required"),
});

// CHANGED: Replaced z.infer<> with Yup.InferType<>
export type LoginInput = Yup.InferType<typeof loginSchema>;
