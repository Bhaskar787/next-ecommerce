"use client";
import "./globals.css";
import Navbar from "./components/Navbar";
import { CartProvider } from "./components/CartContext";
import { AuthProvider } from "./components/AuthContext";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // ✅ Hide navbar on admin pages
  const hideNavbar = pathname?.startsWith("/admin") || pathname === "/admin";

  return (
    <html lang="en">
      <body className="m-0 p-0">
        <AuthProvider>
          <CartProvider>
            {/* ✅ Navbar - Only show for non-admin pages */}
            {!hideNavbar && <Navbar />}
            
            {/* ✅ Main Content Wrapper */}
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}