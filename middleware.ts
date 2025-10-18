import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// تولید nonce تصادفی برای اسکریپت‌ها (فقط در Production استفاده می‌کنیم)
function generateNonce() {
  return Buffer.from(crypto.randomUUID()).toString("base64")
}

export default withAuth(
  function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const isDev = process.env.NODE_ENV !== "production"

    if (isDev) {
      // 🔓 حالت توسعه → CSP بازتر برای HMR و React Refresh
      res.headers.set(
        "Content-Security-Policy",
        [
          "default-src 'self' data: blob:",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
          "style-src * 'unsafe-inline'",
          "img-src * data: https:",
          "connect-src * https://www.google-analytics.com https://www.googletagmanager.com ws://localhost:3000 wss://localhost:3000",
          "font-src * data:",
        ].join("; ")
      )
    } else {
      // 🔐 حالت Production → CSP سخت‌گیرانه‌تر با nonce
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
          "frame-ancestors 'none'",
        ].join("; ")
      )
      res.headers.set("x-nonce", nonce)
    }

    return res
  },
  {
    callbacks: {
      // فقط اگر سشن وجود داشته باشه اجازه ورود بده
      authorized: ({ token }) => !!token,
    },
  }
)

// فقط مسیر داشبورد محافظت بشه
export const config = {
  matcher: ["/ADinfo-100MperW/dashboard/:path*"],
}
