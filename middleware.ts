import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// تولید nonce تصادفی برای اسکریپت‌ها
function generateNonce() {
  return Buffer.from(crypto.randomUUID()).toString("base64")
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const isDev = process.env.NODE_ENV !== "production"

  // 🔐 Content Security Policy
  if (isDev) {
    // حالت توسعه (Dev) → CSP بازتر برای React Refresh و ابزارهای توسعه
    res.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self' data: blob:",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
        "style-src * 'unsafe-inline'",
        "img-src * data: https:",
        "connect-src * https://www.google-analytics.com https://www.googletagmanager.com",
        "font-src * data:",
      ].join("; ")
    )
  } else {
    // حالت Production → CSP سخت‌گیرانه با nonce
    const nonce = generateNonce()

    res.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "style-src 'self' 'unsafe-inline'",
        `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com`,
        "font-src 'self' data:",
        "connect-src 'self' https: https://www.google-analytics.com https://www.googletagmanager.com",
        "frame-ancestors 'none'", // جلوگیری از iframe شدن (Clickjacking Protection)
      ].join("; ")
    )

    // پاس دادن nonce به layout برای استفاده در <script nonce="...">
    res.headers.set("x-nonce", nonce)
  }

  return res
}
