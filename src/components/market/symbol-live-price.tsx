"use client";

import { formatPercent, formatPrice } from "@/lib/market/format";
import { usePriceStore } from "@/store/prices";

export function SymbolLivePrice({ symbol }: { symbol: string }) {
  const ticker = usePriceStore((s) => s.tickers[symbol]);

  if (!ticker) {
    return <div className="h-9 w-44 animate-pulse rounded bg-zinc-800" />;
  }

  const up = ticker.changePercent >= 0;

  return (
    <div className="flex flex-wrap items-baseline gap-3">
      <span className="font-mono text-3xl font-semibold tabular-nums text-zinc-100">
        {formatPrice(ticker.lastPrice)}
      </span>
      <span
        className={`text-sm font-medium ${up ? "text-emerald-400" : "text-red-400"}`}
      >
        {formatPercent(ticker.changePercent)}
        <span className="ml-1 text-xs text-zinc-500">24h</span>
      </span>
    </div>
  );
}
