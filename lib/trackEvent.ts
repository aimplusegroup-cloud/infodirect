// lib/trackEvent.ts

type EventMeta = Record<string, unknown>

export function trackEvent(type: string, meta?: EventMeta): Promise<void> {
  return fetch("/api/track/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      url: window.location.pathname,
      meta,
      referrer: document.referrer,
      device: navigator.userAgent,
    }),
  }).then(() => undefined)
}

// اگر لازم داری خرید رو هم ثبت کنی
export function trackPurchase(order: {
  sessionId: string
  total: number
  currency?: string
  items: { exhibition: string; year: number; unitPrice: number; quantity: number }[]
}): Promise<void> {
  return fetch("/api/track/purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...order,
      currency: order.currency || "IRR",
      status: "success",
    }),
  }).then(() => undefined)
}
