import * as bookingService from "@/modules/bookings";
import { UpdateBookingInput } from "@/types";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
  try {
    const { id } = await params;
    const bookingId = Number(id);
    const body: UpdateBookingInput = await req.json();
    const updatedBooking = await bookingService.modifyBooking(bookingId, body);

    if (!updatedBooking)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
  try {
    const { id } = await params;
    const booking = Number(id);

    const deleted = await bookingService.removeBooking(booking);

    if (!deleted) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Booking deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 },
    );
  }
};
