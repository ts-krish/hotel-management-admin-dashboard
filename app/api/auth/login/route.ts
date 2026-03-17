import { login } from "@/modules/auth";
import { NextResponse } from "next/server";
export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();
    const token = await login(email, password);
    return NextResponse.json({token}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
};
