"use client"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

type TrendItem = { date: string; views: number; revenue: number }

export default function TrendsCard({
  range,
  data,
}: {
  range: "day" | "week" | "month"
  data?: TrendItem[]
}) {
  const safeData: TrendItem[] = (data ?? []).map((d: any, i) => ({
    date: String(d?.date ?? d?.label ?? `pt-${i}`),
    views: typeof d?.views === "number" ? d.views : typeof d?.count === "number" ? d.count : 0,
    revenue: typeof d?.revenue === "number" ? d.revenue : typeof d?.amount === "number" ? d.amount : 0,
  }))

  const hasData = safeData.length > 0

  return (
    <div className="bg-white rounded-xl shadow-md border p-4 h-[400px] flex flex-col">
      <h2 className="text-sm md:text-base font-bold mb-3">روند بازدید و درآمد ({range})</h2>
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={safeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#06b6d4" name="بازدید" dot={false} />
            <Line type="monotone" dataKey="revenue" stroke="#f97316" name="درآمد" dot={false} />
          </LineChart>
        </ResponsiveContainer>

        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 bg-white/70">
            داده‌ای برای نمایش وجود ندارد
          </div>
        )}
      </div>
    </div>
  )
}
