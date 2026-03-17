import * as repo from "./guest.repository";
import { CreateGuestInput, UpdateGuestInput } from "./guest.schema";

export const listGuests = () => {
  return repo.getGuests();
};

export const addGuest = (data: CreateGuestInput) => {
  return repo.insertGuest(data);
};

export const modifyGuest = (guestId: number, data: UpdateGuestInput) => {
  return repo.updateGuest(guestId, data);
};

export const removeGuest = (guestId: number) => {
  return repo.deleteGuest(guestId);
};
