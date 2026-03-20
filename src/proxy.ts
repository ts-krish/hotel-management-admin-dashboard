import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export const proxy = async (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  const isApi = request.nextUrl.pathname.startsWith("/api");
  
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!token) {
    if (isApi)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!process.env.JWT_SECRET_KEY) {
    return NextResponse.json({ error: "No secret key found" }, { status: 500 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    if (isApi)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    return NextResponse.redirect(new URL("/login", request.url));
  }
};

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/rooms/:path*",
    "/guests/:path*",
    "/bookings/:path*",
    "/api/rooms/:path*",
    "/api/guests/:path*",
    "/api/bookings/:path*",
  ],
};
