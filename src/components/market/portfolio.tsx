"use client";

import Link from "next/link";

import {
  formatPercent,
  formatPrice,
  formatSignedUsd,
  formatUsd,
} from "@/lib/market/format";
import { DEFAULT_SYMBOLS } from "@/lib/market/symbols";
import type { Position } from "@/lib/trading/positions";
import { usePriceStore } from "@/store/prices";

const BASE_BY_SYMBOL = new Map(DEFAULT_SYMBOLS.map((s) => [s.symbol, s.base]));

export function Portfolio({
  cash,
  positions,
  realizedPnl,
}: {
  cash: number;
  positions: Position[];
  realizedPnl: number;
}) {
  const tickers = usePriceStore((s) => s.tickers);

  let holdingsValue = 0;
  let totalPnl = 0;

  const rows = positions.map((p) => {
    const price = tickers[p.symbol]?.lastPrice ?? p.avgPrice;
    const marketValue = p.quantity * price;
    const cost = p.quantity * p.avgPrice;
    const pnl = marketValue - cost;
    holdingsValue += marketValue;
    totalPnl += pnl;
    return {
      ...p,
      base: BASE_BY_SYMBOL.get(p.symbol) ?? p.symbol,
      price,
      marketValue,
      pnl,
      pnlPct: cost > 0 ? (pnl / cost) * 100 : 0,
    };
  });

  const equity = cash + holdingsValue;
  const pnlUp = totalPnl >= 0;

  return (
    <section className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <SummaryCard label="Total equity" value={formatUsd(equity)} accent="text-zinc-100" />
        <SummaryCard label="Cash" value={formatUsd(cash)} accent="text-zinc-100" />
        <SummaryCard label="Holdings value" value={formatUsd(holdingsValue)} accent="text-zinc-100" />
        <SummaryCard
          label="Unrealized P&L"
          value={formatSignedUsd(totalPnl)}
          accent={pnlUp ? "text-emerald-400" : "text-red-400"}
        />
        <SummaryCard
          label="Realized P&L"
          value={formatSignedUsd(realizedPnl)}
          accent={realizedPnl >= 0 ? "text-emerald-400" : "text-red-400"}
        />
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-6 text-sm text-zinc-500">
          No open positions yet. Open a market below and place a paper trade.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                <th className="px-4 py-2 font-medium">Asset</th>
                <th className="px-4 py-2 text-right font-medium">Qty</th>
                <th className="px-4 py-2 text-right font-medium">Avg entry</th>
                <th className="px-4 py-2 text-right font-medium">Price</th>
                <th className="px-4 py-2 text-right font-medium">Value</th>
                <th className="px-4 py-2 text-right font-medium">P&L</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.symbol} className="border-b border-zinc-900 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/${r.symbol}`}
                      className="font-semibold text-zinc-100 hover:text-emerald-400"
                    >
                      {r.base}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-zinc-300">
                    {r.quantity}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-zinc-400">
                    {formatPrice(r.avgPrice)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-zinc-300">
                    {formatPrice(r.price)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-zinc-300">
                    {formatUsd(r.marketValue)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-mono ${
                      r.pnl >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {formatSignedUsd(r.pnl)}
                    <span className="ml-1 text-xs opacity-70">
                      ({formatPercent(r.pnlPct)})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}
