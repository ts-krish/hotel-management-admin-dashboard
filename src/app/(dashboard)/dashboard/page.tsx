"use client";

import api from "@/lib/api";
import { Booking, Guest, Room } from "@/types";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BedDouble, BedSingle, CalendarCheck, Users, ArrowRight } from "lucide-react";
  
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading: boolean;
}

const StatCard = ({ title, value, icon, loading }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-md font-medium text-gray-500">{title}</CardTitle>
      <div className="h-8 w-8 rounded-md flex items-center justify-center text-teal-600">
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
        <p className="text-3xl font-bold text-zinc-900">{value}</p>
      )}
    </CardContent>
  </Card>
);

interface NavCardProps {
  title: string;
  subtitle: string;
  href: string;
}

const NavCard = ({ title, subtitle, href }: NavCardProps) => (
  <Link href={href}>
    <Card className="hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="font-semibold text-zinc-900 text-sm">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
          <ArrowRight className="h-4 w-4 text-teal-600" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

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
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const activeBookings = bookings.filter(
    (b) => b.status === "booked" || b.status === "checked_in",
  ).length;

  const recentBookings = [...bookings]
    .sort((a, b) => b.booking_id - a.booking_id)
    .slice(0, 5);

  // Lookup maps for resolving names in the table
  const guestMap = Object.fromEntries(guests.map((g) => [g.guest_id, g.full_name]));
  const roomMap = Object.fromEntries(rooms.map((r) => [r.room_id, r.room_number]));

  return (
    <div className="space-y-6 p-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Rooms"
          value={rooms.length}
          icon={<BedDouble size={40} color="#bfb8ff" />}
          loading={loading}
        />
        <StatCard
          title="Available Rooms"
          value={availableRooms}
          icon={<BedSingle size={40} color="#99F092" />}
          loading={loading}
        />
        <StatCard
          title="Active Bookings"
          value={activeBookings}
          icon={<CalendarCheck size={40} color="#dc8add" />}
          loading={loading}
        />
        <StatCard
          title="Total Guests"
          value={guests.length}
          icon={<Users size={40} color="#f9f06b" />}
          loading={loading}
        />
      </div>

      {/* Nav Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NavCard
          title="Manage Rooms"
          subtitle="View and edit rooms details"
          href="/rooms"
        />
        <NavCard
          title="View Guests"
          subtitle="Guest information and history"
          href="/guests"
        />
        <NavCard
          title="Manage Bookings"
          subtitle="Create and update bookings"
          href="/bookings"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>GUEST</TableHead>
                <TableHead>ROOM</TableHead>
                <TableHead>CHECK-IN</TableHead>
                <TableHead>CHECK-OUT</TableHead>
                <TableHead>STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : recentBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                    No bookings yet
                  </TableCell>
                </TableRow>
              ) : (
                recentBookings.map((b) => (
                  <TableRow key={b.booking_id}>
                    <TableCell className="font-medium">
                      {guestMap[b.guest_id] ?? `Guest #${b.guest_id}`}
                    </TableCell>
                    <TableCell>
                      {roomMap[b.room_id] ? `Room ${roomMap[b.room_id]}` : `Room #${b.room_id}`}
                    </TableCell>
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