import { z } from "zod";

export const createRoomSchema = z.object({
  room_number: z.number().positive(),
  room_type: z.enum(["single", "double", "deluxe"]),
  price_per_night: z.number().positive(),
  status: z.enum(["available", "booked", "maintenance"]).optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export const updateRoomSchema = createRoomSchema.partial();
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
