/**
 * Market Data Types and Interfaces
 */

// Stock Quote Data
export interface StockQuote {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  timestamp: number;
}

// OHLC (Open, High, Low, Close) Data
export interface OHLCData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap?: number; // Volume Weighted Average Price
}

// Technical Indicators
export interface TechnicalIndicators {
  sma?: number[]; // Simple Moving Average
  ema?: number[]; // Exponential Moving Average
  rsi?: number[]; // Relative Strength Index
  macd?: {
    line: number[];
    signal: number[];
    histogram: number[];
  };
  bollingerBands?: {
    upper: number[];
    middle: number[];
    lower: number[];
  };
}

// Historical Price Data
export interface HistoricalPriceData {
  symbol: string;
  timeframe: "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y";
  data: OHLCData[];
  indicators?: TechnicalIndicators;
  startDate: string;
  endDate: string;
}

// Market Statistics
export interface MarketStatistics {
  symbol: string;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  eps?: number;
  dividend?: number;
  dividendYield?: number;
  week52High: number;
  week52Low: number;
  avgVolume?: number;
  beta?: number;
  sharesOutstanding?: number;
}

// Company Information
export interface CompanyInfo {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  sector?: string;
  industry?: string;
  description?: string;
  ceo?: string;
  headquarters?: string;
  employeeCount?: number;
  website?: string;
  founded?: string;
  logo?: string;
}

// Stock Details (Combined)
export interface StockDetails {
  quote: StockQuote;
  statistics: MarketStatistics;
  company: CompanyInfo;
  historicalData?: HistoricalPriceData;
}

// Market Index
export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  timestamp: number;
  logo?: string;
}

// Top Movers Data
export interface TopMovers {
  gainers: StockQuote[];
  losers: StockQuote[];
  mostActive: StockQuote[];
}

// Market Overview
export interface MarketOverview {
  indexes: MarketIndex[];
  topMovers: TopMovers;
  trendingStocks: StockQuote[];
  marketStatus: "OPEN" | "CLOSED" | "PRE_MARKET" | "AFTER_HOURS";
  timestamp: number;
}

// Search Result
export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  type: "STOCK" | "ETF" | "FUND" | "CRYPTO" | "INDEX";
  matchScore: number;
}

// Search Suggestions
export interface SearchSuggestions {
  results: SearchResult[];
  recentSearches: string[];
  trendingSearches: string[];
}

// Watchlist Item
export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  addedAt: number;
  alert?: number; // Alert price
}

// Watchlist
export interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
  createdAt: number;
  updatedAt: number;
  isDefault: boolean;
}

// Realtime Price Update
export interface RealtimePriceUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
  bid?: number;
  ask?: number;
  bidSize?: number;
  askSize?: number;
}

// Market Event (for SignalR)
export const MarketEventType = {
  PRICE_UPDATE: "PRICE_UPDATE",
  QUOTE_UPDATE: "QUOTE_UPDATE",
  TRADING_HALT: "TRADING_HALT",
  CIRCUIT_BREAKER: "CIRCUIT_BREAKER",
  MARKET_STATUS_CHANGE: "MARKET_STATUS_CHANGE",
  ERROR: "ERROR",
} as const;

export type MarketEventType =
  (typeof MarketEventType)[keyof typeof MarketEventType];

export interface MarketEvent {
  type: MarketEventType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  timestamp: number;
}

// API Response Wrappers
export interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
