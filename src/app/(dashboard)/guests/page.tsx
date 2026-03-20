"use client";

import useForm from "@/hooks/useForm";
import api from "@/lib/api";
import {
  CreateGuestInput,
  createGuestSchema,
} from "@/modules/guests/guest.schema";
import { Booking, Guest } from "@/types";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Loader2, Plus } from "lucide-react";

const bookingBadge: Record<
  Booking["status"],
  "default" | "destructive" | "secondary" | "outline"
> = {
  booked: "default",
  checked_in: "secondary",
  checked_out: "outline",
  cancelled: "destructive",
};

const bookingLabel: Record<Booking["status"], string> = {
  booked: "Booked",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  cancelled: "Cancelled",
};

const toDateInput = (dateStr: string) => dateStr?.slice(0, 10) ?? "";

// ── Guest Form ────────────────────────────────────────────────────────────────
interface GuestFormProps {
  initialValues: CreateGuestInput;
  onSuccess: () => void;
  submitLabel: string;
  apiCall: (values: CreateGuestInput) => Promise<unknown>;
}

const GuestForm = ({
  initialValues,
  onSuccess,
  submitLabel,
  apiCall,
}: GuestFormProps) => {
  const {
    values,
    errors,
    // CHANGED: destructure `touched` — required to gate error visibility.
    // Formik only marks a field touched after blur or form submit, so without
    // this check errors would appear before the user has interacted with the field.
    touched,
    formError,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<CreateGuestInput>({
    initialValues,
    schema: createGuestSchema,
    onSubmit: async (data) => {
      await apiCall(data);
      onSuccess();
    },
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
      {formError && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {formError}
        </div>
      )}

      {/* Full Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          placeholder="John Doe"
          value={values.full_name}
          onChange={handleChange}
          onBlur={handleBlur}
          // CHANGED: gate red border on touched.full_name
          // Before: className={errors.full_name ? "border-red-400" : ""}
          // After:  className={touched.full_name && errors.full_name ? "..." : ""}
          className={touched.full_name && errors.full_name ? "border-red-400" : ""}
        />
        {/* CHANGED: gate error message on touched */}
        {touched.full_name && errors.full_name && (
          <p className="text-xs text-red-500">{errors.full_name}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          // CHANGED: gate on touched.email
          className={touched.email && errors.email ? "border-red-400" : ""}
        />
        {/* CHANGED: gate error message on touched */}
        {touched.email && errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Phone Number — optional field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          name="phone_number"
          placeholder="+91 98765 43210"
          value={values.phone_number ?? ""}
          onChange={handleChange}
          onBlur={handleBlur}
          // CHANGED: gate on touched.phone_number
          className={touched.phone_number && errors.phone_number ? "border-red-400" : ""}
        />
        {/* CHANGED: gate error message on touched */}
        {touched.phone_number && errors.phone_number && (
          <p className="text-xs text-red-500">{errors.phone_number}</p>
        )}
      </div>

      {/* Submit — unchanged */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
};

// ── Guest Detail (read-only, no form) — unchanged ────────────────────────────
const GuestDetailContent = ({ guest }: { guest: Guest }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data: Booking[] = await api("/api/bookings");
        setBookings(data.filter((b) => b.guest_id === guest.guest_id));
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [guest.guest_id]);

  return (
    <div className="flex flex-col gap-5 pt-1">
      <div className="p-4 flex gap-3">
        <div className="flex items-center gap-3">
          <div className="text-gray-600">
            <p>{guest.full_name}</p>
          </div>
        </div>

        <div className="flex gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            {guest.email}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            {guest.phone_number || "—"}
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-zinc-800 mb-2">
          Booking History
        </p>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Room</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-gray-400 py-6 text-sm"
                  >
                    No bookings found for this guest
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((b) => (
                  <TableRow key={b.booking_id}>
                    <TableCell className="font-medium">{b.room_id}</TableCell>
                    <TableCell>{toDateInput(b.check_in_date)}</TableCell>
                    <TableCell>{toDateInput(b.check_out_date)}</TableCell>
                    <TableCell>
                      <Badge variant={bookingBadge[b.status]}>
                        {bookingLabel[b.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

// ── Guest Page (table + dialogs) — unchanged ─────────────────────────────────
const GuestPage = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [viewGuest, setViewGuest] = useState<Guest | null>(null);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const data = await api("/api/guests");
      setGuests(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          View guest information and booking history
        </p>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Guest</DialogTitle>
            </DialogHeader>
            <GuestForm
              initialValues={{ full_name: "", email: "", phone_number: "" }}
              submitLabel="Add Guest"
              apiCall={(data) =>
                api("/api/guests", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                })
              }
              onSuccess={() => {
                setAddOpen(false);
                fetchGuests();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>PHONE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-red-500 py-8"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : guests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-400 py-8"
                >
                  No guests found
                </TableCell>
              </TableRow>
            ) : (
              guests.map((guest) => (
                <TableRow key={guest.guest_id}>
                  <TableCell className="font-medium">
                    {guest.full_name}
                  </TableCell>
                  <TableCell>{guest.email}</TableCell>
                  <TableCell>{guest.phone_number || "—"}</TableCell>
                  <TableCell>
                    <Dialog
                      open={viewGuest?.guest_id === guest.guest_id}
                      onOpenChange={(o) => !o && setViewGuest(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewGuest(guest)}
                          className="text-gray-500 hover:text-teal-600 hover:bg-teal-50 cursor-pointer"
                        >
                          <Eye size={20} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="font-bold">
                            Guest Details
                          </DialogTitle>
                        </DialogHeader>
                        <GuestDetailContent guest={guest} />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GuestPage;
