import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ConnectionStatus } from "@/components/market/connection-status";
import { CreateAlertForm } from "@/components/market/create-alert-form";
import { IntervalSelector } from "@/components/market/interval-selector";
import { PriceChart } from "@/components/market/price-chart";
import { SymbolLivePrice } from "@/components/market/symbol-live-price";
import { TradePanel } from "@/components/market/trade-panel";
import { WatchlistToggle } from "@/components/market/watchlist-toggle";
import { fetchKlines, isInterval, type Interval } from "@/lib/market/klines";
import { DEFAULT_SYMBOLS } from "@/lib/market/symbols";
import { positionFor } from "@/lib/trading/positions";
import { createClient } from "@/lib/supabase/server";

// Next.js 16: params and searchParams are async.
export default async function SymbolPage({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ interval?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();
  const meta = DEFAULT_SYMBOLS.find((s) => s.symbol === symbol);
  if (!meta) notFound();

  const { interval: rawInterval } = await searchParams;
  const interval: Interval =
    rawInterval && isInterval(rawInterval) ? rawInterval : "1m";

  const [{ data: trades }, { data: watchRow }] = await Promise.all([
    supabase
      .from("trades")
      .select("*")
      .eq("user_id", user.id)
      .eq("symbol", symbol)
      .order("created_at", { ascending: true }),
    supabase
      .from("watchlist_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("symbol", symbol)
      .maybeSingle(),
  ]);

  let candles: Awaited<ReturnType<typeof fetchKlines>> = [];
  let chartError = false;
  try {
    candles = await fetchKlines(symbol, interval, 500);
  } catch {
    chartError = true;
  }

  const position = positionFor(trades ?? [], symbol);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="text-sm text-zinc-400 transition hover:text-zinc-200"
      >
        &larr; Portfolio
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-zinc-100">
              {meta.base}
              <span className="text-zinc-500">/{meta.quote}</span>
            </h1>
            <span className="text-sm text-zinc-500">{meta.name}</span>
          </div>
          <div className="mt-2">
            <SymbolLivePrice symbol={symbol} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatus />
          <WatchlistToggle symbol={symbol} initialInWatchlist={!!watchRow} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">Price chart</span>
            <IntervalSelector symbol={symbol} active={interval} />
          </div>
          {chartError ? (
            <div className="flex h-105 items-center justify-center text-center text-sm text-zinc-500">
              Chart data is temporarily unavailable.
              <br />
              The live price above still updates.
            </div>
          ) : (
            <PriceChart
              key={`${symbol}-${interval}`}
              symbol={symbol}
              interval={interval}
              initialCandles={candles}
            />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <TradePanel
            symbol={symbol}
            base={meta.base}
            holdingQty={position.quantity}
            avgPrice={position.avgPrice}
          />
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            <h3 className="mb-3 text-sm font-semibold text-zinc-100">
              Price alert
            </h3>
            <CreateAlertForm symbol={symbol} />
          </div>
        </div>
      </div>
    </div>
  );
}
