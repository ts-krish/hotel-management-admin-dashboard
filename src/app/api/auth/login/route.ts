import { login, loginSchema } from "@/modules/auth";
import { yupParse } from "@/lib/yupParse";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    // CHANGED: schema.safeParse(body) → await yupParse(schema, body)
    // yupParse is a thin helper in src/lib/yupParse.ts that wraps Yup's
    // async validate() and returns the same { success, data/errors } shape
    // that Zod's safeParse() used to return, so the rest of this handler
    // is structurally identical to before.
    const parsed = await yupParse(loginSchema, body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.errors }, { status: 400 });
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
