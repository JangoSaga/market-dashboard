import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out-button";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/dashboard" className="text-base font-bold tracking-tight text-white">
          Market<span className="text-emerald-500">Pulse</span>
        </Link>
        <div className="flex items-center gap-4">
          {user?.email && (
            <span className="hidden text-sm text-zinc-400 sm:inline">
              {user.email}
            </span>
          )}
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
