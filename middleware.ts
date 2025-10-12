// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// تابع تولید nonce تصادفی
function generateNonce() {
  return Buffer.from(crypto.randomUUID()).toString("base64");
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // تولید nonce
  const nonce = generateNonce();

  // ست کردن CSP با nonce
  res.headers.set(
    "Content-Security-Policy",
    `default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'nonce-${nonce}'; font-src 'self' data:; connect-src 'self' https:;`
  );

  // پاس دادن nonce به layout از طریق هدر سفارشی
  res.headers.set("x-nonce", nonce);

  return res;
}
