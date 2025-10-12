"use client"
import { motion } from "framer-motion"

export default function Footer() {
  const logos = [
    { src: "/logos/enamad.png", alt: "اینماد" },
    { src: "/logos/samandehi.png", alt: "ساماندهی" },
    { src: "/logos/zarinpal.svg", alt: "زرین‌پال" },
    { src: "/logos/basalam.svg", alt: "باسلام" },
    { src: "/logos/portal.svg", alt: "پرتال" },
    { src: "/logos/nextpay.png", alt: "نکست‌پی" },
    { src: "/logos/vandar.svg", alt: "وندار" },
    { src: "/logos/eseminar.svg", alt: "ایسمینار" },
    { src: "/logos/faradars.svg", alt: "فرادرس" },
  ]

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-10 flex flex-col gap-6 sm:gap-10">

        {/* لوگوهای اعتماد */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:flex md:flex-wrap justify-center gap-4 sm:gap-6"
        >
          {logos.map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              className="h-6 sm:h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition"
            />
          ))}
        </motion.div>

        {/* بخش اطلاعات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto w-full text-xs sm:text-sm leading-relaxed">

          {/* تماس با ما */}
          <div className="text-right" dir="rtl">
            <h3 className="text-sm sm:text-base font-semibold mb-2 text-gray-800 dark:text-white">
              تماس با ما
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              ایمیل: <span dir="ltr">info@infodirect.ir</span>
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              واتس اپ: 09919928609
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              آدرس: تهران، اتوبان لشگری،کارخانه نوآوری آزادی
            </p>
          </div>

          {/* درباره ما */}
          <div className="text-right" dir="rtl">
            <h3 className="text-sm sm:text-base font-semibold mb-2 text-gray-800 dark:text-white">
              درباره ما
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              ما در{" "}
              <span dir="ltr" className="font-semibold text-cyan-600 dark:text-cyan-400">
                InfoDirect
              </span>{" "}
              باور داریم که قدرت واقعی هر کسب‌وکار در <strong>شبکه ارتباطی</strong> آن نهفته است.  
              هدف ما ساده است: فراهم کردن بستری که تصمیم‌ها با اطمینان بیشتری گرفته شوند  
              و شبکه ارتباطی شما به سرمایه‌ای پایدار برای آینده تبدیل شود.
            </p>
          </div>
        </div>

        {/* کپی‌رایت */}
        <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 text-center">
          © {new Date().getFullYear()} InfoDirect – همه حقوق محفوظ است
        </div>
      </div>
    </footer>
  )
}
