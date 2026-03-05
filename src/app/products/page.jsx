"use client";
import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Our Products
        </h1>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:scale-105 transition transform duration-300"
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-4 flex flex-col justify-between h-40">
                <div>
                  <h2 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                    {p.title}
                  </h2>
                  <p className="text-gray-600 font-bold text-md">RS. {p.price}</p>
                </div>
                <button
                  className="mt-3 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                  onClick={() => addToCart(p)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {products.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No products available.
          </p>
        )}
      </div>
    </div>
  );
}