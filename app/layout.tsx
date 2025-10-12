import "./globals.css"
import type { Metadata } from "next"
import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "Infodirect",
  description: "Minimal single-screen staged landing",
  icons: {
    icon: "/infodirect.png",
    apple: "/infodirect.png",
  },
}

// 👇 تابع RootLayout باید async باشه
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
        <meta
          name="description"
          content="InfoDirect یک پلتفرم تخصصی برای کسب‌وکارهای کوچک و متوسط در ایران است. این پلتفرم با طراحی مینیمال، امنیت بالا و تجربه کاربری حرفه‌ای، اعتماد مشتریان را جلب می‌کند."
        />
        <meta
          name="keywords"
          content="کسب و کار, SME, بازاریابی دیجیتال, پلتفرم فروش, اینفودایرکت, اعتماد مشتری, طراحی مینیمال, تجربه کاربری, امنیت وب, سئو"
        />

        {/* ======================== */}
        {/* Open Graph Tags */}
        {/* ======================== */}
        <meta property="og:title" content="InfoDirect | راهکار مدرن برای SMEها" />
        <meta
          property="og:description"
          content="پلتفرم InfoDirect با طراحی مینیمال، امنیت بالا و تجربه کاربری حرفه‌ای، اعتماد مشتریان SME را جلب می‌کند."
        />
        <meta property="og:image" content="/infodirect.png" />
        <meta property="og:url" content="https://infodirect.ir" />
        <meta property="og:type" content="website" />

        {/* ======================== */}
        {/* Twitter Card */}
        {/* ======================== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="InfoDirect | راهکار مدرن برای SMEها" />
        <meta
          name="twitter:description"
          content="پلتفرم InfoDirect با طراحی مینیمال و امنیت بالا، اعتماد مشتریان SME را جلب می‌کند."
        />
        <meta name="twitter:image" content="/infodirect.png" />

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
                "InfoDirect یک پلتفرم تخصصی برای کسب‌وکارهای کوچک و متوسط در ایران است که با طراحی مینیمال، امنیت بالا و تجربه کاربری حرفه‌ای، اعتماد مشتریان را جلب می‌کند.",
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+98-912-111-2233",
                  "contactType": "customer service",
                  "areaServed": "IR",
                  "availableLanguage": ["fa", "en"]
                }
              ]
            })
          }}
        />

        {/* ======================== */}
        {/* Dark Mode Flicker Fix */}
        {/* ======================== */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || 
                     (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-500">
        {children}
      </body>
    </html>
  )
}
