import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// استفاده از Web Crypto API (نیازی به import نیست)
function generateNonce() {
  return Buffer.from(crypto.randomUUID()).toString("base64")
}

export default withAuth(
  function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const isDev = process.env.NODE_ENV !== "production"

    if (isDev) {
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
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/ADinfo-100MperW/dashboard/:path*"],
}
