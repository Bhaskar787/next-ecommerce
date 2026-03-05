// import { connectDB } from "@/lib/db";
// import Order from "@/models/Order";
// import { NextResponse } from "next/server";

// // 🔹 GET - Fetch order by ID
// export async function GET(req, context) {
//   try {
//     await connectDB();

//     const { id } = await context.params; // ✅ must await

//     const order = await Order.findById(id)
//       .populate("userId", "name email");

//     if (!order) {
//       return NextResponse.json(
//         { message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(order, { status: 200 });

//   } catch (error) {
//     return NextResponse.json(
//       { message: "Error fetching order", error: error.message },
//       { status: 500 }
//     );
//   }
// }


// // 🔹 DELETE - Delete order by ID
// export async function DELETE(req, context) {
//   try {
//     await connectDB();

//     const { id } = await context.params; // ✅ must await

//     const deletedOrder = await Order.findByIdAndDelete(id);

//     if (!deletedOrder) {
//       return NextResponse.json(
//         { message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Order deleted successfully" },
//       { status: 200 }
//     );

//   } catch (error) {
//     return NextResponse.json(
//       { message: "Error deleting order", error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // 🔹 PUT - Update payment status
// export async function PUT(req, context) {
//   try {
//     await connectDB();

//     const { id } = await context.params;
//     const body = await req.json();

//     const updatedOrder = await Order.findByIdAndUpdate(
//       id,
//       { paymentStatus: body.paymentStatus },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return NextResponse.json({ message: "Order not found" }, { status: 404 });
//     }

//     return NextResponse.json(updatedOrder);

//   } catch (error) {
//     return NextResponse.json(
//       { message: "Error updating order", error: error.message },
//       { status: 500 }
//     );
//   }
// }

import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

import { NextResponse } from "next/server";

// GET SINGLE ORDER
export async function GET(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const order = await Order.findById(id)
      .populate("userId", "name email");

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching order" },
      { status: 500 }
    );
  }
}

// DELETE ORDER
export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    await Order.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting order" },
      { status: 500 }
    );
  }
}