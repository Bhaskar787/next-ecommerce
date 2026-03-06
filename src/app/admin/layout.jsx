"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Layout({ children }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/adminlogin");
  };

  return (
    <section className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto flex min-h-screen">

        {/* MOBILE SIDEBAR */}
        {menuOpen && (
          <div className="fixed inset-0 bg-gray-100 bg-opacity-40 z-40 md:hidden">
            <aside className="w-64 bg-white h-full shadow-md p-4">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Admin Panel</h2>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-xl"
                >
                  ✕
                </button>
              </div>

              <nav className="space-y-3">
                <Link href="/admin/categories" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded hover:bg-gray-200">
                  Categories
                </Link>

                <Link href="/admin/products" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded hover:bg-gray-200">
                  Products
                </Link>

                <Link href="/admin/users" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded hover:bg-gray-200">
                  Users
                </Link>

                <Link href="/admin/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded hover:bg-gray-200">
                  Orders
                </Link>
              </nav>
            </aside>
          </div>
        )}

        {/* DESKTOP SIDEBAR */}
        <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
          <div className="p-6 text-2xl font-bold border-b">
            Admin Panel
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link href="/admin/categories" className="block px-4 py-2 rounded hover:bg-gray-200">
              Categories
            </Link>

            <Link href="/admin/products" className="block px-4 py-2 rounded hover:bg-gray-200">
              Products
            </Link>

            <Link href="/admin/users" className="block px-4 py-2 rounded hover:bg-gray-200">
              Users
            </Link>

            <Link href="/admin/orders" className="block px-4 py-2 rounded hover:bg-gray-200">
              Orders
            </Link>
          </nav>
        </aside>

        {/* MAIN SECTION */}
        <div className="flex-1 flex flex-col">

          {/* TOP NAVBAR */}
          <header className="flex justify-between items-center bg-white shadow px-4 md:px-6 py-4">

            <div className="flex items-center gap-3">

              {/* HAMBURGER BUTTON (MOBILE) */}
              <button
                onClick={() => setMenuOpen(true)}
                className="text-2xl md:hidden"
              >
                ☰
              </button>

              <h1 className="text-lg md:text-xl font-semibold">
                Admin Dashboard
              </h1>

            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 md:px-4 py-2 rounded hover:bg-red-600 text-sm md:text-base"
            >
              Logout
            </button>

          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto w-full">
              {children}
            </div>
          </main>

        </div>
      </div>
    </section>
  );
}