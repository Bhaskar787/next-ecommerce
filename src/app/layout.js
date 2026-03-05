"use client";
import "./globals.css";
import Navbar from "./components/Navbar";
import { CartProvider } from "./components/CartContext";
import { AuthProvider } from "./components/AuthContext";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideNavbar = pathname.startsWith("/admin"); // Hide navbar on admin pages

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {!hideNavbar && <Navbar />} {/* only show for non-admin pages */}
            <div className="bg-gray-100 min-h-screen p-6">{children}</div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}