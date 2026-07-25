"use client";

import { useActionState } from "react";

import { createAlert, type AlertState } from "@/lib/alerts/actions";
import { formatPrice } from "@/lib/market/format";
import { DEFAULT_SYMBOLS } from "@/lib/market/symbols";
import { usePriceStore } from "@/store/prices";

const controlClass =
  "rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500";

export function CreateAlertForm({ symbol }: { symbol?: string }) {
  const [state, action, pending] = useActionState<AlertState, FormData>(
    createAlert,
    null,
  );
  const livePrice = usePriceStore((s) =>
    symbol ? s.tickers[symbol]?.lastPrice : undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      {symbol ? (
        <input type="hidden" name="symbol" value={symbol} />
      ) : (
        <select name="symbol" required defaultValue="" className={controlClass}>
          <option value="" disabled>
            Select symbol
          </option>
          {DEFAULT_SYMBOLS.map((m) => (
            <option key={m.symbol} value={m.symbol}>
              {m.base} · {m.name}
            </option>
          ))}
        </select>
      )}

      <div className="flex gap-2">
        <select name="direction" defaultValue="above" className={`${controlClass} flex-1`}>
          <option value="above">Price above</option>
          <option value="below">Price below</option>
        </select>
        <input
          name="target_price"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          required
          placeholder={livePrice ? formatPrice(livePrice) : "Target price"}
          className={`${controlClass} flex-1 font-mono w-4`}
        />
      </div>

      {state?.error && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {state.error}
        </p>
      )}
      {state?.message && (
        <p className="rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-md border border-zinc-700 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-800 disabled:opacity-60"
      >
        {pending ? "Setting…" : "Set price alert"}
      </button>
    </form>
  );
}
