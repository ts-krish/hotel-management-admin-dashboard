import { pool } from "@/lib";
import { Booking } from "@/types";
import { CreateBookingInput, UpdateBookingInput } from "./booking.schema";

export const getBookings = async (): Promise<Booking[]> => {
  try {
    const result = await pool.query(`
      SELECT booking_id, guest_id, room_id, check_in_date, check_out_date, status
      FROM booking
    `);
    return result.rows;
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    throw error;
  }
};

export const insertBooking = async (
  data: CreateBookingInput,
): Promise<Booking> => {
  const { guest_id, room_id, check_in_date, check_out_date, status } = data;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const overlapCheck = await client.query(
      `
      SELECT 1 FROM booking
      WHERE room_id = $1
      AND status != 'cancelled'
      AND (
        $2 < check_out_date
        AND $3 > check_in_date
      )
      LIMIT 1
      `,
      [room_id, check_in_date, check_out_date],
    );

    if (overlapCheck.rowCount && overlapCheck.rowCount > 0) {
      throw new Error("Room is already booked for selected dates");
    }

    const result = await client.query<Booking>(
      `
      INSERT INTO booking (guest_id, room_id, check_in_date, check_out_date, status)
      VALUES ($1,$2,$3,$4,$5::booking_status)
      RETURNING *
      `,
      [guest_id, room_id, check_in_date, check_out_date, status],
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to create booking:", error);
    throw error;
  } finally {
    client.release();
  }
};

export const updateBooking = async (
  bookingId: number,
  data: UpdateBookingInput,
): Promise<Booking | null> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingRes = await client.query<Booking>(
      `SELECT * FROM booking WHERE booking_id = $1`,
      [bookingId],
    );

    const existing = existingRes.rows[0];
    if (!existing) {
      await client.query("ROLLBACK");
      return null;
    }

    const finalRoomId = data.room_id ?? existing.room_id;
    const finalCheckIn = data.check_in_date ?? existing.check_in_date;
    const finalCheckOut = data.check_out_date ?? existing.check_out_date;

    const overlapCheck = await client.query(
      `
      SELECT 1 FROM booking
      WHERE room_id = $1
      AND status != 'cancelled'
      AND booking_id != $4
      AND (
        $2 < check_out_date
        AND $3 > check_in_date
      )
      LIMIT 1
      `,
      [finalRoomId, finalCheckIn, finalCheckOut, bookingId],
    );

    if (overlapCheck.rowCount && overlapCheck.rowCount > 0) {
      throw new Error("Room is already booked for selected dates");
    }

    const result = await client.query<Booking>(
      `
      UPDATE booking
      SET
        guest_id = COALESCE($1, guest_id),
        room_id = COALESCE($2, room_id),
        check_in_date = COALESCE($3, check_in_date),
        check_out_date = COALESCE($4, check_out_date),
        status = COALESCE($5::booking_status, status)
      WHERE booking_id = $6
      RETURNING *
      `,
      [
        data.guest_id ?? null,
        data.room_id ?? null,
        data.check_in_date ?? null,
        data.check_out_date ?? null,
        data.status ?? null,
        bookingId,
      ],
    );

    await client.query("COMMIT");

    return result.rows[0] ?? null;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to update booking:", error);
    throw error;
  } finally {
    client.release();
  }
};

export const deleteBooking = async (bookingId: number): Promise<boolean> => {
  try {
    const result = await pool.query(
      `
      DELETE FROM booking
      WHERE booking_id = $1
      RETURNING booking_id
      `,
      [bookingId],
    );

    return result.rowCount === 1;
  } catch (error) {
    console.error("Failed to delete booking:", error);
    throw error;
  }
};
