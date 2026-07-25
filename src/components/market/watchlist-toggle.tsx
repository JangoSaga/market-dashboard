"use client";

import { useState, useTransition } from "react";

import { addToWatchlist, removeFromWatchlist } from "@/lib/watchlist/actions";

export function WatchlistToggle({
  symbol,
  initialInWatchlist,
}: {
  symbol: string;
  initialInWatchlist: boolean;
}) {
  const [inList, setInList] = useState(initialInWatchlist);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const currentlyIn = inList;
    setInList(!currentlyIn); // optimistic
    startTransition(() =>
      currentlyIn ? removeFromWatchlist(symbol) : addToWatchlist(symbol),
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition disabled:opacity-60 ${
        inList
          ? "border-emerald-600/50 bg-emerald-600/10 text-emerald-400"
          : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
      }`}
    >
      {inList ? "★ In watchlist" : "☆ Add to watchlist"}
    </button>
  );
}
