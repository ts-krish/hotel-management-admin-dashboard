// CHANGED: Replaced Zod with Yup for validation schema
import * as Yup from "yup";

// Before: z.object({ ... }) — base schema then .refine() for cross-field validation
// After:  Yup.object({ ... }).test() — cross-field validation via .test() on the object level
export const createBookingSchema = Yup.object({
  // Before: z.number().positive()
  // After:  Yup.number().positive() — direct equivalent; .required() must be explicit
  guest_id: Yup.number()
    .positive("Guest ID must be positive")
    .required("Guest is required"),

  room_id: Yup.number()
    .positive("Room ID must be positive")
    .required("Room is required"),

  // Before: z.coerce.date() — Zod coerces strings to Date automatically
  // After:  Yup.date() — Yup also coerces strings/numbers to Date natively
  check_in_date: Yup.date().required("Check-in date is required"),

  check_out_date: Yup.date().required("Check-out date is required"),

  status: Yup.mixed<"booked" | "checked_in" | "checked_out" | "cancelled">()
    .oneOf(
      ["booked", "checked_in", "checked_out", "cancelled"],
      "Invalid status"
    )
    .required("Status is required"),
})
  // Before: .refine((data) => data.check_out_date > data.check_in_date, { path: ["check_out_date"] })
  // After:  .test() with context access via this.parent — equivalent cross-field validation
  .test(
    "checkout-after-checkin",
    "check_out_date must be after check_in_date",
    function (value) {
      const { check_in_date, check_out_date } = value as {
        check_in_date?: Date;
        check_out_date?: Date;
      };
      if (check_in_date && check_out_date) {
        if (check_out_date <= check_in_date) {
          // createError targets the specific field (same behavior as Zod's path)
          return this.createError({
            path: "check_out_date",
            message: "check_out_date must be after check_in_date",
          });
        }
      }
      return true;
    }
  );

export type CreateBookingInput = Yup.InferType<typeof createBookingSchema>;

// Before: baseBookingSchema.partial().refine(...)
// After:  All fields optional, same cross-field .test() logic guarded by existence checks
export const updateBookingSchema = Yup.object({
  guest_id: Yup.number().positive("Guest ID must be positive").optional(),
  room_id: Yup.number().positive("Room ID must be positive").optional(),
  check_in_date: Yup.date().optional(),
  check_out_date: Yup.date().optional(),
  status: Yup.mixed<"booked" | "checked_in" | "checked_out" | "cancelled">()
    .oneOf(["booked", "checked_in", "checked_out", "cancelled"], "Invalid status")
    .optional(),
}).test(
  "checkout-after-checkin",
  "check_out_date must be after check_in_date",
  function (value) {
    const { check_in_date, check_out_date } = value as {
      check_in_date?: Date;
      check_out_date?: Date;
    };
    if (check_in_date && check_out_date) {
      if (check_out_date <= check_in_date) {
        return this.createError({
          path: "check_out_date",
          message: "check_out_date must be after check_in_date",
        });
      }
    }
    return true;
  }
);

export type UpdateBookingInput = Yup.InferType<typeof updateBookingSchema>;
