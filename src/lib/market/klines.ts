export type Candle = {
  /** UNIX timestamp in seconds (lightweight-charts UTCTimestamp). */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export const INTERVALS = ["1m", "5m", "15m", "1h", "4h", "1d"] as const;
export type Interval = (typeof INTERVALS)[number];

export function isInterval(value: string): value is Interval {
  return (INTERVALS as readonly string[]).includes(value);
}

// Geo-safe public market-data endpoint. Binance's primary api.binance.com
// returns HTTP 451 from some server regions (e.g. Vercel US); the .vision
// data endpoint mirrors the same API without that restriction.
const REST_BASE = "https://data-api.binance.vision/api/v3";

type RawKline = [number, string, string, string, string, ...unknown[]];

/**
 * Fetches historical candlesticks to seed the chart. Safe to call server-side.
 */
export async function fetchKlines(
  symbol: string,
  interval: Interval,
  limit = 500,
): Promise<Candle[]> {
  const url = `${REST_BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Binance klines request failed: ${res.status}`);
  }
  const raw = (await res.json()) as RawKline[];
  return raw.map((k) => ({
    time: Math.floor(k[0] / 1000),
    open: Number(k[1]),
    high: Number(k[2]),
    low: Number(k[3]),
    close: Number(k[4]),
    volume: Number(k[5]),
  }));
}

/**
 * Fetches daily close prices for a symbol keyed by the day's UTC-midnight
 * timestamp in ms (matching Binance 1d kline openTime). Returns an empty map on
 * failure so callers can degrade gracefully. Server-side use.
 */
export async function fetchDailyCloses(
  symbol: string,
  startTimeMs: number,
  limit: number,
): Promise<Map<number, number>> {
  const map = new Map<number, number>();
  try {
    const url = `${REST_BASE}/klines?symbol=${symbol}&interval=1d&startTime=${startTimeMs}&limit=${limit}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return map;
    const raw = (await res.json()) as RawKline[];
    for (const k of raw) map.set(k[0], Number(k[4]));
  } catch {
    // Return whatever we have; the equity curve carries forward last close.
  }
  return map;
}
