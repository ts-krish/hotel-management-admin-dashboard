// CHANGED: Replaced Zod with Yup for validation schema
import * as Yup from "yup";

// Before: z.object({ room_number: z.number().positive(), ... })
// After:  Yup.object({ room_number: Yup.number().positive(), ... })
// Key difference: Yup requires .required() explicitly; Zod fields are required by default
export const createRoomSchema = Yup.object({
  room_number: Yup.number()
    .positive("Room number must be positive")
    .required("Room number is required"),

  // Before: z.enum(["single","double","deluxe"])
  // After:  Yup.mixed().oneOf([...]) — Yup uses oneOf for enum-like constraints
  room_type: Yup.mixed<"single" | "double" | "deluxe">()
    .oneOf(["single", "double", "deluxe"], "Invalid room type")
    .required("Room type is required"),

  price_per_night: Yup.number()
    .positive("Price must be positive")
    .required("Price per night is required"),

  // Before: z.enum([...]).optional()
  // After:  Yup does not require .optional() since fields are nullable by default unless .required() is added
  status: Yup.mixed<"available" | "booked" | "maintenance">()
    .oneOf(["available", "booked", "maintenance"], "Invalid status")
    .optional(),
});

// CHANGED: Replaced z.infer<> with Yup.InferType<>
export type CreateRoomInput = Yup.InferType<typeof createRoomSchema>;

// Before: createRoomSchema.partial()
// After:  Each field individually marked optional — Yup has no built-in .partial() equivalent
export const updateRoomSchema = Yup.object({
  room_number: Yup.number().positive("Room number must be positive").optional(),
  room_type: Yup.mixed<"single" | "double" | "deluxe">()
    .oneOf(["single", "double", "deluxe"], "Invalid room type")
    .optional(),
  price_per_night: Yup.number()
    .positive("Price must be positive")
    .optional(),
  status: Yup.mixed<"available" | "booked" | "maintenance">()
    .oneOf(["available", "booked", "maintenance"], "Invalid status")
    .optional(),
});

export type UpdateRoomInput = Yup.InferType<typeof updateRoomSchema>;
