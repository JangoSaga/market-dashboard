"use client";

import { useEffect, useRef, useState } from "react";
import type {
  CandlestickData,
  HistogramData,
  IChartApi,
  ISeriesApi,
  LineData,
  UTCTimestamp,
} from "lightweight-charts";

import { computeEMA, computeSMA, type LinePoint } from "@/lib/market/indicators";
import { KlineStream } from "@/lib/market/kline-stream";
import type { Candle, Interval } from "@/lib/market/klines";

const SMA_PERIOD = 20;
const EMA_PERIOD = 50;
const SMA_COLOR = "#eab308";
const EMA_COLOR = "#3b82f6";

function toCandle(c: Candle): CandlestickData<UTCTimestamp> {
  return {
    time: c.time as UTCTimestamp,
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
  };
}

function toVolume(c: Candle): HistogramData<UTCTimestamp> {
  return {
    time: c.time as UTCTimestamp,
    value: c.volume,
    color: c.close >= c.open ? "rgba(16,185,129,0.45)" : "rgba(239,68,68,0.45)",
  };
}

function toLine(p: LinePoint): LineData<UTCTimestamp> {
  return { time: p.time as UTCTimestamp, value: p.value };
}

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
  const smaRef = useRef<ISeriesApi<"Line"> | null>(null);
  const emaRef = useRef<ISeriesApi<"Line"> | null>(null);
  const volRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const [show, setShow] = useState({ sma: true, ema: true, volume: true });

  useEffect(() => {
    let disposed = false;
    let chart: IChartApi | null = null;
    let candleSeries: ISeriesApi<"Candlestick"> | null = null;
    let stream: KlineStream | null = null;
    let resizeObserver: ResizeObserver | null = null;
    const candles: Candle[] = [...initialCandles];

    (async () => {
      const {
        createChart,
        CandlestickSeries,
        HistogramSeries,
        LineSeries,
        ColorType,
        CrosshairMode,
      } = await import("lightweight-charts");

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

      candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#10b981",
        downColor: "#ef4444",
        borderUpColor: "#10b981",
        borderDownColor: "#ef4444",
        wickUpColor: "#10b981",
        wickDownColor: "#ef4444",
      });
      candleSeries.setData(candles.map(toCandle));

      const volume = chart.addSeries(HistogramSeries, {
        priceFormat: { type: "volume" },
        priceScaleId: "",
      });
      volume.priceScale().applyOptions({
        scaleMargins: { top: 0.85, bottom: 0 },
      });
      volume.setData(candles.map(toVolume));
      volRef.current = volume;

      const sma = chart.addSeries(LineSeries, {
        color: SMA_COLOR,
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      });
      sma.setData(computeSMA(candles, SMA_PERIOD).map(toLine));
      smaRef.current = sma;

      const ema = chart.addSeries(LineSeries, {
        color: EMA_COLOR,
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      });
      ema.setData(computeEMA(candles, EMA_PERIOD).map(toLine));
      emaRef.current = ema;

      chart.timeScale().fitContent();

      stream = new KlineStream(symbol, interval, (candle) => {
        const last = candles[candles.length - 1];
        if (last && last.time === candle.time) {
          candles[candles.length - 1] = candle;
        } else {
          candles.push(candle);
        }
        candleSeries?.update(toCandle(candle));
        volRef.current?.update(toVolume(candle));

        const smaData = computeSMA(candles, SMA_PERIOD);
        if (smaData.length) smaRef.current?.update(toLine(smaData[smaData.length - 1]));
        const emaData = computeEMA(candles, EMA_PERIOD);
        if (emaData.length) emaRef.current?.update(toLine(emaData[emaData.length - 1]));
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
      smaRef.current = null;
      emaRef.current = null;
      volRef.current = null;
    };
  }, [symbol, interval, initialCandles]);

  // Toggle indicator visibility without rebuilding the chart.
  useEffect(() => {
    smaRef.current?.applyOptions({ visible: show.sma });
    emaRef.current?.applyOptions({ visible: show.ema });
    volRef.current?.applyOptions({ visible: show.volume });
  }, [show]);

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        <IndicatorToggle
          label={`SMA ${SMA_PERIOD}`}
          color={SMA_COLOR}
          active={show.sma}
          onClick={() => setShow((s) => ({ ...s, sma: !s.sma }))}
        />
        <IndicatorToggle
          label={`EMA ${EMA_PERIOD}`}
          color={EMA_COLOR}
          active={show.ema}
          onClick={() => setShow((s) => ({ ...s, ema: !s.ema }))}
        />
        <IndicatorToggle
          label="Volume"
          active={show.volume}
          onClick={() => setShow((s) => ({ ...s, volume: !s.volume }))}
        />
      </div>
      <div ref={containerRef} className="w-full" />
    </div>
  );
}

function IndicatorToggle({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition ${
        active
          ? "border-zinc-600 text-zinc-200"
          : "border-zinc-800 text-zinc-500 hover:text-zinc-400"
      }`}
    >
      {color && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: active ? color : "#3f3f46" }}
        />
      )}
      {label}
    </button>
  );
}
