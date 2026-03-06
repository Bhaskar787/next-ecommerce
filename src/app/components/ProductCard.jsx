"use client";

import { useCart } from "./CartContext";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); // success or error

  const handleAdd = () => {
    // If user not logged in
    if (!user) {
      setMessage("Please login to add product");
      setType("error");

      setTimeout(() => {
        router.push("/login");
      }, 1500);

      return;
    }

    // If user logged in
    addToCart(product._id);
    setMessage("Product added to cart");
    setType("success");

    setTimeout(() => {
      setMessage("");
      setType("");
    }, 2000);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-lg relative">

      {message && (
        <div
          className={`absolute top-2 left-1/2 -translate-x-1/2 text-white px-3 py-1 rounded text-sm
          ${type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >
          {message}
        </div>
      )}

      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover rounded"
      />

      <h2 className="font-bold mt-2">{product.name}</h2>

      <p className="text-gray-600">RS. {product.price}</p>

      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
}