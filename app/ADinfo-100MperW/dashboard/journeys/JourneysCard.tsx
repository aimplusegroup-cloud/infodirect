"use client"

type Journey = { path: string; count: number }

export default function JourneysCard({ data }: { data: Journey[] }) {
  const safeData: Journey[] = (data ?? []).map((j: any, i) => ({
    path: Array.isArray(j?.path) ? j.path.join(" › ") : String(j?.path ?? j?.route ?? `مسیر ${i + 1}`),
    count: typeof j?.count === "number" ? j.count : typeof j?.visitors === "number" ? j.visitors : 0,
  }))

  return (
    <div className="bg-white rounded-xl shadow-md border p-4">
      <h2 className="text-sm md:text-base font-bold mb-3">مسیرهای کاربر</h2>
      <ul className="space-y-2">
        {safeData.map((j, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>{j.path}</span>
            <span className="font-bold">{j.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
