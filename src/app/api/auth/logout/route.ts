import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("POST /auth/logout:", error);

    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
};
