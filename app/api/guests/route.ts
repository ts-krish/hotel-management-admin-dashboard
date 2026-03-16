import * as guestService from "@/modules/guests";
import { CreateGuestInput } from "@/types/guest";
import { NextResponse } from "next/server";

export const GET = async () => {
  const guests = await guestService.listGuests();
  return NextResponse.json(guests, { status: 200 });
};

export const POST = async (req: Request): Promise<NextResponse> => {
  const body: CreateGuestInput = await req.json();
  const newGuest = await guestService.addGuest(body);
  return NextResponse.json(newGuest, { status: 201 });
};
