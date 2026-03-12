import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const dataEncoded = searchParams.get("data");

    if (!dataEncoded) {
      console.error("No data received from eSewa");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/failure`);
    }

    // Decode Base64 data from eSewa
    const decodedString = Buffer.from(dataEncoded, "base64").toString("utf-8");
    const decodedData = JSON.parse(decodedString);

    console.log("eSewa Decoded Data:", decodedData);

    const { transaction_uuid, status, transaction_code } = decodedData;

    if (status !== "COMPLETE") {
      console.error("eSewa Payment Not Complete:", status);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/failure`);
    }

    // ✅ Update order in DB and clear cart
    await connectDB();
    
    // Find and update the order
    const order = await Order.findByIdAndUpdate(
      transaction_uuid, 
      { 
        paymentStatus: "paid",
        transactionId: transaction_code 
      },
      { new: true }
    );

    if (order) {
      // Clear the user's cart
      await User.findByIdAndUpdate(order.userId, { cart: [] });
      console.log(`Order ${transaction_uuid} fulfilled and cart cleared for user ${order.userId}`);
    } else {
      console.error("Order not found:", transaction_uuid);
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL}/success?ref=${transaction_uuid}`
    );
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL}/failure`
    );
  }
}

