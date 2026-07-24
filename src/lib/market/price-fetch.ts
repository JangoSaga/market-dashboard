// Geo-safe public endpoint (see klines.ts).
const REST_BASE = "https://data-api.binance.vision/api/v3";

/**
 * Fetches the current last price for a symbol. Called server-side at trade
 * execution so the price can't be forged by the client.
 */
export async function fetchLastPrice(symbol: string): Promise<number> {
  const res = await fetch(`${REST_BASE}/ticker/price?symbol=${symbol}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Binance price request failed: ${res.status}`);
  }
  const data = (await res.json()) as { symbol: string; price: string };
  return Number(data.price);
}
