import { redirect } from "next/navigation";

import { EquityChart } from "@/components/market/equity-chart";
import { Portfolio } from "@/components/market/portfolio";
import { ResetPortfolioButton } from "@/components/market/reset-portfolio-button";
import { Watchlist } from "@/components/market/watchlist";
import { computeEquityCurve } from "@/lib/trading/equity";
import { computePositions, computeRealizedPnl } from "@/lib/trading/positions";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth: the proxy guards this route, but we re-check at the data
  // source per Next.js security guidance.
  if (!user) redirect("/login");

  const [{ data: profile }, { data: trades }, { data: watchlist }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("cash_balance, starting_balance")
        .eq("id", user.id)
        .single(),
      supabase
        .from("trades")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("watchlist_items")
        .select("symbol")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }),
    ]);

  const cash = profile?.cash_balance ?? 0;
  const startingBalance = profile?.starting_balance ?? 0;
  const allTrades = trades ?? [];
  const positions = computePositions(allTrades);
  const realizedPnl = computeRealizedPnl(allTrades);
  const equityCurve = await computeEquityCurve(
    allTrades,
    startingBalance,
    Date.now(),
  );
  const watchlistSymbols = (watchlist ?? []).map((w) => w.symbol);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Portfolio</h1>
          <p className="mt-1 text-sm text-zinc-400">Signed in as {user.email}</p>
        </div>
        <ResetPortfolioButton />
      </div>

      <Portfolio cash={cash} positions={positions} realizedPnl={realizedPnl} />

      {equityCurve.length > 1 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-zinc-100">Equity curve</h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            <EquityChart points={equityCurve} />
          </div>
        </section>
      )}

      <Watchlist symbols={watchlistSymbols} />
    </div>
  );
}
