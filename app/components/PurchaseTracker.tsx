"use client"

export default function PurchaseTracker() {
  const handlePurchase = async () => {
    await fetch("/api/track/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "demo-session",
        total: 500000,
        currency: "IRR",
        status: "success",
        items: [
          { exhibition: "Tehran Expo", year: 2025, unitPrice: 250000, quantity: 2 },
        ],
      }),
    })
    alert("سفارش تستی ثبت شد ✅")
  }

  return (
    <button
      onClick={handlePurchase}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      ثبت خرید تستی
    </button>
  )
}
