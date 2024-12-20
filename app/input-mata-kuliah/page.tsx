import { Toaster } from "sonner";
import Footer from "../components/Footer";
import MataKuliahForm from "../components/MataKuliahForm";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { SessionProvider } from "next-auth/react";

const Layout = () => {
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
            <MataKuliahForm />
          </div>
        </div>

        {/* Footer - placed on top of Sidebar */}
        <Footer />
      </div>
    </SessionProvider>
  );
};

export default Layout;
