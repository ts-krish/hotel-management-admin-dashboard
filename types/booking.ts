type BookingStatus = "booked" | "checked_in" | "checked_out" | "cancelled";

export interface Booking {
  booking_id: number;
  guest_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  status: BookingStatus;
}
