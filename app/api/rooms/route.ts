import { NextResponse } from "next/server";
import * as roomService from "@/modules/rooms";
import { CreateRoomInput } from "@/types";

export const GET = async () => {
  const rooms = await roomService.listRooms();
  return NextResponse.json(rooms, { status: 200 });
};

export const POST = async (req: Request): Promise<NextResponse> => {
  const body: CreateRoomInput = await req.json();
  const newRoom = await roomService.addRoom(body);
  return NextResponse.json(newRoom, { status: 201 });
};
