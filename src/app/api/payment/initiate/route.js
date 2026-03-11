import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { amount } = await req.json();

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const total_amount = Number(amount);
    const transaction_uuid = `TXN-${Date.now()}`;
    const product_code = process.env.ESEWA_PRODUCT_CODE;

    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

    const signature = crypto
      .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
      .update(message)
      .digest("base64");

    return NextResponse.json({
      paymentUrl: `${process.env.NEXT_PUBLIC_ESEWA_BASE_URL}/api/epay/main/v2/form`,
      params: {
        amount: total_amount,
        tax_amount: 0,
        total_amount,
        transaction_uuid,
        product_code,
        product_service_charge: 0,
        product_delivery_charge: 0,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
        success_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/payment/verify`,
        failure_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/failure`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Payment initiation failed" },
      { status: 500 }
    );
  }
}



// import crypto from "crypto";
// import { NextResponse } from "next/server";

// export async function POST() {
//   try {
//     // Static payment details
//     const total_amount = 300; // Fixed amount
//     const transaction_uuid = "TXN-1234567890123"; // Fixed transaction ID
//     const product_code = process.env.ESEWA_PRODUCT_CODE; // From environment

//     // Create the message to sign
//     const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

//     // Generate signature
//     const signature = crypto
//       .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
//       .update(message)
//       .digest("base64");

//     // Return static payment URL and parameters
//     return NextResponse.json({
//       paymentUrl: `${process.env.NEXT_PUBLIC_ESEWA_BASE_URL}/api/epay/main/v2/form`,
//       params: {
//         amount: total_amount,
//         tax_amount: 0,
//         total_amount,
//         transaction_uuid,
//         product_code,
//         product_service_charge: 0,
//         product_delivery_charge: 0,
//         signed_field_names: "total_amount,transaction_uuid,product_code",
//         signature,
//         success_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/payment/verify`,
//         failure_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/failure`,
//       },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Payment initiation failed" },
//       { status: 500 }
//     );
//   }
// }