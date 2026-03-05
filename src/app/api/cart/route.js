import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

/* =========================================
   ✅ GET CART
   GET /api/cart?userId=xxxxx
========================================= */
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required", cart: [] },
        { status: 400 }
      );
    }

    const user = await User.findById(userId)
      .populate("cart.product");

    if (!user) {
      return NextResponse.json(
        { message: "User not found", cart: [] },
        { status: 404 }
      );
    }

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
   ✅ ADD TO CART
   POST /api/cart
   body: { userId, productId }
========================================= */
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("ADD TO CART BODY:", body);
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { message: "User ID and Product ID are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      console.warn("ADD TO CART: user not found for id:", userId);
      return NextResponse.json(
        { message: "User not found", userId },
        { status: 404 }
      );
    }

    // Ensure `cart` is always an array to avoid runtime `find` errors
    if (!Array.isArray(user.cart)) user.cart = [];

    // ✅ Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // ✅ Check if product already in cart
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({
        product: productId,
        quantity: 1,
      });
    }

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate("cart.product");

    console.log("SAVED USER ID:", userId, "CART:", updatedUser.cart);

    return NextResponse.json({
      success: true,
      message: "Product added to cart",
      cart: updatedUser.cart,
    });

  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}
