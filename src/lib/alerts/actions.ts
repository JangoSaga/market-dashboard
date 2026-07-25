"use server";

import { revalidatePath } from "next/cache";

import { isSupportedSymbol } from "@/lib/market/symbols";
import { createClient } from "@/lib/supabase/server";

export type AlertState = { error?: string; message?: string } | null;

export async function createAlert(
  _prev: AlertState,
  formData: FormData,
): Promise<AlertState> {
  const symbol = String(formData.get("symbol") ?? "").toUpperCase();
  const direction = String(formData.get("direction") ?? "");
  const targetPrice = Number(formData.get("target_price"));

  if (!isSupportedSymbol(symbol)) return { error: "Unknown symbol." };
  if (direction !== "above" && direction !== "below") {
    return { error: "Choose above or below." };
  }
  if (!Number.isFinite(targetPrice) || targetPrice <= 0) {
    return { error: "Enter a target price greater than 0." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in again." };

  const { error } = await supabase.from("alerts").insert({
    user_id: user.id,
    symbol,
    direction,
    target_price: targetPrice,
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard", "layout");
  const base = symbol.replace(/USDT$/, "");
  return { message: `Alert set: ${base} ${direction} ${targetPrice}` };
}

export async function cancelAlert(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("alerts")
    .update({ status: "cancelled" })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("status", "active");

  revalidatePath("/dashboard", "layout");
}

/** Marks an alert as triggered. Called by the client monitor when a target is hit. */
export async function triggerAlert(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("alerts")
    .update({ status: "triggered", triggered_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("status", "active");

  revalidatePath("/dashboard", "layout");
}
