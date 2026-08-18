import type {
  AllocationSlice,
  BenchmarkPoint,
  ContributionRow,
  Holding,
  LedgerEntry,
  PortfolioAnalytics,
  PortfolioSummary,
} from "../types/portfolio.types";

// Adapted from the Claude Design export (template.html, ~lines 3018-3102):
// PORTFOLIOS, ALLOCATION, SECTORS, CONTRIB, HOLDINGS, LEDGER.

export const PORTFOLIOS: PortfolioSummary[] = [
  {
    id: "core-growth",
    name: "Core growth",
    currency: "USD",
    openedLabel: "3 Feb 2026",
    holdingsCount: 4,
    value: 81446.4,
    costBasis: 74527.61,
    unrealizedPl: 6918.79,
    unrealizedPct: 9.28,
    realizedPl: 1204.8,
    spark: [74.5, 75.2, 73.1, 76.4, 78.9, 77.2, 79.8, 81.4],
  },
  {
    id: "income-sleeve",
    name: "Income sleeve",
    currency: "USD",
    openedLabel: "21 Apr 2026",
    holdingsCount: 3,
    value: 22472.25,
    costBasis: 22001.39,
    unrealizedPl: 470.86,
    unrealizedPct: 2.14,
    realizedPl: 0,
    spark: [22.0, 22.1, 21.8, 22.2, 22.3, 22.2, 22.4, 22.47],
  },
];

const HOLDINGS: Holding[] = [
  {
    id: "core-growth:NVDA",
    portfolioId: "core-growth",
    symbol: "NVDA",
    name: "NVIDIA Corp",
    qty: 120,
    avgEntry: 151.46,
    current: 182.44,
    pl: 3717.69,
    plPct: 20.45,
    weight: 26.88,
    firstBoughtLabel: "3 February 2026",
  },
  {
    id: "core-growth:MSFT",
    portfolioId: "core-growth",
    symbol: "MSFT",
    name: "Microsoft Corp",
    qty: 45,
    avgEntry: 468.9,
    current: 517.6,
    pl: 2191.5,
    plPct: 10.39,
    weight: 28.6,
    firstBoughtLabel: "3 February 2026",
  },
  {
    id: "core-growth:AAPL",
    portfolioId: "core-growth",
    symbol: "AAPL",
    name: "Apple Inc.",
    qty: 80,
    avgEntry: 214.6,
    current: 231.18,
    pl: 1326.4,
    plPct: 7.72,
    weight: 22.71,
    firstBoughtLabel: "10 February 2026",
  },
  {
    id: "core-growth:JPM",
    portfolioId: "core-growth",
    symbol: "JPM",
    name: "JPMorgan Chase",
    qty: 60,
    avgEntry: 301.4,
    current: 296.12,
    pl: -316.8,
    plPct: -1.75,
    weight: 21.81,
    firstBoughtLabel: "18 February 2026",
  },
  {
    id: "income-sleeve:AGG",
    portfolioId: "income-sleeve",
    symbol: "AGG",
    name: "iShares Core US Aggregate Bond",
    qty: 120,
    avgEntry: 98.1,
    current: 99.42,
    pl: 158.4,
    plPct: 1.35,
    weight: 42.5,
    firstBoughtLabel: "21 April 2026",
  },
  {
    id: "income-sleeve:VYM",
    portfolioId: "income-sleeve",
    symbol: "VYM",
    name: "Vanguard High Dividend Yield",
    qty: 65,
    avgEntry: 130.2,
    current: 134.86,
    pl: 302.9,
    plPct: 3.58,
    weight: 34.9,
    firstBoughtLabel: "21 April 2026",
  },
  {
    id: "income-sleeve:TLT",
    portfolioId: "income-sleeve",
    symbol: "TLT",
    name: "iShares 20+ Year Treasury Bond",
    qty: 55,
    avgEntry: 90.6,
    current: 90.02,
    pl: -31.9,
    plPct: -0.64,
    weight: 22.6,
    firstBoughtLabel: "3 May 2026",
  },
];

const LEDGER: Record<string, LedgerEntry[]> = {
  "core-growth:NVDA": [
    {
      id: "core-growth:NVDA:1",
      date: "2026-02-03",
      side: "BUY",
      qty: 80,
      price: 142.6,
      fee: 1.25,
      value: 11409.25,
    },
    {
      id: "core-growth:NVDA:2",
      date: "2026-04-17",
      side: "BUY",
      qty: 55,
      price: 164.3,
      fee: 1.25,
      value: 9037.75,
    },
    {
      id: "core-growth:NVDA:3",
      date: "2026-06-11",
      side: "SELL",
      qty: 15,
      price: 176.4,
      fee: 1.25,
      value: -2644.75,
    },
  ],
};

const ALLOCATION_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const ANALYTICS: Record<string, PortfolioAnalytics> = {
  "core-growth": {
    allocation: [
      { label: "MSFT", pct: 28.6, color: ALLOCATION_COLORS[0] },
      { label: "NVDA", pct: 26.88, color: ALLOCATION_COLORS[1] },
      { label: "AAPL", pct: 22.71, color: ALLOCATION_COLORS[2] },
      { label: "JPM", pct: 21.81, color: ALLOCATION_COLORS[3] },
    ],
    sectors: [
      { label: "Technology", pct: 78.19, color: ALLOCATION_COLORS[0] },
      { label: "Financials", pct: 21.81, color: ALLOCATION_COLORS[3] },
    ],
    contribution: [
      { symbol: "NVDA", pl: 3717.69, returnPct: 20.45, contributionPct: 4.99 },
      { symbol: "MSFT", pl: 2191.5, returnPct: 10.39, contributionPct: 2.94 },
      { symbol: "AAPL", pl: 1326.4, returnPct: 7.72, contributionPct: 1.78 },
      { symbol: "JPM", pl: -316.8, returnPct: -1.75, contributionPct: -0.43 },
    ],
    benchmarkSeries: [
      { label: "Feb", portfolio: 100, benchmark: 100 },
      { label: "Mar", portfolio: 104.1, benchmark: 102.6 },
      { label: "Apr", portfolio: 106.4, benchmark: 103.8 },
      { label: "May (low)", portfolio: 92.9, benchmark: 98.1 },
      { label: "Jun", portfolio: 100.5, benchmark: 101.0 },
      { label: "Jul", portfolio: 105.9, benchmark: 104.2 },
      { label: "Aug", portfolio: 109.3, benchmark: 106.4 },
    ],
    summary: {
      returnSinceInceptionPct: 9.28,
      benchmarkReturnPct: 6.41,
      maxDrawdownPct: -7.12,
      drawdownWindowLabel: "12 May – 4 Jun · recovered",
      annualisedVolatilityPct: 18.4,
      tradingDays: 190,
    },
  },
  "income-sleeve": {
    allocation: [
      { label: "AGG", pct: 42.5, color: ALLOCATION_COLORS[0] },
      { label: "VYM", pct: 34.9, color: ALLOCATION_COLORS[1] },
      { label: "TLT", pct: 22.6, color: ALLOCATION_COLORS[2] },
    ],
    sectors: [
      { label: "Fixed income", pct: 65.1, color: ALLOCATION_COLORS[0] },
      { label: "Equity income", pct: 34.9, color: ALLOCATION_COLORS[1] },
    ],
    contribution: [
      { symbol: "VYM", pl: 302.9, returnPct: 3.58, contributionPct: 1.35 },
      { symbol: "AGG", pl: 158.4, returnPct: 1.35, contributionPct: 0.71 },
      { symbol: "TLT", pl: -31.9, returnPct: -0.64, contributionPct: -0.14 },
    ],
    benchmarkSeries: [
      { label: "Apr", portfolio: 100, benchmark: 100 },
      { label: "May", portfolio: 100.6, benchmark: 100.9 },
      { label: "Jun", portfolio: 101.2, benchmark: 101.4 },
      { label: "Jul", portfolio: 101.7, benchmark: 101.9 },
      { label: "Aug", portfolio: 102.14, benchmark: 102.3 },
    ],
    summary: {
      returnSinceInceptionPct: 2.14,
      benchmarkReturnPct: 2.3,
      maxDrawdownPct: -1.1,
      drawdownWindowLabel: "9 Jun – 18 Jun · recovered",
      annualisedVolatilityPct: 5.6,
      tradingDays: 84,
    },
  },
};

export function getPortfolios(): PortfolioSummary[] {
  return PORTFOLIOS;
}

export function getPortfolioById(id: string): PortfolioSummary | undefined {
  return PORTFOLIOS.find((p) => p.id === id);
}

export function getHoldingsByPortfolio(portfolioId: string): Holding[] {
  return HOLDINGS.filter((h) => h.portfolioId === portfolioId);
}

export function getHolding(
  portfolioId: string,
  symbol: string,
): Holding | undefined {
  return HOLDINGS.find(
    (h) =>
      h.portfolioId === portfolioId &&
      h.symbol.toLowerCase() === symbol.toLowerCase(),
  );
}

export function getLedger(portfolioId: string, symbol: string): LedgerEntry[] {
  const key = `${portfolioId}:${symbol.toUpperCase()}`;
  if (LEDGER[key]) return LEDGER[key];

  // No explicit ledger recorded for this holding — synthesize the opening
  // BUY so the ledger view always reflects the current position.
  const holding = getHolding(portfolioId, symbol);
  if (!holding) return [];
  return [
    {
      id: `${key}:opening`,
      date: "2026-04-21",
      side: "BUY",
      qty: holding.qty,
      price: holding.avgEntry,
      fee: 1.0,
      value: holding.qty * holding.avgEntry,
    },
  ];
}

export function getAnalytics(portfolioId: string): PortfolioAnalytics {
  return ANALYTICS[portfolioId] ?? ANALYTICS["core-growth"];
}

export type { AllocationSlice, BenchmarkPoint, ContributionRow };
