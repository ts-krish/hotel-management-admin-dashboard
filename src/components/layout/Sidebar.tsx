"use client";

import {
  BedDouble,
  Building2,
  CalendarCheck,
  LayoutDashboard,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/rooms", label: "Rooms", icon: BedDouble },
  { href: "/guests", label: "Guests", icon: Users },
  { href: "/bookings", label: "Bookings", icon: CalendarCheck },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between w-60 h-screen bg-slate-950 text-white">
      <div>
        {/* Logo */}
        <div className="flex gap-2 px-4 pt-5 items-center text-lg font-bold mb-4">
          <Building2 size={32} color="#2ec27e" />
          <p>Hotel Admin</p>
        </div>

        <Separator className="bg-slate-800 mb-6" />

        {/* Nav items */}
        <div className="flex flex-col px-4 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-slate-800 text-[#2ec27e] font-medium"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-2 text-start">
        <Separator className="bg-slate-800" />
        <p className="py-2 text-gray-600 text-sm">© 2025 Hotel Management</p>
      </div>
    </div>
  );
};

export default Sidebar;