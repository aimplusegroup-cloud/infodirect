"use client"
import { useState } from "react"

export default function SearchTracker() {
  const [query, setQuery] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return

    await fetch("/api/track/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "search",
        url: window.location.pathname,
        meta: query,
        device: navigator.userAgent,
      }),
    })

    setQuery("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="جستجو..."
        className="border rounded px-2 py-1"
      />
      <button type="submit" className="bg-sky-500 text-white px-3 py-1 rounded">
        جستجو
      </button>
    </form>
  )
}
