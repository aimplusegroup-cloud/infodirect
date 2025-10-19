"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null)

  // بررسی حالت اولیه از localStorage یا سیستم
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme")
      if (saved) {
        const isDark = saved === "dark"
        setDark(isDark)
        document.documentElement.classList.toggle("dark", isDark)
      } else {
        // پیش‌فرض روشن
        setDark(false)
        document.documentElement.classList.remove("dark")
      }
    } catch {
      setDark(false)
    }
  }, [])

  const toggleTheme = () => {
    if (dark === null) return
    const newDark = !dark
    setDark(newDark)
    document.documentElement.classList.toggle("dark", newDark)
    localStorage.setItem("theme", newDark ? "dark" : "light")
  }

  if (dark === null) return null

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="fixed top-4 right-4 z-50 p-0 m-0 bg-transparent border-none outline-none appearance-none"
    >
      <AnimatePresence mode="wait" initial={false}>
        {dark ? (
          // ☀️ آیکون خورشید (در حالت تاریک → سفید)
          <motion.svg
            key="sun"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25M12 18.75V21M4.219 4.219l1.591 1.591M18.19 18.19l1.591 1.591M3 12h2.25M18.75 12H21M4.219 19.781l1.591-1.591M18.19 5.81l1.591-1.591M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z"
            />
          </motion.svg>
        ) : (
          // 🌙 آیکون ماه
          <motion.svg
            key="moon"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-800 dark:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  )
}
