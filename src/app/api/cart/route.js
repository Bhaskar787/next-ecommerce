import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

/* =========================================
   ✅ GET CART - Support both formats
   GET /api/cart/:userId  OR  GET /api/cart?userId=xxxxx
========================================= */
export async function GET(req, { params }) {
  try {
    await connectDB();

    // ✅ Support both query params and route params
    const { searchParams } = new URL(req.url);
    const userIdFromQuery = searchParams.get("userId");
    const userIdFromParams = params?.userId;
    
    const userId = userIdFromParams || userIdFromQuery;

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

    // Ensure cart is always an array
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
   ✅ ADD TO CART
   POST /api/cart
   body: { userId, productId, quantity }
========================================= */
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("=== ADD TO CART REQUEST ===");
    console.log("Body:", body);
    
    const { userId, productId, quantity = 1 } = body;

    if (!userId || !productId) {
      console.log("Missing userId or productId");
      return NextResponse.json(
        { success: false, message: "User ID and Product ID are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.warn("User not found for id:", userId);
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.log("Product not found:", productId);
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Check if product is in stock
    if (product.stock <= 0) {
      console.log("Product out of stock");
      return NextResponse.json(
        { success: false, message: "Product is out of stock" },
        { status: 400 }
      );
    }

    // Ensure cart is always an array
    if (!Array.isArray(user.cart)) user.cart = [];

    // Check if product already in cart
    const existingItem = user.cart.find(
      (item) => String(item.product) === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({
        product: productId,
        quantity,
      });
    }

    await user.save();

    // Fetch updated user with populated products
    const updatedUser = await User.findById(userId)
      .populate("cart.product");

    console.log("✅ Cart updated successfully");
    console.log("User ID:", userId);
    console.log("Cart:", updatedUser.cart);

    return NextResponse.json({
      success: true,
      message: "Product added to cart",
      cart: updatedUser.cart,
    });

  } catch (error) {
    console.error("=== ADD TO CART ERROR ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
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

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json(
        { success: false, message: "User ID, Product ID, and quantity required" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!Array.isArray(user.cart)) user.cart = [];

    const item = user.cart.find(
      (i) => String(i.product) === productId
    );

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Product not found in cart" },
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
      { success: false, message: "Server error" },
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

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!Array.isArray(user.cart)) user.cart = [];

    user.cart = user.cart.filter(
      (item) => String(item.product) !== productId
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
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}