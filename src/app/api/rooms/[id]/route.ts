import * as roomService from "@/modules/rooms";
import { updateRoomSchema } from "@/modules/rooms";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
  try {
    const { id } = await params;
    const roomId = Number(id);

    if (isNaN(roomId))
      return NextResponse.json(
        { error: "Id should be a number" },
        { status: 400 },
      );
    const body = await req.json();
    const parsed = updateRoomSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    const updatedRoom = await roomService.modifyRoom(roomId, parsed.data);

    if (!updatedRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error("PATCH /rooms/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update room" },
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
    const roomId = Number(id);

    const deleted = await roomService.removeRoom(roomId);

    if (!deleted) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Room deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /room/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 },
    );
  }
};
