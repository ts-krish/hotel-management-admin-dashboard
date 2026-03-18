import { updateGuestSchema } from "@/src/modules/guests";
import * as guestService from "@/src/modules/guests/guest.service";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const guestId = Number(id);

    if (isNaN(guestId))
      return NextResponse.json(
        { error: "Id should be a number" },
        { status: 400 },
      );

    const body = await req.json();
    const parsed = updateGuestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const updatedGuest = await guestService.modifyGuest(guestId, parsed.data);

    if (!updatedGuest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json(updatedGuest);
  } catch (error) {
    console.error("PATCH /guests/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update guest" },
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
    console.error("DELETE /guests/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete guest" },
      { status: 500 },
    );
  }
};
