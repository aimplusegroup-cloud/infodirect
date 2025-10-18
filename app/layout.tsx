// app/layout.tsx
import "./globals.css"
import type { Metadata } from "next"
import { headers } from "next/headers"
import Script from "next/script"
import Providers from "./providers"
import Tracker from "./Tracker"

export const metadata: Metadata = {
  title: "Infodirect",
  icons: {
    icon: "/infodirect.png",
    apple: "/infodirect.png",
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // گرفتن nonce از هدر (ست شده در middleware)
  const nonce = (await headers()).get("x-nonce") || undefined

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ======================== */}
        {/* SEO Meta Tags */}
        {/* ======================== */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://infodirect.ir/en" />

        <meta
          name="description"
          content="InfoDirect provides structured Excel files with contact details of companies participating in international exhibitions in Tehran and other events. These datasets include companies across industries such as furniture, food, medical equipment, industrial machinery, IT, clothing, and more. Sales and marketing teams can use this data to identify prospects, expand B2B collaborations, and run targeted campaigns."
        />
        <meta
          name="keywords"
          content="Tehran International Exhibition, exhibitor contacts, exhibitor list, exhibition data, Excel company list, B2B sales, B2B marketing, business collaboration, lead generation, company database, furniture, food industry, medical equipment, machinery, IT, clothing"
        />

        {/* ======================== */}
        {/* hreflang (multilingual) */}
        {/* ======================== */}
        <link rel="alternate" href="https://infodirect.ir/" hrefLang="fa" />
        <link rel="alternate" href="https://infodirect.ir/en" hrefLang="en" />

        {/* ======================== */}
        {/* Open Graph */}
        {/* ======================== */}
        <meta property="og:title" content="InfoDirect | Structured Excel Data of Exhibition Participants" />
        <meta
          property="og:description"
          content="Curated and structured Excel lists of exhibition participants with contact details; ideal for B2B sales and marketing across industries."
        />
        <meta property="og:image" content="https://infodirect.ir/infodirect.png" />
        <meta property="og:url" content="https://infodirect.ir/en" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />

        {/* ======================== */}
        {/* Twitter Card */}
        {/* ======================== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="InfoDirect | Structured Excel Data of Exhibition Participants" />
        <meta
          name="twitter:description"
          content="Ready-to-use Excel lists of companies from various industries; perfect for B2B collaboration and sales."
        />
        <meta name="twitter:image" content="https://infodirect.ir/infodirect.png" />

        {/* ======================== */}
        {/* Structured Data (JSON-LD) */}
        {/* ======================== */}
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "InfoDirect",
              "url": "https://infodirect.ir/en",
              "logo": "https://infodirect.ir/infodirect.png",
              "description":
                "InfoDirect provides structured Excel files with exhibitor contact details across multiple industries. Helping sales and marketing teams quickly access prospects and expand B2B collaborations.",
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
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "url": "https://infodirect.ir/en",
              "name": "Excel Lists of Exhibition Participants",
              "description":
                "Structured Excel files including company name, industry, website, email, and phone number for B2B sales, marketing, and business development."
            })
          }}
        />

        {/* ======================== */}
        {/* Performance Hints */}
        {/* ======================== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-500">
        <Providers>
          <Tracker />
          {children}
        </Providers>

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
        <Script id="ga-script" strategy="afterInteractive" nonce={nonce}>
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
