"use client"

import { useState, useEffect, useCallback } from "react"

import KPIsCard from "./kpis/KPIsCard"
import BehaviorCard from "./behavior/BehaviorCard"
import FunnelCard from "./funnel/FunnelCard"
import TrafficCard from "./traffic/TrafficCard"
import JourneysCard from "./journeys/JourneysCard"
import ExhibitionsCard from "./exhibitions/ExhibitionsCard"
import SearchesCard from "./searches/SearchesCard"
import SalesCard from "./sales/SalesCard"
import TrendsCard from "./trends/TrendsCard"

type Range = "day" | "week" | "month"

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

interface BehaviorItem { action: string; count: number }
interface FunnelItem { step?: string; users?: number; count?: number; value?: number }
interface TrafficItem { source?: string; visits?: number; visitors?: number; count?: number; medium?: string; name?: string }
interface JourneyItem { path?: string[] | string; count?: number; route?: string }
interface ExhibitionItem { id?: string; title?: string; exhibition?: string; orders?: number; ordersCount?: number; bookings?: number; revenue?: number; amount?: number; name?: string }
interface SearchItem { query: string; count: number }
interface SalesItemRaw { id?: string; name?: string; sales?: number; amount?: number; [key: string]: any }
interface TrendRawSeries { id?: string; name?: string; points?: any[]; data?: any[] }

interface DashboardData {
  kpis?: KPIs
  behavior?: BehaviorItem[] | null
  funnel?: FunnelItem[] | null
  traffic?: TrafficItem[] | null
  journeys?: JourneyItem[] | null
  exhibitions?: ExhibitionItem[] | null
  searches?: SearchItem[] | null
  sales?: SalesItemRaw[] | null
  trends?: TrendRawSeries[] | null
}

export default function DashboardPage() {
  const [range, setRange] = useState<Range>("day")
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(() => {
    setLoading(true)
    fetch(`/api/dashboard?range=${range}`)
      .then(async r => {
        const json: DashboardData = await r.json()
        return json
      })
      .then(json => setData(json))
      .finally(() => setLoading(false))
  }, [range])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // --- safe mappings مطابق shape مورد انتظار هر کامپوننت ---
  const safeKpis = data?.kpis ?? {}

  const safeBehavior: { action: string; count: number }[] = (data?.behavior ?? []).map((b: any) => ({
    action: String(b?.action ?? ""),
    count: typeof b?.count === "number" ? b.count : 0,
  }))

  const safeFunnel: { step: string; count: number }[] = (data?.funnel ?? []).map((f: any) => ({
    step: String(f?.step ?? ""),
    count:
      typeof f?.count === "number"
        ? f.count
        : typeof f?.users === "number"
        ? f.users
        : typeof f?.value === "number"
        ? f.value
        : 0,
  }))

  const safeTraffic: { source: string; visitors: number }[] = (data?.traffic ?? []).map((t: any) => ({
    source: String(t?.source ?? t?.medium ?? t?.name ?? ""),
    visitors:
      typeof t?.visitors === "number"
        ? t.visitors
        : typeof t?.visits === "number"
        ? t.visits
        : typeof t?.count === "number"
        ? t.count
        : 0,
  }))

  const safeJourneys: { path: string; count: number }[] = (data?.journeys ?? []).map((j: any, idx: number) => ({
    path: Array.isArray(j?.path)
      ? j.path.join(" › ")
      : String(j?.path ?? j?.route ?? `مسیر ${idx + 1}`),
    count: typeof j?.count === "number" ? j.count : typeof j?.visitors === "number" ? j.visitors : 0,
  }))

  const safeExhibitions: { exhibition: string; orders: number; revenue: number }[] = (data?.exhibitions ?? []).map(
    (e: any, idx: number) => ({
      exhibition: String(e?.exhibition ?? e?.title ?? e?.name ?? `نمایشگاه ${idx + 1}`),
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
    })
  )

  const safeSearches: { query: string; count: number }[] = (data?.searches ?? []).map((s: any) => ({
    query: String(s?.query ?? ""),
    count: typeof s?.count === "number" ? s.count : 0,
  }))

  const safeSales = (data?.sales ?? []).map((s: SalesItemRaw, idx: number) => ({
    id: String(s?.id ?? `sale-${idx}`),
    name: String(s?.name ?? s?.product ?? `محصول ${idx + 1}`),
    sales: typeof s?.sales === "number" ? s.sales : 0,
    amount: typeof s?.amount === "number" ? s.amount : 0,
  }))

  // Trends: normalize series -> produce points for card
  const safeTrendsSeries: { id: string; points: any[] }[] = (data?.trends ?? []).map((t: any, idx: number) => ({
    id: String(t?.id ?? t?.name ?? `series-${idx}`),
    points: Array.isArray(t?.points) ? t.points : Array.isArray(t?.data) ? t.data : [],
  }))

  // trendsForCard: choose first series points if exists, else merged points
  const trendsForCard = (safeTrendsSeries[0]?.points ?? []).map((p: any, i: number) => ({
    date: String(p?.date ?? p?.label ?? `pt-${i}`),
    views: typeof p?.views === "number" ? p.views : typeof p?.count === "number" ? p.count : 0,
    revenue: typeof p?.revenue === "number" ? p.revenue : typeof p?.amount === "number" ? p.amount : 0,
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-base md:text-lg font-bold">داشبورد</h2>
        <div className="flex gap-2">
          {(["day", "week", "month"] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs rounded ${range === r ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              {r === "day" ? "روزانه" : r === "week" ? "هفتگی" : "ماهانه"}
            </button>
          ))}
          <button onClick={fetchData} className="px-3 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300">
            🔄 بروزرسانی
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-600">در حال بارگذاری...</div>}

      {data && (
        <>
          <KPIsCard kpis={safeKpis} />
          <BehaviorCard data={safeBehavior} />
          <FunnelCard data={safeFunnel} />
          <TrafficCard data={safeTraffic} />
          <JourneysCard data={safeJourneys} />
          <ExhibitionsCard data={safeExhibitions} />
          <SearchesCard data={safeSearches} />
          <SalesCard range={range} data={safeSales} />
          <TrendsCard range={range} data={trendsForCard} />
        </>
      )}
    </div>
  )
}
