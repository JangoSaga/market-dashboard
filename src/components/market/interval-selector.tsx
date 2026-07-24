import Link from "next/link";

import { INTERVALS, type Interval } from "@/lib/market/klines";

export function IntervalSelector({
  symbol,
  active,
}: {
  symbol: string;
  active: Interval;
}) {
  return (
    <div className="flex gap-1">
      {INTERVALS.map((iv) => (
        <Link
          key={iv}
          href={`/dashboard/${symbol}?interval=${iv}`}
          scroll={false}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            iv === active
              ? "bg-emerald-600 text-white"
              : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          {iv}
        </Link>
      ))}
    </div>
  );
}
