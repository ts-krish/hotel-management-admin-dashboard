import * as bookingService from "@/modules/bookings";
import { createBookingSchema } from "@/modules/bookings";
import { yupParse } from "@/lib/yupParse";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const bookings = await bookingService.listBookings();
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("GET /api/bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    // CHANGED: createBookingSchema.safeParse(body) → await yupParse(createBookingSchema, body)
    const parsed = await yupParse(createBookingSchema, body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.errors }, { status: 400 });
    }

    const newBooking = await bookingService.addBooking(parsed.data);
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("POST /bookings:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
};
