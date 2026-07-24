"use client";

import { useActionState, useState } from "react";

import {
  formatPrice,
  formatSignedUsd,
  formatUsd,
} from "@/lib/market/format";
import { executeTrade, type TradeState } from "@/lib/trading/actions";
import { usePriceStore } from "@/store/prices";

export function TradePanel({
  symbol,
  base,
  holdingQty,
  avgPrice,
}: {
  symbol: string;
  base: string;
  holdingQty: number;
  avgPrice: number;
}) {
  const [state, action, pending] = useActionState<TradeState, FormData>(
    executeTrade,
    null,
  );
  const [qty, setQty] = useState("");

  const price = usePriceStore((s) => s.tickers[symbol]?.lastPrice);
  const q = Number(qty);
  const validQty = Number.isFinite(q) && q > 0;
  const estValue = price && validQty ? q * price : 0;

  const holdingPnl = price ? (price - avgPrice) * holdingQty : 0;
  const holdingUp = holdingPnl >= 0;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <h3 className="text-sm font-semibold text-zinc-100">Paper trade</h3>

      {holdingQty > 0 && (
        <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-xs">
          <div className="flex justify-between text-zinc-400">
            <span>Position</span>
            <span className="font-mono text-zinc-200">
              {holdingQty} {base}
            </span>
          </div>
          <div className="mt-1 flex justify-between text-zinc-400">
            <span>Avg entry</span>
            <span className="font-mono text-zinc-200">
              {formatPrice(avgPrice)}
            </span>
          </div>
          <div className="mt-1 flex justify-between text-zinc-400">
            <span>Unrealized P&amp;L</span>
            <span
              className={`font-mono ${holdingUp ? "text-emerald-400" : "text-red-400"}`}
            >
              {formatSignedUsd(holdingPnl)}
            </span>
          </div>
        </div>
      )}

      <form action={action} className="mt-4 flex flex-col gap-3">
        <input type="hidden" name="symbol" value={symbol} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="quantity" className="text-xs font-medium text-zinc-400">
            Quantity ({base})
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex justify-between text-xs text-zinc-400">
          <span>Est. order value</span>
          <span className="font-mono text-zinc-200">
            {price ? formatUsd(estValue) : "waiting for price…"}
          </span>
        </div>

        {state?.error && (
          <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {state.error}
          </p>
        )}
        {state?.message && (
          <p className="rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
            {state.message}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            name="side"
            value="buy"
            disabled={pending || !validQty}
            className="h-10 flex-1 rounded-md bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            Buy
          </button>
          <button
            type="submit"
            name="side"
            value="sell"
            disabled={pending || !validQty || holdingQty <= 0}
            className="h-10 flex-1 rounded-md bg-red-600 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
          >
            Sell
          </button>
        </div>
      </form>
    </div>
  );
}
