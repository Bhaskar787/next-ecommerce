"use client";
import { useCart } from "./CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-lg">
      <img src={product.image} className="h-48 w-full object-cover rounded" />
      <h2 className="font-bold mt-2">{product.name}</h2>
      <p className="text-gray-600">RS. {product.price}</p>

      <button
  onClick={() => addToCart(product._id)}
  className="bg-blue-500 text-white px-4 py-2 rounded"
>
  Add to Cart
</button>
    </div>
  );
}




