"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <h2 className="text-lg font-semibold text-zinc-100">
        Something went wrong
      </h2>
      <p className="text-sm text-zinc-400">
        {error.message || "An unexpected error occurred loading this page."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="h-10 rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-500"
      >
        Try again
      </button>
    </div>
  );
}
