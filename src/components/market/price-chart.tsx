"use client";

import { useEffect, useRef } from "react";
import type {
  CandlestickData,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
} from "lightweight-charts";

import { KlineStream } from "@/lib/market/kline-stream";
import type { Candle, Interval } from "@/lib/market/klines";

export function PriceChart({
  symbol,
  interval,
  initialCandles,
}: {
  symbol: string;
  interval: Interval;
  initialCandles: Candle[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let chart: IChartApi | null = null;
    let series: ISeriesApi<"Candlestick"> | null = null;
    let stream: KlineStream | null = null;
    let resizeObserver: ResizeObserver | null = null;

    (async () => {
      // Dynamic import keeps the canvas library out of the server render.
      const { createChart, CandlestickSeries, ColorType, CrosshairMode } =
        await import("lightweight-charts");

      const el = containerRef.current;
      if (disposed || !el) return;

      chart = createChart(el, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "#a1a1aa",
        },
        grid: {
          vertLines: { color: "#27272a" },
          horzLines: { color: "#27272a" },
        },
        crosshair: { mode: CrosshairMode.Normal },
        rightPriceScale: { borderColor: "#27272a" },
        timeScale: {
          borderColor: "#27272a",
          timeVisible: true,
          secondsVisible: false,
        },
        width: el.clientWidth,
        height: 420,
      });

      series = chart.addSeries(CandlestickSeries, {
        upColor: "#10b981",
        downColor: "#ef4444",
        borderUpColor: "#10b981",
        borderDownColor: "#ef4444",
        wickUpColor: "#10b981",
        wickDownColor: "#ef4444",
      });

      series.setData(
        initialCandles.map((c) => ({
          ...c,
          time: c.time as UTCTimestamp,
        })) satisfies CandlestickData<UTCTimestamp>[],
      );
      chart.timeScale().fitContent();

      stream = new KlineStream(symbol, interval, (candle) => {
        series?.update({
          ...candle,
          time: candle.time as UTCTimestamp,
        } satisfies CandlestickData<UTCTimestamp>);
      });
      stream.start();

      resizeObserver = new ResizeObserver(() => {
        if (chart && el) chart.applyOptions({ width: el.clientWidth });
      });
      resizeObserver.observe(el);
    })();

    return () => {
      disposed = true;
      stream?.stop();
      resizeObserver?.disconnect();
      chart?.remove();
    };
  }, [symbol, interval, initialCandles]);

  return <div ref={containerRef} className="w-full" />;
}
