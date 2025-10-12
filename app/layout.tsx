import "./globals.css"
import type { Metadata } from "next"
import { headers } from "next/headers"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Infodirect",
  // توضیحات رو فقط اینجا حذف کردیم تا دوباره در <head> دستی تکرار نشه
  icons: {
    icon: "/infodirect.png",
    apple: "/infodirect.png",
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") || undefined

  return (
    <html lang="fa" suppressHydrationWarning>
      <head>
        {/* ======================== */}
        {/* SEO Meta Tags */}
        {/* ======================== */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://infodirect.ir/" />

        {/* توضیحات فقط یک بار */}
        <meta
          name="description"
          content="InfoDirect اطلاعات تماس شرکت‌های شرکت‌کننده در نمایشگاه‌های بین‌المللی تهران و سایر رویدادها را گردآوری و به‌صورت فایل اکسل ساختاریافته ارائه می‌دهد. این داده‌ها شامل شرکت‌های فعال در صنایع مختلف مانند مبلمان، صنایع غذایی، تجهیزات پزشکی، ماشین‌آلات صنعتی، فناوری اطلاعات، پوشاک و بسیاری حوزه‌های دیگر است. تیم‌های فروش و بازاریابی می‌توانند با استفاده از این داده‌ها همکاری‌های سازمانی را توسعه دهند، مشتریان بالقوه را شناسایی کنند و کمپین‌های B2B هدفمند اجرا کنند."
        />
        <meta
          name="keywords"
          content="نمایشگاه بین‌المللی تهران, اطلاعات تماس, لیست شرکت‌کنندگان, داده‌های نمایشگاهی, اکسل شرکت‌ها, فروش B2B, بازاریابی B2B, توسعه همکاری سازمانی, سرنخ‌های بازاریابی, پایگاه داده شرکت‌ها, مبلمان, صنایع غذایی, تجهیزات پزشکی, ماشین‌آلات, فناوری اطلاعات, پوشاک"
        />

        {/* ======================== */}
        {/* hreflang (اگر چندزبانه) */}
        {/* ======================== */}
        <link rel="alternate" href="https://infodirect.ir/" hreflang="fa" />
        <link rel="alternate" href="https://infodirect.ir/en" hreflang="en" />

        {/* ======================== */}
        {/* Open Graph */}
        {/* ======================== */}
        <meta property="og:title" content="InfoDirect | داده‌های تماس شرکت‌کنندگان نمایشگاهی به‌صورت اکسل" />
        <meta
          property="og:description"
          content="گردآوری و یکپارچه‌سازی لیست شرکت‌کنندگان نمایشگاه‌ها با اطلاعات تماس و خروجی اکسل؛ مناسب برای فروش و بازاریابی B2B در صنایع مختلف."
        />
        <meta property="og:image" content="https://infodirect.ir/infodirect.png" />
        <meta property="og:url" content="https://infodirect.ir" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fa_IR" />

        {/* ======================== */}
        {/* Twitter Card */}
        {/* ======================== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="InfoDirect | داده‌های تماس شرکت‌کنندگان نمایشگاهی به‌صورت اکسل" />
        <meta
          name="twitter:description"
          content="لیست‌های اکسل آماده استفاده از شرکت‌های فعال در صنایع مختلف نمایشگاهی؛ مناسب برای همکاری‌های سازمانی و فروش B2B."
        />
        <meta name="twitter:image" content="https://infodirect.ir/infodirect.png" />

        {/* ======================== */}
        {/* Structured Data (JSON-LD) */}
        {/* ======================== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "InfoDirect",
              "url": "https://infodirect.ir",
              "logo": "https://infodirect.ir/infodirect.png",
              "description":
                "InfoDirect اطلاعات تماس شرکت‌های شرکت‌کننده در نمایشگاه‌های بین‌المللی را در قالب فایل‌های اکسل آماده ارائه می‌دهد. این داده‌ها شامل شرکت‌های فعال در صنایع مختلف مانند مبلمان، صنایع غذایی، تجهیزات پزشکی، ماشین‌آلات صنعتی، فناوری اطلاعات، پوشاک و بسیاری حوزه‌های دیگر است. هدف ما کمک به تیم‌های فروش و بازاریابی برای دسترسی سریع به مشتریان بالقوه و توسعه همکاری‌های سازمانی است.",
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "contactType": "sales",
                  "areaServed": "IR",
                  "availableLanguage": ["fa", "en"]
                }
              ]
            })
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "url": "https://infodirect.ir",
              "name": "لیست‌های اکسل اطلاعات تماس شرکت‌کنندگان نمایشگاهی",
              "description":
                "ارائه فایل‌های اکسل ساختاریافته شامل نام شرکت، صنعت، وب‌سایت، ایمیل و شماره تماس برای استفاده در فروش، بازاریابی B2B و توسعه همکاری‌های سازمانی."
            })
          }}
        />

        {/* ======================== */}
        {/* Performance Hints */}
        {/* ======================== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-500">
        {children}

        {/* ======================== */}
        {/* Dark Mode Flicker Fix */}
        {/* ======================== */}
        <Script id="theme-script" strategy="beforeInteractive" nonce={nonce}>
          {`
            try {
              const theme = localStorage.getItem('theme');
              if (theme === 'dark' || 
                 (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (_) {}
          `}
        </Script>

        {/* ======================== */}
        {/* Google Analytics (GA4) */}
        {/* ======================== */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  )
}
