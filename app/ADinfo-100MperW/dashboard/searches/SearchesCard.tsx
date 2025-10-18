"use client"

type SearchStat = { query: string; count: number }

export default function SearchesCard({ data }: { data: SearchStat[] }) {
  return (
    <div className="bg-white rounded-xl shadow-md border p-4">
      <h2 className="text-sm md:text-base font-bold mb-3">جستجوها</h2>
      <ul className="space-y-2">
        {data.map((s, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>{s.query}</span>
            <span className="font-bold">{s.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
