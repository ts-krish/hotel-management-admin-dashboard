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
        <div className="flex gap-2 px-4 pt-5 items-center text-lg font-bold mb-4">
          <Building2 size={32} color="#2ec27e" />
          <p>Hotel Admin</p>
        </div>
        <hr className="border-slate-800 mb-6" />

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
      <div className="text-gray-700 text-sm px-2 text-start ">
        <hr className="border-slate-800" />
        <p className="py-2">© 2025 Hotel Management</p>
      </div>
    </div>
  );
};

export default Sidebar;
