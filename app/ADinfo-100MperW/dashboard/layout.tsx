"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LogoutButton from "../../components/LogoutButton"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()

  // اگر لاگین نباشه، بفرست به صفحه لاگین
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/logADinfo-100MperW/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="p-4">در حال بررسی ورود...</div>
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-base md:text-lg font-bold">داشبورد InfoDirect</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600">نسخه نمایشی</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
          {children}
        </div>
      </main>
    </div>
  )
}
