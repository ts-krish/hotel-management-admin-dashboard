import { CreateRoomInput, UpdateRoomInput } from "@/types";
import * as repo from "./room.repository";

export const listRooms = () => {
  return repo.findRooms();
};

export const addRoom = (data: CreateRoomInput) => {
  return repo.insertRoom(data);
};

export const modifyRoom = (roomId: number, data: UpdateRoomInput) => {
  return repo.updateRoom(roomId, data);
};

export const removeRoom = (roomId: number) => {
  return repo.deleteRoom(roomId);
};
