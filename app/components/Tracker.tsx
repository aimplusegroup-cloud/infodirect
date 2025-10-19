"use client"

import { useEffect } from "react"
import { trackEvent, trackPurchase } from "../../lib/trackEvent"

export default function Tracker() {
  // ثبت page_view در هر بار لود صفحه
  useEffect(() => {
    trackEvent("page_view", {
      url: window.location.pathname,
      referrer: document.referrer,
    })
  }, [])

  // نمونه: ثبت سرچ (می‌تونی اینو به SearchTracker یا فرم جستجو وصل کنی)
  const handleSearch = (query: string) => {
    trackEvent("search", { query })
  }

  // نمونه: ثبت خرید تستی (می‌تونی اینو به checkout واقعی وصل کنی)
  const handleTestPurchase = () => {
    trackPurchase({
      sessionId: crypto.randomUUID(),
      total: 120000,
      currency: "IRR",
      items: [
        { exhibition: "Tehran Expo", year: 2025, unitPrice: 60000, quantity: 2 },
      ],
    })
  }

  return (
    <>
      {/* این دکمه‌ها فقط برای تست هستند و می‌تونی hidden بذاری */}
      <button
        onClick={() => handleSearch("نمونه جستجو")}
        className="hidden"
      >
        Test Search
      </button>
      <button
        onClick={handleTestPurchase}
        className="hidden"
      >
        Test Purchase
      </button>
    </>
  )
}
