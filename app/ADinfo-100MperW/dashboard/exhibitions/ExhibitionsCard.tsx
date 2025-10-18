"use client"

type ExhibitionStat = { exhibition: string; orders: number; revenue: number }

export default function ExhibitionsCard({ data }: { data: ExhibitionStat[] }) {
  const safeData: ExhibitionStat[] = (data ?? []).map((e: any, i) => ({
    exhibition: String(e?.exhibition ?? e?.title ?? e?.name ?? `نمایشگاه ${i + 1}`),
    orders:
      typeof e?.orders === "number"
        ? e.orders
        : typeof e?.ordersCount === "number"
        ? e.ordersCount
        : typeof e?.bookings === "number"
        ? e.bookings
        : 0,
    revenue:
      typeof e?.revenue === "number"
        ? e.revenue
        : typeof e?.amount === "number"
        ? e.amount
        : 0,
  }))

  return (
    <div className="bg-white rounded-xl shadow-md border p-4">
      <h2 className="text-sm md:text-base font-bold mb-3">نمایشگاه‌ها</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-1">نام</th>
            <th className="py-1">سفارش‌ها</th>
            <th className="py-1">درآمد</th>
          </tr>
        </thead>
        <tbody>
          {safeData.map((ex, i) => (
            <tr key={i} className="border-b">
              <td className="py-1">{ex.exhibition}</td>
              <td className="py-1">{ex.orders}</td>
              <td className="py-1">{ex.revenue.toLocaleString("fa-IR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
