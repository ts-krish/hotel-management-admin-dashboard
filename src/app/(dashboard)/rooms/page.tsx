"use client";

import { Button } from "@/components/ui";
import { useEffect, useState } from "react";
import { Room } from "@/types";

const RoomPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getRooms = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/rooms", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data: Room[] = await response.json();
        setRooms(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    getRooms();
  }, []);

  if (loading) return <p>Loading rooms...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  if (rooms.length === 0) return <p>No rooms found</p>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Manage hotel rooms, pricing, and availability
        </p>
        <Button>+ Add room</Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className= "text-left">
            <tr>
              <th className="p-3">ROOM NUMBER</th>
              <th className="p-3">TYPE</th>
              <th className="p-3">PRICE/NIGHT</th>
              <th className="p-3">STATUS</th>
              <th className="p-3">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room.room_id} className="border-t">
                <td className="p-3">{room.room_number}</td>
                <td className="p-3 capitalize">{room.room_type}</td>
                <td className="p-3">₹{room.price_per_night}</td>
                <td className="p-3 capitalize">{room.status}</td>
                <td className="p-3">
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomPage;