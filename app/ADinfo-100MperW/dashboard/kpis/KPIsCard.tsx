"use client"

type KPIs = {
  visitors?: number
  orders?: number
  revenue?: number
  conversionRate?: number
  aov?: number
  arpu?: number
  retentionRate?: number
  bounceRate?: number
}

export default function KPIsCard({ kpis }: { kpis?: KPIs }) {
  if (!kpis) {
    return (
      <div className="bg-white rounded-xl shadow-md border p-4 text-center text-sm text-gray-500">
        داده‌ای موجود نیست
      </div>
    )
  }

  const items = [
    { label: "بازدیدکنندگان", value: (kpis.visitors ?? 0).toLocaleString("fa-IR") },
    { label: "سفارش‌ها", value: (kpis.orders ?? 0).toLocaleString("fa-IR") },
    { label: "درآمد", value: (kpis.revenue ?? 0).toLocaleString("fa-IR") },
    { label: "نرخ تبدیل", value: `${((kpis.conversionRate ?? 0) * 100).toFixed(1)}%` },
    { label: "میانگین ارزش سفارش (AOV)", value: (kpis.aov ?? 0).toLocaleString("fa-IR") },
    { label: "ARPU", value: (kpis.arpu ?? 0).toLocaleString("fa-IR") },
    { label: "Retention", value: `${((kpis.retentionRate ?? 0) * 100).toFixed(1)}%` },
    { label: "Bounce Rate", value: `${((kpis.bounceRate ?? 0) * 100).toFixed(1)}%` },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-md border p-4 flex flex-col items-center"
        >
          <span className="text-xs text-gray-500">{item.label}</span>
          <span className="text-lg font-bold">{item.value}</span>
        </div>
      ))}
    </div>
  )
}
