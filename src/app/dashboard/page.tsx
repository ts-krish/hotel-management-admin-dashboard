import { Sidebar, Navbar } from "@/components/layout";
const page = () => {
  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className="w-full">
          <Navbar title="Dashboard" email="admin@gmail.com" />
        </div>
      </div>
    </main>
  );
};

export default page;
