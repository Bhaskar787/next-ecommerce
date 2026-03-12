import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { NextResponse } from "next/server";

/* =========================================
   ✅ GET ALL ORDERS (Paid)
   GET /api/orders
========================================= */
export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find({ paymentStatus: "paid" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

/* =========================================
   ✅ CREATE PENDING ORDER
   POST /api/orders
========================================= */
export async function POST(req) {
  try {
    await connectDB();

    const { userId, items, total } = await req.json();

    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { message: "Invalid order data" },
        { status: 400 }
      );
    }

    const order = await Order.create({
      userId,
      items,
      total,
      paymentStatus: "pending",
    });

    return NextResponse.json({
      success: true,
      message: "Pending order created",
      orderId: order._id,
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
