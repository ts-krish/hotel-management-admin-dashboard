import { pool } from "@/lib";
import { Room } from "@/types";
import { CreateRoomInput, UpdateRoomInput } from "./room.schema";

export const getRooms = async (): Promise<Room[]> => {
  const rooms = await pool.query<Room>(`
    SELECT room_id, room_number, room_type, price_per_night, status
    FROM room
    ORDER BY room_number
  `);

  return rooms.rows;
};

export const insertRoom = async (data: CreateRoomInput): Promise<Room> => {
  const { room_number, room_type, price_per_night, status } = data;

  const newRoom = await pool.query<Room>(
    `
    INSERT INTO room (room_number, room_type, price_per_night, status)
    VALUES ($1, $2::room_category, $3, $4::room_status)
    RETURNING *
    `,
    [room_number, room_type, price_per_night, status],
  );

  return newRoom.rows[0];
};

export const updateRoom = async (
  roomId: number,
  data: UpdateRoomInput,
): Promise<Room | null> => {
  const { room_number, room_type, price_per_night, status } = data;

  const result = await pool.query<Room>(
    `
    UPDATE room
    SET
      room_number = COALESCE($1, room_number),
      room_type = COALESCE($2::room_category, room_type),
      price_per_night = COALESCE($3, price_per_night),
      status = COALESCE($4::room_status, status)
    WHERE room_id = $5
    RETURNING *
    `,
    [
      room_number ?? null,
      room_type ?? null,
      price_per_night ?? null,
      status ?? null,
      roomId,
    ],
  );

  return result.rows[0] ?? null;
};

export const deleteRoom = async (roomId: number): Promise<boolean> => {
  const result = await pool.query(
    `
    DELETE FROM room
    WHERE room_id = $1
    RETURNING room_id
    `,
    [roomId],
  );

  return result.rowCount === 1;
};
