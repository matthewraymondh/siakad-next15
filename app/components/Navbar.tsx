"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="bg-congress-blue-800 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand/Logo */}
        <div className="flex items-center space-x-3">
          {/* Image */}
          <Image
            src="/Logo-Web-Udinus-Putih.png" // Replace with the path to your image
            alt="Logo"
            // className="h-8 w-8"
            width={400} // Specify width
            height={32} // Specify height
            layout="intrinsic"
          />
          {/* Text */}
          {/* <h1 className="text-xl font-bold text-congress-blue-50">SiAkad</h1> */}
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          {/* Uncomment or add more links as needed */}
          {/* <Link
            href="/input-mahasiswa"
            className="text-congress-blue-50 hover:text-congress-blue-200 font-semibold"
          >
            Input Mahasiswa
          </Link>
          <Link
            href="/input-mata-kuliah"
            className="text-congress-blue-50 hover:text-congress-blue-200 font-semibold"
          >
            Input Mata Kuliah
          </Link> */}
          <Link
            href="/logout"
            className="text-congress-blue-50 hover:text-red-300 font-semibold"
          >
            Logout
          </Link>
        </nav>
      </div>
    </div>
  );
}
