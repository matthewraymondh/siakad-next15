"use client";

import Image from "next/image";

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
            width={400} // Specify width
            height={32} // Specify height
            layout="intrinsic"
          />
        </div>

        {/* Placeholder for future content */}
        <div className="flex items-center space-x-6">
          <span className="text-congress-blue-50 font-semibold">
            Welcome, Guest
          </span>
        </div>
      </div>
    </div>
  );
}
