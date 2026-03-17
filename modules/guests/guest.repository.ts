import pool from "@/lib/db";
import { CreateGuestInput, Guest, UpdateGuestInput } from "@/types";

export const getGuests = async () => {
  try {
    const guest = await pool.query<Guest>(`
      SELECT full_name,email,phone_number 
      FROM guest
      ORDER BY full_name
    `);
    return guest.rows;
  } catch (error) {
    console.error("Failed to fetch guests:", error);
    throw error;
  }
};

export const insertGuest = async (data: CreateGuestInput): Promise<Guest> => {
  try {
    const { full_name, email, phone_number } = data;
    const newGuest = await pool.query<Guest>(
      `
            INSERT INTO guest (full_name,email,phone_number)
            VALUES ($1,$2,$3)
            RETURNING *
        `,
      [full_name, email, phone_number],
    );
    return newGuest.rows[0];
  } catch (error) {
    console.error("Failed to create guest:", error);
    throw error;
  }
};

export const updateGuest = async (
  guestId: number,
  data: UpdateGuestInput,
): Promise<Guest> => {
  try {
    const { full_name, email, phone_number } = data;
    const updatedGuest = await pool.query(
      `
                UPDATE guest
                SET
                    full_name = COALESCE($1, full_name),
                    email = COALESCE($2, email),
                    phone_number = COALESCE($3, phone_number)
                WHERE guest_id = $4
                RETURNING *
            `,
      [full_name ?? null, email ?? null, phone_number ?? null, guestId],
    );
    return updatedGuest.rows[0] ?? null;
  } catch (error) {
    console.error("Failed to update guest:", error);
    throw error;
  }
};

export const deleteGuest = async (guestId: number): Promise<boolean> => {
  try {
    const result = await pool.query(
      `
      DELETE FROM guest
      WHERE guest_id = $1
      RETURNING guest_id
      `,
      [guestId],
    );

    return result.rowCount === 1;
  } catch (error) {
    console.error("Failed to delete room:", error);
    throw error;
  }
};
