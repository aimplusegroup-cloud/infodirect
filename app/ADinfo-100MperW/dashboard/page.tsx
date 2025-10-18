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

// ✨ تایپ‌های دقیق برای داده‌ها
interface KPIs {
  visitors?: number
  orders?: number
  revenue?: number
  conversionRate?: number
  aov?: number
  arpu?: number
  retentionRate?: number
  bounceRate?: number
}

interface TrendItem {
  date: string
  views: number
  revenue: number
}

interface SaleItem {
  id: string
  amount: number
}

interface BehaviorItem {
  action: string
  count: number
}

interface FunnelItem {
  step: string
  users: number
}

interface TrafficItem {
  source: string
  visits: number
}

interface JourneyItem {
  path: string[]
}

interface ExhibitionItem {
  id: string
  title: string
}

interface SearchItem {
  query: string
  count: number
}

// ✨ DashboardData
interface DashboardData {
  kpis?: KPIs
  daily?: TrendItem[]
  sales?: SaleItem[]
  behavior?: BehaviorItem[]
  funnel?: FunnelItem[]
  traffic?: TrafficItem[]
  journeys?: JourneyItem[]
  exhibitions?: ExhibitionItem[]
  searches?: SearchItem[]
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

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="space-y-6">
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

      {loading && <div className="text-sm text-gray-600">در حال بارگذاری...</div>}

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
