import { NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"

interface PurchaseItem {
  exhibition: string
  year: number
  unitPrice: number
  quantity?: number
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { sessionId, total, currency, status, items } = body as {
      sessionId: string
      total: number
      currency?: string
      status?: string
      items: PurchaseItem[]
    }

    const order = await prisma.order.create({
      data: {
        sessionId,
        total,
        currency: currency || "IRR",
        status: status || "success",
        items: {
          create: items.map((item: PurchaseItem) => ({
            exhibition: item.exhibition,
            year: item.year,
            unitPrice: item.unitPrice,
            quantity: item.quantity ?? 1,
          })),
        },
      },
      include: { items: true }, // آیتم‌ها رو هم برگردونیم
    })

    return NextResponse.json({ ok: true, order })
  } catch (e) {
    console.error("Track purchase error:", e)
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    )
  }
}
