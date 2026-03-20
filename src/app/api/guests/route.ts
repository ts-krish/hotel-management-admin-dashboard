import { sendBookingEmail } from "@/lib/sendBookingEmail";
import { yupParse } from "@/lib/yupParse";
import * as guestService from "@/modules/guests";
import { createGuestSchema } from "@/modules/guests";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const guests = await guestService.listGuests();
    return NextResponse.json(guests, { status: 200 });
  } catch (error) {
    console.error("GET /api/guests:", error);
    return NextResponse.json(
      { error: "Failed to fetch guests" },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const parsed = await yupParse(createGuestSchema, body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.errors }, { status: 400 });
    }

    const newGuest = await guestService.addGuest(parsed.data);
    await sendBookingEmail({
      to: parsed.data.email,
      guestName: parsed.data.full_name,
    }).catch((err) => {
      console.error("Email failed:", err);
    });
    return NextResponse.json(newGuest, { status: 201 });
  } catch (error) {
    console.error("POST /guests", error);
    return NextResponse.json(
      { error: "Failed to create guest" },
      { status: 500 },
    );
  }
};
