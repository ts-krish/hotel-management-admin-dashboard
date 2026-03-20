"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logout successfully.");
      router.push("/login");
    } catch {
      toast.error("Failed to Logout");
    }
  };

  const getTitle = () => {
    if (pathname.includes("rooms")) return "Room Management";
    if (pathname.includes("bookings")) return "Booking Management";
    if (pathname.includes("guests")) return "Guest Management";
    return "Dashboard";
  };

  return (
    <nav className="w-full border-b border-gray-200 px-6 py-3 bg-white">
      <div className="flex justify-between items-center w-full">
        <p className="font-semibold text-xl text-zinc-900">{getTitle()}</p>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors outline-none cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-emerald-100 text-white text-xs font-semibold">
                <User color="#2ec27e" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-zinc-700">admin@gmail.com</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogOut}
              className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
