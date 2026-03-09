"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  User,
  Mail,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/api/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      setError("Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Order Details</h1>
          <p className="text-slate-500 text-sm">Order #{id}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{order.paymentStatus}</span>
        </div>
      </motion.div>

      {/* Order Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
        >
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Customer Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">{order.userId?.name || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">{order.userId?.email || "N/A"}</span>
            </div>
          </div>
        </motion.div>

        {/* Order Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
        >
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Total Amount</span>
              <span className="text-green-600 font-bold">Rs. {order.total}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <LinkIcon className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">
                {order.transactionId || "N/A"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Order Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
      >
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-600" />
          Order Items
        </h2>
        <div className="space-y-3">
          {order.items?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-500">Rs. {item.price} each</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">Qty: {item.quantity}</p>
                <p className="text-sm text-slate-600">
                  Rs. {item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}