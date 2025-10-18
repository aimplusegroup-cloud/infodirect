import { NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { sessionId, total, currency, status, items } = body

    const order = await prisma.order.create({
      data: {
        sessionId,
        total,
        currency: currency || "IRR",
        status: status || "success",
        items: {
          create: items.map((item: any) => ({
            exhibition: item.exhibition,
            year: item.year,
            unitPrice: item.unitPrice,
            quantity: item.quantity || 1,
          })),
        },
      },
    })

    return NextResponse.json({ ok: true, order })
  } catch (e) {
    console.error("Track purchase error:", e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
