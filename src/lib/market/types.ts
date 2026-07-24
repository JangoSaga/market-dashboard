export type Ticker = {
  /** Binance symbol, e.g. "BTCUSDT". */
  symbol: string;
  lastPrice: number;
  /** 24h price change, percent. */
  changePercent: number;
  high: number;
  low: number;
};

export type ConnectionStatus =
  | "connecting"
  | "open"
  | "reconnecting"
  | "closed";
