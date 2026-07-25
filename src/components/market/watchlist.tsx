"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

import { ConnectionStatus } from "@/components/market/connection-status";
import { formatPercent, formatPrice } from "@/lib/market/format";
import { DEFAULT_SYMBOLS, getSymbolMeta } from "@/lib/market/symbols";
import { addToWatchlist, removeFromWatchlist } from "@/lib/watchlist/actions";
import { usePriceStore } from "@/store/prices";

export function Watchlist({ symbols }: { symbols: string[] }) {
  const [pending, startTransition] = useTransition();
  const available = DEFAULT_SYMBOLS.filter((m) => !symbols.includes(m.symbol));

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-100">Watchlist</h2>
        <div className="flex items-center gap-3">
          <ConnectionStatus />
          <AddSymbol
            available={available}
            disabled={pending}
            onAdd={(s) => startTransition(() => addToWatchlist(s))}
          />
        </div>
      </div>

      {symbols.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-6 text-sm text-zinc-500">
          Your watchlist is empty. Add a symbol to track its live price.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {symbols.map((sym) => (
            <WatchCard
              key={sym}
              symbol={sym}
              onRemove={() =>
                startTransition(() => removeFromWatchlist(sym))
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

function AddSymbol({
  available,
  onAdd,
  disabled,
}: {
  available: { symbol: string; base: string; name: string }[];
  onAdd: (symbol: string) => void;
  disabled: boolean;
}) {
  return (
    <select
      value=""
      disabled={disabled || available.length === 0}
      onChange={(e) => {
        if (e.target.value) onAdd(e.target.value);
      }}
      className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-emerald-500"
    >
      <option value="">+ Add symbol</option>
      {available.map((m) => (
        <option key={m.symbol} value={m.symbol}>
          {m.base} · {m.name}
        </option>
      ))}
    </select>
  );
}

function WatchCard({
  symbol,
  onRemove,
}: {
  symbol: string;
  onRemove: () => void;
}) {
  const meta = getSymbolMeta(symbol);
  const ticker = usePriceStore((s) => s.tickers[symbol]);
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
      <div className="flex items-start justify-between">
        <Link href={`/dashboard/${symbol}`} className="group">
          <p className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-400">
            {meta?.base ?? symbol}
          </p>
          <p className="text-xs text-zinc-500">{meta?.name}</p>
        </Link>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${meta?.base ?? symbol} from watchlist`}
          className="-mr-1 -mt-1 rounded p-1 text-zinc-600 transition hover:bg-zinc-800 hover:text-zinc-300"
        >
          ✕
        </button>
      </div>

      <div className="mt-3">
        {ticker ? (
          <>
            <p
              className={`font-mono text-lg font-semibold tabular-nums ${
                flash === "up"
                  ? "text-emerald-400"
                  : flash === "down"
                    ? "text-red-400"
                    : "text-zinc-100"
              }`}
            >
              {formatPrice(ticker.lastPrice)}
            </p>
            <p
              className={`mt-1 text-sm font-medium ${up ? "text-emerald-400" : "text-red-400"}`}
            >
              {formatPercent(ticker.changePercent)}
              <span className="ml-2 text-xs text-zinc-500">24h</span>
            </p>
          </>
        ) : (
          <div className="h-11 w-24 animate-pulse rounded bg-zinc-800" />
        )}
      </div>
    </div>
  );
}
