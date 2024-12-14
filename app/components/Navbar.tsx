"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const { data: session } = useSession(); // Get session data using NextAuth
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  return (
    <div className="bg-congress-blue-800 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand/Logo */}
        <div className="flex items-center space-x-3">
          <Image
            src="/Logo-Web-Udinus-Putih.png"
            alt="Logo"
            width={200}
            height={32}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-3">
          <ul className="hidden md:flex items-center gap-4 mr-5 font-semibold">
            {/* <li>
              <Link
                href="/"
                className="text-white hover:text-congress-blue-100"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-white hover:text-congress-blue-100"
              >
                About
              </Link>
            </li> */}
            {session?.user.role === "admin" ? (
              <li>
                <Link
                  href="/user"
                  className="text-white hover:text-congress-blue-100"
                >
                  Users
                </Link>
              </li>
            ) : null}
          </ul>

          {/* User Avatar and Dropdown */}
          <div className="flex gap-3 items-center relative">
            {/* User info */}
            <div className="flex flex-col justify-center -space-y-1">
              <span className="text-congress-blue-50 font-semibold text-right">
                {session?.user?.name || "Guest"}
              </span>
              <span className="font-xs text-gray-50 text-right capitalize">
                {session?.user?.role || "guest"}
              </span>
            </div>

            {/* User Avatar */}
            <button
              type="button"
              className="ring-2 bg-gray-100 rounded-full p-1 hover:ring-4 hover:ring-blue-400 transition duration-200"
              aria-label="User Avatar"
              onClick={toggleDropdown} // Toggle dropdown on click
            >
              <Image
                src={session?.user?.image || "/avatar.svg"}
                alt={session?.user?.name || "User Avatar"}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-40 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                <ul className="py-2">
                  <li>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition duration-200"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-400 hover:text-white rounded-lg transition duration-200"
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} aria-label="Toggle Mobile Menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-congress-blue-700 text-white py-4">
          <div className="container mx-auto px-6">
            <Link
              href="/"
              className="block py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <span className="block py-2 font-semibold">
              Welcome, {session?.user?.name || "Guest"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
