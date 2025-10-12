"use client"
import { useSwipeable } from "react-swipeable"
import { useRouter } from "next/navigation"

export default function SwipeWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handlers = useSwipeable({
    onSwipedLeft: () => router.push("/next-page"), // سوایپ به چپ → صفحه بعد
    onSwipedRight: () => router.back(),            // سوایپ به راست → صفحه قبل
    delta: 50, // 👈 حداقل فاصله (پیکسل) برای تشخیص سوایپ
    preventScrollOnSwipe: true, // جلوگیری از اسکرول ناخواسته
    trackTouch: true,
    trackMouse: false,
  })

  return (
    <div {...handlers} className="w-full h-full">
      {children}
    </div>
  )
}
