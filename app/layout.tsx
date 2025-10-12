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
        {/* اسکریپت جلوگیری از فلیکر دارک مود با nonce */}
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
