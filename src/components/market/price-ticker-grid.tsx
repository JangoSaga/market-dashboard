"use client";

import { useEffect, useRef, useState } from "react";

import { formatPercent, formatPrice } from "@/lib/market/format";
import { DEFAULT_SYMBOLS, type SymbolMeta } from "@/lib/market/symbols";
import type { Ticker } from "@/lib/market/types";
import { usePriceStore } from "@/store/prices";

export function PriceTickerGrid() {
  const tickers = usePriceStore((s) => s.tickers);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {DEFAULT_SYMBOLS.map((meta) => (
        <TickerCard key={meta.symbol} meta={meta} ticker={tickers[meta.symbol]} />
      ))}
    </div>
  );
}

function TickerCard({
  meta,
  ticker,
}: {
  meta: SymbolMeta;
  ticker: Ticker | undefined;
}) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPrice = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!ticker) return;
    const prev = prevPrice.current;
    if (prev !== undefined && ticker.lastPrice !== prev) {
      setFlash(ticker.lastPrice > prev ? "up" : "down");
      const id = setTimeout(() => setFlash(null), 350);
      prevPrice.current = ticker.lastPrice;
      return () => clearTimeout(id);
    }
    prevPrice.current = ticker.lastPrice;
  }, [ticker?.lastPrice, ticker]);

  const loading = !ticker;
  const up = (ticker?.changePercent ?? 0) >= 0;

  const flashClass =
    flash === "up"
      ? "ring-1 ring-emerald-500/60"
      : flash === "down"
        ? "ring-1 ring-red-500/60"
        : "ring-0";

  return (
    <div
      className={`rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 transition-all duration-300 ${flashClass}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-100">{meta.base}</p>
          <p className="text-xs text-zinc-500">{meta.name}</p>
        </div>
        <span className="text-xs text-zinc-500">/ {meta.quote}</span>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="h-7 w-28 animate-pulse rounded bg-zinc-800" />
        ) : (
          <p
            className={`font-mono text-xl font-semibold tabular-nums transition-colors ${
              flash === "up"
                ? "text-emerald-400"
                : flash === "down"
                  ? "text-red-400"
                  : "text-zinc-100"
            }`}
          >
            {formatPrice(ticker.lastPrice)}
          </p>
        )}

        {loading ? (
          <div className="mt-2 h-4 w-16 animate-pulse rounded bg-zinc-800" />
        ) : (
          <p
            className={`mt-1 text-sm font-medium ${
              up ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {formatPercent(ticker.changePercent)}
            <span className="ml-2 text-xs text-zinc-500">24h</span>
          </p>
        )}
      </div>
    </div>
  );
}
