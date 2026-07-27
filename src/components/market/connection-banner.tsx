"use client";

import { usePriceStore } from "@/store/prices";

/**
 * Global banner shown only when the live price stream is down. Reassures the
 * user that stale prices are being recovered rather than silently frozen.
 */
export function ConnectionBanner() {
  const status = usePriceStore((s) => s.status);

  if (status === "open" || status === "connecting") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-amber-500/20 bg-amber-500/10 py-1.5 text-center text-sm text-amber-300"
    >
      {status === "reconnecting"
        ? "Reconnecting to live prices…"
        : "Live prices disconnected. Reconnecting shortly…"}
    </div>
  );
}
