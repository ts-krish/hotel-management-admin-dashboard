import { z } from "zod";

export const createGuestSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),

  email: z.email(),

  phone_number: z
    .string()
    .min(7, "Phone number too short")
    .max(20, "Phone number too long")
    .optional(),
});

export type CreateGuestInput = z.infer<typeof createGuestSchema>;

export const updateGuestSchema = createGuestSchema.partial();
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;
