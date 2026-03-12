"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  CheckCircle,
  ArrowLeft,
  ChevronRight,
  Minus,
  Plus,
  X,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
} from "lucide-react";
import ProductCard from "@/app/components/ProductCard";
import { useCart } from "@/app/components/CartContext";
import { useAuth } from "@/app/components/AuthContext";

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

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    if (!id) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    console.log("=== Fetching Product ===");
    console.log("Product ID:", id);

    fetch(`/api/products/${id}`)
      .then((res) => {
        console.log("API Response Status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("API Response Data:", data);
        
        if (data && data.product) {
          console.log("Product found:", data.product);
          setProduct(data.product);
          setCategory(data.product.category || null);
          setActiveImage(0);
        } else if (data && data.error) {
          console.log("Error from API:", data.error);
          setError(data.error);
        } else {
          console.log("Unexpected response:", data);
          setError("Product not found in response");
        }
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setError("Failed to load product. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (category?._id && product?._id) {
      fetch(`/api/products?category=${category._id}&limit=4`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setRelatedProducts(data.filter((p) => p._id !== product._id));
          }
        })
        .catch((err) => console.error("Error fetching related products:", err));
    }
  }, [category, product]);

  // Fetch reviews
  useEffect(() => {
    if (id) {
      fetch(`/api/reviews?productId=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setReviews(data);
          }
        })
        .catch((err) => console.error("Error fetching reviews:", err));
    }
  }, [id]);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + change, 10)));
  };

  // ✅ FIXED: Add to Cart using CartContext
  const handleAddToCart = async () => {
    if (!user) {
      showToast("Please login to add product", "error");
      setTimeout(() => router.push("/login"), 1500);
      return;
    }

    if (!product?._id) {
      showToast("Invalid product", "error");
      return;
    }

    if (product.stock === 0) {
      showToast("Product is out of stock", "error");
      return;
    }

    setIsAdding(true);
    try {
      await addToCart({
        productId: product._id,
        quantity: quantity,
        product: {
          _id: product._id,
          name: product.name || product.title,
          price: product.price,
          image: product.image || product.images?.[0],
        }
      });
      
      showToast("Product added to cart!", "success");
    } catch (error) {
      console.error("Add to cart error:", error);
      showToast("Failed to add to cart", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = async () => {
    setIsWishlist(!isWishlist);
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const SkeletonProduct = () => (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="bg-gray-200 h-96 rounded-xl animate-pulse" />
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-20 w-20 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-gray-200 h-8 w-3/4 rounded animate-pulse" />
        <div className="bg-gray-200 h-6 w-1/2 rounded animate-pulse" />
        <div className="bg-gray-200 h-4 w-full rounded animate-pulse" />
        <div className="bg-gray-200 h-4 w-2/3 rounded animate-pulse" />
        <div className="bg-gray-200 h-12 w-1/3 rounded animate-pulse" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonProduct />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <X size={48} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-medium shadow-lg z-50 ${
              toast.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={18} />
            ) : (
              <CheckCircle size={18} />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={() => router.push("/")} className="hover:text-blue-600">Home</button>
            <ChevronRight size={16} />
            {category && (
              <>
                <button onClick={() => router.push(`/category/${category._id}`)} className="hover:text-blue-600">
                  {category.name}
                </button>
                <ChevronRight size={16} />
              </>
            )}
            <span className="text-gray-900 font-medium truncate">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {/* Product Images */}
          <motion.div variants={fadeIn} className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={product.images?.[activeImage] || product.image || "https://via.placeholder.com/600"}
                alt={product.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index ? "border-blue-600" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={img} alt={`Product image ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div variants={fadeIn} className="space-y-6">
            {category && (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {category.name}
                </span>
                <button
                  onClick={() => router.push(`/category/${category._id}`)}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  View Category <ChevronRight size={14} />
                </button>
              </div>
            )}

            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${i < Math.floor(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {averageRating} ({reviews.length} reviews)
                </span>
                <button
                  onClick={() => setShowReviews(!showReviews)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {reviews.length} reviews
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-blue-600">Rs. {product.price?.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  Rs. {product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
              <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  <Plus size={18} />
                </button>
              </div>
              <span className="text-sm text-gray-500">Max: {product.stock}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <ShoppingCart size={24} />
              )}
              {isAdding ? "Adding..." : "Add to Cart"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className={`p-4 rounded-xl border-2 transition-all ${
                isWishlist
                  ? "border-red-500 bg-red-50 text-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Heart size={24} className={isWishlist ? "fill-red-500" : ""} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowShareModal(!showShareModal)}
              className="p-4 rounded-xl border-2 border-gray-300 hover:border-gray-400"
            >
              <Share2 size={24} />
            </motion.button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Truck size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Free Shipping</p>
                <p className="text-sm font-medium text-gray-900">On orders over Rs. 1000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Secure Payment</p>
                <p className="text-sm font-medium text-gray-900">100% Protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Quality Guarantee</p>
                <p className="text-sm font-medium text-gray-900">30 Days Return</p>
              </div>
            </div>
          </div>

          {/* Share Modal */}
          <AnimatePresence>
            {showShareModal && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setShowShareModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Share Product</h3>
                    <button
                      onClick={() => setShowShareModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Share2 size={20} className="text-blue-600" />
                      <span>Copy Link</span>
                    </button>
                    <button
                      onClick={() => {
                        window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank');
                      }}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-green-600">💬</span>
                      <span>Share on WhatsApp</span>
                    </button>
                    <button
                      onClick={() => {
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank');
                      }}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-blue-400">🐦</span>
                      <span>Share on Twitter</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Reviews Section */}
      <AnimatePresence>
        {showReviews && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare size={24} className="text-blue-600" />
                Customer Reviews ({reviews.length})
              </h2>

              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-blue-600">
                            {review.user?.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{review.user?.name}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={`${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                              <ThumbsUp size={16} />
                              Helpful ({review.helpful || 0})
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Related Products</h2>
            <button
              onClick={() => router.push(`/category/${category?._id}`)}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </motion.div>
      )}
    </div>

    {/* Footer CTA */}
        <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-900 text-white py-12 mt-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-400">
                We are dedicated to providing the best products and exceptional customer service.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/products" className="hover:text-white transition-colors">Products</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Mail size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Phone size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 All In One Store. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
  </div>
);
}