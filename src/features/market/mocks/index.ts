/**
 * Mock Data for Development and Testing
 * Remove or disable when backend API is ready
 */

import type {
  StockQuote,
  OHLCData,
  MarketOverview,
  TopMovers,
  StockDetails,
  SearchResult,
  Watchlist,
  CompanyInfo,
  MarketStatistics,
  MarketIndex,
} from "@/features/market/types";

// ============================================================================
// MOCK COMPANIES
// ============================================================================

const mockCompanies = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Consumer Electronics",
    description:
      "Apple designs, manufactures, and sells smartphones, computers, and wearables.",
    ceo: "Tim Cook",
    headquarters: "Cupertino, CA",
    employees: 164000,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Software",
    description:
      "Microsoft develops software, cloud services, and gaming platforms.",
    ceo: "Satya Nadella",
    headquarters: "Redmond, WA",
    employees: 221000,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Internet Services",
    description:
      "Alphabet offers search engines, advertising, cloud services, and hardware.",
    ceo: "Sundar Pichai",
    headquarters: "Mountain View, CA",
    employees: 190544,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    exchange: "NASDAQ",
    sector: "Consumer Cyclical",
    industry: "Automotive",
    description:
      "Tesla manufactures electric vehicles and energy storage products.",
    ceo: "Elon Musk",
    headquarters: "Austin, TX",
    employees: 127855,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    exchange: "NASDAQ",
    sector: "Consumer Cyclical",
    industry: "Retail-Internet",
    description:
      "Amazon provides e-commerce, cloud computing, and digital services.",
    ceo: "Andy Jassy",
    headquarters: "Seattle, WA",
    employees: 1608000,
  },
];

// ============================================================================
// MOCK STOCK QUOTES
// ============================================================================

export const generateMockQuote = (symbol: string): StockQuote => {
  const basePrice: Record<string, number> = {
    AAPL: 180,
    MSFT: 370,
    GOOGL: 140,
    TSLA: 250,
    AMZN: 170,
  };

  const price = basePrice[symbol] || 100;
  const change = (Math.random() - 0.5) * 10;
  const changePercent = (change / price) * 100;

  return {
    symbol,
    name: mockCompanies.find((c) => c.symbol === symbol)?.name || symbol,
    exchange: "NASDAQ",
    currency: "USD",
    price: price + change,
    priceChange: change,
    priceChangePercent: changePercent,
    timestamp: Date.now(),
  };
};

// ============================================================================
// MOCK HISTORICAL DATA
// ============================================================================

export const generateMockOHLCData = (
  symbol: string,
  days: number = 30,
): OHLCData[] => {
  const basePrice: Record<string, number> = {
    AAPL: 180,
    MSFT: 370,
    GOOGL: 140,
    TSLA: 250,
    AMZN: 170,
  };

  let price = basePrice[symbol] || 100;
  const data: OHLCData[] = [];

  for (let i = days; i >= 0; i--) {
    const timestamp = Date.now() - i * 24 * 60 * 60 * 1000;
    const change = (Math.random() - 0.5) * 5;
    const volatility = Math.random() * 2;

    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + volatility;
    const low = Math.min(open, close) - volatility;
    const volume = Math.random() * 100_000_000 + 50_000_000;

    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume,
      vwap: (open + high + low + close) / 4,
    });

    price = close;
  }

  return data;
};

// ============================================================================
// MOCK MARKET STATISTICS
// ============================================================================

export const generateMockStatistics = (symbol: string): MarketStatistics => {
  const quote = generateMockQuote(symbol);
  const basePrice = quote.price;

  return {
    symbol,
    open: basePrice + (Math.random() - 0.5) * 5,
    high: basePrice + Math.random() * 10,
    low: basePrice - Math.random() * 10,
    volume: Math.random() * 100_000_000 + 50_000_000,
    marketCap: 3_000_000_000_000 * Math.random(),
    peRatio: 20 + Math.random() * 10,
    eps: basePrice * (0.05 + Math.random() * 0.05),
    dividend: Math.random() * 2,
    dividendYield: Math.random() * 5,
    week52High: basePrice * 1.5,
    week52Low: basePrice * 0.8,
    avgVolume: 60_000_000,
    beta: 1 + Math.random(),
    sharesOutstanding: 3_000_000_000,
  };
};

// ============================================================================
// MOCK COMPANY INFO
// ============================================================================

export const generateMockCompanyInfo = (symbol: string): CompanyInfo => {
  const company = mockCompanies.find((c) => c.symbol === symbol);

  return {
    symbol,
    name: company?.name || symbol,
    exchange: "NASDAQ",
    currency: "USD",
    sector: company?.sector,
    industry: company?.industry,
    description: company?.description,
    ceo: company?.ceo,
    headquarters: company?.headquarters,
    employeeCount: company?.employees,
    website: `https://www.${symbol.toLowerCase()}.com`,
    founded: "2000",
  };
};

// ============================================================================
// MOCK MARKET INDEXES
// ============================================================================

export const generateMockIndexes = (): MarketIndex[] => {
  return [
    {
      symbol: "SPX",
      name: "S&P 500",
      value: 4500 + Math.random() * 200,
      change: (Math.random() - 0.5) * 50,
      changePercent: (Math.random() - 0.5) * 2,
      timestamp: Date.now(),
    },
    {
      symbol: "CCMP",
      name: "NASDAQ-100",
      value: 14000 + Math.random() * 500,
      change: (Math.random() - 0.5) * 100,
      changePercent: (Math.random() - 0.5) * 3,
      timestamp: Date.now(),
    },
    {
      symbol: "INDU",
      name: "Dow Jones",
      value: 35000 + Math.random() * 1000,
      change: (Math.random() - 0.5) * 100,
      changePercent: (Math.random() - 0.5) * 2,
      timestamp: Date.now(),
    },
    {
      symbol: "RUT",
      name: "Russell 2000",
      value: 2000 + Math.random() * 100,
      change: (Math.random() - 0.5) * 30,
      changePercent: (Math.random() - 0.5) * 2.5,
      timestamp: Date.now(),
    },
  ];
};

// ============================================================================
// MOCK TOP MOVERS
// ============================================================================

export const generateMockTopMovers = (): TopMovers => {
  const symbols = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN"];

  const gainers = symbols.map((symbol) => {
    const quote = generateMockQuote(symbol);
    return {
      ...quote,
      priceChange: Math.random() * 20,
      priceChangePercent: Math.random() * 10,
    };
  });

  const losers = symbols.map((symbol) => {
    const quote = generateMockQuote(symbol);
    return {
      ...quote,
      priceChange: -(Math.random() * 20),
      priceChangePercent: -(Math.random() * 10),
    };
  });

  const mostActive = symbols.map((symbol) => generateMockQuote(symbol));

  return {
    gainers: gainers.sort(
      (a, b) => b.priceChangePercent - a.priceChangePercent,
    ),
    losers: losers.sort((a, b) => a.priceChangePercent - b.priceChangePercent),
    mostActive: mostActive.sort(() => Math.random() - 0.5),
  };
};

// ============================================================================
// MOCK MARKET OVERVIEW
// ============================================================================

export const generateMockMarketOverview = (): MarketOverview => {
  return {
    indexes: generateMockIndexes(),
    topMovers: generateMockTopMovers(),
    trendingStocks: ["AAPL", "MSFT", "GOOGL", "TSLA"].map((symbol) =>
      generateMockQuote(symbol),
    ),
    marketStatus: "OPEN",
    timestamp: Date.now(),
  };
};

// ============================================================================
// MOCK STOCK DETAILS
// ============================================================================

export const generateMockStockDetails = (symbol: string): StockDetails => {
  return {
    quote: generateMockQuote(symbol),
    statistics: generateMockStatistics(symbol),
    company: generateMockCompanyInfo(symbol),
    historicalData: {
      symbol,
      timeframe: "1M",
      data: generateMockOHLCData(symbol, 30),
      indicators: {
        sma: generateMockOHLCData(symbol, 30).map((d) => d.close),
        ema: generateMockOHLCData(symbol, 30).map((d) => d.close * 0.98),
      },
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString(),
    },
  };
};

// ============================================================================
// MOCK SEARCH RESULTS
// ============================================================================

export const generateMockSearchResults = (query: string): SearchResult[] => {
  const allSymbols = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN"];

  return allSymbols
    .filter((symbol) => symbol.includes(query.toUpperCase()))
    .map((symbol) => ({
      symbol,
      name: mockCompanies.find((c) => c.symbol === symbol)?.name || symbol,
      exchange: "NASDAQ",
      currency: "USD",
      type: "STOCK" as const,
      matchScore: 1 - Math.random() * 0.2,
    }));
};

// ============================================================================
// MOCK WATCHLIST
// ============================================================================

export const generateMockWatchlist = (): Watchlist => {
  return {
    id: "default-watchlist",
    name: "My Watchlist",
    items: ["AAPL", "MSFT", "GOOGL"].map((symbol, index) => ({
      id: `${symbol}-${index}`,
      symbol,
      name: mockCompanies.find((c) => c.symbol === symbol)?.name || symbol,
      addedAt: Date.now() - index * 24 * 60 * 60 * 1000,
    })),
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
    isDefault: true,
  };
};

// ============================================================================
// ENABLE MOCK DATA INTERCEPTOR
// ============================================================================

export const enableMockDataInterceptor = () => {
  // This function can be called in development to intercept API calls
  // and return mock data instead
  console.log("Mock data interceptor enabled for development");
};
