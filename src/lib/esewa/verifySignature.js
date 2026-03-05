import CryptoJS from "crypto-js";

export function generateEsewaSignature(message) {
  const secretKey = process.env.ESEWA_SECRET_KEY; 
  if (!secretKey) throw new Error("Missing ESEWA_SECRET_KEY");

  const hash = CryptoJS.HmacSHA256(message, secretKey);
  return CryptoJS.enc.Base64.stringify(hash);
}