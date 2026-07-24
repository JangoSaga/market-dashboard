import { create } from "zustand";

import type { ConnectionStatus, Ticker } from "@/lib/market/types";

type PriceState = {
  tickers: Record<string, Ticker>;
  status: ConnectionStatus;
  updateTicker: (ticker: Ticker) => void;
  setStatus: (status: ConnectionStatus) => void;
};

/**
 * Client-side store for live prices. Fed by the Binance stream via
 * PriceStreamProvider; read by ticker/watchlist/chart components.
 */
export const usePriceStore = create<PriceState>((set) => ({
  tickers: {},
  status: "connecting",
  updateTicker: (ticker) =>
    set((state) => ({
      tickers: { ...state.tickers, [ticker.symbol]: ticker },
    })),
  setStatus: (status) => set({ status }),
}));
