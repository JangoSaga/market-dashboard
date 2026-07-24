"use client";

import { useEffect } from "react";

import { BinancePriceStream } from "@/lib/market/binance-stream";
import { DEFAULT_SYMBOLS } from "@/lib/market/symbols";
import { usePriceStore } from "@/store/prices";

/**
 * Opens the Binance price stream for the lifetime of the subtree and tears it
 * down on unmount. Actions are read via getState so the effect stays stable
 * and does not reconnect on every render.
 */
export function PriceStreamProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  useEffect(() => {
    const { updateTicker, setStatus } = usePriceStore.getState();
    const stream = new BinancePriceStream(
      DEFAULT_SYMBOLS.map((s) => s.symbol),
      { onTicker: updateTicker, onStatus: setStatus },
    );
    stream.start();
    return () => stream.stop();
  }, []);

  return <>{children}</>;
}
