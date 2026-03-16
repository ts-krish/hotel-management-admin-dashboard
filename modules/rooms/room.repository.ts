import pool from "@/lib/db";
import { CreateRoomInput, Room, UpdateRoomInput } from "@/types";

export const findRooms = async (): Promise<Room[]> => {
  try {
    const rooms = await pool.query<Room>(`
      SELECT room_number,room_type,price_per_night,status 
      FROM room
      ORDER BY room_number
    `);
    return rooms.rows;
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    throw error;
  }
};

export const insertRoom = async (data: CreateRoomInput): Promise<Room> => {
  try {
    const { room_number, room_type, price_per_night, status } = data;
    const newRoom = await pool.query<Room>(
      `
            INSERT INTO room (room_number,room_type,price_per_night,status)
            VALUES ($1,$2,$3,$4)
            RETURNING *
        `,
      [room_number, room_type, price_per_night, status],
    );
    return newRoom.rows[0];
  } catch (error) {
    console.error("Failed to create room:", error);
    throw error;
  }
};

export const updateRoom = async (
  roomId: number,
  data: UpdateRoomInput,
): Promise<Room> => {
  try {
    const { room_number, room_type, price_per_night, status } = data;
    const updatedRoom = await pool.query(
      `
                UPDATE room
                SET
                    room_number = COALESCE($1, room_number),
                    room_type = COALESCE($2, room_type),
                    price_per_night = COALESCE($3, price_per_night),
                    status = COALESCE($4, status)
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
    return updatedRoom.rows[0] ?? null;
  } catch (error) {
    console.error("Failed to update room:", error);
    throw error;
  }
};

export const deleteRoom = async (roomId: number): Promise<boolean> => {
  try {
    const result = await pool.query(
      `
      DELETE FROM room
      WHERE room_id = $1
      RETURNING room_id
      `,
      [roomId]
    );

    return result.rowCount === 1;
  } catch (error) {
    console.error("Failed to delete room:", error);
    throw error;
  }
};