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

/**
 * Formats a USDT money amount as USD. Binance prices are USDT-denominated
 * (~1 USD), so the paper-trading wallet is tracked in the same unit.
 */
export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Formats a signed money amount, e.g. "+$12.30" / "-$4.50". */
export function formatSignedUsd(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatUsd(Math.abs(value))}`;
}
