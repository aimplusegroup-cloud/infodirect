export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* هدر ثابت بالا */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-base md:text-lg font-bold">داشبورد InfoDirect</h1>
          <div className="text-xs text-gray-600">نسخه نمایشی</div>
        </div>
      </header>

      {/* محتوای داشبورد با اسکرول عمودی */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
          {children}
        </div>
      </main>
    </div>
  )
}
