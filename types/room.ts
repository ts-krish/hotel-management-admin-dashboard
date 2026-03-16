type RoomType = "single" | "double" | "deluxe";
type RoomStatus = "available" | "booked" | "maintenance";

export interface Room {
  room_id: number;
  room_number: number;
  room_type: RoomType;
  price_per_night: number;
  status: RoomStatus;
}
export type CreateRoomInput = Omit<Room, "room_id">;
export type UpdateRoomInput = Partial<CreateRoomInput>;
