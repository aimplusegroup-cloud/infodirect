import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"

function getDateWindow(range: "day" | "week" | "month") {
  const now = new Date()
  const from = new Date(now)
  if (range === "day") from.setDate(now.getDate() - 1)
  else if (range === "week") from.setDate(now.getDate() - 7)
  else if (range === "month") from.setMonth(now.getMonth() - 1)
  return { from, to: now }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const range = (searchParams.get("range") || "day") as "day" | "week" | "month"
    const { from, to } = getDateWindow(range)

    // KPI اصلی
    const visitors = await prisma.event.count({
      where: { type: "page_view", createdAt: { gte: from, lte: to } },
    })
    const searchesCount = await prisma.event.count({
      where: { type: "search", createdAt: { gte: from, lte: to } },
    })
    const samplesCount = await prisma.event.count({
      where: { type: "sample_open", createdAt: { gte: from, lte: to } },
    })
    const slidesCount = await prisma.event.count({
      where: { type: "slide_view", createdAt: { gte: from, lte: to } },
    })

    const orders = await prisma.order.count({
      where: { createdAt: { gte: from, lte: to }, status: "success" },
    })
    const revenueAgg = await prisma.order.aggregate({
      where: { createdAt: { gte: from, lte: to }, status: "success" },
      _sum: { total: true },
    })
    const revenue = revenueAgg._sum.total || 0
    const conversionRate = visitors ? orders / visitors : 0

    // KPI تکمیلی
    const aov = orders > 0 ? revenue / orders : 0
    const arpu = visitors > 0 ? revenue / visitors : 0

    // رفتار کاربران (همه‌ی eventها)
    const behaviorGrouped = await prisma.event.groupBy({
      by: ["type"],
      where: { createdAt: { gte: from, lte: to } },
      _count: { _all: true },
    })
    const behavior = behaviorGrouped.map(b => ({
      action: b.type,
      count: b._count._all,
    }))

    // روند روزانه (بازدید + درآمد)
    const events = await prisma.event.findMany({
      where: { createdAt: { gte: from, lte: to }, type: "page_view" },
      select: { createdAt: true },
    })
    const orderList = await prisma.order.findMany({
      where: { createdAt: { gte: from, lte: to }, status: "success" },
      select: { createdAt: true, total: true },
    })
    const bucket: Record<string, { views: number; revenue: number }> = {}
    for (const e of events) {
      const key = e.createdAt.toISOString().slice(0, 10)
      bucket[key] = bucket[key] || { views: 0, revenue: 0 }
      bucket[key].views++
    }
    for (const o of orderList) {
      const key = o.createdAt.toISOString().slice(0, 10)
      bucket[key] = bucket[key] || { views: 0, revenue: 0 }
      bucket[key].revenue += o.total
    }
    const daily = Object.entries(bucket).map(([date, v]) => ({
      date,
      views: v.views,
      revenue: v.revenue,
    }))

    // فروش بر اساس نمایشگاه
    const salesGrouped = await prisma.orderItem.groupBy({
      by: ["exhibition"],
      where: { order: { createdAt: { gte: from, lte: to }, status: "success" } },
      _sum: { unitPrice: true, quantity: true },
    })
    const sales = salesGrouped.map(s => ({
      name: s.exhibition,
      sales: s._sum.quantity || 0,
      amount: (s._sum.unitPrice || 0) * (s._sum.quantity || 0),
    }))

    // منابع ترافیک
    const trafficGrouped = await prisma.event.groupBy({
      by: ["referrer"],
      where: { createdAt: { gte: from, lte: to }, type: "page_view" },
      _count: { _all: true },
    })
    const traffic = trafficGrouped.map(t => ({
      source: t.referrer || "مستقیم",
      visitors: t._count._all,
    }))

    // مسیرهای کاربر
    const journeysGrouped = await prisma.event.groupBy({
      by: ["url"],
      where: { createdAt: { gte: from, lte: to }, type: "page_view" },
      _count: { _all: true },
    })
    const journeys = journeysGrouped.map(j => ({
      path: j.url || "نامشخص",
      count: j._count._all,
    }))

    // جستجوها
    const searchesGrouped = await prisma.event.groupBy({
      by: ["meta"],
      where: { createdAt: { gte: from, lte: to }, type: "search" },
      _count: { _all: true },
    })
    const searches = searchesGrouped.map(s => ({
      query: s.meta || "نامشخص",
      count: s._count._all,
    }))

    return NextResponse.json({
      kpis: { 
        visitors, 
        searches: searchesCount, 
        samples: samplesCount, 
        slides: slidesCount,
        orders, 
        revenue, 
        conversionRate, 
        aov, 
        arpu 
      },
      daily,
      sales,
      behavior,
      traffic,
      journeys,
      searches,
      range,
    })
  } catch (err) {
    console.error("Dashboard API error:", err)
    return NextResponse.json({
      kpis: { visitors: 0, searches: 0, samples: 0, slides: 0, orders: 0, revenue: 0, conversionRate: 0, aov: 0, arpu: 0 },
      daily: [],
      sales: [],
      behavior: [],
      traffic: [],
      journeys: [],
      searches: [],
      range: "day",
      error: "dashboard_failed",
    })
  }
}
