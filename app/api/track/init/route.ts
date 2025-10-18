import { NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { sessionId, device } = body

    await prisma.event.create({
      data: {
        type: "session_start",
        sessionId: sessionId || crypto.randomUUID(),
        device,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Track init error:", e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
