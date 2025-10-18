// data/index.ts

// ایمپورت همه نمایشگاه‌ها
import { expo1 } from "./exhibitions/expo1"
import { expo2 } from "./exhibitions/expo2"
import { expo3 } from "./exhibitions/expo3"
// ... به همین شکل برای بقیه

// خروجی یک آرایه‌ی واحد از همه داده‌ها
export const exhibitionsData = [
  ...expo1,
  ...expo2,
  ...expo3,
  // ...
]
