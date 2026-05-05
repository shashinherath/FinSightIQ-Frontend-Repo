export type ForexTimeframe = "1H" | "4H" | "1D" | "1W" | "1M";
export type ForexTrend = "UP" | "DOWN" | "SIDEWAYS";
export type ForexMarketStatus = "OPEN" | "CLOSED";

export interface ForexPair {
  symbol: string;
  baseCurrency: string;
  quoteCurrency: string;
  name: string;
  region: string;
  popularity: number;
}

export interface ForexQuote extends ForexPair {
  price: number;
  bid: number;
  ask: number;
  spread: number;
  pipChange: number;
  dailyChange: number;
  dailyChangePercent: number;
  volatility: number;
  high: number;
  low: number;
  trend: ForexTrend;
  marketStatus: ForexMarketStatus;
  timestamp: number;
  sparkline: Array<{ timestamp: number; close: number }>;
}

export interface ForexHistoricalRate {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ForexHistoricalSeries {
  pair: string;
  timeframe: ForexTimeframe;
  data: ForexHistoricalRate[];
  bid: number;
  ask: number;
  spread: number;
  pipChange: number;
  volatility: number;
  high: number;
  low: number;
  timestamp: number;
}

export interface ForexMover extends ForexQuote {
  sparkline: Array<{ timestamp: number; close: number }>;
}

export interface ForexDashboardData {
  majorPairs: ForexQuote[];
  gainers: ForexMover[];
  losers: ForexMover[];
  volatilePairs: ForexMover[];
  timestamp: number;
}

export interface ForexSearchResult {
  symbol: string;
  displayName: string;
  baseCurrency: string;
  quoteCurrency: string;
  price: number;
  spread: number;
  dailyChangePercent: number;
  popularity: number;
  trend: ForexTrend;
}
