import pool from "@/src/lib/db";

const seed = async () => {
  try {
    // INSERT ROOMS
    await pool.query(`INSERT INTO room (room_number, price_per_night, room_type, status)
      VALUES
      (101,150,'deluxe','available'),
      (102,120,'double','booked'),
      (103,90,'single','maintenance')`);

    /* Insert Guests */

    await pool.query(`
      INSERT INTO guest (full_name, email, phone_number)
      VALUES
      ('Krish Patel','krish.patel@gmail.com','9898310101'),
      ('John Smith','john.smith@gmail.com','9876543210')
    `);

    /* Insert Booking */

    await pool.query(`
      INSERT INTO booking
      (guest_id, room_id, check_in_date, check_out_date)
      VALUES
      (1,1,'2026-03-15','2026-03-20')
    `);

    await pool.query(`
      INSERT INTO users (email,password)
      VALUES ('admin@gmail.com','$2b$10$7nLAkUfQ.Lzv9WcGmc/AlOPoFkb.Wxk9loy2bfzbsFoxRDlxEfA5K')
      `);

    console.log("Seed data inserted successfully");
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
};
seed();
