import type { NextRequest } from "next/server";

// هندلر GET برای تست سریع در مرورگر
export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, message: "Contact GET working" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// هندلر POST برای درخواست واقعی
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return new Response(
      JSON.stringify({
        ok: true,
        message: "Contact POST working",
        data: body,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (_) {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid request" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
