"use client"
import { useEffect } from "react"

export default function Tracker() {
  useEffect(() => {
    fetch("/api/track/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "page_view",
        url: window.location.pathname,
        referrer: document.referrer,
        device: navigator.userAgent,
      }),
    })
  }, [])

  return null
}
