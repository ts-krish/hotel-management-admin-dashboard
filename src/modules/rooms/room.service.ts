import * as repo from "./room.repository";
import { CreateRoomInput, UpdateRoomInput } from "./room.schema";

export const listRooms = () => repo.getRooms();

export const addRoom = (data: CreateRoomInput) => {
  return repo.insertRoom(data);
};

export const modifyRoom = (roomId: number, data: UpdateRoomInput) => {
  return repo.updateRoom(roomId, data);
};

export const removeRoom = (roomId: number) => {
  return repo.deleteRoom(roomId);
};
