import pool from "@/lib/db";

export const findAdmin = async (email: string) => {
  const result = await pool.query(
    `
        SELECT * FROM users 
        WHERE email = $1
    `,
    [email],
  );
  return result.rows[0];
};
