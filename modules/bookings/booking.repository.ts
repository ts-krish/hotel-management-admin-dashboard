import pool from "@/lib/db";
import { CreateBookingInput, UpdateBookingInput } from "./booking.schema";

export const getBookings = async () => {
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

export const insertBooking = async (data: CreateBookingInput) => {
  try {
    const { guest_id, room_id, check_in_date, check_out_date, status } = data;

    const result = await pool.query(
      `
      INSERT INTO booking (guest_id, room_id, check_in_date, check_out_date, status)
      VALUES ($1, $2, $3, $4, $5::booking_status)
      RETURNING *
      `,
      [guest_id, room_id, check_in_date, check_out_date, status],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Failed to create booking:", error);
    throw error;
  }
};

export const updateBooking = async (
  bookingId: number,
  data: UpdateBookingInput,
) => {
  try {
    const { guest_id, room_id, check_in_date, check_out_date, status } = data;

    const result = await pool.query(
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
        guest_id ?? null,
        room_id ?? null,
        check_in_date ?? null,
        check_out_date ?? null,
        status ?? null,
        bookingId,
      ],
    );

    return result.rows[0] ?? null;
  } catch (error) {
    console.error("Failed to update booking:", error);
    throw error;
  }
};

export const deleteBooking = async (bookingId: number) => {
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
