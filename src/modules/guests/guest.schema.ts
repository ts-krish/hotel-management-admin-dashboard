// CHANGED: Replaced Zod with Yup for validation schema
import * as Yup from "yup";

export const createGuestSchema = Yup.object({
  full_name: Yup.string()
    .min(1, "Full name is required")
    .required("Full name is required"),

  // Before: z.email() — Zod has a standalone .email() method
  // After:  Yup.string().email() — Yup chains email validation onto string type
  email: Yup.string().email("Invalid email").required("Email is required"),

  // Before: z.string().min(7,...).max(20,...).optional()
  // After:  Yup strips the field when it's empty string via .optional()
  phone_number: Yup.string()
    .min(7, "Phone number too short")
    .max(20, "Phone number too long")
    .optional(),
});

export type CreateGuestInput = Yup.InferType<typeof createGuestSchema>;

// Before: createGuestSchema.partial()
// After:  All fields manually set to optional — Yup has no .partial() shorthand
export const updateGuestSchema = Yup.object({
  full_name: Yup.string().min(1, "Full name is required").optional(),
  email: Yup.string().email("Invalid email").optional(),
  phone_number: Yup.string()
    .min(7, "Phone number too short")
    .max(20, "Phone number too long")
    .optional(),
});

export type UpdateGuestInput = Yup.InferType<typeof updateGuestSchema>;
