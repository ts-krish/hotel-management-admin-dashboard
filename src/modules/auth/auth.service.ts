import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import * as repo from "./auth.repository";
import { LoginInput } from "./auth.schema";

export const login = async ({ email, password }: LoginInput) => {
  const admin = await repo.findAdmin(email);
  if (!admin) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("No Secret key found.");
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

  const token = await new SignJWT({ userId: admin.user_id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);

  return token;
};
