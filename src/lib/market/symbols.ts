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

function meta(symbol: string, base: string, name: string): SymbolMeta {
  return { symbol, base, quote: "USDT", name };
}

/** Full supported universe (validated as TRADING/USDT on Binance). */
export const DEFAULT_SYMBOLS: SymbolMeta[] = [
  meta("BTCUSDT", "BTC", "Bitcoin"),
  meta("ETHUSDT", "ETH", "Ethereum"),
  meta("BNBUSDT", "BNB", "BNB"),
  meta("SOLUSDT", "SOL", "Solana"),
  meta("XRPUSDT", "XRP", "XRP"),
  meta("ADAUSDT", "ADA", "Cardano"),
  meta("DOGEUSDT", "DOGE", "Dogecoin"),
  meta("TRXUSDT", "TRX", "TRON"),
  meta("AVAXUSDT", "AVAX", "Avalanche"),
  meta("LINKUSDT", "LINK", "Chainlink"),
  meta("DOTUSDT", "DOT", "Polkadot"),
  meta("LTCUSDT", "LTC", "Litecoin"),
  meta("BCHUSDT", "BCH", "Bitcoin Cash"),
  meta("ATOMUSDT", "ATOM", "Cosmos"),
  meta("UNIUSDT", "UNI", "Uniswap"),
  meta("XLMUSDT", "XLM", "Stellar"),
  meta("ETCUSDT", "ETC", "Ethereum Classic"),
  meta("FILUSDT", "FIL", "Filecoin"),
  meta("APTUSDT", "APT", "Aptos"),
  meta("ARBUSDT", "ARB", "Arbitrum"),
  meta("OPUSDT", "OP", "Optimism"),
  meta("NEARUSDT", "NEAR", "NEAR"),
  meta("INJUSDT", "INJ", "Injective"),
  meta("SUIUSDT", "SUI", "Sui"),
  meta("POLUSDT", "POL", "Polygon"),
  meta("SHIBUSDT", "SHIB", "Shiba Inu"),
  meta("PEPEUSDT", "PEPE", "Pepe"),
];

/** All symbol strings, e.g. ["BTCUSDT", ...]. Used to open the price stream. */
export const ALL_SYMBOL_IDS = DEFAULT_SYMBOLS.map((s) => s.symbol);

const META_BY_SYMBOL = new Map(DEFAULT_SYMBOLS.map((s) => [s.symbol, s]));

export function getSymbolMeta(symbol: string): SymbolMeta | undefined {
  return META_BY_SYMBOL.get(symbol);
}

export function isSupportedSymbol(symbol: string): boolean {
  return META_BY_SYMBOL.has(symbol);
}

/** Symbols a brand-new user's watchlist is seeded with (mirrors the DB trigger). */
export const DEFAULT_WATCHLIST = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
];
