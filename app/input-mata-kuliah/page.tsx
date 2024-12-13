import { Toaster } from "sonner";
import Footer from "../components/Footer";
import MataKuliahForm from "../components/MataKuliahForm";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

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
          <MataKuliahForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
