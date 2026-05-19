"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("login", checkAuth);

    return () => window.removeEventListener("login", checkAuth);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">

        {/* Logo */}
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
          DentalAI
        </h1>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm font-medium">

          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>

          <Link href="/about" className="hover:text-blue-600 transition">
            About
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="hover:text-blue-600 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow hover:scale-105 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/profile"
                className="hover:text-blue-600 transition"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-full border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;