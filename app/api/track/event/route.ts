import { NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, url, referrer, device, sessionId, meta } = body

    await prisma.event.create({
      data: {
        type,
        url,
        referrer,
        device,
        sessionId: sessionId || crypto.randomUUID(),
        // چون meta در schema.prisma از نوع String? هست
        meta: meta ? JSON.stringify(meta) : null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Track event error:", e)
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    )
  }
}
