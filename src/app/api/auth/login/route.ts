import { loginSchema } from "@/src/modules/auth/auth.schema";
import { login } from "@/src/modules/auth/auth.service";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const token = await login(parsed.data);

    const response = NextResponse.json(
      { message: "Logged in successfully" },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("POST /auth/login:", error);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 500 });
  }
};
