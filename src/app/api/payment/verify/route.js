
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
   
     const transaction_uuid = `TXN-${Date.now()}`;

    // ✅ Update order in DB and clear cart here (if you have DB)

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

