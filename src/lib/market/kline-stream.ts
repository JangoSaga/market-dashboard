import type { Candle } from "./klines";

const WS_BASE = "wss://stream.binance.com:9443/ws";
const MAX_BACKOFF_MS = 30_000;

/**
 * Streams live candlestick updates for a single symbol/interval. Each message
 * is the current (possibly still-forming) candle; feeding it to
 * `series.update()` mutates the last bar until it closes and a new one begins.
 *
 * Mirrors BinancePriceStream's reconnect/backoff so the chart recovers from
 * dropped connections on its own.
 */
export class KlineStream {
  private ws: WebSocket | null = null;
  private attempts = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private stopped = false;

  constructor(
    private readonly symbol: string,
    private readonly interval: string,
    private readonly onCandle: (candle: Candle) => void,
  ) {}

  start(): void {
    this.stopped = false;
    this.open();
  }

  private open(): void {
    const url = `${WS_BASE}/${this.symbol.toLowerCase()}@kline_${this.interval}`;
    const ws = new WebSocket(url);
    this.ws = ws;

    ws.onopen = () => {
      this.attempts = 0;
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string);
        const k = msg?.k;
        if (!k) return;
        this.onCandle({
          time: Math.floor(k.t / 1000),
          open: Number(k.o),
          high: Number(k.h),
          low: Number(k.l),
          close: Number(k.c),
        });
      } catch {
        // Ignore malformed frames.
      }
    };

    ws.onerror = () => {};

    ws.onclose = () => {
      if (this.stopped) return;
      const delay = Math.min(1000 * 2 ** this.attempts, MAX_BACKOFF_MS);
      this.attempts += 1;
      this.timer = setTimeout(() => {
        if (!this.stopped) this.open();
      }, delay);
    };
  }

  stop(): void {
    this.stopped = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      this.ws.close();
      this.ws = null;
    }
  }
}
