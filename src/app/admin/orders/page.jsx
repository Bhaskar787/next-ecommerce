// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get("/api/orders"); // ✅ Your API returns array directly
//       setOrders(Array.isArray(res.data) ? res.data : []);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // ✅ Calculate total quantity
//   const getTotalItems = (items) => {
//     if (!items) return 0;
//     return items.reduce((sum, item) => sum + item.quantity, 0);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Orders</h1>

//       {loading ? (
//         <p>Loading orders...</p>
//       ) : orders.length === 0 ? (
//         <p>No orders found</p>
//       ) : (
//         <div className="overflow-x-auto bg-white shadow rounded-lg">
//           <table className="min-w-full">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 text-left">User</th>
//                 <th className="p-3 text-left">Email</th>
//                 <th className="p-3 text-left">Items</th>
//                 <th className="p-3 text-left">Total</th>
//                 <th className="p-3 text-left">Payment</th>
//                 <th className="p-3 text-left">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order._id} className="border-t hover:bg-gray-50">
//                   <td className="p-3">{order.userId?.name || "N/A"}</td>
//                   <td className="p-3">{order.userId?.email || "N/A"}</td>
//                   <td className="p-3">{getTotalItems(order.items)}</td>
//                   <td className="p-3 font-semibold text-green-600">
//                     Rs. {order.total}
//                   </td>
//                   <td className="p-3">
//                     <span
//                       className={`px-2 py-1 rounded text-white text-sm ${
//                         order.paymentStatus === "paid"
//                           ? "bg-green-500"
//                           : "bg-yellow-500"
//                       }`}
//                     >
//                       {order.paymentStatus}
//                     </span>
//                   </td>
//                   <td className="p-3">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import axios from "axios";


export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return;

    try {
      await axios.delete(`/api/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  if (loading) return <p className="p-8">Loading orders...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Paid Orders</h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Total</th>
              <th className="p-3">Transaction</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-gray-500">
                  No paid orders found
                </td>
              </tr>
            )}

            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="p-3">{order.userId?.name || "N/A"}</td>

                <td className="p-3 text-green-600 font-semibold">
                  Rs. {order.total}
                </td>

                <td className="p-3 text-sm text-gray-600">
                  {order.transactionId || "N/A"}
                </td>

                <td className="p-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 space-x-2">
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => handleDelete(order._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}