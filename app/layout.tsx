import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Infodirect",
  description: "Minimal single-screen staged landing",
  icons: {
    icon: "/infodirect.png", // 👈 یا infodirect.ico اگر همونو گذاشتی
    apple: "/infodirect.png", // برای iOS (اختیاری)
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" suppressHydrationWarning>
      <head>
        {/* اسکریپت برای جلوگیری از فلیکر دارک مود */}
        <script
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
