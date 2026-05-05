import axios from "axios";
import {
  DEFAULT_FOREX_PAIRS,
  forexPairId,
  pairFromDisplay,
  splitForexPair,
} from "../utils/forex.mapper";
import type {
  ForexDashboardData,
  ForexHistoricalRate,
  ForexHistoricalSeries,
  ForexPair,
  ForexQuote,
  ForexSearchResult,
  ForexTimeframe,
  ForexTrend,
} from "../types/forex.types";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 12000,
});

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

function seeded(seed: string) {
  let value = 0;
  for (let index = 0; index < seed.length; index += 1) {
    value = (value * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toTrend(changePercent: number): ForexTrend {
  if (changePercent > 0.12) return "UP";
  if (changePercent < -0.12) return "DOWN";
  return "SIDEWAYS";
}

function createQuote(symbol: string): ForexQuote {
  const normalized = pairFromDisplay(symbol);
  const rand = seeded(normalized.symbol);
  const baseRate =
    normalized.baseCurrency === "JPY"
      ? 140 + rand() * 15
      : normalized.quoteCurrency === "JPY"
        ? 145 + rand() * 10
        : 0.85 + rand() * 0.55;
  const dailyChangePercent = Number(((rand() - 0.48) * 1.2).toFixed(2));
  const dailyChange = Number(
    (baseRate * (dailyChangePercent / 100)).toFixed(4),
  );
  const price = Number((baseRate + dailyChange).toFixed(4));
  const spread = Number((0.00008 + rand() * 0.00025).toFixed(5));
  const bid = Number((price - spread / 2).toFixed(5));
  const ask = Number((price + spread / 2).toFixed(5));
  const pipMultiplier = normalized.quoteCurrency === "JPY" ? 100 : 10_000;
  const pipChange = Number((dailyChange * pipMultiplier).toFixed(1));
  const volatility = Number((0.2 + rand() * 1.5).toFixed(2));
  const high = Number(
    (price + Math.abs(dailyChange) * (0.8 + rand())).toFixed(4),
  );
  const low = Number(
    (price - Math.abs(dailyChange) * (0.8 + rand())).toFixed(4),
  );
  const sparkline = Array.from({ length: 24 }, (_, index) => {
    const drift = Math.sin(index / 4) * 0.003 + (rand() - 0.5) * 0.004;
    return {
      timestamp: Date.now() - (23 - index) * 30 * 60 * 1000,
      close: Number((price * (1 + drift)).toFixed(4)),
    };
  });

  return {
    ...normalized,
    price,
    bid,
    ask,
    spread,
    pipChange,
    dailyChange,
    dailyChangePercent,
    volatility,
    high,
    low,
    trend: toTrend(dailyChangePercent),
    marketStatus: "OPEN",
    timestamp: Date.now(),
    sparkline,
  };
}

function createHistoricalSeries(
  symbol: string,
  timeframe: ForexTimeframe,
): ForexHistoricalSeries {
  const quote = createQuote(symbol);
  const rand = seeded(`${quote.symbol}-${timeframe}`);
  const pointsByTimeframe: Record<ForexTimeframe, number> = {
    "1H": 48,
    "4H": 42,
    "1D": 60,
    "1W": 52,
    "1M": 60,
  };
  const total = pointsByTimeframe[timeframe];
  const intervalMs: Record<ForexTimeframe, number> = {
    "1H": 15 * 60 * 1000,
    "4H": 60 * 60 * 1000,
    "1D": 3 * 60 * 60 * 1000,
    "1W": 12 * 60 * 60 * 1000,
    "1M": 24 * 60 * 60 * 1000,
  };
  const data: ForexHistoricalRate[] = Array.from(
    { length: total },
    (_, index) => {
      const drift = Math.sin(index / 5) * 0.004 + (rand() - 0.5) * 0.006;
      const close = Number((quote.price * (1 + drift)).toFixed(4));
      const open = Number((close - (rand() - 0.5) * 0.004).toFixed(4));
      const high = Number((Math.max(open, close) + rand() * 0.005).toFixed(4));
      const low = Number((Math.min(open, close) - rand() * 0.005).toFixed(4));
      return {
        timestamp: Date.now() - (total - 1 - index) * intervalMs[timeframe],
        open,
        high,
        low,
        close,
        volume: Math.floor(800_000 + rand() * 2_400_000),
      };
    },
  );

  return {
    pair: quote.symbol,
    timeframe,
    data,
    bid: quote.bid,
    ask: quote.ask,
    spread: quote.spread,
    pipChange: quote.pipChange,
    volatility: quote.volatility,
    high: Math.max(...data.map((entry) => entry.high)),
    low: Math.min(...data.map((entry) => entry.low)),
    timestamp: Date.now(),
  };
}

function createPairs(): ForexPair[] {
  return DEFAULT_FOREX_PAIRS.map((pair, index) => {
    const { baseCurrency, quoteCurrency } = splitForexPair(pair);
    return {
      symbol: pair,
      baseCurrency,
      quoteCurrency,
      name: `${baseCurrency} / ${quoteCurrency}`,
      region: index < 4 ? "Majors" : "Crosses",
      popularity: 100 - index * 7,
    };
  });
}

export async function getForexPairs(): Promise<ForexPair[]> {
  if (USE_MOCKS) {
    await delay();
    return createPairs();
  }

  const response = await apiClient.get<ForexPair[]>("/forex/pairs");
  return response.data;
}

export async function getLiveForexRate(symbol: string): Promise<ForexQuote> {
  if (USE_MOCKS) {
    await delay();
    return createQuote(symbol);
  }

  const response = await apiClient.get<ForexQuote>(
    `/forex/rates/${forexPairId(symbol)}`,
  );
  return response.data;
}

export async function getForexHistoricalRates(
  symbol: string,
  timeframe: ForexTimeframe = "1D",
): Promise<ForexHistoricalSeries> {
  if (USE_MOCKS) {
    await delay();
    return createHistoricalSeries(symbol, timeframe);
  }

  const response = await apiClient.get<ForexHistoricalSeries>(
    `/forex/historical/${forexPairId(symbol)}`,
    {
      params: { timeframe },
    },
  );
  return response.data;
}

export async function getForexMovers(): Promise<ForexDashboardData> {
  if (USE_MOCKS) {
    await delay();
    const quotes = createPairs().map((pair) => createQuote(pair.symbol));
    const ranked = [...quotes].sort(
      (left, right) => right.dailyChangePercent - left.dailyChangePercent,
    );
    const volatilityRanked = [...quotes].sort(
      (left, right) => right.volatility - left.volatility,
    );

    return {
      majorPairs: quotes.slice(0, 6),
      gainers: ranked.slice(0, 3),
      losers: ranked.slice(-3).reverse(),
      volatilePairs: volatilityRanked.slice(0, 3),
      timestamp: Date.now(),
    };
  }

  const response = await apiClient.get<ForexDashboardData>("/forex/movers");
  return response.data;
}

export async function getForexDashboardData(): Promise<ForexDashboardData> {
  if (USE_MOCKS) {
    return getForexMovers();
  }

  const response = await apiClient.get<ForexDashboardData>("/forex/dashboard");
  return response.data;
}

export async function searchForexPairs(
  query: string,
  limit = 10,
): Promise<ForexSearchResult[]> {
  const term = query.trim().toUpperCase();
  if (!term) return [];

  if (USE_MOCKS) {
    await delay(120);
    return createPairs()
      .map((pair) => createQuote(pair.symbol))
      .filter(
        (quote) =>
          quote.symbol.includes(term) ||
          quote.name.includes(term) ||
          quote.baseCurrency.includes(term) ||
          quote.quoteCurrency.includes(term),
      )
      .sort((left, right) => right.popularity - left.popularity)
      .slice(0, limit)
      .map((quote) => ({
        symbol: quote.symbol,
        displayName: quote.name,
        baseCurrency: quote.baseCurrency,
        quoteCurrency: quote.quoteCurrency,
        price: quote.price,
        spread: quote.spread,
        dailyChangePercent: quote.dailyChangePercent,
        popularity: quote.popularity,
        trend: quote.trend,
      }));
  }

  const response = await apiClient.get<ForexSearchResult[]>("/forex/search", {
    params: { query: term, limit },
  });
  return response.data;
}
