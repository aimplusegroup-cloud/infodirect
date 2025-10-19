// next.config.ts
import type { NextConfig } from "next";

const devCSP = `
  default-src 'self' data: blob:;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src * 'unsafe-inline';
  img-src * data: https:;
  font-src * data:;
  connect-src * https://www.google-analytics.com https://www.googletagmanager.com ws://localhost:3000 wss://localhost:3000;
`.replace(/\s{2,}/g, " ").trim();

const prodCSP = `
  default-src 'self';
  script-src 'self' 'nonce-__RANDOM_NONCE__' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.google-analytics.com https://www.googletagmanager.com;
  frame-ancestors 'none';
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: process.env.NODE_ENV !== "production" ? devCSP : prodCSP,
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  experimental: {
    // این گزینه باعث میشه Next.js خودش nonce رو به اسکریپت‌های داخلی اضافه کنه
    cspNonce: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
