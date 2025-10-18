"use client"

import { useState } from "react"

export default function ContactForm() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      })
      const data = await res.json()
      setResponse(JSON.stringify(data))
    } catch {
      // نیازی به err نیست چون استفاده نمی‌شه
      setResponse("خطا در ارسال درخواست")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="نام شما"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded p-2"
        required
      />
      <textarea
        placeholder="پیام شما"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border rounded p-2"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition"
      >
        ارسال
      </button>

      {response && (
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm mt-4">
          {response}
        </pre>
      )}
    </form>
  )
}
