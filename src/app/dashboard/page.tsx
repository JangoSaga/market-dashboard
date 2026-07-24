import { redirect } from "next/navigation";

import { ConnectionStatus } from "@/components/market/connection-status";
import { PriceTickerGrid } from "@/components/market/price-ticker-grid";
import { createClient } from "@/lib/supabase/server";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth: the proxy already guards this route, but we re-check at
  // the data source per Next.js security guidance.
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("cash_balance, starting_balance")
    .eq("id", user.id)
    .single();

  const cash = profile?.cash_balance ?? 0;
  const starting = profile?.starting_balance ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">Signed in as {user.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <p className="text-sm text-zinc-400">Cash balance</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-400">
            {inr.format(cash)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <p className="text-sm text-zinc-400">Starting balance</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-200">
            {inr.format(starting)}
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Live markets</h2>
          <ConnectionStatus />
        </div>
        <PriceTickerGrid />
      </section>
    </div>
  );
}
