"use client"

import { useMemo, useState, useEffect } from "react"
import { exhibitions, Exhibition } from "./exhibitions"

type Row = {
  id: number
  company: string
  role: string
  address: string
  phone: string
  email: string
  website: string
}

export default function Pricing() {
  const previewData: Row[] = [
    { id: 1, company: "InfoDirect", role: "پایگاه داده بازاریابی", address: "تهران، خیابان نمونه ۱", phone: "021-123456", email: "info@example.com", website: "example.com" },
    { id: 2, company: "اینفودایرکت", role: "تامین کننده سرنخ های بازاریابی و فروش", address: "اصفهان، میدان نمونه ۲", phone: "031-654321", email: "contact@example.com", website: "example.org" },
    { id: 3, company: "اینفو دایرکت", role: "فعال در حوزه جمع آوری دیتاهای بازاریابی", address: "مشهد، بلوار نمونه ۳", phone: "051-987654", email: "support@example.net", website: "example.net" },
  ]

  const [selected, setSelected] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [sortBy, setSortBy] = useState<keyof Row | "id">("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (selected.length === 0) setShowPreview(false)
  }, [selected])

  const basePrice = (year: number) => (year === 1404 ? 490000 : 390000)
  const getDiscount = (c: number) => (c >= 7 ? 0.32 : c >= 3 ? 0.18 : c === 2 ? 0.1 : 0)

  const toggleSelect = (ex: Exhibition) => {
    if (ex.type === "all") {
      const all = exhibitions.filter(e => !e.type && (!ex.year || e.year === ex.year)).map(e => e.name)
      const alreadyAll = all.every(n => selected.includes(n))
      setSelected(alreadyAll ? selected.filter(n => !all.includes(n)) : [...new Set([...selected, ...all])])
      return
    }
    setSelected(prev => (prev.includes(ex.name) ? prev.filter(x => x !== ex.name) : [...prev, ex.name]))
  }

  const selectedItems = selected.map(name => exhibitions.find(e => e?.name === name)).filter(Boolean) as Exhibition[]
  const count = selectedItems.length
  const discount = getDiscount(count)
  const gross = selectedItems.reduce((s, ex) => s + basePrice(ex.year), 0)
  const finalPrice = Math.round(gross * (1 - discount))

  const sortedData = useMemo(() => {
    const cp = [...previewData]
    cp.sort((a, b) => {
      const av = String(a[sortBy] ?? "")
      const bv = String(b[sortBy] ?? "")
      return sortDir === "asc" ? av.localeCompare(bv, "fa", { numeric: true }) : bv.localeCompare(av, "fa", { numeric: true })
    })
    return cp
  }, [sortBy, sortDir])

  const handleSort = (col: keyof Row | "id") => {
    if (sortBy === col) setSortDir(prev => (prev === "asc" ? "desc" : "asc"))
    else {
      setSortBy(col)
      setSortDir("asc")
    }
  }
  const sortIndicator = (col: keyof Row | "id") => (sortBy === col ? (sortDir === "asc" ? " ▴" : " ▾") : "")

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
    if (!q) return exhibitions
    return exhibitions.filter(e => e.name.toLowerCase().includes(q))
  }, [query])

  const handleWhatsAppOrder = () => {
    if (selectedItems.length === 0) return
    const orderText = [
      "🛒 سفارش جدید:",
      ...selectedItems.map((ex, i) => `${i + 1}. ${ex.name} (${ex.year})`),
      `جمع کل: ${finalPrice.toLocaleString("fa-IR")} تومان`
    ].join("\n")
    const phoneNumber = "989919928609"
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderText)}`
    window.open(url, "_blank")
  }

  const handleCheckout = async () => {
    if (selectedItems.length === 0) return
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: selectedItems,
          total: finalPrice,
        }),
      })
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
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
                <span className={`flex-1 text-right text-xs sm:text-sm ${isAllRow ? "font-semibold" : ""} text-gray-700 dark:text-gray-200`}>
                  {ex.name}{!isAllRow && ` (${ex.year})`}
                </span>
                {!isAllRow && isSelected && <span className="text-cyan-600 dark:text-cyan-400 font-bold ml-2 text-xs sm:text-sm">✔</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* کارت قیمت + پیش‌نمایش */}
      <div className="border rounded-xl bg-white dark:bg-gray-900 shadow-sm mt-2 sm:mt-0 h-auto flex flex-col w-full min-w-0">
        <div className="p-2 text-center">
          {count > 0 ? (
            <>
              <p className="text-base sm:text-xl font-extrabold text-gray-900 dark:text-gray-100">
                {finalPrice.toLocaleString("fa-IR")} تومان
              </p>
                            {discount > 0 && (
                <p className="mt-0.5 text-xs sm:text-sm text-green-600 dark:text-green-400">
                  شامل {(discount * 100).toFixed(0)}٪ تخفیف
                </p>
              )}
              {!!offerText && (
                <p className="mt-0.5 text-xs sm:text-sm text-orange-500 dark:text-orange-400">{offerText}</p>
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

        {/* پیش‌نمایش جدول */}
        <div className="px-2 pb-2 flex-1 flex flex-col min-w-0">
          <div className="border rounded bg-gray-100 dark:bg-gray-800 p-1 flex-1 min-w-0 max-h-[160px] overflow-y-auto">
            {showPreview ? (
              <div dir="rtl">
                <table className="w-full table-auto text-gray-900 dark:text-gray-100 border-collapse text-[9px] sm:text-xs text-right bg-gray-100 dark:bg-gray-800">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                      <th onClick={() => handleSort("id")} className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center cursor-pointer select-none">
                        ردیف{sortIndicator("id")}
                      </th>
                      <th onClick={() => handleSort("company")} className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center cursor-pointer select-none">
                        نام شرکت{sortIndicator("company")}
                      </th>
                      <th onClick={() => handleSort("role")} className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center cursor-pointer select-none">
                        حوزه فعالیت{sortIndicator("role")}
                      </th>
                      <th onClick={() => handleSort("address")} className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center cursor-pointer select-none">
                        آدرس{sortIndicator("address")}
                      </th>
                      <th onClick={() => handleSort("phone")} className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center cursor-pointer select-none">
                        تلفن{sortIndicator("phone")}
                      </th>
                      <th onClick={() => handleSort("email")} className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center cursor-pointer select-none w-[110px] sm:w-[160px]">
                        ایمیل{sortIndicator("email")}
                      </th>
                      <th onClick={() => handleSort("website")} className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center cursor-pointer select-none w-[90px] sm:w-[140px]">
                        وب‌سایت{sortIndicator("website")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.slice(0, 3).map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">{row.id}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">{row.company}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">{row.role}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">{row.address}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center">{row.phone}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center truncate">{row.email}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-center truncate">{row.website}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-1 text-center text-[9px] sm:text-xs text-gray-600 dark:text-gray-400">
                  📂 این فقط یک پیش‌نمایش نمایشی است — فایل اصلی پس از خرید ارائه می‌شود
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
            onClick={handleCheckout}
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
