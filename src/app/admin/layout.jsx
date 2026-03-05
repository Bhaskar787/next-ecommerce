// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function Layout({ children }) {
//   const router = useRouter();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     document.cookie = "token=; Max-Age=0; path=/";
//     router.push("/adminlogin");
//   };

//   return (
//     <section className="bg-gray-100 min-h-screen">
//       {/* Centered Container */}
//       <div className="max-w-7xl mx-auto flex min-h-screen">
//         {/* Sidebar */}
//         <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
//           <div className="p-6 text-2xl font-bold border-b">
//             Admin Panel
//           </div>

//           <nav className="flex-1 p-4 space-y-2">
//             <Link
//               href="/admin/categories"
//               className="block px-4 py-2 rounded hover:bg-gray-200 transition"
//             >
//               Categories
//             </Link>

//             <Link
//               href="/admin/products"
//               className="block px-4 py-2 rounded hover:bg-gray-200 transition"
//             >
//               Products
//             </Link>

//             <Link
//               href="/admin/users"
//               className="block px-4 py-2 rounded hover:bg-gray-200 transition"
//             >
//               Users
//             </Link>

//             <Link
//               href="/admin/orders"
//               className="block px-4 py-2 rounded hover:bg-gray-200 transition"
//             >
//               Orders
//             </Link>
//           </nav>
//         </aside>

//         {/* Main Section */}
//         <div className="flex-1 flex flex-col">
//           {/* Top Navbar */}
//           <header className="flex justify-between items-center bg-white shadow px-6 py-4">
//             <h1 className="text-xl font-semibold">Admin Dashboard</h1>
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
//             >
//               Logout
//             </button>
//           </header>

//           {/* Page Content */}
//           <main className="flex-1 p-6">
//             {/* Centered content */}
//             <div className="mx-auto w-full">
//               {children}
//             </div>
//           </main>
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    // Remove admin data
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");

    // Remove cookie used by middleware
    document.cookie = "token=; Max-Age=0; path=/";

    // Redirect to login
    router.push("/adminlogin");
  };

  return (
    <section className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto flex min-h-screen">

        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
          
          <div className="p-6 text-2xl font-bold border-b">
            Admin Panel
          </div>

          <nav className="flex-1 p-4 space-y-2">

            <Link
              href="/admin/categories"
              className="block px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              Categories
            </Link>

            <Link
              href="/admin/products"
              className="block px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              Products
            </Link>

            <Link
              href="/admin/users"
              className="block px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              Users
            </Link>

            <Link
              href="/admin/orders"
              className="block px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              Orders
            </Link>

          </nav>
        </aside>

        {/* Main Section */}
        <div className="flex-1 flex flex-col">

          {/* Top Navbar */}
          <header className="flex justify-between items-center bg-white shadow px-6 py-4">
            
            <h1 className="text-xl font-semibold">
              Admin Dashboard
            </h1>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>

          </header>

          {/* Page Content */}
          <main className="flex-1 p-6">
            <div className="mx-auto w-full">
              {children}
            </div>
          </main>

        </div>
      </div>
    </section>
  );
}