import { redirect } from "next/navigation";

import { Portfolio } from "@/components/market/portfolio";
import { ResetPortfolioButton } from "@/components/market/reset-portfolio-button";
import { Watchlist } from "@/components/market/watchlist";
import { computePositions } from "@/lib/trading/positions";
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
      supabase.from("profiles").select("cash_balance").eq("id", user.id).single(),
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
  const positions = computePositions(trades ?? []);
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

      <Portfolio cash={cash} positions={positions} />
      <Watchlist symbols={watchlistSymbols} />
    </div>
  );
}
