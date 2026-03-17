import * as bookingService from "@/modules/bookings";
import { CreateBookingInput } from "@/types";
import { NextResponse } from "next/server";

export const GET = async () => {
  const booking = await bookingService.listBookings();
  return NextResponse.json(booking, { status: 200 });
};

export const POST = async (req: Request): Promise<NextResponse> => {
  const body: CreateBookingInput = await req.json();
  const newBooking = await bookingService.addBooking(body);
  return NextResponse.json(newBooking, { status: 201 });
};
