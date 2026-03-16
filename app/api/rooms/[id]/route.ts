import * as roomService from "@/modules/rooms";
import { UpdateRoomInput } from "@/types";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
  try {
    const { id } = await params;
    const roomId = Number(id);
    const body: UpdateRoomInput = await req.json();
    const updatedRoom = await roomService.modifyRoom(roomId, body);

    if (!updatedRoom)
      return NextResponse.json({ error: "Room not found" }, { status: 404 });

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error(error);

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
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 },
    );
  }
};
