import pool from "@/lib/db";
import { CreateBookingInput, Booking, UpdateBookingInput } from "@/types";

export const getBookings = async () => {
  try {
    const booking = await pool.query<Booking>(`
      SELECT guest_id,room_id,check_in_date,check_out_date,status
      FROM booking
    `);
    return booking.rows;
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    throw error;
  }
};

export const insertBooking = async (
  data: CreateBookingInput,
): Promise<Booking> => {
  try {
    const { guest_id, room_id, check_in_date, check_out_date, status } = data;
    const newBooking = await pool.query<Booking>(
      `
            INSERT INTO booking (guest_id,room_id,check_in_date,check_out_date,status)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *
        `,
      [guest_id, room_id, check_in_date, check_out_date, status],
    );
    return newBooking.rows[0];
  } catch (error) {
    console.error("Failed to create booking:", error);
    throw error;
  }
};

export const updateBooking = async (
  bookingId: number,
  data: UpdateBookingInput,
): Promise<Booking> => {
  try {
    const { guest_id, room_id, check_in_date, check_out_date, status } = data;
    const updatedBooking = await pool.query(
      `
                UPDATE booking
                SET
                    guest_id = COALESCE($1, guest_id),
                    room_id = COALESCE($2, room_id),
                    check_in_date = COALESCE($3, check_in_date),
                    check_out_date = COALESCE($4, check_out_date),
                    status = COALESCE($5, status)
                WHERE guest_id = $6
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
    return updatedBooking.rows[0] ?? null;
  } catch (error) {
    console.error("Failed to update booking:", error);
    throw error;
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
