import * as roomService from "@/modules/rooms";
import { createRoomSchema } from "@/modules/rooms/room.schema";
import { NextResponse } from "next/server";

export const GET = async () => {
  const rooms = await roomService.listRooms();
  return NextResponse.json(rooms, { status: 200 });
};

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const body = await req.json();
    const parsed = createRoomSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    const newRoom = await roomService.addRoom(parsed.data);
    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error("POST /guests", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 },
    );
  }
};
