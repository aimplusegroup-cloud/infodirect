"use client"

type FunnelStep = { step: string; count: number }

export default function FunnelCard({ data }: { data: FunnelStep[] }) {
  return (
    <div className="bg-white rounded-xl shadow-md border p-4">
      <h2 className="text-sm md:text-base font-bold mb-3">قیف تبدیل</h2>
      <div className="space-y-3">
        {data.map((step, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm">
              <span>{step.step}</span>
              <span className="font-bold">{step.count}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-sky-500 rounded"
                style={{ width: `${Math.min(step.count, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
