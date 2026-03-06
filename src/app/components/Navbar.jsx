"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logoutUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false); // mobile menu toggle
  const [catOpen, setCatOpen] = useState(false); // categories dropdown toggle

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 tracking-wide"
        >
          MyShop
        </Link>

        {/* HAMBURGER BUTTON - MOBILE */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="text-2xl focus:outline-none"
          >
            {open ? "✖" : "☰"}
          </button>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="hover:text-blue-600 transition"
            >
              Categories ▾
            </button>
            {catOpen && (
              <div className="absolute left-0 mt-3 w-48 bg-white border rounded-lg shadow-lg py-2">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/category/${cat._id}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setCatOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400">No categories</div>
                )}
              </div>
            )}
          </div>

          <Link href="/cart" className="hover:text-blue-600 transition">
            🛒 Cart ({cart.length})
          </Link>

          {user && cart.length > 0 && (
            <Link
              href="/checkout"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-sm transition"
            >
              Checkout
            </Link>
          )}
        </div>

        {/* USER SECTION - DESKTOP */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-sm font-semibold">👤 {user.name}</span>
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
              <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm">Register</Link>
            </>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-md">
          <ul className="flex flex-col p-4 gap-3 text-gray-700 font-medium">

            <li>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="hover:text-blue-600 transition"
              >
                Home
              </Link>
            </li>

            {/* Mobile Categories Dropdown */}
            <li>
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="w-full text-left hover:text-blue-600 transition"
              >
                Categories ▾
              </button>
              {catOpen && (
                <div className="pl-4 mt-2 flex flex-col gap-1">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/category/${cat._id}`}
                        onClick={() => { setOpen(false); setCatOpen(false); }}
                        className="block px-2 py-1 hover:bg-gray-100 rounded"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <div className="px-2 py-1 text-sm text-gray-400">No categories</div>
                  )}
                </div>
              )}
            </li>

            <li>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="hover:text-blue-600 transition"
              >
                🛒 Cart ({cart.length})
              </Link>
            </li>

            {user && cart.length > 0 && (
              <li>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-sm transition"
                >
                  Checkout
                </Link>
              </li>
            )}

            {/* USER SECTION - MOBILE */}
            <li className="border-t pt-2 mt-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full mb-2">
                    👤 {user.name}
                  </div>
                  <button
                    onClick={() => { logoutUser(); setOpen(false); }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="hover:text-blue-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}