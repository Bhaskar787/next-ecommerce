"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  X 
} from "lucide-react";

const CartContext = createContext();

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl ${
            type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {type === "error" ? (
            <AlertCircle size={20} />
          ) : (
            <CheckCircle size={20} />
          )}
          <span className="font-medium">{String(message)}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="ml-2 hover:opacity-75"
          >
            <X size={16} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Check if current route is admin route
const isAdminRoute = (pathname) => {
  return pathname?.startsWith("/admin");
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });

  // Show toast notification (only on non-admin routes)
  const showToast = (message, type = "success") => {
    // Don't show toasts on admin pages
    if (isAdminRoute(pathname)) {
      return;
    }
    
    setToast({ 
      message: String(message || ""), 
      type 
    });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // Load cart on mount and when user changes
  useEffect(() => {
    const loadCart = async () => {
      const userId = user?._id;
      if (!userId) {
        setCart([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/cart/${userId}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Cart loaded:", data);

        // ✅ Ensure cart is always an array
        if (data.success && Array.isArray(data.cart)) {
          setCart(data.cart);
          showToast(`Cart loaded with ${data.cart.length} items`);
        } else if (Array.isArray(data.cart)) {
          setCart(data.cart);
          showToast(`Cart loaded with ${data.cart.length} items`);
        } else {
          setCart([]);
          showToast("Cart is empty", "success");
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        setCart([]);
        showToast("Failed to load cart", "error");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // ✅ FIXED: Add to cart - accepts both productId (string) and object
  const addToCart = async (input) => {
    const userId = user?._id;
    
    if (!userId) {
      showToast("Please login to add product", "error");
      return;
    }

    // ✅ Handle both formats: productId (string) or object
    let productId;
    let quantity = 1;

    if (typeof input === 'string') {
      productId = input;
    } else if (typeof input === 'object' && input !== null) {
      productId = input.productId;
      quantity = input.quantity || 1;
    } else {
      showToast("Invalid product", "error");
      return;
    }

    if (!productId) {
      showToast("Invalid product", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId, 
          productId, 
          quantity 
        }),
      });

      const data = await res.json();
      console.log("Cart API Response:", data);

      if (data.success) {
        setCart(data.cart);
        showToast("Product added to cart!");
      } else {
        showToast(String(data.message || "Failed to add to cart"), "error");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Server error - please try again", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update quantity with animation
  const updateQuantity = async (productId, quantity) => {
    const userId = user?._id;
    if (!userId) return;

    if (!productId) {
      showToast("Invalid product", "error");
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/cart/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      console.log("Update cart response:", data);
      
      if (data.success) {
        setCart(data.cart);
        showToast("Cart updated!");
      } else {
        showToast(String(data.message || "Failed to update cart"), "error");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      showToast("Failed to update cart", "error");
    } finally {
      setLoading(false);
    }
  };

  // Remove from cart with animation
  const removeFromCart = async (productId) => {
    const userId = user?._id;
    if (!userId) return;

    if (!productId) {
      showToast("Invalid product", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/cart/${userId}?productId=${productId}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      console.log("Remove cart response:", data);
      
      if (data.success) {
        setCart(data.cart);
        showToast("Item removed from cart");
      } else {
        showToast(String(data.message || "Failed to remove item"), "error");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      showToast("Failed to remove item", "error");
    } finally {
      setLoading(false);
    }
  };

  // Clear cart with animation
  const clearCart = async () => {
    const userId = user?._id;
    if (!userId) return;

    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/cart/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCart([]);
        showToast("Cart cleared successfully");
      } else {
        showToast("Failed to clear cart", "error");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      showToast("Failed to clear cart", "error");
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart totals safely
  const cartTotal = cart.reduce((total, item) => {
    const price = Number(item?.product?.price || item?.price || 0);
    const quantity = Number(item?.quantity || 0);
    return total + (price * quantity);
  }, 0);

  const cartItemCount = cart.reduce((count, item) => {
    return count + (Number(item?.quantity || 0));
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartTotal,
        cartItemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: "", type: "" })} 
      />
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};