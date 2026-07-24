import type { ConnectionStatus, Ticker } from "./types";

const WS_BASE = "wss://stream.binance.com:9443/stream";
const MAX_BACKOFF_MS = 30_000;

type Handlers = {
  onTicker: (ticker: Ticker) => void;
  onStatus: (status: ConnectionStatus) => void;
};

/**
 * Maintains a single Binance combined-stream WebSocket for a set of symbols,
 * pushing `@ticker` updates to `onTicker`. Survives dropped connections via
 * exponential backoff so the UI keeps recovering on its own.
 *
 * Client-side only (Tier 1). The planned server-relay refactor will replace
 * this with one shared upstream connection fanned out via Supabase Realtime.
 */
export class BinancePriceStream {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private stopped = false;

  constructor(
    private readonly symbols: string[],
    private readonly handlers: Handlers,
  ) {}

  start(): void {
    this.stopped = false;
    this.open();
  }

  private open(): void {
    const streams = this.symbols
      .map((s) => `${s.toLowerCase()}@ticker`)
      .join("/");
    const url = `${WS_BASE}?streams=${streams}`;

    this.handlers.onStatus(
      this.reconnectAttempts === 0 ? "connecting" : "reconnecting",
    );

    const ws = new WebSocket(url);
    this.ws = ws;

    ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.handlers.onStatus("open");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string);
        const d = msg?.data;
        if (!d || typeof d.s !== "string") return;
        this.handlers.onTicker({
          symbol: d.s,
          lastPrice: Number(d.c),
          changePercent: Number(d.P),
          high: Number(d.h),
          low: Number(d.l),
        });
      } catch {
        // Ignore malformed frames rather than tearing down the stream.
      }
    };

    // An error is always followed by a close event, where reconnect is handled.
    ws.onerror = () => {};

    ws.onclose = () => {
      if (this.stopped) return;
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    this.handlers.onStatus("reconnecting");
    // Exponential backoff with a small jitter, capped at MAX_BACKOFF_MS.
    const base = Math.min(1000 * 2 ** this.reconnectAttempts, MAX_BACKOFF_MS);
    const delay = base / 2 + (base / 2) * deterministicJitter(this.reconnectAttempts);
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => {
      if (!this.stopped) this.open();
    }, delay);
  }

  stop(): void {
    this.stopped = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      // Detach handlers so the close below can't schedule a reconnect.
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      this.ws.close();
      this.ws = null;
    }
    this.handlers.onStatus("closed");
  }
}

/** Cheap 0..1 jitter that avoids Math.random for deterministic testing. */
function deterministicJitter(attempt: number): number {
  const x = Math.sin(attempt * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
