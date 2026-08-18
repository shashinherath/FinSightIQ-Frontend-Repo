export interface PortfolioSummary {
  id: string;
  name: string;
  currency: string;
  openedLabel: string;
  holdingsCount: number;
  value: number;
  costBasis: number;
  unrealizedPl: number;
  unrealizedPct: number;
  realizedPl: number;
  spark: number[];
}

export interface Holding {
  id: string;
  portfolioId: string;
  symbol: string;
  name: string;
  qty: number;
  avgEntry: number;
  current: number;
  pl: number;
  plPct: number;
  weight: number;
  firstBoughtLabel: string;
}

export type TransactionSide = "BUY" | "SELL";

export interface LedgerEntry {
  id: string;
  date: string;
  side: TransactionSide;
  qty: number;
  price: number;
  fee: number;
  value: number;
}

export interface AllocationSlice {
  label: string;
  pct: number;
  color: string;
}

export interface ContributionRow {
  symbol: string;
  pl: number;
  returnPct: number;
  contributionPct: number;
}

export interface BenchmarkPoint {
  label: string;
  portfolio: number;
  benchmark: number;
}

export interface AnalyticsSummary {
  returnSinceInceptionPct: number;
  benchmarkReturnPct: number;
  maxDrawdownPct: number;
  drawdownWindowLabel: string;
  annualisedVolatilityPct: number;
  tradingDays: number;
}

export interface PortfolioAnalytics {
  allocation: AllocationSlice[];
  sectors: AllocationSlice[];
  contribution: ContributionRow[];
  benchmarkSeries: BenchmarkPoint[];
  summary: AnalyticsSummary;
}
