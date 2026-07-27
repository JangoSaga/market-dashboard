import type { Candle } from "./klines";

export type LinePoint = { time: number; value: number };

/** Simple moving average of close prices. */
export function computeSMA(candles: Candle[], period: number): LinePoint[] {
  const out: LinePoint[] = [];
  let sum = 0;
  for (let i = 0; i < candles.length; i++) {
    sum += candles[i].close;
    if (i >= period) sum -= candles[i - period].close;
    if (i >= period - 1) {
      out.push({ time: candles[i].time, value: sum / period });
    }
  }
  return out;
}

/** Exponential moving average, seeded with the SMA of the first `period`. */
export function computeEMA(candles: Candle[], period: number): LinePoint[] {
  const out: LinePoint[] = [];
  if (candles.length < period) return out;

  const k = 2 / (period + 1);
  let ema = 0;
  for (let i = 0; i < period; i++) ema += candles[i].close;
  ema /= period;
  out.push({ time: candles[period - 1].time, value: ema });

  for (let i = period; i < candles.length; i++) {
    ema = candles[i].close * k + ema * (1 - k);
    out.push({ time: candles[i].time, value: ema });
  }
  return out;
}
