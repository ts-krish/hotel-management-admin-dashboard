"use client";

import { CircleUserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = ({ title, email }: { title: string; email: string }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {}
  };

  return (
    <nav className="w-full border border-b-gray-300 p-4 bg-white">
      <div className="flex justify-between items-center w-full">
        <p className="font-semibold text-2xl">{title}</p>

        <div
          className="relative px-3 flex items-center gap-2 cursor-pointer hover:bg-emerald-100"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open && (
            <div className="absolute cursor-pointer right-0 top-12 z-50 w-50 rounded-lg shadow-lg bg-white border border-gray-200 p-2 flex flex-col gap-2">
              <button
                type="button"
                className="text-left cursor-pointer px-3 py-2 hover:bg-gray-100 rounded"
              >
                Profile
              </button>
              <hr className="text-gray-200" />
              <button
                onClick={handleLogOut}
                type="button"
                className="text-left px-3 cursor-pointer py-2 hover:bg-red-100 text-red-600 rounded"
              >
                Logout
              </button>
            </div>
          )}

          <CircleUserRound size={36} color="#2ec27e" />
          <p className="text-sm">{email}</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
