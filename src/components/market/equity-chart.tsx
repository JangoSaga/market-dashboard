"use client";

import { useEffect, useRef } from "react";
import type { AreaData, IChartApi, UTCTimestamp } from "lightweight-charts";

import type { EquityPoint } from "@/lib/trading/equity";

export function EquityChart({ points }: { points: EquityPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let chart: IChartApi | null = null;
    let resizeObserver: ResizeObserver | null = null;

    (async () => {
      const { createChart, AreaSeries, ColorType } = await import(
        "lightweight-charts"
      );
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
        rightPriceScale: { borderColor: "#27272a" },
        timeScale: { borderColor: "#27272a" },
        width: el.clientWidth,
        height: 240,
      });

      const series = chart.addSeries(AreaSeries, {
        lineColor: "#10b981",
        topColor: "rgba(16,185,129,0.4)",
        bottomColor: "rgba(16,185,129,0.02)",
        lineWidth: 2,
        priceLineVisible: false,
      });
      series.setData(
        points.map(
          (p): AreaData<UTCTimestamp> => ({
            time: p.time as UTCTimestamp,
            value: p.value,
          }),
        ),
      );
      chart.timeScale().fitContent();

      resizeObserver = new ResizeObserver(() => {
        if (chart && el) chart.applyOptions({ width: el.clientWidth });
      });
      resizeObserver.observe(el);
    })();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      chart?.remove();
    };
  }, [points]);

  return <div ref={containerRef} className="w-full" />;
}
