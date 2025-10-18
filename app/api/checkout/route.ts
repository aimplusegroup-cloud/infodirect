import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

type ExhibitionItem = { name: string; year: number; unitPrice: number }
type CheckoutBody = { items: ExhibitionItem[]; total: number; sessionId?: string }

// هندلر GET برای تست سریع
export async function GET() {
  return NextResponse.json({ ok: true, route: "checkout" })
}

// هندلر POST برای ثبت سفارش واقعی
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody
    const { items, total, sessionId } = body

    // ایجاد سفارش در دیتابیس
    const order = await prisma.order.create({
      data: {
        sessionId: sessionId || "anon",
        total,
        status: "success",
        items: {
          create: items.map(it => ({
            exhibition: it.name,
            year: it.year,
            unitPrice: it.unitPrice,
            quantity: 1,
          })),
        },
      },
      include: { items: true },
    })

    // ثبت رویداد purchase
    await prisma.event.create({
      data: {
        type: "purchase",
        sessionId: sessionId || "anon",
        meta: JSON.stringify({ total, items }),
      },
    })

    return NextResponse.json({ ok: true, orderId: order.id })
  } catch (e) {
    return NextResponse.json({ ok: false, error: "checkout_failed" }, { status: 500 })
  }
}
