import * as repo from "./booking.repository";
import { CreateBookingInput, UpdateBookingInput } from "./booking.schema";

export const listBookings = () => {
  return repo.getBookings();
};

export const addBooking = (data: CreateBookingInput) => {
  return repo.insertBooking(data);
};

export const modifyBooking = (bookingId: number, data: UpdateBookingInput) => {
  return repo.updateBooking(bookingId, data);
};

export const removeBooking = (bookingId: number) => {
  return repo.deleteBooking(bookingId);
};
