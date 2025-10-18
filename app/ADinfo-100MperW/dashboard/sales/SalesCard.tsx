"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

type SalesItem = { name: string; sales: number; amount: number }

export default function SalesCard({ range, data }: { range: "day" | "week" | "month"; data: SalesItem[] }) {
  return (
    <div className="bg-white rounded-xl shadow-md border p-4 h-[400px] flex flex-col">
      <h2 className="text-sm md:text-base font-bold mb-3">فروش محصولات ({range})</h2>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: any, name: string) => (name === "amount" ? value.toLocaleString("fa-IR") : value)} />
            <Legend />
            <Bar dataKey="sales" fill="#06b6d4" name="تعداد فروش" />
            <Bar dataKey="amount" fill="#f97316" name="مبلغ فروش" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
