"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { 
  Menu, 
  X, 
  ShoppingBag, 
  User, 
  LogOut, 
  ChevronDown, 
  Search 
} from "lucide-react";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logoutUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Handle scroll effect for navbar shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories with proper error handling
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        
        console.log("Categories API Response:", data);
        
        // ✅ Ensure categories is always an array
        const validCategories = Array.isArray(data) ? data : [];
        setCategories(validCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Animation Variants
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.1 } }
  };

  return (
    <>
      {/* --- 1. Animated Navbar Container --- */}
      <motion.nav 
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100" : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ rotate: 180 }}
                className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-blue-500/50 transition-shadow"
              >
                M
              </motion.div>
              <span className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                MyShop
              </span>
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 font-medium hover:text-blue-600 transition-colors relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>

              {/* Categories Dropdown - FIXED */}
              <div className="relative">
                <button
                  onClick={() => setCatOpen(!catOpen)}
                  className="flex items-center gap-1 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  Categories <ChevronDown size={16} className={`transition-transform ${catOpen ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {catOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute left-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50"
                    >
                      {loading ? (
                        <div className="px-4 py-2 text-sm text-gray-400">Loading...</div>
                      ) : categories.length > 0 ? (
                        categories.map((cat) => (
                          <Link
                            key={cat._id || cat.id}
                            href={`/category/${cat._id || cat.id}`}
                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                            onClick={() => setCatOpen(false)}
                          >
                            {/* ✅ Render cat.name, not cat object */}
                            {String(cat.name || cat.title || "Uncategorized")}
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-400">
                          No categories available
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/cart" className="relative group">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <ShoppingBag className="text-gray-700 group-hover:text-blue-600 transition-colors" size={24} />
                </motion.div>
                {cart.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm"
                  >
                    {cart.length}
                  </motion.span>
                )}
              </Link>

              {user && cart.length > 0 && (
                <Link href="/checkout">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md shadow-green-500/20 transition-all"
                  >
                    Checkout
                  </motion.button>
                </Link>
              )}
            </div>

            {/* USER SECTION - DESKTOP */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer"
                  >
                    <User size={16} className="text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      {String(user.name || user.username || "User")}
                    </span>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={logoutUser}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                  >
                    <LogOut size={20} />
                  </motion.button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
                  <Link href="/register">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md shadow-blue-500/20 transition-all"
                    >
                      Register
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* HAMBURGER BUTTON - MOBILE */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(!open)}
                className="text-gray-700 focus:outline-none"
              >
                {open ? <X size={28} /> : <Menu size={28} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* --- 2. Animated Mobile Menu --- */}
        <AnimatePresence>
          {open && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden bg-white border-t border-gray-100 shadow-xl"
            >
              <ul className="flex flex-col p-4 gap-2">
                <li>
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                  >
                    <span className="text-xl">🏠</span> Home
                  </Link>
                </li>

                {/* Mobile Categories Dropdown - FIXED */}
                <li>
                  <button
                    onClick={() => setCatOpen(!catOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">📂</span> Categories
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${catOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {catOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4 mt-1"
                      >
                        <div className="flex flex-col gap-1 py-2">
                          {loading ? (
                            <div className="px-4 py-2 text-sm text-gray-400">Loading...</div>
                          ) : categories.length > 0 ? (
                            categories.map((cat) => (
                              <Link
                                key={cat._id || cat.id}
                                href={`/category/${cat._id || cat.id}`}
                                onClick={() => { setOpen(false); setCatOpen(false); }}
                                className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                              >
                                {/* ✅ Render cat.name, not cat object */}
                                {String(cat.name || cat.title || "Uncategorized")}
                              </Link>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-400">
                              No categories available
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>

                <li>
                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                  >
                    <span className="text-xl">🛒</span> Cart ({cart.length})
                  </Link>
                </li>

                {user && cart.length > 0 && (
                  <li>
                    <Link
                      href="/checkout"
                      onClick={() => setOpen(false)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-semibold text-center transition-colors"
                    >
                      Checkout Now
                    </Link>
                  </li>
                )}

                {/* USER SECTION - MOBILE */}
                <li className="border-t border-gray-100 pt-2 mt-2">
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-lg mb-2">
                        <User size={18} className="text-gray-600" />
                        <span className="text-sm font-semibold text-gray-700">
                          {String(user.name || user.username || "User")}
                        </span>
                      </div>
                      <button
                        onClick={() => { logoutUser(); setOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="text-center py-3 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setOpen(false)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-semibold text-center transition-colors"
                      >
                        Signup
                      </Link>
                    </div>
                  )}
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}