// import { connectDB } from "@/lib/db";
// import Order from "@/models/Order";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// /* =========================================
//    ✅ GET ALL ORDERS (Admin)
//    GET /api/orders
// ========================================= */
// export async function GET() {
//   try {
//     await connectDB();

//     const orders = await Order.find()
//       .populate("userId") // get user details
//       .sort({ createdAt: -1 });

//     return NextResponse.json(orders);
//   } catch (error) {
//     console.error("GET ORDERS ERROR:", error);
//     return NextResponse.json(
//       { message: "Server error" },
//       { status: 500 }
//     );
//   }
// }

// /* =========================================
//    ✅ CREATE ORDER
//    POST /api/orders
// ========================================= */
// export async function POST(req) {
//   try {
//     await connectDB();

//     const { userId } = await req.json();

//     const user = await User.findById(userId).populate("cart.product");

//     if (!user || user.cart.length === 0) {
//       return NextResponse.json(
//         { message: "Cart is empty" },
//         { status: 400 }
//       );
//     }

//     const items = user.cart.map((item) => ({
//       productId: item.product._id,
//       title: item.product.title,
//       price: item.product.price,
//       quantity: item.quantity,
//     }));

//     const total = items.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );

//     await Order.create({
//       userId,
//       items,
//       total,
//       paymentStatus: "pending",
//     });

//     // 🔥 Clear cart
//     user.cart = [];
//     await user.save();

//     return NextResponse.json({
//       success: true,
//       message: "Order placed successfully",
//     });

//   } catch (error) {
//     console.error("ORDER ERROR:", error);
//     return NextResponse.json(
//       { message: "Server error" },
//       { status: 500 }
//     );
//   }
// }

import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

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