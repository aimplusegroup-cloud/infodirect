export function trackEvent(type: string, meta?: any) {
  fetch("/api/track/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      url: window.location.pathname,
      meta,
      referrer: document.referrer,
      device: navigator.userAgent,
    }),
  })
}

export function trackPurchase(order: {
  sessionId: string
  total: number
  currency?: string
  items: { exhibition: string; year: number; unitPrice: number; quantity: number }[]
}) {
  fetch("/api/track/purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...order,
      currency: order.currency || "IRR",
      status: "success",
    }),
  })
}
