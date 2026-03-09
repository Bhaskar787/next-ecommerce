
import crypto from "crypto";

export function generateEsewaSignature(message, secretKey) {
  if (!secretKey) {
    throw new Error("ESEWA_SECRET_KEY is not set");
  }

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");

  return signature;
}