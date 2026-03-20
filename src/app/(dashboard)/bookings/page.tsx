"use client";

import useForm from "@/hooks/useForm";
import api from "@/lib/api";
import {
  CreateBookingInput,
  createBookingSchema,
} from "@/modules/bookings/booking.schema";
import { Booking, Guest, Room } from "@/types";
import { useEffect, useState } from "react";
import type { DayButtonProps } from "react-day-picker";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
  BedDouble,
  CalendarCheck,
  CalendarDays,
  CalendarX,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  TableIcon,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

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

const statusDot: Record<Booking["status"], string> = {
  booked: "bg-blue-500",
  checked_in: "bg-purple-500",
  checked_out: "bg-gray-400",
  cancelled: "bg-orange-500",
};

const statusBg: Record<Booking["status"], string> = {
  booked: "bg-blue-50 border-blue-200",
  checked_in: "bg-purple-50 border-purple-200",
  checked_out: "bg-gray-50 border-gray-200",
  cancelled: "bg-orange-50 border-orange-200",
};

const statusTextColor: Record<Booking["status"], string> = {
  booked: "text-blue-700",
  checked_in: "text-purple-700",
  checked_out: "text-gray-600",
  cancelled: "text-orange-700",
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const toDateInput = (s: string) => s?.slice(0, 10) ?? "";

// ── BookingForm ───────────────────────────────────────────────────────────────
interface BookingFormProps {
  initialValues: CreateBookingInput;
  onSuccess: () => void;
  submitLabel: string;
  apiCall: (v: CreateBookingInput) => Promise<unknown>;
  guests: Guest[];
  rooms: Room[];
}

const BookingForm = ({
  initialValues,
  onSuccess,
  submitLabel,
  apiCall,
  guests,
  rooms,
}: BookingFormProps) => {
  const {
    values,
    errors,
    // CHANGED: destructure `touched` — needed for all error display guards.
    // Formik populates errors eagerly but only shows them once the field is touched.
    touched,
    formError,
    isSubmitting,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useForm<CreateBookingInput>({
    initialValues,
    schema: createBookingSchema,
    onSubmit: async (data) => {
      await apiCall(data);
      onSuccess();
    },
  });

  // Pre-compute touched+error guards to keep JSX concise.
  // CHANGED: all error display now gated on touched — before it was errors.field alone.
  const showGuestError = touched.guest_id && errors.guest_id;
  const showRoomError = touched.room_id && errors.room_id;
  const showCheckInError = touched.check_in_date && errors.check_in_date;
  const showCheckOutError = touched.check_out_date && errors.check_out_date;
  const showStatusError = touched.status && errors.status;

  const availableRooms = rooms.filter((r) => r.status === "available");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
      {formError && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {formError}
        </div>
      )}

      {/* Guest — Select uses setFieldValue, not handleChange */}
      <div className="flex flex-col gap-1.5">
        <Label>Guest</Label>
        <Select
          value={values.guest_id ? String(values.guest_id) : ""}
          onValueChange={(v) => setFieldValue("guest_id", Number(v))}
        >
          {/* CHANGED: gate border on showGuestError */}
          <SelectTrigger className={showGuestError ? "border-red-400" : ""}>
            <SelectValue placeholder="Select a guest" />
          </SelectTrigger>
          <SelectContent>
            {guests.map((g) => (
              <SelectItem key={g.guest_id} value={String(g.guest_id)}>
                {g.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* CHANGED: gate error message on showGuestError */}
        {showGuestError && (
          <p className="text-xs text-red-500">{errors.guest_id}</p>
        )}
      </div>

      {/* Room — Select uses setFieldValue */}
      <div className="flex flex-col gap-1.5">
        <Label>Room</Label>
        <Select
          value={values.room_id ? String(values.room_id) : ""}
          onValueChange={(v) => setFieldValue("room_id", Number(v))}
        >
          {/* CHANGED: gate border on showRoomError */}
          <SelectTrigger className={showRoomError ? "border-red-400" : ""}>
            <SelectValue placeholder="Select a room" />
          </SelectTrigger>
          <SelectContent>
            {availableRooms.length === 0 ? (
              <SelectItem value="none" disabled>
                No available rooms
              </SelectItem>
            ) : (
              availableRooms.map((r) => (
                <SelectItem key={r.room_id} value={String(r.room_id)}>
                  <span className="flex items-center gap-4">
                    <span>
                      Room {r.room_number} —{" "}
                      <span className="capitalize">{r.room_type}</span>
                    </span>
                    <span className="text-gray-400 text-xs">
                      ₹{r.price_per_night.toLocaleString()}/night
                    </span>
                  </span>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {/* CHANGED: gate error message on showRoomError */}
        {showRoomError && (
          <p className="text-xs text-red-500">{errors.room_id}</p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="check_in_date">Check-in</Label>
          <Input
            id="check_in_date"
            name="check_in_date"
            type="date"
            value={
              values.check_in_date
                ? toDateInput(String(values.check_in_date))
                : ""
            }
            onChange={(e) =>
              setFieldValue(
                "check_in_date",
                e.target.value ? new Date(e.target.value) : null,
              )
            }
            onBlur={handleBlur}
            // CHANGED: gate border on showCheckInError
            className={showCheckInError ? "border-red-400" : ""}
          />
          {/* CHANGED: gate error message on showCheckInError */}
          {showCheckInError && (
            <p className="text-xs text-red-500">
              {errors.check_in_date as string}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="check_out_date">Check-out</Label>
          <Input
            id="check_out_date"
            name="check_out_date"
            type="date"
            value={
              values.check_out_date
                ? toDateInput(String(values.check_out_date))
                : ""
            }
            // CHANGED: same Date conversion as check_in_date above
            onChange={(e) =>
              setFieldValue(
                "check_out_date",
                e.target.value ? new Date(e.target.value) : null,
              )
            }
            onBlur={handleBlur}
            // CHANGED: gate border on showCheckOutError
            className={showCheckOutError ? "border-red-400" : ""}
          />
          {/* CHANGED: gate error message on showCheckOutError */}
          {showCheckOutError && (
            <p className="text-xs text-red-500">
              {errors.check_out_date as string}
            </p>
          )}
        </div>
      </div>

      {/* Status — Select uses setFieldValue */}
      <div className="flex flex-col gap-1.5">
        <Label>Status</Label>
        <Select
          value={values.status}
          onValueChange={(v) => setFieldValue("status", v)}
        >
          {/* CHANGED: gate border on showStatusError */}
          <SelectTrigger className={showStatusError ? "border-red-400" : ""}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="checked_in">Checked In</SelectItem>
            <SelectItem value="checked_out">Checked Out</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        {/* CHANGED: gate error message on showStatusError */}
        {showStatusError && (
          <p className="text-xs text-red-500">{errors.status}</p>
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

interface DayDetailProps {
  date: Date;
  bookings: Booking[];
  guestMap: Record<number, string>;
  roomMap: Record<number, number>;
}

const DayDetailContent = ({
  date,
  bookings,
  guestMap,
  roomMap,
}: DayDetailProps) => {
  const label = date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-base font-semibold">{label}</DialogTitle>
      </DialogHeader>

      {bookings.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">
          No bookings on this day
        </div>
      ) : (
        <div className="flex flex-col gap-3 pt-1">
          {bookings.map((b, i) => (
            <div key={b.booking_id}>
              {i > 0 && <Separator className="mb-3" />}
              <div className={`rounded-lg border p-4 ${statusBg[b.status]}`}>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${statusTextColor[b.status]}`}
                  >
                    {statusLabel[b.status]}
                  </span>
                  <span className="text-xs text-gray-400">#{b.booking_id}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-full bg-white border flex items-center justify-center shrink-0">
                    <User className="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Guest</p>
                    <p className="text-sm font-medium text-zinc-900">
                      {guestMap[b.guest_id] ?? `Guest #${b.guest_id}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-full bg-white border flex items-center justify-center shrink-0">
                    <BedDouble className="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Room</p>
                    <p className="text-sm font-medium text-zinc-900">
                      {roomMap[b.room_id]
                        ? `Room ${roomMap[b.room_id]}`
                        : `#${b.room_id}`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 mt-3">
                  <div className="flex items-center gap-1.5">
                    <CalendarCheck className="h-3.5 w-3.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Check-in</p>
                      <p className="text-xs font-medium text-zinc-800">
                        {toDateInput(b.check_in_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarX className="h-3.5 w-3.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Check-out</p>
                      <p className="text-xs font-medium text-zinc-800">
                        {toDateInput(b.check_out_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DialogContent>
  );
};

// ── CalendarView (no form, unchanged) ────────────────────────────────────────
interface CalendarViewProps {
  bookings: Booking[];
  guestMap: Record<number, string>;
  roomMap: Record<number, number>;
}

const CalendarView = ({ bookings, guestMap, roomMap }: CalendarViewProps) => {
  const today = new Date();
  const [month, setMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const bookingsByDate: Record<string, Booking[]> = {};
  bookings.forEach((b) => {
    const checkIn = new Date(b.check_in_date);
    checkIn.setHours(0, 0, 0, 0);
    const checkOut = new Date(b.check_out_date);
    checkOut.setHours(0, 0, 0, 0);
    const cursor = new Date(checkIn);
    while (cursor <= checkOut) {
      const key = toDateStr(cursor);
      if (!bookingsByDate[key]) bookingsByDate[key] = [];
      bookingsByDate[key].push(b);
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setDialogOpen(true);
  };

  const selectedBookings = selectedDate
    ? (bookingsByDate[toDateStr(selectedDate)] ?? [])
    : [];

  const goToPrevMonth = () =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  const goToToday = () =>
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1));

  const CustomDayButton = (props: DayButtonProps) => {
    const { day, modifiers, ...buttonProps } = props;
    const date = day.date;
    const key = toDateStr(date);
    const dayBookings = bookingsByDate[key] ?? [];
    const isToday = modifiers?.today ?? false;
    const isOutside = modifiers?.outside ?? false;

    return (
      <button
        {...buttonProps}
        onClick={() => handleDayClick(date)}
        className={`
          w-full h-full ring ring-gray-100 min-h-25 flex flex-col items-start p-1.5 rounded-md text-left
          transition-colors hover:bg-gray-50 hover:cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-400
          ${isOutside ? "opacity-30" : ""}
        `}
      >
        <span
          className={`
            text-sm font-medium leading-none mb-1.5 h-7 w-7 flex items-center
            justify-center rounded-full shrink-0
            ${isToday ? "bg-teal-600 text-white" : "text-zinc-700"}
          `}
        >
          {date.getDate()}
        </span>

        {dayBookings.slice(0, 2).map((b) => (
          <div
            key={b.booking_id}
            className={`
              w-full rounded px-1 py-0.5 mb-0.5 text-xs leading-tight
              truncate font-lg border
              ${statusBg[b.status]} ${statusTextColor[b.status]}
            `}
          >
            {roomMap[b.room_id] ?? b.room_id} ·{" "}
            {(guestMap[b.guest_id] ?? "Guest").split(" ")[0]}
          </div>
        ))}

        {dayBookings.length > 2 && (
          <p className="text-[9px] text-gray-400 pl-0.5">
            +{dayBookings.length - 2} more
          </p>
        )}
      </button>
    );
  };

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b bg-white">
        <p className="font-semibold text-zinc-900 text-base">
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevMonth}
            className="h-8 w-8 p-0 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="h-8 px-3 text-xs cursor-pointer"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
            className="h-8 w-8 p-0 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Calendar
        mode="single"
        onMonthChange={setMonth}
        month={month}
        selected={selectedDate}
        onSelect={setSelectedDate}
        hideNavigation
        showOutsideDays
        className="w-full"
        classNames={{
          root: "w-full block",
          month_caption: "hidden",
          month_grid: "w-full",
          month: "w-full",
          table: "w-full border-collapse",
          row: "grid grid-cols-7",
          cell: "w-full h-full mx-10",
          day: "p-0 w-full h-full border-gray-100",
          day_button: "w-full h-full",
          weekdays: "grid grid-cols-7 bg-gray-50 border-b",
          weekday: "text-center text-xs font-medium text-gray-500 py-2",
        }}
        formatters={{
          formatWeekdayName: (date) =>
            date.toLocaleDateString("en-US", { weekday: "short" }),
        }}
        components={{
          DayButton: CustomDayButton,
        }}
      />

      <div className="flex flex-wrap items-center gap-5 px-5 py-3 bg-gray-50 border-t">
        {(Object.keys(statusDot) as Booking["status"][]).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${statusDot[s]}`} />
            <span className="text-xs text-gray-600">{statusLabel[s]}</span>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedDate && (
          <DayDetailContent
            date={selectedDate}
            bookings={selectedBookings}
            guestMap={guestMap}
            roomMap={roomMap}
          />
        )}
      </Dialog>
    </div>
  );
};

// ── BookingPage (table + calendar + dialogs) ──────────────────────────────────
const BookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [view, setView] = useState<"calendar" | "table">("calendar");

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [b, g, r] = await Promise.all([
        api("/api/bookings"),
        api("/api/guests"),
        api("/api/rooms"),
      ]);
      setBookings(b);
      setGuests(g);
      setRooms(r);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api(`/api/bookings/${id}`, { method: "DELETE" });
      setBookings((prev) => prev.filter((b) => b.booking_id !== id));
      toast.success("Booking deleted");
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  const guestMap = Object.fromEntries(
    guests.map((g) => [g.guest_id, g.full_name]),
  );
  const roomMap = Object.fromEntries(
    rooms.map((r) => [r.room_id, r.room_number]),
  );

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center border rounded-lg p-0.5 bg-gray-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("calendar")}
            className={`h-8 px-3 cursor-pointer rounded-md ${
              view === "calendar"
                ? "bg-white shadow-sm font-semibold"
                : "text-gray-400"
            }`}
          >
            <CalendarDays className="h-4 w-4 mr-1.5" /> Calendar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("table")}
            className={`h-8 px-3 cursor-pointer rounded-md ${
              view === "table"
                ? "bg-white shadow-sm font-semibold"
                : "text-gray-400"
            }`}
          >
            <TableIcon className="h-4 w-4 mr-1.5" /> Table
          </Button>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer">
              <Plus className="mr-2 h-4 w-4" /> New Booking
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
              guests={guests}
              rooms={rooms}
              apiCall={(data) =>
                api("/api/bookings", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                })
              }
              onSuccess={() => {
                toast.success("Booking added successfully");
                setAddOpen(false);
                fetchAll();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar view */}
      {view === "calendar" && loading && (
        <div className="rounded-lg border p-4 space-y-3">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-md" />
            ))}
          </div>
        </div>
      )}
      {view === "calendar" && !loading && (
        <CalendarView
          bookings={bookings}
          guestMap={guestMap}
          roomMap={roomMap}
        />
      )}

      {/* Table view */}
      {view === "table" && (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Booking ID</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
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
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-red-500 py-8"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-400 py-8"
                  >
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.booking_id}>
                    <TableCell className="font-medium">
                      {booking.booking_id}
                    </TableCell>
                    <TableCell>
                      {guestMap[booking.guest_id] ??
                        `Guest ${booking.guest_id}`}
                    </TableCell>
                    <TableCell>
                      {roomMap[booking.room_id]
                        ? `Room ${roomMap[booking.room_id]}`
                        : `${booking.room_id}`}
                    </TableCell>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditBooking(booking)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Edit Booking #{booking.booking_id}
                            </DialogTitle>
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
                            guests={guests}
                            rooms={rooms}
                            apiCall={(data) =>
                              api(`/api/bookings/${booking.booking_id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(data),
                              })
                            }
                            onSuccess={() => {
                              toast.success("Booking updated successfully");
                              setEditBooking(null);
                              fetchAll();
                            }}
                          />
                        </DialogContent>
                      </Dialog>

                      {/* Delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Booking {booking.booking_id}?
                            </AlertDialogTitle>
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
      )}
    </div>
  );
};

export default BookingPage;
