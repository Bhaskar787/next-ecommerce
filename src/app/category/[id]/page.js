"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/app/components/ProductCard";

export default function CategoryPage() {
  const { id } = useParams(); // category ID from URL
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState(""); // store category name
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?category=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data || []);
        if (data && data.length > 0 && data[0].category) {
          setCategoryName(data[0].category.name);
        } else {
          setCategoryName("Category");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading products...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {categoryName} Products
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products available in this category.</p>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}