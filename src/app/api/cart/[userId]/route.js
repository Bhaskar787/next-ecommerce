import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

/* =========================================
   ✅ GET CART BY USER ID
   GET /api/cart/:userId
========================================= */
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { userId } = await params;

    const user = await User.findById(userId)
      .populate("cart.product");

    if (!user) {
      return NextResponse.json(
        { message: "User not found", cart: [] },
        { status: 404 }
      );
    }

    // Ensure `cart` is always an array to avoid runtime `find`/`filter` errors
    if (!Array.isArray(user.cart)) user.cart = [];

    return NextResponse.json({
      success: true,
      cart: user.cart,
    });

  } catch (error) {
    console.error("GET CART ERROR:", error);
    return NextResponse.json(
      { message: "Server error", cart: [] },
      { status: 500 }
    );
  }
}


/* =========================================
   ✅ UPDATE QUANTITY
   PUT /api/cart/:userId
========================================= */
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { userId } = await params;
    const { productId, quantity } = await req.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { message: "Product ID and quantity required" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { message: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (!Array.isArray(user.cart)) user.cart = [];

    const item = user.cart.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return NextResponse.json(
        { message: "Product not found in cart" },
        { status: 404 }
      );
    }

    item.quantity = quantity;
    await user.save();

    const updatedUser = await User.findById(userId)
      .populate("cart.product");

    return NextResponse.json({
      success: true,
      message: "Cart updated",
      cart: updatedUser.cart,
    });

  } catch (error) {
    console.error("UPDATE CART ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}


/* =========================================
   ✅ DELETE ITEM
   DELETE /api/cart/:userId?productId=xxx
========================================= */
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { userId } = await params;
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (!Array.isArray(user.cart)) user.cart = [];

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate("cart.product");

    return NextResponse.json({
      success: true,
      message: "Item removed",
      cart: updatedUser.cart,
    });

  } catch (error) {
    console.error("DELETE CART ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}