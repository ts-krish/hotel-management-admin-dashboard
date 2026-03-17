import { updateBookingSchema } from "@/modules/bookings";
import * as bookingService from "@/modules/bookings/booking.service";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const bookingId = Number(id);
    const body = await req.json();
    const parsed = updateBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const updatedBooking = await bookingService.modifyBooking(
      bookingId,
      parsed.data,
    );

    if (!updatedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBooking);
  } catch(error) {
    console.error("PATCH /bookings/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const bookingId = Number(id);

    const deleted = await bookingService.removeBooking(bookingId);

    if (!deleted) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Booking deleted successfully" },
      { status: 200 },
    );
  } catch(error) {
    console.error("DELETE /bookings/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 },
    );
  }
};
