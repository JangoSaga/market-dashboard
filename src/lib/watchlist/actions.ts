"use server";

import { revalidatePath } from "next/cache";

import { isSupportedSymbol } from "@/lib/market/symbols";
import { createClient } from "@/lib/supabase/server";

export async function addToWatchlist(symbol: string): Promise<void> {
  const sym = symbol.toUpperCase();
  if (!isSupportedSymbol(sym)) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("watchlist_items")
    .upsert(
      { user_id: user.id, symbol: sym },
      { onConflict: "user_id,symbol", ignoreDuplicates: true },
    );

  revalidatePath("/dashboard", "layout");
}

export async function removeFromWatchlist(symbol: string): Promise<void> {
  const sym = symbol.toUpperCase();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("watchlist_items")
    .delete()
    .eq("user_id", user.id)
    .eq("symbol", sym);

  revalidatePath("/dashboard", "layout");
}
