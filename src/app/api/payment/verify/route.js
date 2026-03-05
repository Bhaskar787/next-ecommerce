import crypto from "crypto";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const dataEncoded = searchParams.get("data");

    if (!dataEncoded) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/failure`
      );
    }

    const decodedString = Buffer.from(dataEncoded, "base64").toString("utf-8");
    const decodedData = JSON.parse(decodedString);

    console.log("eSewa Response:", decodedData);

    // Recreate signature to verify
    const message = `total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${decodedData.product_code}`;

    const secret = process.env.ESEWA_SECRET_KEY;
    if (!secret) {
      console.warn("ESEWA_SECRET_KEY not set – skipping signature check (development)");
    }

    const expectedSignature = secret
      ? crypto.createHmac("sha256", secret).update(message).digest("base64")
      : null;

    if (expectedSignature) {
      console.log("expected signature:", expectedSignature);
      if (decodedData.signature !== expectedSignature) {
        console.warn("signature mismatch", {
          received: decodedData.signature,
          expected: expectedSignature,
        });
      }
    }

    if (
      decodedData.status === "COMPLETE" &&
      (secret ? decodedData.signature === expectedSignature : true)
    ) {
      // ✅ TODO:
      // 1. Update Order in DB → paymentStatus = "paid"
      // 2. Clear Cart

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/success?ref=${decodedData.transaction_code}`
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL}/failure`
    );
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL}/failure`
    );
  }
}

// legacy client verification calls (success page used to POST here);
// keep a no‑op handler to avoid 405 responses if anything still hits
// this route via POST.
export async function POST(req) {
  return NextResponse.json({ ok: true });
}
