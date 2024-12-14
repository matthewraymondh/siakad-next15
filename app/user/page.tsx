import type { Metadata } from "next";
import UserTable from "../components/user-table";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "User List",
  description: "List of all users in the system",
};

const UserPage = () => {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        {/* Toast notifications */}
        <Toaster richColors />

        {/* Navbar at the top */}
        <Navbar />

        <div className="flex flex-1 relative">
          {/* Sidebar */}
          <div className="w-64 fixed top-17 left-0 h-full bg-congress-blue-200 shadow-lg z-40">
            <Sidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 ml-64 pt-17 p-6 overflow-y-auto">
            {/* Main content like MataKuliahForm goes here */}
            <div className="bg-slate-50 min-h-screen">
              <div className="max-w-screen-md mx-auto py-10">
                <h1 className="text-2xl font-bold">User List</h1>
                <UserTable />
              </div>
            </div>
          </div>
        </div>

        {/* Footer - placed on top of Sidebar */}
        <Footer />
      </div>
    </SessionProvider>
  );
};

export default UserPage;
