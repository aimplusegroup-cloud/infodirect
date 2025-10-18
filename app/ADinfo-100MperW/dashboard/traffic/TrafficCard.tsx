"use client"

type TrafficSource = { source: string; visitors: number }

export default function TrafficCard({ data }: { data: TrafficSource[] }) {
  const safeData: TrafficSource[] = (data ?? []).map((t: any, i) => ({
    source: String(t?.source ?? t?.medium ?? t?.name ?? `منبع ${i + 1}`),
    visitors:
      typeof t?.visitors === "number"
        ? t.visitors
        : typeof t?.visits === "number"
        ? t.visits
        : typeof t?.count === "number"
        ? t.count
        : 0,
  }))

  return (
    <div className="bg-white rounded-xl shadow-md border p-4">
      <h2 className="text-sm md:text-base font-bold mb-3">منابع ترافیک</h2>
      <ul className="space-y-2">
        {safeData.map((src, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>{src.source}</span>
            <span className="font-bold">{src.visitors}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
