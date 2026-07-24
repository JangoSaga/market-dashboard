import type { Database } from "@/lib/database.types";

export type Trade = Database["public"]["Tables"]["trades"]["Row"];

export type Position = {
  symbol: string;
  /** Net base-asset quantity held (open long). */
  quantity: number;
  /** Average cost basis of the open position. */
  avgPrice: number;
};

/**
 * Reduces a chronological trade log into open positions using average-cost
 * basis. Buys raise the weighted-average entry; sells reduce quantity at that
 * average (realized P&L on the sold portion is not tracked here). A position
 * that returns to zero resets its average.
 *
 * `trades` MUST be ordered oldest-first.
 */
export function computePositions(trades: Trade[]): Position[] {
  const map = new Map<string, { qty: number; avg: number }>();

  for (const t of trades) {
    const cur = map.get(t.symbol) ?? { qty: 0, avg: 0 };
    const qty = Number(t.quantity);
    const price = Number(t.price);

    if (t.side === "buy") {
      const newQty = cur.qty + qty;
      cur.avg = newQty > 0 ? (cur.qty * cur.avg + qty * price) / newQty : 0;
      cur.qty = newQty;
    } else {
      cur.qty -= qty;
      if (cur.qty <= 1e-9) {
        cur.qty = 0;
        cur.avg = 0;
      }
    }
    map.set(t.symbol, cur);
  }

  return [...map.entries()]
    .filter(([, v]) => v.qty > 1e-9)
    .map(([symbol, v]) => ({ symbol, quantity: v.qty, avgPrice: v.avg }));
}

/** Convenience: the open position for a single symbol (qty 0 if none). */
export function positionFor(trades: Trade[], symbol: string): Position {
  return (
    computePositions(trades).find((p) => p.symbol === symbol) ?? {
      symbol,
      quantity: 0,
      avgPrice: 0,
    }
  );
}
