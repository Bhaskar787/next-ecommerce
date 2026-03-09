"use client";

import { useCart } from "../components/CartContext";
import { useAuth } from "../components/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  CreditCard, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Package,
  Truck,
  Shield,
  Lock
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
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function CheckoutPage() {
  const { cart, loading: cartLoading } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // ✅ Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // ✅ Safe total calculation (NO TAX)
  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = Number(item?.product?.price || 0);
      const quantity = Number(item?.quantity || 0);
      return total + price * quantity;
    }, 0);
  }, [cart]);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleEsewaPayment = async () => {
    if (!user) return alert("Login required");
    if (totalAmount <= 0) return alert("Cart is empty");

    try {
      setLoading(true);

      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.paymentUrl;

      Object.entries(data.params).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  // ✅ Loading State
  if (authLoading || cartLoading) {
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
  if (!cart || cart.length === 0) {
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
      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3"
          >
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
            <button
              onClick={() => setError(null)}
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
          className="flex items-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="text-gray-600 hover:text-blue-600" size={24} />
          </motion.button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <span className="text-sm font-medium">Cart</span>
              </div>
              <div className="w-16 h-0.5 bg-blue-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <span className="text-sm font-medium">Payment</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <span className="text-sm font-medium">Complete</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8"
        >
          {/* 🛒 Order Summary */}
          <motion.div variants={fadeIn} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="text-blue-600" size={24} />
                Order Summary
              </h2>

              <div className="space-y-4">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.product?._id || item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={item.product?.image || "https://via.placeholder.com/150"}
                        alt={item.product?.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.product?.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-blue-600 mt-1">
                        Rs. {(item.product?.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <hr className="my-6 border-gray-200" />

              {/* Price Breakdown (NO TAX) */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItemCount} items)</span>
                  <span className="font-semibold">Rs. {totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600">Rs. {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="text-blue-600" size={24} />
                Shipping Information
              </h2>
              <div className="space-y-3 text-gray-600">
                <p><span className="font-semibold">Name:</span> {user?.name}</p>
                <p><span className="font-semibold">Email:</span> {user?.email}</p>
                <p><span className="font-semibold">Address:</span> Kathmandu, Nepal</p>
              </div>
            </div>
          </motion.div>

          {/* 💳 Payment Section */}
          <motion.div variants={fadeIn} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="text-blue-600" size={24} />
                Payment Method
              </h2>

              {/* Payment Options */}
              <div className="space-y-4 mb-6">
                <div className="border-2 border-blue-600 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <CreditCard className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">eSewa</h3>
                      <p className="text-sm text-gray-600">Secure payment gateway</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield size={18} className="text-green-600" />
                  <span className="text-sm">Secure</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Lock size={18} className="text-green-600" />
                  <span className="text-sm">Encrypted</span>
                </div>
              </div>

              {/* Payment Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEsewaPayment}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={24} />
                    Pay Rs. {totalAmount.toFixed(2)}
                  </>
                )}
              </motion.button>

              {/* Trust Badges */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-2">
                  By completing this purchase, you agree to our
                </p>
                <div className="flex justify-center gap-4 text-sm text-blue-600">
                  <a href="#" className="hover:underline">Terms</a>
                  <span>•</span>
                  <a href="#" className="hover:underline">Privacy</a>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-3">
                Contact our support team for any questions
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <span>📞</span>
                <span>+977-1-4444444</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}