"use client"

type Journey = { path: string; count: number }

export default function JourneysCard({ data }: { data: Journey[] }) {
  return (
    <div className="bg-white rounded-xl shadow-md border p-4">
      <h2 className="text-sm md:text-base font-bold mb-3">مسیرهای کاربر</h2>
      <ul className="space-y-2">
        {data.map((j, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>{j.path}</span>
            <span className="font-bold">{j.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
