import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
        Live crypto prices · Paper trading
      </span>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Market<span className="text-emerald-500">Pulse</span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-400">
        A real-time market dashboard with live price streaming, watchlists, and
        a paper-trading simulator that tracks your P&amp;L against real prices.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/signup"
          className="flex h-11 items-center rounded-md bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Get started
        </Link>
        <Link
          href="/dashboard"
          className="flex h-11 items-center rounded-md border border-zinc-700 px-6 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
        >
          Open dashboard
        </Link>
      </div>
    </div>
  );
}
