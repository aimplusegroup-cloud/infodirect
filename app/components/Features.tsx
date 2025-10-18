import { motion } from "framer-motion"

export default function Features({ setStage }) {
  const items = [
    { icon: "💼", title: "فرصت‌های شغلی پنهان", desc: "جویای کار؟! بله،این داده‌ها پلی به سوی فرصت ها و کسب و کارهایی است که به تخصص شما نیاز دارند" },
    { icon: "🚀", title: "رشد سریع کسب‌وکار", desc: "کسب‌وکارهای کوچک می‌توانند چندین پله سریع‌تر رشد کنند" },
    { icon: "🤝", title: "شبکه‌سازی هوشمند", desc: "ارتباط با تأمین‌کنندگان، تولیدکنندگان و توزیع‌کنندگان صنف خود بدون نیاز به حضور در نمایشگاه" },
    { icon: "⏳", title: "صرفه‌جویی در زمان", desc: "بدون سفر و هزینه‌های جانبی، مستقیم به لیست کامل کسب‌وکارهای فعال دسترسی دارید" },
    { icon: "📊", title: "شناخت رقبا و بازار", desc: "با دیدن نام‌ها و حوزه‌های فعالیت، جایگاه خود را در بازار بهتر می‌شناسید" },
    { icon: "🏢", title: "یافتن مشتریان سازمانی", desc: "اگر مشتریان شما سازمان‌ها هستند، این فایل همان لیست طلایی است" },
    { icon: "🔗", title: "شریک‌های تجاری جدید", desc: "برای توسعه همکاری‌های سازمانی کافیست به داده‌ها نگاه کنید" },
    { icon: "✨", title: "آشنایی با نوآوری‌ها", desc: "با تازه‌ترین محصولات و برندها در صنف خود آشنا شوید" },
    { icon: "🏆", title: "مزیت رقابتی پایدار", desc: "اطلاعاتی که دیگران ندارند، شما را یک قدم جلوتر نگه می‌دارد" },
  ]

  return (
    <div className="text-center max-w-5xl mx-auto px-4">
      {/* تیتر */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-3 text-2xl md:text-3xl font-bold mb-4
                   bg-clip-text text-transparent 
                   bg-gradient-to-r from-black to-cyan-500 
                   dark:from-white dark:to-cyan-400"
      >
        چرا این فایل ها و اطلاعات می‌تواند مسیر شما را تغییر دهد؟
      </motion.h2>

      {/* کارت‌ها */}
      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
            // 👇 در موبایل کارت آخر حذف میشه تا خیلی شلوغ نشه
            className={`p-2 md:p-3 border rounded-md hover:shadow-md transition 
                       bg-white dark:bg-gray-800 
                       border-gray-200 dark:border-gray-700 
                       flex flex-col items-center text-center
                       ${i === items.length - 1 ? "hidden sm:flex" : ""}`}
          >
            <div className="text-base md:text-lg mb-1">{item.icon}</div>
            <h3 className="text-xs md:text-sm font-semibold text-cyan-600 dark:text-cyan-400">
              {item.title}
            </h3>
            <p className="mt-1 text-gray-700 dark:text-white text-[11px] md:text-xs leading-snug max-w-[160px] md:max-w-[200px]">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="mt-3 mb-8 flex justify-center"
      >
        <button
          onClick={() => setStage("pricing")}
          className="px-4 py-2 sm:px-6 sm:py-3 rounded-md text-white 
                     text-sm sm:text-base bg-cyan-500 
                     hover:bg-cyan-600 transition shadow-md"
        >
          مشاهده فرصت ها
        </button>
      </motion.div>
    </div>
  )
}
