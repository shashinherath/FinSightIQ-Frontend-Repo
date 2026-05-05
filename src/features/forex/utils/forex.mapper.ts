import type { ForexPair, ForexQuote } from "../types/forex.types";

export const DEFAULT_FOREX_PAIRS = [
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "USD/CHF",
  "AUD/USD",
  "USD/CAD",
  "NZD/USD",
  "EUR/JPY",
  "GBP/JPY",
  "EUR/GBP",
] as const;

export function normalizeForexPair(symbol: string) {
  const value = symbol.trim().toUpperCase().replace(/\s+/g, "");
  if (value.includes("/")) return value;
  if (value.length === 6) return `${value.slice(0, 3)}/${value.slice(3)}`;
  return value;
}

export function forexPairId(symbol: string) {
  return normalizeForexPair(symbol).replace(/[^A-Z]/g, "");
}

export function splitForexPair(symbol: string) {
  const normalized = normalizeForexPair(symbol);
  const [
    baseCurrency = normalized.slice(0, 3),
    quoteCurrency = normalized.slice(3, 6),
  ] = normalized.split("/");
  return {
    baseCurrency: baseCurrency || normalized.slice(0, 3),
    quoteCurrency: quoteCurrency || normalized.slice(3, 6),
  };
}

export function formatForexPair(baseCurrency: string, quoteCurrency: string) {
  return `${baseCurrency}/${quoteCurrency}`;
}

export function isForexPair(symbol: string) {
  return /^([A-Z]{3})\/?([A-Z]{3})$/.test(normalizeForexPair(symbol));
}

export function pairFromDisplay(
  symbol: string,
  region = "Global",
  popularity = 0,
): ForexPair {
  const { baseCurrency, quoteCurrency } = splitForexPair(symbol);

  return {
    symbol: formatForexPair(baseCurrency, quoteCurrency),
    baseCurrency,
    quoteCurrency,
    name: `${baseCurrency} / ${quoteCurrency} Forex Pair`,
    region,
    popularity,
  };
}

export function forexQuoteLabel(quote: ForexQuote) {
  return `${quote.baseCurrency}/${quote.quoteCurrency}`;
}
