import * as guestService from "@/modules/guests";
import { createGuestSchema } from "@/modules/guests";
import { yupParse } from "@/lib/yupParse";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const guests = await guestService.listGuests();
    return NextResponse.json(guests, { status: 200 });
  } catch (error) {
    console.error("GET /api/guests:", error);
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    // CHANGED: createGuestSchema.safeParse(body) → await yupParse(createGuestSchema, body)
    const parsed = await yupParse(createGuestSchema, body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.errors }, { status: 400 });
    }

    const newGuest = await guestService.addGuest(parsed.data);
    return NextResponse.json(newGuest, { status: 201 });
  } catch (error) {
    console.error("POST /guests", error);
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 });
  }
};
