import { redirect } from "next/navigation";
import Link from "next/link";

import { CancelAlertButton } from "@/components/market/cancel-alert-button";
import { CreateAlertForm } from "@/components/market/create-alert-form";
import { formatPrice } from "@/lib/market/format";
import { getSymbolMeta } from "@/lib/market/symbols";
import { createClient } from "@/lib/supabase/server";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-amber-500/10 text-amber-400",
  triggered: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-zinc-700/40 text-zinc-400",
};

export default async function AlertsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: alerts } = await supabase
    .from("alerts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = alerts ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Price alerts</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Get a toast when a symbol crosses your target (while the app is open).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <h2 className="mb-3 text-sm font-semibold text-zinc-100">New alert</h2>
          <CreateAlertForm />
        </div>

        <div className="lg:col-span-2">
          {rows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-6 text-sm text-zinc-500">
              No alerts yet. Create one on the left, or from any symbol page.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                    <th className="px-4 py-2 font-medium">Asset</th>
                    <th className="px-4 py-2 font-medium">Condition</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => {
                    const base = getSymbolMeta(a.symbol)?.base ?? a.symbol;
                    return (
                      <tr
                        key={a.id}
                        className="border-b border-zinc-900 last:border-0"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/dashboard/${a.symbol}`}
                            className="font-medium text-zinc-100 hover:text-emerald-400"
                          >
                            {base}
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-300">
                          {a.direction} {formatPrice(Number(a.target_price))}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-semibold ${
                              STATUS_STYLES[a.status] ?? ""
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {a.status === "active" ? (
                            <CancelAlertButton id={a.id} />
                          ) : (
                            <span className="text-xs text-zinc-600">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
