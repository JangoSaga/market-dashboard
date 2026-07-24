"use client";

import { usePriceStore } from "@/store/prices";
import type { ConnectionStatus as Status } from "@/lib/market/types";

const LABELS: Record<Status, { text: string; dot: string; pulse: boolean }> = {
  connecting: { text: "Connecting", dot: "bg-amber-500", pulse: true },
  open: { text: "Live", dot: "bg-emerald-500", pulse: true },
  reconnecting: { text: "Reconnecting", dot: "bg-amber-500", pulse: true },
  closed: { text: "Disconnected", dot: "bg-zinc-500", pulse: false },
};

export function ConnectionStatus() {
  const status = usePriceStore((s) => s.status);
  const { text, dot, pulse } = LABELS[status];

  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400">
      <span
        className={`h-2 w-2 rounded-full ${dot} ${pulse ? "animate-pulse" : ""}`}
      />
      {text}
    </span>
  );
}
