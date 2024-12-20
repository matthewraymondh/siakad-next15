"use client"; // Mark the component as a client-side component (necessary for using hooks like useState and usePathname)

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaUserGraduate, FaBook } from "react-icons/fa"; // Icons
import { usePathname } from "next/navigation"; // Import usePathname from next/navigation

const Sidebar = () => {
  const pathname = usePathname(); // Get the current route from next/navigation
  const [active, setActive] = useState("");

  // Update the active state based on the current route
  useEffect(() => {
    if (pathname === "/dashboard") {
      setActive("input-mahasiswa");
    } else if (pathname === "/input-mata-kuliah") {
      setActive("input-mata-kuliah");
    } else if (pathname === "/logout") {
      setActive("logout");
    }
  }, [pathname]); // Re-run the effect whenever the pathname changes

  return (
    <div className="w-64 bg-congress-blue-200 shadow-lg rounded-md p-4 space-y-6 sticky top-0 h-screen">
      {/* College Logo and Name */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-10 h-10  rounded-full"></div>{" "}
        {/* Placeholder for logo */}
        <div className="text-xl font-bold text-gray-800">SiAkad</div>
      </div>

      {/* Sidebar Menu */}
      <Link href="/dashboard">
        <div
          className={`flex items-center space-x-4 p-4 text-lg transition-all duration-300 rounded-md ${
            active === "input-mahasiswa"
              ? "bg-congress-blue-600 text-white"
              : "hover:bg-congress-blue-100 text-gray-800"
          }`}
        >
          <FaUserGraduate className="text-xl" />
          <span>Input Mahasiswa</span>
        </div>
      </Link>
      <Link href="/input-mata-kuliah">
        <div
          className={`flex items-center space-x-4 p-4 text-lg transition-all duration-300 rounded-md ${
            active === "input-mata-kuliah"
              ? "bg-congress-blue-600 text-white"
              : "hover:bg-congress-blue-100 text-gray-800"
          }`}
        >
          <FaBook className="text-xl" />
          <span>Input Mata Kuliah</span>
        </div>
      </Link>

      {/* <Link href="/logout">
        <div
          className={`flex items-center space-x-4 p-4 text-lg transition-all duration-300 rounded-md ${
            active === "logout"
              ? "bg-teal-600 text-white"
              : "hover:bg-teal-100 text-gray-800"
          }`}
        >
          <FaSignOutAlt className="text-xl" />
          <span>Logout</span>
        </div>
      </Link> */}
    </div>
  );
};

export default Sidebar;
