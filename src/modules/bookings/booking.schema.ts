import { z } from "zod";

const baseBookingSchema = z.object({
  guest_id: z.number().positive(),
  room_id: z.number().positive(),
  check_in_date: z.coerce.date(),
  check_out_date: z.coerce.date(),
  status: z.enum(["booked", "checked_in", "checked_out", "cancelled"]),
});

export const createBookingSchema = baseBookingSchema.refine(
  (data) => data.check_out_date > data.check_in_date,
  {
    message: "check_out_date must be after check_in_date",
    path: ["check_out_date"],
  },
);

export const updateBookingSchema = baseBookingSchema.partial().refine(
  (data) => {
    if (data.check_in_date && data.check_out_date) {
      return data.check_out_date > data.check_in_date;
    }
    return true;
  },
  {
    message: "check_out_date must be after check_in_date",
    path: ["check_out_date"],
  },
);

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
