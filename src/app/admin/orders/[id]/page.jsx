"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/api/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error("Failed to fetch order", error);
    }
  };

  if (!order) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">

        <p><strong>User:</strong> {order.userId?.name}</p>
        <p><strong>Email:</strong> {order.userId?.email}</p>
        <p><strong>Total:</strong> Rs. {order.total}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="text-green-600 font-semibold">
            {order.paymentStatus}
          </span>
        </p>
        <p>
          <strong>Transaction ID:</strong>{" "}
          {order.transactionId || "N/A"}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>

        <h2 className="text-lg font-semibold mt-6">Items:</h2>

        {order.items.map((item, index) => (
          <div key={index} className="border p-3 rounded mb-2">
            <p><strong>{item.title}</strong></p>
            <p>Qty: {item.quantity}</p>
            <p>Price: Rs. {item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}