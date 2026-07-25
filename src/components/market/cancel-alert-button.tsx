"use client";

import { useTransition } from "react";

import { cancelAlert } from "@/lib/alerts/actions";

export function CancelAlertButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => cancelAlert(id))}
      className="rounded-md border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-60"
    >
      Cancel
    </button>
  );
}
