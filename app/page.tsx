"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSwipeable } from "react-swipeable"
import Image from "next/image"

import ScenesNetwork from "./components/ScenesNetwork"
import Features from "./components/Features"
import Pricing from "./components/Pricing"
import Footer from "./components/Footer"
import ThemeToggle from "./components/ThemeToggle"

type Stage = "hero" | "features" | "pricing" | "footer"
const stages: Stage[] = ["hero", "features", "pricing", "footer"]

export default function Home() {
  const [stage, setStage] = useState<Stage>("hero")
  const currentIndex = stages.indexOf(stage)

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < stages.length - 1) setStage(stages[currentIndex + 1])
    },
    onSwipedRight: () => {
      if (currentIndex > 0) setStage(stages[currentIndex - 1])
    },
    trackTouch: true,
    trackMouse: false,
    delta: 50, // 👈 حداقل فاصله برای تشخیص سوایپ (حساسیت کمتر)
    preventScrollOnSwipe: true,
  })

  return (
    <main
      {...handlers}
      className="relative w-full h-screen bg-neutral-50 dark:bg-gray-900 overflow-hidden touch-pan-y transition-colors duration-500"
    >
      {/* پس‌زمینه شبکه */}
      <ScenesNetwork />

      {/* هدر */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={64}
          height={64}
          priority
          className="dark:invert"
        />
        <ThemeToggle />
      </header>

      {/* محتوای اصلی */}
      <AnimatePresence mode="wait">
        {stage === "hero" && (
          <motion.section
            key="hero"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-10 flex items-center justify-center px-6"
          >
            <div className="text-center max-w-3xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl md:text-6xl font-extrabold tracking-tight 
                           bg-clip-text text-transparent 
                           bg-gradient-to-r from-black to-cyan-500 
                           dark:from-white dark:to-cyan-400"
              >
                از نمایشگاه بین‌المللی تهران تا دفتر کارتان، فقط یک کلیک فاصله است
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-4 md:mt-6 text-base md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                بانک اطلاعاتی کامل کسب‌وکارهای حاضر در نمایشگاه را در قالب فایل اکسل دریافت کنید. 
                همه‌ی اطلاعات یک‌جا، قابل جستجو و فیلتر، آماده برای بازاریابی و توسعه همکاری‌های سازمانی.
              </motion.p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => setStage("features")}
                  className="px-6 py-3 rounded-lg bg-cyan-500 text-white font-semibold shadow-md hover:bg-cyan-600 transition"
                >
                  اطلاعات بیشتر
                </button>

                <button
                  onClick={() => setStage("pricing")}
                  className="px-6 py-3 rounded-lg bg-cyan-500 text-white font-semibold shadow-md hover:bg-cyan-600 transition"
                >
                  مشاهده نمایشگاه ‌ها
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {stage === "features" && (
          <motion.section
            key="features"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-10 flex items-center justify-center px-6"
          >
            <Features setStage={setStage} />
          </motion.section>
        )}

        {stage === "pricing" && (
          <motion.section
            key="pricing"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-10 flex items-center justify-center px-6"
          >
            <Pricing />
          </motion.section>
        )}

        {stage === "footer" && (
          <motion.section
            key="footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-10 flex items-center justify-center px-6"
          >
            <Footer />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Indicator پایین صفحه */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {stages.map((s) => (
          <button
            key={s}
            onClick={() => setStage(s)}
            aria-label={`go to ${s}`}
            className={`h-3 w-3 rounded-full transition-colors duration-300 ${
              stage === s
                ? "bg-cyan-500"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </main>
  )
}
