"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { triggerAlert } from "@/lib/alerts/actions";
import { formatPrice } from "@/lib/market/format";
import { getSymbolMeta } from "@/lib/market/symbols";
import { usePriceStore } from "@/store/prices";

type ActiveAlert = {
  id: string;
  symbol: string;
  direction: string;
  target_price: number;
};

/**
 * Watches live prices and fires a toast when an active alert's target is
 * crossed, then marks it triggered. Client-side: alerts fire while the app is
 * open (a cron/edge-function would be the always-on upgrade).
 */
export function AlertMonitor({ alerts }: { alerts: ActiveAlert[] }) {
  const tickers = usePriceStore((s) => s.tickers);
  const fired = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (const a of alerts) {
      if (fired.current.has(a.id)) continue;
      const price = tickers[a.symbol]?.lastPrice;
      if (price === undefined) continue;

      const hit =
        a.direction === "above"
          ? price >= a.target_price
          : price <= a.target_price;

      if (hit) {
        fired.current.add(a.id);
        const base = getSymbolMeta(a.symbol)?.base ?? a.symbol;
        toast.success(
          `${base} is ${a.direction} ${formatPrice(a.target_price)}`,
          { description: `Now ${formatPrice(price)}` },
        );
        void triggerAlert(a.id);
      }
    }
  }, [tickers, alerts]);

  return null;
}
