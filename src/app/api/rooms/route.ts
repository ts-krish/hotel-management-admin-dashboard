import * as roomService from "@/modules/rooms";
import { createRoomSchema } from "@/modules/rooms";
import { yupParse } from "@/lib/yupParse";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const rooms = await roomService.listRooms();
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("GET /api/rooms:", error);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
};

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const body = await req.json();

    // CHANGED: createRoomSchema.safeParse(body) → await yupParse(createRoomSchema, body)
    const parsed = await yupParse(createRoomSchema, body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.errors }, { status: 400 });
    }

    const newRoom = await roomService.addRoom(parsed.data);
    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error("POST /rooms", error);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
};
