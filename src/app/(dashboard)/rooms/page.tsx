"use client";

import useForm from "@/hooks/useForm";
import api from "@/lib/api";
import { CreateRoomInput, createRoomSchema } from "@/modules/rooms/room.schema";
import { Room } from "@/types";
import { useEffect, useState } from "react";

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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

const statusVariant: Record<
  Room["status"],
  "default" | "destructive" | "secondary" | "outline"
> = {
  available: "default",
  booked: "destructive",
  maintenance: "secondary",
};

interface RoomFormProps {
  initialValues: CreateRoomInput;
  onSuccess: () => void;
  submitLabel: string;
  apiCall: (values: CreateRoomInput) => Promise<unknown>;
}

const RoomForm = ({
  initialValues,
  onSuccess,
  submitLabel,
  apiCall,
}: RoomFormProps) => {
  const {
    values,
    errors,
    formError,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useForm<CreateRoomInput>({
    initialValues,
    schema: createRoomSchema,
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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="room_number">Room Number</Label>
        <Input
          id="room_number"
          name="room_number"
          type="number"
          placeholder="101"
          value={values.room_number || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.room_number ? "border-red-400" : ""}
        />
        {errors.room_number && (
          <p className="text-xs text-red-500">{errors.room_number}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="room_type">Room Type</Label>
        <Select
          name="room_type"
          value={values.room_type}
          onValueChange={(val) => setFieldValue("room_type", val)}
        >
          <SelectTrigger className={errors.room_type ? "border-red-400" : ""}>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="double">Double</SelectItem>
            <SelectItem value="deluxe">Deluxe</SelectItem>
          </SelectContent>
        </Select>
        {errors.room_type && (
          <p className="text-xs text-red-500">{errors.room_type}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="price_per_night">Price / Night ($)</Label>
        <Input
          id="price_per_night"
          name="price_per_night"
          type="number"
          placeholder="2500"
          value={values.price_per_night || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.price_per_night ? "border-red-400" : ""}
        />
        {errors.price_per_night && (
          <p className="text-xs text-red-500">{errors.price_per_night}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status">Status</Label>
        <Select
          name="status"
          value={values.status ?? "available"}
          onValueChange={(val) => setFieldValue("status", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
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

const RoomPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await api("/api/rooms");
      setRooms(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api(`/api/rooms/${id}`, { method: "DELETE" });
      setRooms((prev) => prev.filter((r) => r.room_id !== id));
    } catch {}
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Manage hotel rooms, pricing, and availability
        </p>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <RoomForm
              initialValues={{
                room_number: 0,
                room_type: "single",
                price_per_night: 0,
                status: "available",
              }}
              submitLabel="Add Room"
              apiCall={(data) =>
                api("/api/rooms", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                })
              }
              onSuccess={() => {
                setAddOpen(false);
                fetchRooms();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>ROOM NUMBER</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>PRICE/NIGHT</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>ACTIONS</TableHead>
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
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-red-500 py-8"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : rooms.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-400 py-8"
                >
                  No rooms found
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow key={room.room_id}>
                  <TableCell className="font-medium">
                    {room.room_number}
                  </TableCell>
                  <TableCell className="capitalize">{room.room_type}</TableCell>
                  <TableCell>
                    ${room.price_per_night.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusVariant[room.status]}
                      className="capitalize"
                    >
                      {room.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog
                      open={editRoom?.room_id === room.room_id}
                      onOpenChange={(o) => !o && setEditRoom(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditRoom(room)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Edit Room #{room.room_number}
                          </DialogTitle>
                        </DialogHeader>
                        <RoomForm
                          initialValues={{
                            room_number: room.room_number,
                            room_type: room.room_type,
                            price_per_night: room.price_per_night,
                            status: room.status,
                          }}
                          submitLabel="Save Changes"
                          apiCall={(data) =>
                            api(`/api/rooms/${room.room_id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(data),
                            })
                          }
                          onSuccess={() => {
                            setEditRoom(null);
                            fetchRooms();
                          }}
                        />
                      </DialogContent>
                    </Dialog>

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
                            Delete Room #{room.room_number}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The room will be
                            permanently removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDelete(room.room_id)}
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

export default RoomPage;
