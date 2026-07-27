import type { Database } from "@/lib/database.types";

export type Trade = Database["public"]["Tables"]["trades"]["Row"];

export type Position = {
  symbol: string;
  /** Net base-asset quantity held (open long). */
  quantity: number;
  /** Average cost basis of the open position (includes buy fees). */
  avgPrice: number;
};

type Acc = { qty: number; avg: number };

/**
 * Single pass over a chronological trade log producing both open positions and
 * total realized P&L, using average-cost basis with fees folded in.
 *
 * `trades` MUST be ordered oldest-first.
 */
function reduceTrades(trades: Trade[]): {
  book: Map<string, Acc>;
  realized: number;
} {
  const book = new Map<string, Acc>();
  let realized = 0;

  for (const t of trades) {
    const cur = book.get(t.symbol) ?? { qty: 0, avg: 0 };
    const qty = Number(t.quantity);
    const price = Number(t.price);
    const fee = Number(t.fee ?? 0);

    if (t.side === "buy") {
      const cost = cur.qty * cur.avg + qty * price + fee;
      const newQty = cur.qty + qty;
      cur.avg = newQty > 0 ? cost / newQty : 0;
      cur.qty = newQty;
    } else {
      // Realized P&L on the sold portion, net of the sell fee.
      realized += (price - cur.avg) * qty - fee;
      cur.qty -= qty;
      if (cur.qty <= 1e-9) {
        cur.qty = 0;
        cur.avg = 0;
      }
    }
    book.set(t.symbol, cur);
  }

  return { book, realized };
}

export function computePositions(trades: Trade[]): Position[] {
  const { book } = reduceTrades(trades);
  return [...book.entries()]
    .filter(([, v]) => v.qty > 1e-9)
    .map(([symbol, v]) => ({ symbol, quantity: v.qty, avgPrice: v.avg }));
}

export function computeRealizedPnl(trades: Trade[]): number {
  return reduceTrades(trades).realized;
}

/** The open position for a single symbol (qty 0 if none). */
export function positionFor(trades: Trade[], symbol: string): Position {
  return (
    computePositions(trades).find((p) => p.symbol === symbol) ?? {
      symbol,
      quantity: 0,
      avgPrice: 0,
    }
  );
}
