"use client";

import { useEffect, useState } from "react";
import { Guest } from "@/types";
import { createGuestSchema, CreateGuestInput } from "@/modules/guests/guest.schema";
import useForm from "@/hooks/useForm";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

// ── Guest Form ────────────────────────────────────────────────────────────────
interface GuestFormProps {
  initialValues: CreateGuestInput;
  onSuccess: () => void;
  submitLabel: string;
  apiCall: (values: CreateGuestInput) => Promise<unknown>;
}

const GuestForm = ({ initialValues, onSuccess, submitLabel, apiCall }: GuestFormProps) => {
  const { values, errors, formError, isSubmitting, handleChange, handleBlur, handleSubmit } =
    useForm<CreateGuestInput>({
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
          className={errors.full_name ? "border-red-400" : ""}
        />
        {errors.full_name && <p className="text-xs text-red-500">{errors.full_name}</p>}
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
          className={errors.email ? "border-red-400" : ""}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          name="phone_number"
          placeholder="+91 98765 43210"
          value={values.phone_number ?? ""}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.phone_number ? "border-red-400" : ""}
        />
        {errors.phone_number && <p className="text-xs text-red-500">{errors.phone_number}</p>}
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
const GuestPage = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editGuest, setEditGuest] = useState<Guest | null>(null);

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

  const handleDelete = async (id: number) => {
    try {
      await api(`/api/guests/${id}`, { method: "DELETE" });
      setGuests((prev) => prev.filter((g) => g.guest_id !== id));
    } catch {}
  };

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Manage hotel guests and their contact information</p>
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
              onSuccess={() => { setAddOpen(false); fetchGuests(); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-red-500 py-8">{error}</TableCell>
              </TableRow>
            ) : guests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-400 py-8">No guests found</TableCell>
              </TableRow>
            ) : (
              guests.map((guest) => (
                <TableRow key={guest.guest_id}>
                  <TableCell className="font-medium">{guest.full_name}</TableCell>
                  <TableCell>{guest.email}</TableCell>
                  <TableCell>{guest.phone_number || "—"}</TableCell>
                  <TableCell className="flex gap-2">
                    {/* Edit */}
                    <Dialog
                      open={editGuest?.guest_id === guest.guest_id}
                      onOpenChange={(o) => !o && setEditGuest(null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setEditGuest(guest)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Guest</DialogTitle>
                        </DialogHeader>
                        <GuestForm
                          initialValues={{
                            full_name: guest.full_name,
                            email: guest.email,
                            phone_number: guest.phone_number,
                          }}
                          submitLabel="Save Changes"
                          apiCall={(data) =>
                            api(`/api/guests/${guest.guest_id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(data),
                            })
                          }
                          onSuccess={() => { setEditGuest(null); fetchGuests(); }}
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
                          <AlertDialogTitle>Delete {guest.full_name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove the guest and cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDelete(guest.guest_id)}
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

export default GuestPage;