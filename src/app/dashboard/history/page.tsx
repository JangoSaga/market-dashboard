import { redirect } from "next/navigation";
import Link from "next/link";

import { formatPrice, formatUsd } from "@/lib/market/format";
import { getSymbolMeta } from "@/lib/market/symbols";
import { createClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: trades } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = trades ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Trade history</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {rows.length} {rows.length === 1 ? "trade" : "trades"}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-6 text-sm text-zinc-500">
          No trades yet. Open a market and place a paper trade to see it here.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                <th className="px-4 py-2 font-medium">Time</th>
                <th className="px-4 py-2 font-medium">Asset</th>
                <th className="px-4 py-2 font-medium">Side</th>
                <th className="px-4 py-2 text-right font-medium">Quantity</th>
                <th className="px-4 py-2 text-right font-medium">Price</th>
                <th className="px-4 py-2 text-right font-medium">Value</th>
                <th className="px-4 py-2 text-right font-medium">Fee</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => {
                const base = getSymbolMeta(t.symbol)?.base ?? t.symbol;
                const value = Number(t.quantity) * Number(t.price);
                const isBuy = t.side === "buy";
                return (
                  <tr
                    key={t.id}
                    className="border-b border-zinc-900 last:border-0"
                  >
                    <td className="px-4 py-3 text-zinc-400">
                      {new Date(t.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/${t.symbol}`}
                        className="font-medium text-zinc-100 hover:text-emerald-400"
                      >
                        {base}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${
                          isBuy
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {t.side}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-zinc-300">
                      {Number(t.quantity)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-zinc-300">
                      {formatPrice(Number(t.price))}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-zinc-300">
                      {formatUsd(value)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-zinc-500">
                      {formatUsd(Number(t.fee ?? 0))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
