"use client"

import { useMemo, useState, useEffect } from "react"
import { exhibitions, Exhibition } from "../../data/exhibitions"
import { pricingImports } from "../../data/exhibitions/pricingImports"

type Row = {
  id: number
  company: string
  role: string
  address?: string
  phone: string
  email: string
  website: string
}

export default function Pricing() {
  const [selected, setSelected] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [sortBy, setSortBy] = useState<keyof Row | "id">("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [query, setQuery] = useState("")

  // ساخت sessionId برای ردیابی
  const sessionId =
    typeof window !== "undefined"
      ? (localStorage.getItem("sid") ||
          (() => {
            const sid = Math.random().toString(36).slice(2)
            localStorage.setItem("sid", sid)
            return sid
          })())
      : "server"

  // ثبت pageview
  useEffect(() => {
    if (typeof window === "undefined") return
    fetch("/api/track/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        url: window.location.pathname,
        referrer: document.referrer ? "referral" : "direct",
        device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
      }),
    })
  }, [])

  useEffect(() => {
    if (selected.length === 0) setShowPreview(false)
  }, [selected])

  const basePrice = (year: number) => (year === 1404 ? 290000 : 190000)

  const getExhibitionPrice = (ex: Exhibition) => {
    const rows = pricingImports[ex.name]?.length || 0
    if (rows > 0 && rows < 50) {
       return 99000
   }
    return basePrice(ex.year)
  }

  const getDiscount = (c: number) => (c >= 7 ? 0.32 : c >= 3 ? 0.18 : c === 2 ? 0.1 : 0)

  const toggleSelect = (ex: Exhibition) => {
    if (ex.type === "all") {
      const all = exhibitions.filter(e => !e.type && (!ex.year || e.year === ex.year)).map(e => e.name)
      const alreadyAll = all.every(n => selected.includes(n))
      setSelected(alreadyAll ? selected.filter(n => !all.includes(n)) : [...new Set([...selected, ...all])])
      return
    }
    const newSelected = selected.includes(ex.name)
      ? selected.filter(x => x !== ex.name)
      : [...selected, ex.name]
    setSelected(newSelected)

    // ثبت رویداد انتخاب
    fetch("/api/track/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        type: "select_exhibition",
        meta: { name: ex.name, year: ex.year },
      }),
    })
  }

  const selectedItems = selected.map(name => exhibitions.find(e => e?.name === name)).filter(Boolean) as Exhibition[]
  const count = selectedItems.length
  const discount = getDiscount(count)
  const gross = selectedItems.reduce((s, ex) => s + getExhibitionPrice(ex), 0)
  const finalPrice = Math.round(gross * (1 - discount))

  const selectedData = useMemo(() => {
    if (selected.length === 0) return []
    return selected.flatMap(name => pricingImports[name] || [])
  }, [selected])

  const handleSort = (col: keyof Row | "id") => {
    if (sortBy === col) setSortDir(prev => (prev === "asc" ? "desc" : "asc"))
    else {
      setSortBy(col)
      setSortDir("asc")
    }
  }
  const sortIndicator = (col: keyof Row | "id") =>
    sortBy === col ? (sortDir === "asc" ? " ▴" : " ▾") : ""

  const offerText =
    count >= 7
      ? "بسته تسلط بازار: ۳۲٪ تخفیف"
      : count >= 3
      ? "بسته حرفه‌ای: ۱۸٪ تخفیف"
      : count === 2
      ? "شروع هوشمند: ۱۰٪ تخفیف"
      : ""

  const filteredExhibitions = useMemo(() => {
    const q = query.trim().toLowerCase()
    return exhibitions.filter(e => e.name.toLowerCase().includes(q))
  }, [query])

  const handleWhatsAppOrder = () => {
    if (selectedItems.length === 0) return
    const orderText = [
      "🛒 سفارش جدید:",
      ...selectedItems.map((ex, i) => `${i + 1}. ${ex.name} (${ex.year})`),
      `جمع کل: ${finalPrice.toLocaleString("fa-IR")} تومان`,
    ].join("\n")
    const phoneNumber = "989919928609"
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderText)}`
    window.open(url, "_blank")
  }

  const handleCheckout = async () => {
    if (selectedItems.length === 0) return
    try {
      // ثبت add_to_cart فقط اینجا
      await fetch("/api/track/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          type: "add_to_cart",
          meta: { names: selected, total: finalPrice },
        }),
      })

      // ثبت checkout_start
      await fetch("/api/track/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          type: "checkout_start",
          meta: { count: selectedItems.length, total: finalPrice },
        }),
      })

      // ارسال سفارش به API
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          total: finalPrice,
          items: selectedItems.map(ex => ({
            name: ex.name,
            year: ex.year!,
            unitPrice: getExhibitionPrice(ex),
          })),
        }),
      })
      const data = await res.json()
      if (data?.ok) {
        alert("سفارش با موفقیت ثبت شد ✅")
      } else {
        alert("خطا در ایجاد تراکنش")
      }
    } catch (err) {
      console.error(err)
      alert("ارتباط با سرور برقرار نشد")
    }
  }

  return (
       <div className="max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-3 w-full overflow-hidden px-3 sm:px-0">
      {/* لیست نمایشگاه‌ها */}
      <div className="border rounded-lg bg-white dark:bg-gray-900 h-[140px] sm:h-[320px] overflow-y-auto divide-y text-right flex flex-col w-full min-w-0">
        <div className="sticky top-0 bg-white dark:bg-gray-900 h-9 p-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <span className="text-[12px] text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {filteredExhibitions.length} مورد
          </span>
          <input
            type="text"
            dir="rtl"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="جستجو..."
            className="w-full min-w-0 h-7 px-2 text-sm border rounded-md text-right bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />
        </div>
        <div className="flex-1">
          {filteredExhibitions.map((ex, i) => {
            const isSelected = selected.includes(ex.name)
            const isAllRow = ex.type === "all"
            return (
              <div
                key={i}
                onClick={() => toggleSelect(ex)}
                className={`px-2 py-1 cursor-pointer flex items-center justify-between
                  ${isSelected && !isAllRow ? "bg-cyan-100 dark:bg-cyan-900/40" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                <span
                  className={`flex-1 text-right text-xs sm:text-sm ${
                    isAllRow ? "font-semibold" : ""
                  } text-gray-700 dark:text-gray-200`}
                >
                  {ex.name}
                  {!isAllRow && ` (${ex.year})`}
                </span>
                {!isAllRow && isSelected && (
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold ml-2 text-xs sm:text-sm">
                    ✔
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* کارت قیمت + جدول */}
      <div className="border rounded-xl bg-white dark:bg-gray-900 shadow-sm mt-2 sm:mt-0 h-auto flex flex-col w-full min-w-0">
        <div className="p-2 text-center">
          {count > 0 ? (
            <>
              <p className="text-base sm:text-xl font-extrabold text-gray-900 dark:text-gray-100">
                {finalPrice.toLocaleString("fa-IR")} تومان
              </p>
              <div
                className="mt-0.5 flex justify-center items-center gap-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                dir="rtl"
              >
                <span dir="ltr">
                  {new Intl.NumberFormat("fa-IR").format(count)}
                </span>
                <span>نمایشگاه انتخاب شده</span>
              </div>
              {discount > 0 && (
                <p className="mt-0.5 text-xs sm:text-sm text-green-600 dark:text-green-400">
                  شامل {(discount * 100).toFixed(0)}٪ تخفیف
                </p>
              )}
              {!!offerText && (
                <p className="mt-0.5 text-xs sm:text-sm text-orange-500 dark:text-orange-400">
                  {offerText}
                </p>
              )}
              <button
                onClick={() => setShowPreview(v => !v)}
                className="mt-2 w-32 sm:w-36 px-2 py-1 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-gray-600 
                           text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {showPreview ? "بستن پیش‌نمایش" : "نمونه فایل"}
              </button>
            </>
          ) : (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              برای مشاهده قیمت، حداقل یک نمایشگاه انتخاب کنید
            </p>
          )}
        </div>

        {/* جدول داده‌ها */}
        <div className="px-2 pb-2 flex-1 flex flex-col min-w-0">
          <div className="border rounded bg-gray-100 dark:bg-gray-800 p-1 flex-1 min-w-0 
                          max-h-[160px] overflow-y-auto overflow-x-scroll">
            {showPreview ? (
              <div dir="rtl" className="min-w-[900px]">
                <table className="w-full table-auto text-gray-900 dark:text-gray-100 border-collapse 
                                  text-[9px] sm:text-xs text-right bg-gray-100 dark:bg-gray-800">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                      <th onClick={() => handleSort("id")} className="border px-1 py-0.5 text-center cursor-pointer select-none">
                        ردیف{sortIndicator("id")}
                      </th>
                      <th onClick={() => handleSort("company")} className="border px-1 py-0.5 text-center cursor-pointer select-none">
                        نام شرکت{sortIndicator("company")}
                      </th>
                      <th onClick={() => handleSort("role")} className="border px-1 py-0.5 text-center cursor-pointer select-none">
                        حوزه فعالیت{sortIndicator("role")}
                      </th>
                      <th onClick={() => handleSort("address")} className="border px-1 py-0.5 text-center cursor-pointer select-none">
                        آدرس{sortIndicator("address")}
                      </th>
                      <th onClick={() => handleSort("phone")} className="border px-1 py-0.5 text-center cursor-pointer select-none">
                        تلفن{sortIndicator("phone")}
                      </th>
                      <th onClick={() => handleSort("email")} className="border px-1 py-0.5 text-center cursor-pointer select-none">
                        ایمیل{sortIndicator("email")}
                      </th>
                      <th onClick={() => handleSort("website")} className="border px-1 py-0.5 text-center cursor-pointer select-none">
                        وب‌سایت{sortIndicator("website")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedData.map((row, index) => (
                      <tr key={`${row.company}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="border px-1 py-0.5 text-center">{index + 1}</td>
                        <td className="border px-1 py-0.5 text-center">
                          {index < 3 ? row.company : <span className="text-gray-400">🔒</span>}
                        </td>
                        <td className="border px-1 py-0.5 text-center">{row.role}</td>
                        <td className="border px-1 py-0.5 text-center">
                          {index < 3 ? (row.address || "—") : <span className="text-gray-400">🔒</span>}
                        </td>
                        <td className="border px-1 py-0.5 text-center">
                          {index < 3 ? row.phone : <span className="text-gray-400">🔒</span>}
                        </td>
                        <td className="border px-1 py-0.5 text-center truncate">
                          {index < 3 ? row.email : <span className="text-gray-400">🔒</span>}
                        </td>
                        <td className="border px-1 py-0.5 text-center truncate">
                          {index < 3 ? row.website : <span className="text-gray-400">🔒</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-1 text-center text-[9px] sm:text-xs text-gray-600 dark:text-gray-400">
                  📂 این فقط یک پیش‌نمایش است — فایل کامل پس از خرید ارائه می‌شود
                </p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[10px] sm:text-sm text-gray-500 dark:text-gray-400">
                برای مشاهده کیفیت داده‌ها، «نمونه فایل» را بزنید
              </div>
            )}
          </div>

          {/* دکمه‌ها */}
          <button
            onClick={() => alert("درگاه پرداخت فعلاً در دسترس نیست؛ لطفاً از طریق واتس‌اپ اقدام کنید، سفارش شما به‌صورت خودکار ثبت خواهد شد.")
  }
            className="mt-2 w-full px-3 py-1.5 rounded-md text-white text-xs sm:text-sm 
                                             bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 transition"
            disabled={count === 0}
          >
            خرید از طریق درگاه پرداخت
          </button>
          <button
            onClick={handleWhatsAppOrder}
            className="mt-1 w-full px-3 py-1.5 rounded-md text-white text-xs sm:text-sm 
                       bg-[#25D366] hover:bg-green-500 disabled:opacity-50 transition"
            disabled={count === 0}
          >
            سفارش سریع در واتس‌اپ
          </button>
        </div>
      </div>
    </div>
  )
}
