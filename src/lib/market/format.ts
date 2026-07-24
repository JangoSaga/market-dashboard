/** Formats a USDT price with decimals scaled to the price magnitude. */
export function formatPrice(price: number): string {
  if (!Number.isFinite(price)) return "—";
  const decimals =
    price >= 1000 ? 2 : price >= 1 ? 2 : price >= 0.01 ? 4 : 6;
  return price.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Formats a signed percentage, e.g. "+1.23%" / "-0.45%". */
export function formatPercent(pct: number): string {
  if (!Number.isFinite(pct)) return "—";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}
