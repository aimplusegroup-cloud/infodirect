// app/api/stats/route.ts
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

/**
 * Professional, production-ready stats API for InfoDirect
 * - Robust parsing for TEXT meta fields
 * - Real funnel metrics from events
 * - Real sales per exhibition from OrderItem
 * - Time series (views + revenue) with configurable range
 * - Safe fallbacks, typed outputs, and defensive guards
 * - Ready for Next.js App Router
 */

const prisma = new PrismaClient()

/** ---- Types ---- */
type RangePreset = "day" | "week" | "month" | "90d"
type DailyPoint = { date: string; iso: string; views: number; revenue: number }
type ExhibitionSelection = { name: string; count: number }
type ExhibitionSale = { exhibition: string; orders: number; quantity: number; revenue: number }
type SearchItem = { query: string; count: number }
type Funnel = {
  pageviews: number
  selections: number
  previews: number
  checkoutClicks: number
  orders: number
  whatsappClicks: number
}
type StatsResponse = {
  // traffic
  today: number
  week: number
  month: number
  // interactions
  previews: number
  checkoutClicks: number
  whatsappClicks: number
  exhibitions: ExhibitionSelection[]
  searches: SearchItem[]
  // sales
  orders: number
  totalRevenue: number
  avgOrderValue: number
  conversionRate: number
  exhibitionSales: ExhibitionSale[]
  // time series
  daily: DailyPoint[]
  // behavior
  avgPageDuration: number
  previewAvgTime: number
  previewAvgScroll: number
  // funnel
  funnel: Funnel
}

/** ---- Utilities ---- */
function safeParse<T = any>(text: string | null | undefined, fallback: T): T {
  if (!text) return fallback
  try {
    return JSON.parse(text)
  } catch {
    return fallback
  }
}
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function startOfWeek(d: Date) {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  const weekday = copy.getDay() // 0..6 (Sunday = 0)
  copy.setDate(copy.getDate() - weekday)
  return copy
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function addDays(d: Date, days: number) {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + days)
  return copy
}
function toFaDate(d: Date) {
  return d.toLocaleDateString("fa-IR")
}
function clampNonNegative(n: number) {
  return Number.isFinite(n) && n > 0 ? n : 0
}
function avg(arr: number[]) {
  return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0
}
function chooseRange(preset: RangePreset, now = new Date()) {
  const end = startOfDay(now)
  let length = 14
  switch (preset) {
    case "day":
      length = 1
      break
    case "week":
      length = 7
      break
    case "month":
      length = 30
      break
    case "90d":
      length = 90
      break
    default:
      length = 14
  }
  const start = addDays(end, -length + 1)
  return { start, end, length }
}

/** ---- Domain helpers ---- */

/**
 * Build exhibition selection counts from events meta
 * meta example: { name: "نمایشگاه کتاب", year: 1403 }
 */
async function getExhibitionSelections() {
  const rows = await prisma.event.findMany({
    where: { type: "select_exhibition" },
    select: { meta: true },
  })
  const counter = new Map<string, number>()
  for (const r of rows) {
    const { name } = safeParse<{ name?: string }>(r.meta, {})
    const key = name?.trim() || "نامشخص"
    counter.set(key, (counter.get(key) ?? 0) + 1)
  }
  const list: ExhibitionSelection[] = Array.from(counter.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
  return list
}

/**
 * Build search terms from events meta
 * meta example: { query: "کتاب" }
 */
async function getSearchTerms() {
  const rows = await prisma.event.findMany({
    where: { type: "search" },
    select: { meta: true },
  })
  const counter = new Map<string, number>()
  for (const r of rows) {
    const { query } = safeParse<{ query?: string }>(r.meta, {})
    const key = query?.trim() || "?"
    counter.set(key, (counter.get(key) ?? 0) + 1)
  }
  const list: SearchItem[] = Array.from(counter.entries())
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
  return list
}

/**
 * Sales by exhibition from OrderItem (real sales, not just selections)
 * - Revenue = sum(unitPrice * quantity)
 * - Orders approximated by item lines count (can be enhanced with unique orderId aggregation)
 */
async function getExhibitionSales() {
  const items = await prisma.orderItem.findMany({
    select: { exhibition: true, unitPrice: true, quantity: true, orderId: true },
  })
  const map = new Map<string, ExhibitionSale>()
  for (const it of items) {
    const key = it.exhibition?.trim() || "نامشخص"
    const prev = map.get(key) || { exhibition: key, orders: 0, quantity: 0, revenue: 0 }
    const revenue = clampNonNegative((it.unitPrice || 0) * (it.quantity || 0))
    map.set(key, {
      exhibition: key,
      orders: prev.orders + 1, // item-level count; for unique orders per exhibition, extra join logic is needed
      quantity: prev.quantity + (it.quantity || 0),
      revenue: prev.revenue + revenue,
    })
  }
  const list = Array.from(map.values()).sort((a, b) => b.revenue - a.revenue)
  return list
}

/**
 * Compute funnel and basic counters
 */
async function getFunnel(now = new Date()) {
  const sDay = startOfDay(now)
  const sWeek = startOfWeek(now)
  const sMonth = startOfMonth(now)

  const [todayViews, weekViews, monthViews] = await Promise.all([
    prisma.event.count({ where: { type: "pageview", createdAt: { gte: sDay } } }),
    prisma.event.count({ where: { type: "pageview", createdAt: { gte: sWeek } } }),
    prisma.event.count({ where: { type: "pageview", createdAt: { gte: sMonth } } }),
  ])

  const [selections, previews, checkoutClicks, whatsappClicks] = await Promise.all([
    prisma.event.count({ where: { type: "select_exhibition" } }),
    prisma.event.count({ where: { type: "preview_open" } }),
    prisma.event.count({ where: { type: "checkout_click" } }),
    prisma.event.count({ where: { type: "whatsapp_click" } }),
  ])

  const ordersCount = await prisma.order.count()

  const funnel: Funnel = {
    pageviews: todayViews,
    selections,
    previews,
    checkoutClicks,
    orders: ordersCount,
    whatsappClicks,
  }

  return { todayViews, weekViews, monthViews, funnel, ordersCount }
}

/**
 * Behavior metrics from events.meta:
 * - page_leave: meta.duration (ms)
 * - preview_time: meta.duration (ms), meta.scrollDepth (0-100)
 */
async function getBehaviorMetrics() {
  const [leavesRaw, previewTimeRaw] = await Promise.all([
    prisma.event.findMany({ where: { type: "page_leave" }, select: { meta: true } }),
    prisma.event.findMany({ where: { type: "preview_time" }, select: { meta: true } }),
  ])

  const leaveDurations: number[] = []
  for (const e of leavesRaw) {
    const { duration } = safeParse<{ duration?: number }>(e.meta, {})
    if (Number.isFinite(duration)) leaveDurations.push(duration!)
  }

  const previewDurations: number[] = []
  const previewScrolls: number[] = []
  for (const e of previewTimeRaw) {
    const { duration, scrollDepth } = safeParse<{
      duration?: number
      scrollDepth?: number
    }>(e.meta, {})
    if (Number.isFinite(duration)) previewDurations.push(duration!)
    if (Number.isFinite(scrollDepth)) previewScrolls.push(scrollDepth!)
  }

  return {
    avgPageDuration: avg(leaveDurations),
    previewAvgTime: avg(previewDurations),
    previewAvgScroll: avg(previewScrolls),
  }
}

/**
 * Time series: views + revenue for chosen range
 * Generates daily points (inclusive of end, starting from start)
 */
async function getDailySeries(range: RangePreset, now = new Date()): Promise<DailyPoint[]> {
  const { start, end, length } = chooseRange(range, now)
  const points: DailyPoint[] = []

  for (let i = 0; i < length; i++) {
    const day = addDays(start, i)
    const s = startOfDay(day)
    const e = addDays(s, 1)

    const [views, dayOrders] = await Promise.all([
      prisma.event.count({ where: { type: "pageview", createdAt: { gte: s, lt: e } } }),
      prisma.order.findMany({ where: { createdAt: { gte: s, lt: e } }, select: { total: true } }),
    ])

    const revenue = clampNonNegative(dayOrders.reduce((sum, o) => sum + (o.total || 0), 0))
    points.push({
      date: toFaDate(s),
      iso: s.toISOString(),
      views,
      revenue,
    })
  }
  return points
}

/**
 * Sales aggregates
 */
async function getSalesAggregates() {
  const agg = await prisma.order.aggregate({ _sum: { total: true }, _avg: { total: true }, _count: { _all: true } })
  const orders = clampNonNegative(agg._count._all || 0)
  const totalRevenue = clampNonNegative(agg._sum.total || 0)
  const avgOrderValue = clampNonNegative(agg._avg.total || 0)
  return { orders, totalRevenue, avgOrderValue }
}

/** ---- Handler ---- */
export async function GET(req: Request) {
  try {
    // parse query params (range preset: day|week|month|90d)
    const url = new URL(req.url)
    const presetParam = (url.searchParams.get("range") || "").toLowerCase() as RangePreset
    const range: RangePreset = ["day", "week", "month", "90d"].includes(presetParam) ? presetParam : "week"

    const now = new Date()

    // parallel high-level aggregates
    const [
      selections,
      searches,
      exhibitionSales,
      funnelData,
      behavior,
      daily,
      salesAgg,
    ] = await Promise.all([
      getExhibitionSelections(),
      getSearchTerms(),
      getExhibitionSales(),
      getFunnel(now),
      getBehaviorMetrics(),
      getDailySeries(range, now),
      getSalesAggregates(),
    ])

    const { todayViews, weekViews, monthViews, funnel, ordersCount } = funnelData
    const { orders, totalRevenue, avgOrderValue } = salesAgg

    // robust conversion rate: today orders / today pageviews
    // Note: if you prefer overall conversion, change numerator/denominator accordingly.
    const conversionRate = todayViews > 0 ? (ordersCount / todayViews) * 100 : 0

    const payload: StatsResponse = {
      // traffic
      today: todayViews,
      week: weekViews,
      month: monthViews,
      // interactions
      previews: funnel.previews,
      checkoutClicks: funnel.checkoutClicks,
      whatsappClicks: funnel.whatsappClicks,
      exhibitions: selections,
      searches,
      // sales
      orders,
      totalRevenue,
      avgOrderValue,
      conversionRate,
      exhibitionSales,
      // time series
      daily,
      // behavior
      avgPageDuration: behavior.avgPageDuration,
      previewAvgTime: behavior.previewAvgTime,
      previewAvgScroll: behavior.previewAvgScroll,
      // funnel
      funnel,
    }

    // Optional: caching headers (tune to your needs)
    // Here we avoid caching in dev; for prod, you can set short revalidation windows.
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (e) {
    console.error("❌ /api/stats error:", e)
    return NextResponse.json({ error: "خطا در دریافت آمار" }, { status: 500 })
  }
}
