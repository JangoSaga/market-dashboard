import { fetchDailyCloses } from "@/lib/market/klines";

import type { Trade } from "./positions";

export type EquityPoint = { time: number; value: number };

const DAY_MS = 86_400_000;

/**
 * Reconstructs daily portfolio equity from the trade log plus historical daily
 * closes: for each day, replay trades to get cash + per-symbol quantity, then
 * mark holdings to that day's close. Gives a real equity curve immediately
 * instead of waiting for snapshots to accumulate.
 *
 * Server-side (fetches Binance REST). Returns [] when there are no trades.
 */
export async function computeEquityCurve(
  trades: Trade[],
  startingBalance: number,
  nowMs: number,
): Promise<EquityPoint[]> {
  if (trades.length === 0) return [];

  const firstMs = new Date(trades[0].created_at).getTime();
  const startDay = Math.floor(firstMs / DAY_MS) * DAY_MS;
  const todayDay = Math.floor(nowMs / DAY_MS) * DAY_MS;

  const days: number[] = [];
  for (let d = startDay; d <= todayDay; d += DAY_MS) days.push(d);

  const symbols = [...new Set(trades.map((t) => t.symbol))];
  const closes = new Map<string, Map<number, number>>();
  await Promise.all(
    symbols.map(async (sym) => {
      closes.set(sym, await fetchDailyCloses(sym, startDay, days.length + 2));
    }),
  );

  const points: EquityPoint[] = [];
  const qty = new Map<string, number>();
  const lastClose = new Map<string, number>();
  let cash = startingBalance;
  let ti = 0;

  for (const day of days) {
    const dayEnd = day + DAY_MS - 1;

    while (
      ti < trades.length &&
      new Date(trades[ti].created_at).getTime() <= dayEnd
    ) {
      const t = trades[ti];
      const gross = Number(t.quantity) * Number(t.price);
      const fee = Number(t.fee ?? 0);
      const q = Number(t.quantity);
      if (t.side === "buy") {
        cash -= gross + fee;
        qty.set(t.symbol, (qty.get(t.symbol) ?? 0) + q);
      } else {
        cash += gross - fee;
        qty.set(t.symbol, (qty.get(t.symbol) ?? 0) - q);
      }
      ti++;
    }

    let holdings = 0;
    for (const [sym, q] of qty) {
      if (q <= 1e-9) continue;
      const c = closes.get(sym)?.get(day);
      if (c !== undefined) lastClose.set(sym, c);
      holdings += q * (lastClose.get(sym) ?? 0);
    }

    points.push({ time: Math.floor(day / 1000), value: cash + holdings });
  }

  return points;
}
