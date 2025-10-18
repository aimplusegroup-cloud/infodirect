"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

type SalesItem = { id: string; name: string; sales: number; amount: number }

export default function SalesCard({
  range,
  data,
}: {
  range: "day" | "week" | "month"
  data?: Partial<SalesItem>[] | null
}) {
  const safeData: SalesItem[] = (data ?? []).map((d: any, idx: number) => ({
    id: String(d?.id ?? `sale-${idx}`),
    name: String(d?.name ?? d?.product ?? `محصول ${idx + 1}`),
    sales: typeof d?.sales === "number" ? d.sales : 0,
    amount: typeof d?.amount === "number" ? d.amount : 0,
  }))

  const currencyFormatter = (value: number) => Number(value).toLocaleString("fa-IR")

  return (
    <div className="bg-white rounded-xl shadow-md border p-4 h-[400px] flex flex-col">
      <h2 className="text-sm md:text-base font-bold mb-3">فروش محصولات ({range})</h2>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={safeData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number, key: string) =>
                key === "amount" ? currencyFormatter(value) : String(value)
              }
              labelFormatter={(label: string) => String(label)}
            />
            <Legend />
            <Bar dataKey="sales" fill="#06b6d4" name="تعداد فروش" />
            <Bar dataKey="amount" fill="#f97316" name="مبلغ فروش" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
