"use client";

import { useEffect, useState } from "react";
import { Booking } from "@/types";
import { createBookingSchema, CreateBookingInput } from "@/modules/bookings/booking.schema";
import useForm from "@/hooks/useForm";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";

// ── Status badge helper ───────────────────────────────────────────────────────
const statusVariant: Record<
  Booking["status"],
  "default" | "destructive" | "secondary" | "outline"
> = {
  booked: "default",
  checked_in: "secondary",
  checked_out: "outline",
  cancelled: "destructive",
};

const statusLabel: Record<Booking["status"], string> = {
  booked: "Booked",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  cancelled: "Cancelled",
};

const toDateInput = (dateStr: string) => dateStr?.slice(0, 10) ?? "";

// ── Booking Form ──────────────────────────────────────────────────────────────
interface BookingFormProps {
  initialValues: CreateBookingInput;
  onSuccess: () => void;
  submitLabel: string;
  apiCall: (values: CreateBookingInput) => Promise<unknown>;
}

const BookingForm = ({ initialValues, onSuccess, submitLabel, apiCall }: BookingFormProps) => {
  const { values, errors, formError, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue } =
    useForm<CreateBookingInput>({
      initialValues,
      schema: createBookingSchema,
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

      {/* Guest ID */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="guest_id">Guest ID</Label>
        <Input
          id="guest_id"
          name="guest_id"
          type="number"
          placeholder="1"
          value={values.guest_id || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.guest_id ? "border-red-400" : ""}
        />
        {errors.guest_id && <p className="text-xs text-red-500">{errors.guest_id}</p>}
      </div>

      {/* Room ID */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="room_id">Room ID</Label>
        <Input
          id="room_id"
          name="room_id"
          type="number"
          placeholder="101"
          value={values.room_id || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.room_id ? "border-red-400" : ""}
        />
        {errors.room_id && <p className="text-xs text-red-500">{errors.room_id}</p>}
      </div>

      {/* Check-in & Check-out (side by side) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="check_in_date">Check-in</Label>
          <Input
            id="check_in_date"
            name="check_in_date"
            type="date"
            value={values.check_in_date ? toDateInput(String(values.check_in_date)) : ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.check_in_date ? "border-red-400" : ""}
          />
          {errors.check_in_date && <p className="text-xs text-red-500">{errors.check_in_date}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="check_out_date">Check-out</Label>
          <Input
            id="check_out_date"
            name="check_out_date"
            type="date"
            value={values.check_out_date ? toDateInput(String(values.check_out_date)) : ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.check_out_date ? "border-red-400" : ""}
          />
          {errors.check_out_date && <p className="text-xs text-red-500">{errors.check_out_date}</p>}
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status">Status</Label>
        <Select
          name="status"
          value={values.status}
          onValueChange={(val) => setFieldValue("status", val)}
        >
          <SelectTrigger className={errors.status ? "border-red-400" : ""}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="checked_in">Checked In</SelectItem>
            <SelectItem value="checked_out">Checked Out</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
      </div>

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

// ── Main Page ─────────────────────────────────────────────────────────────────
const BookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api("/api/bookings");
      setBookings(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api(`/api/bookings/${id}`, { method: "DELETE" });
      setBookings((prev) => prev.filter((b) => b.booking_id !== id));
    } catch {}
  };

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Track and manage all guest bookings</p>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
            </DialogHeader>
            <BookingForm
              initialValues={{
                guest_id: 0,
                room_id: 0,
                check_in_date: new Date(),
                check_out_date: new Date(),
                status: "booked",
              }}
              submitLabel="Create Booking"
              apiCall={(data) =>
                api("/api/bookings", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                })
              }
              onSuccess={() => { setAddOpen(false); fetchBookings(); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Booking ID</TableHead>
              <TableHead>Guest ID</TableHead>
              <TableHead>Room ID</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-red-500 py-8">{error}</TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400 py-8">No bookings found</TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.booking_id}>
                  <TableCell className="font-medium">#{booking.booking_id}</TableCell>
                  <TableCell>{booking.guest_id}</TableCell>
                  <TableCell>{booking.room_id}</TableCell>
                  <TableCell>{toDateInput(booking.check_in_date)}</TableCell>
                  <TableCell>{toDateInput(booking.check_out_date)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[booking.status]}>
                      {statusLabel[booking.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {/* Edit */}
                    <Dialog
                      open={editBooking?.booking_id === booking.booking_id}
                      onOpenChange={(o) => !o && setEditBooking(null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setEditBooking(booking)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Booking #{booking.booking_id}</DialogTitle>
                        </DialogHeader>
                        <BookingForm
                          initialValues={{
                            guest_id: booking.guest_id,
                            room_id: booking.room_id,
                            check_in_date: new Date(booking.check_in_date),
                            check_out_date: new Date(booking.check_out_date),
                            status: booking.status,
                          }}
                          submitLabel="Save Changes"
                          apiCall={(data) =>
                            api(`/api/bookings/${booking.booking_id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(data),
                            })
                          }
                          onSuccess={() => { setEditBooking(null); fetchBookings(); }}
                        />
                      </DialogContent>
                    </Dialog>

                    {/* Delete */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Booking #{booking.booking_id}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the booking record.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDelete(booking.booking_id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default BookingPage;