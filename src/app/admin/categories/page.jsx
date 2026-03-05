"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    const res = await axios.get("/api/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add or Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    if (editingId) {
      await axios.put(`/api/categories/${editingId}`, { name });
      setEditingId(null);
    } else {
      await axios.post("/api/categories", { name });
    }

    setName("");
    fetchCategories();
  };

  // Delete category
  const handleDelete = async (id) => {
    await axios.delete(`/api/categories/${id}`);
    fetchCategories();
  };

  // Edit category
  const handleEdit = (category) => {
    setName(category.name);
    setEditingId(category._id);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Categories</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-6 flex gap-4"
      >
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b">
                <td className="p-2">{cat.name}</td>
                <td className="p-2 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center p-4 text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}