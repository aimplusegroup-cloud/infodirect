export function formatNum(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return "—"

  const num = typeof val === "number" ? val : Number(val)
  return isNaN(num) ? "—" : num.toLocaleString("fa-IR")
}
