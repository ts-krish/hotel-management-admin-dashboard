import pool from "@/lib/db";

export const findAdmin = async (email: string) => {
  const result = await pool.query(
    `
    SELECT user_id, email, password
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  return result.rows[0] ?? null;
};
