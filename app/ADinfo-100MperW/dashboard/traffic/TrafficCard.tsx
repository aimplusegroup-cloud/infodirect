"use client"

type TrafficSource = { source: string; visitors: number }

export default function TrafficCard({ data }: { data: TrafficSource[] }) {
  return (
    <div className="bg-white rounded-xl shadow-md border p-4">
      <h2 className="text-sm md:text-base font-bold mb-3">منابع ترافیک</h2>
      <ul className="space-y-2">
        {data.map((src, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>{src.source}</span>
            <span className="font-bold">{src.visitors}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
