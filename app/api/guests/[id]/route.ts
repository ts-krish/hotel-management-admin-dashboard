import * as guestService from "@/modules/guests";
import { UpdateGuestInput } from "@/types/guest";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
  try {
    const { id } = await params;
    const guestId = Number(id);
    const body: UpdateGuestInput = await req.json();
    const updatedGuest = await guestService.modifyGuest(guestId, body);

    if (!updatedGuest)
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });

    return NextResponse.json(updatedGuest);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update guest" },
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
    const guestId = Number(id);

    const deleted = await guestService.removeGuest(guestId);

    if (!deleted) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Guest deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete guest" },
      { status: 500 },
    );
  }
};
