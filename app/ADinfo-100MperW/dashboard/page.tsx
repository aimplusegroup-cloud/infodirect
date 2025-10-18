"use client"

import { useState, useEffect, useCallback } from "react"

import KPIsCard from "./kpis/KPIsCard"
import TrendsCard from "./trends/TrendsCard"
import SalesCard from "./sales/SalesCard"
import BehaviorCard from "./behavior/BehaviorCard"
import FunnelCard from "./funnel/FunnelCard"
import TrafficCard from "./traffic/TrafficCard"
import JourneysCard from "./journeys/JourneysCard"
import ExhibitionsCard from "./exhibitions/ExhibitionsCard"
import SearchesCard from "./searches/SearchesCard"

type Range = "day" | "week" | "month"

// یک تایپ کلی برای داده‌های داشبورد
interface DashboardData {
  kpis?: unknown
  daily?: unknown[]
  sales?: unknown[]
  behavior?: unknown[]
  funnel?: unknown[]
  traffic?: unknown[]
  journeys?: unknown[]
  exhibitions?: unknown[]
  searches?: unknown[]
}

export default function DashboardPage() {
  const [range, setRange] = useState<Range>("day")
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(() => {
    setLoading(true)
    fetch(`/api/dashboard?range=${range}`)
      .then(r => r.json())
      .then((json: DashboardData) => setData(json))
      .finally(() => setLoading(false))
  }, [range])

  // بارگذاری اولیه و تغییر بازه
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="space-y-6">
      {/* هدر و انتخاب بازه */}
      <div className="flex justify-between items-center">
        <h2 className="text-base md:text-lg font-bold">داشبورد</h2>
        <div className="flex gap-2">
          {(["day","week","month"] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs rounded ${
                range === r ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {r === "day" ? "روزانه" : r === "week" ? "هفتگی" : "ماهانه"}
            </button>
          ))}
          <button
            onClick={fetchData}
            className="px-3 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300"
          >
            🔄 بروزرسانی
          </button>
        </div>
      </div>

      {/* وضعیت بارگذاری */}
      {loading && <div className="text-sm text-gray-600">در حال بارگذاری...</div>}

      {/* کارت‌ها */}
      {data && (
        <>
          <KPIsCard kpis={data.kpis} />
          <TrendsCard range={range} data={data.daily || []} />
          <SalesCard range={range} data={data.sales || []} />
          <BehaviorCard data={data.behavior || []} />
          <FunnelCard data={data.funnel || []} />
          <TrafficCard data={data.traffic || []} />
          <JourneysCard data={data.journeys || []} />
          <ExhibitionsCard data={data.exhibitions || []} />
          <SearchesCard data={data.searches || []} />
        </>
      )}
    </div>
  )
}
