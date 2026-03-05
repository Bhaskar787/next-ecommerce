"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logoutUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LEFT - LOGO */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 tracking-wide"
        >
          MyShop
        </Link>

        {/* CENTER - NAV LINKS */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="hover:text-blue-600 transition"
            >
              Categories ▾
            </button>

            {open && (
              <div className="absolute left-0 mt-3 w-48 bg-white border rounded-lg shadow-lg py-2">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/category/${cat._id}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    No categories
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            href="/cart"
            className="hover:text-blue-600 transition"
          >
            🛒 Cart ({cart.length})
          </Link>

          {/* ✅ Checkout (Only if logged in & cart not empty) */}
          {user && cart.length > 0 && (
            <Link
              href="/checkout"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-sm transition"
            >
              Checkout
            </Link>
          )}
        </div>

        {/* RIGHT - USER SECTION */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-sm font-semibold">
                  👤 {user.name}
                </span>
              </div>

              <button
                onClick={logoutUser}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}