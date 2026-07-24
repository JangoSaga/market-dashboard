export type SymbolMeta = {
  /** Binance symbol used for the stream, e.g. "BTCUSDT". */
  symbol: string;
  /** Base asset ticker, e.g. "BTC". */
  base: string;
  /** Quote asset, e.g. "USDT". */
  quote: string;
  /** Human-readable name. */
  name: string;
};

export const DEFAULT_SYMBOLS: SymbolMeta[] = [
  { symbol: "BTCUSDT", base: "BTC", quote: "USDT", name: "Bitcoin" },
  { symbol: "ETHUSDT", base: "ETH", quote: "USDT", name: "Ethereum" },
  { symbol: "SOLUSDT", base: "SOL", quote: "USDT", name: "Solana" },
  { symbol: "BNBUSDT", base: "BNB", quote: "USDT", name: "BNB" },
  { symbol: "XRPUSDT", base: "XRP", quote: "USDT", name: "XRP" },
];
