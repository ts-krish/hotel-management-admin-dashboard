export interface Guest {
  guest_id: number;
  full_name: string;
  email: string;
  phone_number: string;
}

export type CreateGuestInput = Omit<Guest, "guest_id">;
export type UpdateGuestInput = Partial<CreateGuestInput>;
