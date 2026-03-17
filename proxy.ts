import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const proxy = (req: Request) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  if (!process.env.JWT_SECRET_KEY)
    return NextResponse.json({ error: "No secret key found" }, { status: 500 });
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY!);
    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
};

export const config = {
  matcher: ["/api/rooms/:path*", "/api/guests/:path*", "/api/bookings/:path*"],
};
