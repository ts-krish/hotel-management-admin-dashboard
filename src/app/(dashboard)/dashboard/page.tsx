"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Room } from "@/types";
import { Booking } from "@/types";
import { Guest } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BedDouble, Users, CalendarCheck, BedSingle } from "lucide-react";

// ── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  loading: boolean;
}

const StatCard = ({ title, value, sub, icon, loading }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      <div className="h-8 w-8 rounded-md bg-teal-50 flex items-center justify-center text-teal-600">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      {loading ? (
        <>
          <Skeleton className="h-7 w-16 mb-1" />
          <Skeleton className="h-3 w-24" />
        </>
      ) : (
        <>
          <p className="text-2xl font-bold text-zinc-900">{value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
        </>
      )}
    </CardContent>
  </Card>
);

// ── Status badge helpers ──────────────────────────────────────────────────────
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

// ── Main Page ─────────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [r, g, b] = await Promise.all([
          api("/api/rooms"),
          api("/api/guests"),
          api("/api/bookings"),
        ]);
        setRooms(r);
        setGuests(g);
        setBookings(b);
      } catch {}
      finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const activeBookings = bookings.filter(
    (b) => b.status === "booked" || b.status === "checked_in"
  ).length;
  const recentBookings = [...bookings]
    .sort((a, b) => b.booking_id - a.booking_id)
    .slice(0, 5);

  return (
    <div className="space-y-6 p-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Rooms"
          value={rooms.length}
          sub="Across all types"
          icon={<BedDouble size={18} />}
          loading={loading}
        />
        <StatCard
          title="Available Rooms"
          value={availableRooms}
          sub={`${rooms.length - availableRooms} occupied or under maintenance`}
          icon={<BedSingle size={18} />}
          loading={loading}
        />
        <StatCard
          title="Total Guests"
          value={guests.length}
          sub="Registered guests"
          icon={<Users size={18} />}
          loading={loading}
        />
        <StatCard
          title="Active Bookings"
          value={activeBookings}
          sub="Booked or checked in"
          icon={<CalendarCheck size={18} />}
          loading={loading}
        />
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Booking ID</TableHead>
                <TableHead>Guest ID</TableHead>
                <TableHead>Room ID</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : recentBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                    No bookings yet
                  </TableCell>
                </TableRow>
              ) : (
                recentBookings.map((b) => (
                  <TableRow key={b.booking_id}>
                    <TableCell className="font-medium">#{b.booking_id}</TableCell>
                    <TableCell>{b.guest_id}</TableCell>
                    <TableCell>{b.room_id}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;