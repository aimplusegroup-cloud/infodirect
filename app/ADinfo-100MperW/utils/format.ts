export function formatNum(val: any) {
  const num = Number(val)
  return isNaN(num) ? "—" : num.toLocaleString("fa-IR")
}
