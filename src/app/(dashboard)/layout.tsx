// app/(dashboard)/layout.tsx
import { Navbar, Sidebar } from "@/components/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar/>

        {/* Page content */}
        <main className="p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
