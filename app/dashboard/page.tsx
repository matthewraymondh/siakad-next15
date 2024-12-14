import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Mahasiswa from "../components/Mahasiswa";
import Footer from "../components/Footer";

const Dashboard = () => {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        {/* Toast notifications */}
        <Toaster richColors />

        {/* Navbar at the top */}
        <Navbar />

        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-64 fixed top-17 left-0 h-full bg-congress-blue-200 shadow-lg z-50">
            <Sidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 ml-64 pt-16 p-6 overflow-y-auto">
            {/* Main content like Mahasiswa goes here */}
            <Mahasiswa />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </SessionProvider>
  );
};

export default Dashboard;
