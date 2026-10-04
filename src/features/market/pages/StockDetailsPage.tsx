/**
 * Stock Details Page
 * Comprehensive stock analysis page matching the FinSightIQ prototype:
 * - Sub-navigation tabs: Chart | Forecast | Sentiment
 * - Chart: Candlestick, volume, timeframe selector, OHLC toggle table, statistics, 52-week range
 * - Forecast: Horizon (1D-90D), Model selector (Prophet, ARIMA, LSTM, Ensemble), Handoff states,
 *             Price forecast fan chart, data table toggle, confidence ring, signal badge & SHAP attribution
 * - Sentiment: 24h score, mood gauge, source contributions, recent news coverage
 */

import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, AlertCircle, TriangleAlert } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
  useStockQuote,
  useHistoricalPrices,
  useMarketStatistics,
  useCompanyInfo,
} from "@/features/market/hooks/useMarketQueries";
import {
  CandlestickChart,
  VolumeChart,
} from "@/features/market/components/charts";
import { MarketStatisticsPanel } from "@/features/market/components/dashboard/MarketCards";
import {
  ConfidenceRing,
  RiskIndicator,
} from "@/features/predictions/components/summary";
import { EmptyState } from "@/shared/components/EmptyState";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/utils/cn";

type SubTab = "chart" | "forecast" | "sentiment";
type PanelState = "success" | "loading" | "degraded" | "error";

interface SymbolPreset {
  name: string;
  exchange: string;
  sector: string;
  price: number;
  change: number;
  changePct: number;
  open: number;
  prevClose: number;
  high: number;
  low: number;
  volume: string;
  avgVolume: string;
  marketCap: string;
  pe: string;
  low52: number;
  high52: number;
  forecastMid: number;
  forecastRange: string;
  forecastConf: number;
  signal: "BUY" | "HOLD" | "SELL";
  risk: "LOW" | "MEDIUM" | "HIGH";
  sentimentScore: number;
  mood: number;
}

const SYMBOL_PRESETS: Record<string, SymbolPreset> = {
  NVDA: {
    name: "NVIDIA Corp",
    exchange: "NASDAQ",
    sector: "Semiconductors",
    price: 182.44,
    change: 2.86,
    changePct: 1.59,
    open: 179.6,
    prevClose: 179.58,
    high: 183.4,
    low: 180.4,
    volume: "44.1M",
    avgVolume: "41.3M",
    marketCap: "$4.44T",
    pe: "52.8",
    low52: 86.62,
    high52: 195.1,
    forecastMid: 188.6,
    forecastRange: "179.90 – 197.30",
    forecastConf: 84,
    signal: "BUY",
    risk: "MEDIUM",
    sentimentScore: 42,
    mood: 0.42,
  },
  AAPL: {
    name: "Apple Inc.",
    exchange: "NASDAQ",
    sector: "Consumer Electronics",
    price: 231.18,
    change: 2.38,
    changePct: 1.04,
    open: 228.8,
    prevClose: 228.8,
    high: 232.4,
    low: 227.9,
    volume: "38.6M",
    avgVolume: "45.2M",
    marketCap: "$3.52T",
    pe: "33.4",
    low52: 164.08,
    high52: 237.23,
    forecastMid: 234.1,
    forecastRange: "227.90 – 240.30",
    forecastConf: 78,
    signal: "BUY",
    risk: "LOW",
    sentimentScore: 28,
    mood: 0.28,
  },
  MSFT: {
    name: "Microsoft Corp",
    exchange: "NASDAQ",
    sector: "Software & Cloud",
    price: 517.6,
    change: -3.23,
    changePct: -0.62,
    open: 521.0,
    prevClose: 520.83,
    high: 523.5,
    low: 515.2,
    volume: "19.4M",
    avgVolume: "22.1M",
    marketCap: "$3.85T",
    pe: "36.2",
    low52: 395.0,
    high52: 528.0,
    forecastMid: 512.85,
    forecastRange: "498.45 – 527.25",
    forecastConf: 72,
    signal: "HOLD",
    risk: "MEDIUM",
    sentimentScore: 11,
    mood: 0.11,
  },
  AMZN: {
    name: "Amazon.com Inc.",
    exchange: "NASDAQ",
    sector: "E-Commerce & Cloud",
    price: 228.75,
    change: 0.93,
    changePct: 0.41,
    open: 227.5,
    prevClose: 227.82,
    high: 230.1,
    low: 226.4,
    volume: "31.2M",
    avgVolume: "35.8M",
    marketCap: "$2.38T",
    pe: "44.6",
    low52: 166.32,
    high52: 232.0,
    forecastMid: 231.6,
    forecastRange: "222.50 – 240.70",
    forecastConf: 69,
    signal: "BUY",
    risk: "MEDIUM",
    sentimentScore: -6,
    mood: -0.06,
  },
  JPM: {
    name: "JPMorgan Chase & Co.",
    exchange: "NYSE",
    sector: "Financial Services",
    price: 296.12,
    change: -0.53,
    changePct: -0.18,
    open: 297.0,
    prevClose: 296.65,
    high: 298.5,
    low: 294.8,
    volume: "8.9M",
    avgVolume: "9.8M",
    marketCap: "$840B",
    pe: "13.2",
    low52: 185.0,
    high52: 304.5,
    forecastMid: 294.3,
    forecastRange: "288.50 – 300.10",
    forecastConf: 74,
    signal: "HOLD",
    risk: "LOW",
    sentimentScore: 5,
    mood: 0.05,
  },
  TSLA: {
    name: "Tesla Inc.",
    exchange: "NASDAQ",
    sector: "Automotive & Energy",
    price: 341.2,
    change: 0.0,
    changePct: 0.0,
    open: 342.0,
    prevClose: 341.2,
    high: 346.5,
    low: 338.1,
    volume: "62.7M",
    avgVolume: "58.4M",
    marketCap: "$1.08T",
    pe: "78.4",
    low52: 138.8,
    high52: 368.5,
    forecastMid: 345.0,
    forecastRange: "315.00 – 375.00",
    forecastConf: 54,
    signal: "HOLD",
    risk: "HIGH",
    sentimentScore: -24,
    mood: -0.24,
  },
};

const DEFAULT_PRESET: SymbolPreset = {
  name: "Company Inc.",
  exchange: "NASDAQ",
  sector: "Technology",
  price: 150.0,
  change: 1.5,
  changePct: 1.0,
  open: 148.5,
  prevClose: 148.5,
  high: 151.2,
  low: 147.8,
  volume: "25.0M",
  avgVolume: "24.0M",
  marketCap: "$500B",
  pe: "28.5",
  low52: 110.0,
  high52: 165.0,
  forecastMid: 154.0,
  forecastRange: "148.00 – 160.00",
  forecastConf: 75,
  signal: "BUY",
  risk: "MEDIUM",
  sentimentScore: 20,
  mood: 0.2,
};

const OHLC_ROWS = [
  {
    date: "11 Aug",
    o: "163.20",
    h: "165.00",
    l: "161.80",
    c: "164.40",
    v: "38.2M",
    up: true,
  },
  {
    date: "12 Aug",
    o: "164.40",
    h: "166.20",
    l: "163.10",
    c: "163.60",
    v: "41.5M",
    up: false,
  },
  {
    date: "13 Aug",
    o: "163.60",
    h: "164.90",
    l: "160.40",
    c: "160.80",
    v: "55.0M",
    up: false,
  },
  {
    date: "14 Aug",
    o: "160.80",
    h: "163.40",
    l: "159.90",
    c: "162.90",
    v: "47.1M",
    up: true,
  },
  {
    date: "17 Aug",
    o: "179.60",
    h: "183.40",
    l: "180.40",
    c: "182.44",
    v: "44.1M",
    up: true,
  },
];

const FORECAST_TABLE = [
  { date: "18 Aug", mid: "183.20", lo: "179.60", hi: "186.80" },
  { date: "19 Aug", mid: "184.10", lo: "179.10", hi: "189.10" },
  { date: "20 Aug", mid: "184.90", lo: "178.80", hi: "191.00" },
  { date: "21 Aug", mid: "185.60", lo: "178.60", hi: "192.60" },
  { date: "22 Aug", mid: "186.40", lo: "178.90", hi: "193.90" },
  { date: "23 Aug", mid: "187.10", lo: "179.30", hi: "194.90" },
  { date: "24 Aug", mid: "188.60", lo: "179.90", hi: "197.30" },
];

const ATTRIBUTION_ITEMS = [
  { label: "News sentiment", v: 0.38 },
  { label: "RSI (14-day)", v: 0.24 },
  { label: "Price 7 days ago", v: -0.17 },
  { label: "MACD", v: 0.11 },
  { label: "30-day moving average", v: 0.06 },
];

const SENTIMENT_SOURCES = [
  { label: "News", share: 62, score: "+0.48", color: "var(--color-up)" },
  { label: "Social", share: 24, score: "+0.31", color: "var(--color-up)" },
  { label: "Filings", share: 14, score: "+0.12", color: "var(--color-hold)" },
];

const NEWS_ARTICLES = [
  {
    title: "Data-centre orders lift guidance for the third quarter",
    source: "Reuters",
    at: "2 hours ago",
    sentiment: 0.62,
    summary:
      "Management raised the mid-point of its revenue range, citing committed capacity through the first half of next year.",
  },
  {
    title: "Supply constraints on advanced packaging persist",
    source: "Bloomberg",
    at: "6 hours ago",
    sentiment: 0.08,
    summary:
      "Packaging capacity remains the binding constraint on shipments, though two additional lines qualify this quarter.",
  },
  {
    title: "Export licence review widens to a second product tier",
    source: "Financial Times",
    at: "yesterday",
    sentiment: -0.34,
    summary:
      "A review of licence conditions could affect a segment that contributed roughly 9% of revenue last year.",
  },
];

export function StockDetailsPage() {
  const { symbol = "NVDA" } = useParams<{ symbol: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.user?.role ?? "Analyst");
  const isViewer = role === "Viewer";

  const symUpper = symbol.toUpperCase();
  const preset = SYMBOL_PRESETS[symUpper] || DEFAULT_PRESET;

  // Active sub-navigation tab
  const rawTab = searchParams.get("tab");
  const activeTab: SubTab =
    rawTab === "forecast" || rawTab === "sentiment" ? rawTab : "chart";

  const setActiveTab = (tab: SubTab) => {
    setSearchParams({ tab });
  };

  // State for Chart tab
  const [chartRange, setChartRange] = useState<"7D" | "30D" | "90D" | "1Y">(
    "30D",
  );
  const [showOhlc, setShowOhlc] = useState(false);

  // State for Forecast tab
  const [horizon, setHorizon] = useState<"1D" | "7D" | "14D" | "30D" | "90D">(
    "7D",
  );
  const [model, setModel] = useState<"PROPHET" | "ARIMA" | "LSTM" | "ENSEMBLE">(
    "ARIMA",
  );
  const [fcState, setFcState] = useState<PanelState>("success");
  const [showFcTable, setShowFcTable] = useState(false);

  // Queries
  const { data: quote } = useStockQuote(symUpper, { enabled: !!symUpper });
  const { data: stats } = useMarketStatistics(symUpper, {
    enabled: !!symUpper,
  });
  const { data: company } = useCompanyInfo(symUpper, { enabled: !!symUpper });
  const { data: historicalData, isLoading: historicalLoading } =
    useHistoricalPrices(symUpper, "1M", true, { enabled: !!symUpper });

  const price = quote?.price ?? preset.price;
  const change = quote?.priceChange ?? preset.change;
  const changePct = quote?.priceChangePercent ?? preset.changePct;
  const isUp = change >= 0;
  const companyName = company?.name ?? preset.name;
  const exchange = quote?.exchange ?? preset.exchange;
  const sector = company?.sector ?? preset.sector;

  const low52 = stats?.week52Low ?? preset.low52;
  const high52 = stats?.week52High ?? preset.high52;
  const span52 = high52 - low52 || 1;
  const pct52 = Math.min(100, Math.max(0, ((price - low52) / span52) * 100));
  const fromLow52 = ((price - low52) / low52) * 100;
  const fromHigh52 = ((high52 - price) / high52) * 100;

  return (
    <div className="flex flex-col gap-5 pb-14 font-body">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/app/market")}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Markets
        </button>
      </div>

      {/* Header bar matching prototype */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {symUpper} · {companyName}
          </h1>
          <p className="text-xs text-muted-foreground">
            {exchange} · {sector} · Market Status: OPEN
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold tracking-tight tabular-nums">
              {price.toFixed(2)}
            </span>
            <span
              className={cn(
                "text-base font-semibold tabular-nums",
                isUp ? "text-up" : "text-down",
              )}
            >
              {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
              {change.toFixed(2)} ({isUp ? "+" : ""}
              {changePct.toFixed(2)}%)
            </span>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums flex items-center gap-1.5">
            as of 14:32 UTC · live
          </span>
        </div>
      </div>

      {/* Sub-navigation tabs matching prototype Image 3 */}
      <div className="flex w-fit items-center gap-1 rounded-lg border border-border bg-card p-1">
        {(["chart", "forecast", "sentiment"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize cursor-pointer",
              activeTab === tab
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ======================= TAB: CHART ======================= */}
      {activeTab === "chart" && (
        <div className="flex flex-col gap-4">
          {/* Timeframe selector bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {(["7D", "30D", "90D", "1Y"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setChartRange(r)}
                  className={cn(
                    "min-h-9 rounded-md border px-3.5 text-xs font-semibold transition-colors cursor-pointer",
                    chartRange === r
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              as of 14:32 UTC · live
            </span>
          </div>

          {/* Daily candles and volume chart card */}
          <div className="rounded-xl border border-border bg-card shadow-sm p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-base font-semibold">
                Daily candles and volume · {chartRange}
              </h2>
              <button
                type="button"
                onClick={() => setShowOhlc(!showOhlc)}
                className="rounded-md border border-border bg-transparent px-3 py-1.5 font-body text-xs text-foreground transition-colors hover:bg-muted/50 cursor-pointer"
              >
                {showOhlc ? "Hide data table" : "Show data table"}
              </button>
            </div>

            {historicalLoading ? (
              <div className="space-y-3 py-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : historicalData && historicalData.data.length > 0 ? (
              <div className="flex flex-col gap-3">
                <CandlestickChart
                  symbol={symUpper}
                  data={historicalData.data}
                  indicators={historicalData.indicators}
                  height={380}
                  loading={historicalLoading}
                />
                <VolumeChart data={historicalData.data} height={140} />
                <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-2 rounded-sm bg-up" />
                    close above open
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-2 rounded-sm bg-down" />
                    close below open
                  </span>
                  <span>
                    Volume bars carry each candle's colour at 35% opacity.
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No chart data available
                </p>
              </div>
            )}

            {/* Toggleable OHLC data table */}
            {showOhlc && (
              <div className="overflow-x-auto border-t border-border pt-3">
                <div className="min-w-[560px]">
                  <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr_1fr_1.1fr] gap-x-4 border-b border-border py-2 text-xs font-medium text-muted-foreground">
                    <div>Session</div>
                    <div className="text-right">Open</div>
                    <div className="text-right">High</div>
                    <div className="text-right">Low</div>
                    <div className="text-right">Close</div>
                    <div className="text-right">Volume</div>
                  </div>
                  {OHLC_ROWS.map((o) => (
                    <div
                      key={o.date}
                      className="grid grid-cols-[1.1fr_1fr_1fr_1fr_1fr_1.1fr] gap-x-4 border-b border-border/50 py-2 font-display text-[13px] tabular-nums"
                    >
                      <div className="font-body text-xs text-muted-foreground">
                        {o.date}
                      </div>
                      <div className="text-right">{o.o}</div>
                      <div className="text-right">{o.h}</div>
                      <div className="text-right">{o.l}</div>
                      <div
                        className={cn(
                          "text-right font-semibold",
                          o.up ? "text-up" : "text-down",
                        )}
                      >
                        {o.c}
                      </div>
                      <div className="text-right text-muted-foreground font-body text-xs">
                        {o.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key statistics & 52-week range grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col gap-4">
              <h3 className="text-base font-semibold">Key statistics</h3>
              <MarketStatisticsPanel
                stats={{
                  Open: `$${preset.open.toFixed(2)}`,
                  "Prev close": `$${preset.prevClose.toFixed(2)}`,
                  "Day high": `$${preset.high.toFixed(2)}`,
                  "Day low": `$${preset.low.toFixed(2)}`,
                  Volume: preset.volume,
                  "Avg volume": preset.avgVolume,
                  "Market cap": preset.marketCap,
                  "P/E": preset.pe,
                }}
              />
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col gap-3">
              <h3 className="text-base font-semibold">52-week range</h3>
              <div className="flex flex-col gap-2.5">
                <div className="relative h-2 rounded-full bg-muted">
                  <div
                    className="absolute top-0 h-2 rounded-full bg-primary"
                    style={{ left: 0, width: `${pct52}%` }}
                  />
                  <div
                    className="absolute -top-1 h-4 w-1 rounded-sm bg-primary"
                    style={{ left: `${pct52}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
                  <span>{low52.toFixed(2)} low</span>
                  <span>{high52.toFixed(2)} high</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Trading {fromHigh52.toFixed(1)}% below the 52-week high and{" "}
                  {fromLow52.toFixed(1)}% above the low. The shaded region
                  covers the middle two quartiles of closes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB: FORECAST ======================= */}
      {activeTab === "forecast" && (
        <>
          {isViewer ? (
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <EmptyState
                title="Forecasts require the Analyst role"
                description="Your account has Viewer access. Prices, charts and sentiment stay available."
              />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Controls bar matching Image 1 */}
              <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-end gap-6">
                  {/* Forecast Horizon */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Horizon
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      Forecast Horizon
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(["1D", "7D", "14D", "30D", "90D"] as const).map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setHorizon(h)}
                          className={cn(
                            "min-h-9 min-w-10 rounded-md border px-3 text-xs font-semibold transition-colors cursor-pointer",
                            horizon === h
                              ? "border-primary bg-foreground text-background"
                              : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40",
                          )}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prediction Model */}
                  <div className="flex flex-col gap-2 min-w-[240px]">
                    <span className="text-xs font-medium text-muted-foreground">
                      Model
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      Prediction Model
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(["PROPHET", "ARIMA", "LSTM", "ENSEMBLE"] as const).map(
                        (m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setModel(m)}
                            className={cn(
                              "min-h-9 rounded-md border px-3 text-xs font-semibold transition-colors cursor-pointer",
                              model === m
                                ? "border-primary bg-foreground text-background"
                                : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40",
                            )}
                          >
                            {m}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    setFcState("loading");
                    setTimeout(() => setFcState("success"), 1200);
                  }}
                  className="min-h-10 cursor-pointer"
                >
                  New forecast
                </Button>
              </div>

              {/* Handoff Panel State Chips matching Image 1 */}
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 px-3 py-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mr-1">
                  HANDOFF · PANEL STATE (§9)
                </span>
                {(["success", "loading", "degraded", "error"] as const).map(
                  (stateKey) => (
                    <button
                      key={stateKey}
                      type="button"
                      onClick={() => setFcState(stateKey)}
                      className={cn(
                        "rounded-full border px-3 py-1 font-body text-xs font-medium capitalize transition-colors cursor-pointer min-h-8",
                        fcState === stateKey
                          ? "border-primary bg-foreground text-background font-semibold"
                          : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40",
                      )}
                    >
                      {stateKey}
                    </button>
                  ),
                )}
              </div>

              {/* State: Loading */}
              {fcState === "loading" && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-72 w-full" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-3">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-9 w-44" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-3">
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-28 w-full" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Running {model} over {horizon}…
                  </p>
                </div>
              )}

              {/* State: Error */}
              {fcState === "error" && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/60 bg-destructive/10 p-6 flex gap-4 items-start shadow-sm"
                >
                  <TriangleAlert className="h-6 w-6 shrink-0 text-destructive mt-0.5" />
                  <div className="flex flex-col gap-3 flex-1">
                    <h3 className="text-base font-semibold text-foreground">
                      Forecast unavailable
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      The prediction service is not responding. Market data and
                      portfolios are unaffected.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFcState("success")}
                      >
                        Try again
                      </Button>
                      <span className="font-mono text-xs text-muted-foreground">
                        Reference: 4bf92f35-71c0-4c8e-9a11-d3e6
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* State: Degraded */}
              {fcState === "degraded" && (
                <div
                  role="status"
                  className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 flex gap-3 items-start shadow-sm"
                >
                  <TriangleAlert className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-0.5">
                      Partial data
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      News sentiment was unavailable and a neutral value was
                      used. This forecast may differ from one produced with
                      complete inputs.
                    </p>
                  </div>
                </div>
              )}

              {/* State: Success or Degraded Main Content */}
              {(fcState === "success" || fcState === "degraded") && (
                <div className="flex flex-col gap-4">
                  {/* Forecast Fan Chart Card matching Image 1 */}
                  <div className="rounded-xl border border-border bg-card shadow-sm p-5 flex flex-col gap-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h2 className="text-base font-semibold">
                        Price and 7-day forecast
                      </h2>
                      <button
                        type="button"
                        onClick={() => setShowFcTable(!showFcTable)}
                        className="rounded-md border border-border bg-transparent px-3 py-1.5 font-body text-xs text-foreground transition-colors hover:bg-muted/50 cursor-pointer"
                      >
                        {showFcTable ? "Hide data table" : "Show data table"}
                      </button>
                    </div>

                    {/* Accurate SVG Forecast Chart matching Image 1 */}
                    <div className="w-full overflow-hidden rounded-lg bg-card border border-border/40 p-2">
                      <svg
                        viewBox="0 0 980 310"
                        role="img"
                        aria-label="Price and 7-day forecast chart"
                        className="w-full h-auto aspect-[980/310] block"
                      >
                        {/* Shaded future zone */}
                        <rect
                          x="774"
                          y="20"
                          width="166"
                          height="250"
                          fill="hsl(var(--muted) / 0.45)"
                        />

                        {/* Grid lines */}
                        <g
                          stroke="hsl(var(--border))"
                          strokeWidth="1"
                          strokeDasharray="4 6"
                        >
                          <line x1="60" y1="20" x2="940" y2="20" />
                          <line x1="60" y1="70" x2="940" y2="70" />
                          <line x1="60" y1="120" x2="940" y2="120" />
                          <line x1="60" y1="170" x2="940" y2="170" />
                          <line x1="60" y1="220" x2="940" y2="220" />
                        </g>

                        {/* Baseline */}
                        <line
                          x1="60"
                          y1="270"
                          x2="940"
                          y2="270"
                          stroke="hsl(var(--border))"
                          strokeWidth="1"
                        />
                        <line
                          x1="60"
                          y1="20"
                          x2="60"
                          y2="270"
                          stroke="hsl(var(--border))"
                          strokeWidth="1"
                        />

                        {/* Y-axis labels */}
                        <g
                          fill="hsl(var(--muted-foreground))"
                          fontSize="12"
                          fontFamily="var(--font-body)"
                          textAnchor="end"
                        >
                          <text x="50" y="24">
                            200
                          </text>
                          <text x="50" y="74">
                            190
                          </text>
                          <text x="50" y="124">
                            180
                          </text>
                          <text x="50" y="174">
                            170
                          </text>
                          <text x="50" y="224">
                            160
                          </text>
                          <text x="50" y="274">
                            150
                          </text>
                        </g>

                        {/* Axis truncation mark */}
                        <path
                          d="M52 278 L68 282 L52 286 L68 290"
                          fill="none"
                          stroke="hsl(var(--border))"
                          strokeWidth="1.5"
                        />
                        <text
                          x="76"
                          y="289"
                          fill="hsl(var(--muted-foreground))"
                          fontSize="10"
                          fontFamily="var(--font-body)"
                        >
                          axis truncated
                        </text>

                        {/* Confidence fan polygon */}
                        <path
                          d="M774 107.8 L815 97 L857 84 L899 66 L940 33.5 L940 120.5 L899 113 L857 106 L815 105 L774 107.8 Z"
                          fill="hsl(var(--primary) / 0.22)"
                          stroke="hsl(var(--primary) / 0.35)"
                          strokeWidth="1"
                        />

                        {/* Historical actual price polyline */}
                        <polyline
                          points="60,204 131,216 203,188 274,164.5 345,178.5 417,150.5 488,134 559,142 631,123 702,129.5 774,107.8"
                          fill="none"
                          stroke="hsl(var(--foreground))"
                          strokeWidth="2.5"
                          strokeLinejoin="round"
                        />

                        {/* Forecast dashed polyline */}
                        <polyline
                          points="774,107.8 815,99.5 857,92 899,84.5 940,77"
                          fill="none"
                          stroke="hsl(var(--foreground))"
                          strokeWidth="1.5"
                          strokeDasharray="6 5"
                        />

                        {/* Endpoint circles */}
                        <circle
                          cx="774"
                          cy="107.8"
                          r="3.5"
                          fill="hsl(var(--foreground))"
                        />
                        <circle
                          cx="940"
                          cy="77"
                          r="3.5"
                          fill="hsl(var(--foreground))"
                        />

                        {/* Vertical today divider */}
                        <line
                          x1="774"
                          y1="14"
                          x2="774"
                          y2="276"
                          stroke="hsl(var(--muted-foreground))"
                          strokeWidth="1"
                          strokeDasharray="3 4"
                        />
                        <text
                          x="778"
                          y="14"
                          fill="hsl(var(--muted-foreground))"
                          fontSize="11"
                          fontFamily="var(--font-body)"
                        >
                          today · 17 Aug
                        </text>

                        {/* X-axis dates */}
                        <g
                          fill="hsl(var(--muted-foreground))"
                          fontSize="12"
                          fontFamily="var(--font-body)"
                          textAnchor="middle"
                        >
                          <text x="60" y="290">
                            18 Jul
                          </text>
                          <text x="226" y="290">
                            25 Jul
                          </text>
                          <text x="393" y="290">
                            1 Aug
                          </text>
                          <text x="559" y="290">
                            8 Aug
                          </text>
                          <text x="726" y="290">
                            15 Aug
                          </text>
                          <text x="936" y="290">
                            24 Aug
                          </text>
                        </g>
                      </svg>
                    </div>

                    {/* Chart Legend */}
                    <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-2">
                        <span className="h-0.5 w-5 bg-foreground rounded" />
                        actual close
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-5 border-t-2 border-dashed border-foreground" />
                        forecast · {model}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-5 rounded-xs border border-primary/40 bg-primary/20" />
                        84% confidence band
                      </span>
                    </div>

                    {/* Forecast data table */}
                    {showFcTable && (
                      <div className="overflow-x-auto border-t border-border pt-3">
                        <div className="min-w-[500px]">
                          <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-x-4 border-b border-border py-2 text-xs font-medium text-muted-foreground">
                            <div>Date</div>
                            <div className="text-right">Forecast</div>
                            <div className="text-right">Lower</div>
                            <div className="text-right">Upper</div>
                          </div>
                          {FORECAST_TABLE.map((row) => (
                            <div
                              key={row.date}
                              className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-x-4 border-b border-border/50 py-2 font-display text-[13px] tabular-nums"
                            >
                              <div className="font-body text-xs text-muted-foreground">
                                {row.date}
                              </div>
                              <div className="text-right font-semibold text-foreground">
                                {row.mid}
                              </div>
                              <div className="text-right text-muted-foreground">
                                {row.lo}
                              </div>
                              <div className="text-right text-muted-foreground">
                                {row.hi}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom two cards matching Image 1 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                    {/* Left Card: 7-day forecast summary */}
                    <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col gap-5">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        7-DAY FORECAST
                      </span>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-col gap-1 min-w-[160px]">
                          <span className="font-display text-4xl font-semibold tracking-tight tabular-nums">
                            ${preset.forecastMid.toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            range {preset.forecastRange}
                          </span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            confidence {preset.forecastConf}%
                          </span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            target 24 Aug 2026
                          </span>
                        </div>
                        <ConfidenceRing value={preset.forecastConf} />
                      </div>

                      <div className="h-px bg-border" />

                      <div className="flex flex-wrap items-center gap-3">
                        <Badge
                          variant="outline"
                          className="font-semibold text-xs"
                        >
                          ▲ {preset.signal}
                        </Badge>
                        <RiskIndicator level={preset.risk} />
                        <span className="font-mono text-xs text-muted-foreground">
                          {model} · v2026-08-11
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The signal is a mechanical mapping from trend and
                        confidence, not an analyst's judgement.
                      </p>
                    </div>

                    {/* Right Card: What drove this forecast (SHAP attribution) */}
                    <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-0.5">
                          What drove this forecast
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Top five features by absolute impact
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 py-1">
                        {ATTRIBUTION_ITEMS.map((f) => {
                          const wpc = (Math.abs(f.v) / 0.4) * 45;
                          const isPositive = f.v >= 0;
                          return (
                            <div
                              key={f.label}
                              className="grid grid-cols-[140px_1fr_56px] items-center gap-3 text-xs"
                            >
                              <span className="truncate text-muted-foreground">
                                {f.label}
                              </span>
                              <div className="relative h-4 rounded-sm bg-muted/50 overflow-hidden">
                                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border z-10" />
                                <div
                                  className={cn(
                                    "absolute top-0.5 bottom-0.5 rounded-xs",
                                    isPositive ? "bg-up" : "bg-down",
                                  )}
                                  style={{
                                    left: isPositive ? "50%" : `${50 - wpc}%`,
                                    width: `${wpc}%`,
                                  }}
                                />
                              </div>
                              <span
                                className={cn(
                                  "text-right font-display font-semibold tabular-nums text-xs",
                                  isPositive ? "text-up" : "text-down",
                                )}
                              >
                                {isPositive ? "+" : "−"}
                                {Math.abs(f.v).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                        Bars right of centre push the forecast up, left down.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ======================= TAB: SENTIMENT ======================= */}
      {activeTab === "sentiment" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {/* Left Column: 24h Sentiment + Mood */}
            <div className="flex flex-col gap-4">
              {/* Score Card */}
              <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col gap-4">
                <span className="text-xs font-semibold text-muted-foreground">
                  24-HOUR SENTIMENT · {symUpper}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl font-bold tracking-tight text-up tabular-nums">
                    +{preset.sentimentScore}
                  </span>
                  <span className="text-sm font-semibold text-up">Bullish</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-up"
                    style={{
                      width: `${Math.min(100, Math.max(0, preset.sentimentScore + 50))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Mood Card */}
              <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">
                    Market Mood Indicator
                  </h3>
                  <span className="text-sm font-semibold text-up tabular-nums">
                    +{preset.mood.toFixed(2)}
                  </span>
                </div>

                <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 flex gap-2.5 items-start">
                  <TriangleAlert className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Low confidence — computed from 12 articles in the last 24
                    hours. Treat the score as indicative, not a signal.
                  </p>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  as of 14:15 UTC
                </span>
              </div>
            </div>

            {/* Right Column: Where the score comes from */}
            <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col gap-4">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-0.5">
                  Where the score comes from
                </h3>
                <p className="text-xs text-muted-foreground">
                  Contribution by source, last 24 hours
                </p>
              </div>

              <div className="flex flex-col gap-3 py-1">
                {SENTIMENT_SOURCES.map((s) => (
                  <div
                    key={s.label}
                    className="grid grid-cols-[110px_1fr_80px] items-center gap-3 text-xs"
                  >
                    <span className="text-muted-foreground">{s.label}</span>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${s.share}%`,
                          backgroundColor: s.color,
                        }}
                      />
                    </div>
                    <span className="text-right font-display font-semibold tabular-nums text-foreground">
                      {s.score}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-border my-1" />

              <p className="text-xs text-muted-foreground leading-relaxed">
                Each article scores −1 to +1, then weights by source reliability
                and recency. Filings carry the highest weight and the lowest
                volume.
              </p>
            </div>
          </div>

          {/* Recent coverage news cards */}
          <div className="flex flex-col gap-3 pt-2">
            <h3 className="text-base font-semibold text-foreground">
              Recent coverage
            </h3>
            <div className="grid gap-3">
              {NEWS_ARTICLES.map((article) => (
                <div
                  key={article.title}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col gap-2 hover:border-foreground/30 transition-colors"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      {article.title}
                    </h4>
                    <span
                      className={cn(
                        "text-xs font-semibold tabular-nums",
                        article.sentiment > 0
                          ? "text-up"
                          : article.sentiment < 0
                            ? "text-down"
                            : "text-muted-foreground",
                      )}
                    >
                      {article.sentiment > 0 ? "+" : ""}
                      {article.sentiment.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/80">
                      {article.source}
                    </span>
                    <span>·</span>
                    <span>{article.at}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom disclaimer matching prototype */}
      <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/20 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          Model output only. Not financial advice. Past accuracy does not
          guarantee future results.
        </span>
      </div>
    </div>
  );
}
