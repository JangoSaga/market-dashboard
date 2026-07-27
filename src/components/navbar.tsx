import Link from "next/link";

import { MobileNav } from "@/components/mobile-nav";
import { NAV_LINKS } from "@/lib/nav";
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
        <div className="flex items-center gap-3">
          <MobileNav />
          <Link
            href="/dashboard"
            className="text-base font-bold tracking-tight text-white"
          >
            Market<span className="text-emerald-500">Pulse</span>
          </Link>
          <nav className="ml-3 hidden items-center gap-4 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 transition hover:text-zinc-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user?.email && (
            <span className="hidden text-sm text-zinc-400 md:inline">
              {user.email}
            </span>
          )}
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
