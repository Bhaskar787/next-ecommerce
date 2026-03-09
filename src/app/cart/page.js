"use client";

import { useCart } from "../components/CartContext";
import { useAuth } from "../components/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle,
  Package,
  TrendingUp
} from "lucide-react";

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, loading: cartLoading, cartTotal, cartItemCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState({ message: "", type: "" });

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // ✅ Calculate total safely (NO TAX)
  const totalAmount = cart.reduce((total, item) => {
    const price = Number(item?.product?.price || 0);
    const quantity = Number(item?.quantity || 0);
    return total + price * quantity;
  }, 0);

  const handleDecrease = (productId, quantity) => {
    if (quantity <= 1) return;
    updateQuantity(productId, quantity - 1);
    showToast("Quantity updated");
  };

  const handleIncrease = (productId, quantity) => {
    updateQuantity(productId, quantity + 1);
    showToast("Quantity updated");
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    showToast("Item removed from cart");
  };

  const handleCheckout = () => {
    if (!user) {
      showToast("Please login first", "error");
      return;
    }

    if (cart.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    router.push("/checkout");
  };

  // ✅ Loading State
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-blue-600"
        >
          <Loader2 size={48} />
        </motion.div>
      </div>
    );
  }

  // ✅ Empty Cart State
  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={48} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty 🛒</h1>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
          >
            Start Shopping
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-3 rounded-lg shadow-xl ${
              toast.type === "error" ? "bg-red-500" : "bg-green-500"
            } text-white`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={20} />
            ) : (
              <CheckCircle size={20} />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast({ message: "", type: "" })}
              className="ml-2 hover:opacity-75"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.back()}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="text-gray-600 hover:text-blue-600" size={24} />
            </motion.button>
            <h1 className="text-3xl font-bold text-gray-900">
              Shopping Cart <span className="text-blue-600">({cartItemCount} items)</span>
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (window.confirm("Clear all items from cart?")) {
                cart.forEach(item => removeFromCart(item.product?._id || item._id));
                showToast("Cart cleared");
              }
            }}
            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
          >
            <Trash2 size={18} /> Clear Cart
          </motion.button>
        </motion.div>

        {/* Cart Items */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {cart.map((item, index) => (
            <motion.div
              key={item.product?._id || item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-4 shadow-sm hover:shadow-md rounded-lg flex justify-between items-center transition-shadow"
            >
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={item.product?.image || "https://via.placeholder.com/150"}
                  alt={item.product?.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 ml-4">
                <h2 className="font-semibold text-lg text-gray-900">
                  {item.product?.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  Rs. {item.product?.price}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {item.product?.category || "General"}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDecrease(item.product?._id || item._id, item.quantity)}
                  disabled={item.quantity <= 1}
                  className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded transition-colors"
                >
                  <Minus size={16} />
                </motion.button>

                <motion.span
                  key={item.quantity}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="px-4 py-1 border rounded font-semibold min-w-[3rem] text-center"
                >
                  {item.quantity}
                </motion.span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleIncrease(item.product?._id || item._id, item.quantity)}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors"
                >
                  <Plus size={16} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemove(item.product?._id || item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition-colors"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Order Summary (NO TAX) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={24} />
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cartItemCount} items)</span>
              <span className="font-semibold">Rs. {totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
            <div className="border-t pt-4 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-xl text-blue-600">Rs. {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transition-colors"
            >
              <CreditCard size={20} /> Proceed to Checkout
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-lg font-medium transition-colors"
            >
              Continue Shopping →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}