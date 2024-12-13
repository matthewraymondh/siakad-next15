import Navbar from "./components/Navbar"; // Adjust path as needed
import Sidebar from "./components/Sidebar"; // Adjust path as needed
import Mahasiswa from "./components/Mahasiswa"; // Your main content component
import Footer from "./components/Footer";
import { Toaster } from "sonner";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Toast notifications */}
      <Toaster richColors />

      {/* Navbar at the top */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 p-6">
          {/* Main content like Mahasiswa goes here */}
          <Mahasiswa />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
