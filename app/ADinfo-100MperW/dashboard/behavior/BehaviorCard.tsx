"use client"

type BehaviorItem = { action: string; count: number }

export default function BehaviorCard({ data }: { data: BehaviorItem[] }) {
  return (
    <div className="bg-white rounded-xl shadow-md border p-4">
      <h2 className="text-sm md:text-base font-bold mb-3">رفتار کاربران</h2>
      <ul className="space-y-2">
        {data.map((item, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>{item.action}</span>
            <span className="font-bold">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
