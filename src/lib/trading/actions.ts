"use server";

import { revalidatePath } from "next/cache";

import { fetchLastPrice } from "@/lib/market/price-fetch";
import { DEFAULT_SYMBOLS } from "@/lib/market/symbols";
import { createClient } from "@/lib/supabase/server";

export type TradeState = { error?: string; message?: string } | null;

/**
 * Executes a paper buy/sell. The execution price is fetched server-side from
 * Binance (never trusted from the client), then the atomic `execute_trade`
 * Postgres function moves cash and records the trade under row-lock.
 */
export async function executeTrade(
  _prev: TradeState,
  formData: FormData,
): Promise<TradeState> {
  const symbol = String(formData.get("symbol") ?? "").toUpperCase();
  const side = String(formData.get("side") ?? "");
  const quantity = Number(formData.get("quantity"));

  if (!DEFAULT_SYMBOLS.some((s) => s.symbol === symbol)) {
    return { error: "Unknown symbol." };
  }
  if (side !== "buy" && side !== "sell") {
    return { error: "Invalid order side." };
  }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { error: "Enter a quantity greater than 0." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Please sign in again." };
  }

  let price: number;
  try {
    price = await fetchLastPrice(symbol);
  } catch {
    return { error: "Couldn't fetch the live price. Try again." };
  }

  const { error } = await supabase.rpc("execute_trade", {
    p_symbol: symbol,
    p_side: side,
    p_quantity: quantity,
    p_price: price,
  });
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  const base = symbol.replace(/USDT$/, "");
  const verb = side === "buy" ? "Bought" : "Sold";
  return {
    message: `${verb} ${quantity} ${base} @ ${price.toLocaleString("en-US")}`,
  };
}

/** Wipes all trades and resets cash to the starting balance (atomic RPC). */
export async function resetPortfolio(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.rpc("reset_portfolio");
  revalidatePath("/dashboard", "layout");
}
