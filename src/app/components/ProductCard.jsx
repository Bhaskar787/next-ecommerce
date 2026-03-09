"use client";

import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Eye, AlertCircle, CheckCircle } from "lucide-react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  // Show toast notification
  const showToast = (msg, successType) => {
    setMessage(String(msg));
    setType(successType);
    setTimeout(() => {
      setMessage("");
      setType("");
    }, 2500);
  };

  const handleAdd = async () => {
    if (!user) {
      showToast("Please login to add product", "error");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    if (!product?._id) {
      showToast("Invalid product", "error");
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        quantity: 1,
        product: {
          _id: product._id,
          name: product.name || product.title,
          price: product.price,
          image: product.image || product.images?.[0],
        }
      });
      showToast("Product added to cart!", "success");
    } catch (error) {
      showToast("Failed to add to cart", "error");
      console.error("Add to cart error:", error);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleView = (e) => {
    e.stopPropagation();
    if (product?._id) {
      router.push(`/products/${product._id}`);
    }
  };

  const productName = product?.name || product?.title || "Product";
  const productPrice = Number(product?.price || 0);
  const productOriginalPrice = Number(product?.originalPrice || product?.price || 0);
  const productCategory = product?.category?.name || product?.category || "General";
  const productDescription = product?.description || "High quality product";
  const productImage = product?.image || product?.images?.[0] || "https://via.placeholder.com/400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- Image Section --- */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        <motion.img
          src={productImage}
          alt={productName}
          className={`h-full w-full object-cover object-center transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />

        {/* Quick Action Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
            >
              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleView}
                  className="bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors"
                  title="Quick View"
                >
                  <Eye size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAdd}
                  className="bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-green-600 hover:text-white transition-colors"
                  title="Add to Cart"
                >
                  <ShoppingCart size={20} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <Heart 
            size={20} 
            className={isLiked ? "fill-red-500 text-red-500" : "text-gray-600"} 
          />
        </motion.button>

        {/* Sale Badge */}
        {product.discount && Number(product.discount) > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{String(product.discount)}%
          </div>
        )}
      </div>

      {/* --- Content Section --- */}
      <div className="p-5 flex flex-col flex-grow">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-2"
        >
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            {productCategory}
          </span>
        </motion.div>
        
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors"
        >
          {productName}
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-500 mb-4 line-clamp-2"
        >
          {productDescription}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-auto flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              Rs.{productPrice.toFixed(2)}
            </span>
            {productOriginalPrice > productPrice && (
              <span className="text-sm text-gray-400 line-through">
                Rs.{productOriginalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-blue-500/20 transition-all"
          >
            Add to Cart
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}