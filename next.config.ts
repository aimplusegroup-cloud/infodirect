import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

// 🔍 فعال‌سازی Bundle Analyzer فقط وقتی ANALYZE=true باشه
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// 🔒 Content Security Policy (بدون Google Analytics)
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self';
  frame-ancestors 'none';
`.replace(/\s{2,}/g, " ").trim();

// 🔒 Security Headers
const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// ⚙️ Next.js Config
const nextConfig: NextConfig = {
  // 🔹 خروجی سبک‌تر برای Vercel (فقط فایل‌های ضروری)
  output: "standalone",

  // 🔹 جلوگیری از تولید sourcemap در production (حجم کمتر)
  productionBrowserSourceMaps: false,

  // 🔹 فعال کردن React Strict Mode
  reactStrictMode: true,

  // 🔹 بهینه‌سازی تصاویر
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [
      "infodirect.ir", // ✅ دامنه اصلی پروژه
      "localhost",     // برای توسعه لوکال
      "your-cdn.com"   // اگر CDN یا استوریج خارجی داری
    ],
  },

  // 🔹 اضافه کردن هدرهای امنیتی
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
