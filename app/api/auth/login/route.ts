import { loginSchema } from "@/modules/auth/auth.schema";
import { login } from "@/modules/auth/auth.service";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const token = await login(parsed.data);

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.log("POST /auth/login:", error);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
};
