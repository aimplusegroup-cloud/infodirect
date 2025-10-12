/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["BNazanin", "serif"], // 👈 فقط فونت اضافه شده
      },
    },
  },
  plugins: [], // 👈 خالی، چون پلاگین نصب نکردی
}
