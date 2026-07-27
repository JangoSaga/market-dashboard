export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="h-8 w-40 animate-pulse rounded bg-zinc-800" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-zinc-800 bg-zinc-950/60"
          />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-zinc-800 bg-zinc-950/60"
          />
        ))}
      </div>
    </div>
  );
}
