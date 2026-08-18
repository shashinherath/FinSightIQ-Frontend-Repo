/**
 * Stock Details Page
 * Comprehensive stock analysis page with charts and detailed information
 */

import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import {
  useStockQuote,
  useHistoricalPrices,
  useMarketStatistics,
  useCompanyInfo,
} from "@/features/market/hooks/useMarketQueries";
import {
  useRealtimePrice,
  useSignalRConnection,
} from "@/features/market/hooks/useSignalR";
import {
  CandlestickChart,
  VolumeChart,
} from "@/features/market/components/charts";
import {
  DashboardWidget,
  WidgetSkeleton,
} from "@/features/market/components/dashboard/DashboardWidget";
import { MarketStatisticsPanel } from "@/features/market/components/dashboard/MarketCards";
import { AddToWatchlistButton } from "@/features/market/components/watchlist/AddToWatchlistButton";
import { useMarketStore } from "@/features/market/store";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { cn } from "@/shared/utils/cn";

const TIMEFRAMES = ["1D", "1W", "1M", "3M", "6M", "1Y", "5Y"] as const;
type Timeframe = (typeof TIMEFRAMES)[number];

export function StockDetailsPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();

  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>("1M");
  const { setTimeframe } = useMarketStore();

  // Fetch data
  const { data: quote, isLoading: quoteLoading } = useStockQuote(symbol || "", {
    enabled: !!symbol,
  });
  const { data: stats, isLoading: statsLoading } = useMarketStatistics(
    symbol || "",
    { enabled: !!symbol },
  );
  const { data: company, isLoading: companyLoading } = useCompanyInfo(
    symbol || "",
    { enabled: !!symbol },
  );
  const { data: historicalData, isLoading: historicalLoading } =
    useHistoricalPrices(symbol || "", selectedTimeframe, true, {
      enabled: !!symbol,
    });

  // Realtime price + connection status
  const realtime = useRealtimePrice(symbol || null);
  const { isConnected } = useSignalRConnection();

  const price = realtime?.price ?? quote?.price;
  const priceChange = realtime?.change ?? quote?.priceChange;
  const priceChangePercent =
    realtime?.changePercent ?? quote?.priceChangePercent;
  const isUp = (priceChange ?? 0) >= 0;
  const asOf = realtime?.timestamp ?? quote?.timestamp;

  const week52Range = useMemo(() => {
    if (!stats || !price) return null;
    const { week52Low, week52High } = stats;
    const span = week52High - week52Low || 1;
    const pct = Math.min(100, Math.max(0, ((price - week52Low) / span) * 100));
    const fromLow = ((price - week52Low) / week52Low) * 100;
    const fromHigh = ((week52High - price) / week52High) * 100;
    return { week52Low, week52High, pct, fromLow, fromHigh };
  }, [stats, price]);

  if (!symbol) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-down mx-auto mb-4" />
          <p className="text-muted-foreground">Stock symbol not found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/app/market")}
          >
            Back to Market
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-12">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate("/app/market")}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Markets
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {quoteLoading ? "Loading…" : symbol}
            {company?.name ? ` · ${company.name}` : ""}
          </h1>
          <p className="text-xs text-muted-foreground">
            {[quote?.exchange, company?.sector].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold tracking-tight tabular-nums">
                {price != null ? `$${price.toFixed(2)}` : "—"}
              </span>
              {priceChange != null && priceChangePercent != null && (
                <span
                  className={cn(
                    "text-base font-semibold tabular-nums",
                    isUp ? "text-up" : "text-down",
                  )}
                >
                  {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
                  {priceChange.toFixed(2)} ({isUp ? "+" : ""}
                  {priceChangePercent.toFixed(2)}%)
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground tabular-nums flex items-center gap-1.5">
              {asOf ? new Date(asOf).toLocaleTimeString() : "—"}
              {isConnected && (
                <>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
                  </span>
                  live
                </>
              )}
            </span>
          </div>
          <AddToWatchlistButton symbol={symbol} showText />
        </div>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList>
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        {/* Chart tab */}
        <TabsContent value="chart" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setSelectedTimeframe(tf);
                    setTimeframe(tf);
                  }}
                  className={cn(
                    "min-h-9 rounded-md border px-3.5 text-xs font-semibold transition-colors",
                    selectedTimeframe === tf
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-transparent text-foreground hover:bg-accent",
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {asOf ? new Date(asOf).toLocaleString() : ""}
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-base font-semibold">
                Daily candles and volume · {selectedTimeframe}
              </h2>
            </div>
            {historicalLoading ? (
              <WidgetSkeleton lines={6} />
            ) : historicalData && historicalData.data.length > 0 ? (
              <div className="flex flex-col gap-3">
                <CandlestickChart
                  symbol={symbol}
                  data={historicalData.data}
                  indicators={historicalData.indicators}
                  height={420}
                  loading={historicalLoading}
                />
                <VolumeChart data={historicalData.data} height={160} />
                <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-2 rounded-sm bg-up" />
                    close above open
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-2 rounded-sm bg-down" />
                    close below open
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No chart data available</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col gap-4">
              <h3 className="text-base font-semibold">Key statistics</h3>
              {statsLoading ? (
                <WidgetSkeleton lines={8} />
              ) : stats ? (
                <MarketStatisticsPanel
                  stats={{
                    Open: `$${stats.open.toFixed(2)}`,
                    High: `$${stats.high.toFixed(2)}`,
                    Low: `$${stats.low.toFixed(2)}`,
                    Volume: `${(stats.volume / 1_000_000).toFixed(1)}M`,
                    "Market Cap": stats.marketCap
                      ? `$${(stats.marketCap / 1_000_000_000).toFixed(2)}B`
                      : "N/A",
                    "PE Ratio": stats.peRatio?.toFixed(2) || "N/A",
                    EPS: stats.eps?.toFixed(2) || "N/A",
                    "Avg Volume": stats.avgVolume
                      ? `${(stats.avgVolume / 1_000_000).toFixed(1)}M`
                      : "N/A",
                  }}
                />
              ) : (
                <p className="text-muted-foreground">No data available</p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col gap-3">
              <h3 className="text-base font-semibold">52-week range</h3>
              {statsLoading ? (
                <WidgetSkeleton lines={3} />
              ) : week52Range ? (
                <div className="flex flex-col gap-2.5">
                  <div className="relative h-2 rounded-full bg-muted">
                    <div
                      className="absolute top-0 h-2 rounded-full bg-primary"
                      style={{
                        left: 0,
                        width: `${week52Range.pct}%`,
                      }}
                    />
                    <div
                      className="absolute -top-1 h-4 w-1 rounded-sm bg-primary"
                      style={{ left: `${week52Range.pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
                    <span>{week52Range.week52Low.toFixed(2)} low</span>
                    <span>{week52Range.week52High.toFixed(2)} high</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Trading {week52Range.fromHigh.toFixed(1)}% below the 52-week
                    high and {week52Range.fromLow.toFixed(1)}% above the low.
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">No data available</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Overview tab */}
        <TabsContent
          value="overview"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          <DashboardWidget
            title="Market Statistics"
            description="Key metrics"
            collapsible
            loading={statsLoading}
          >
            {statsLoading ? (
              <WidgetSkeleton lines={8} />
            ) : stats ? (
              <MarketStatisticsPanel
                stats={{
                  "Market Cap": stats.marketCap
                    ? `$${(stats.marketCap / 1_000_000_000).toFixed(2)}B`
                    : "N/A",
                  "PE Ratio": stats.peRatio?.toFixed(2) || "N/A",
                  EPS: stats.eps?.toFixed(2) || "N/A",
                  Dividend: stats.dividend?.toFixed(2) || "N/A",
                  "Dividend Yield": stats.dividendYield
                    ? `${stats.dividendYield.toFixed(2)}%`
                    : "N/A",
                  "52 Week High": `$${stats.week52High.toFixed(2)}`,
                  "52 Week Low": `$${stats.week52Low.toFixed(2)}`,
                  "Avg Volume": stats.avgVolume
                    ? `${(stats.avgVolume / 1_000_000).toFixed(1)}M`
                    : "N/A",
                }}
              />
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </DashboardWidget>

          <DashboardWidget
            title="Company Info"
            description="Business details"
            collapsible
            loading={companyLoading}
          >
            {companyLoading ? (
              <WidgetSkeleton lines={8} />
            ) : company ? (
              <div className="space-y-4">
                {company.sector && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Sector
                    </p>
                    <p className="text-foreground">{company.sector}</p>
                  </div>
                )}
                {company.industry && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Industry
                    </p>
                    <p className="text-foreground">{company.industry}</p>
                  </div>
                )}
                {company.ceo && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      CEO
                    </p>
                    <p className="text-foreground">{company.ceo}</p>
                  </div>
                )}
                {company.headquarters && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Headquarters
                    </p>
                    <p className="text-foreground">{company.headquarters}</p>
                  </div>
                )}
                {company.employeeCount && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Employees
                    </p>
                    <p className="text-foreground">
                      {company.employeeCount.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </DashboardWidget>

          <DashboardWidget
            title="About"
            description="Company overview"
            collapsible
            loading={companyLoading}
          >
            {companyLoading ? (
              <WidgetSkeleton lines={6} />
            ) : company?.description ? (
              <p className="text-sm leading-relaxed text-foreground/90">
                {company.description}
              </p>
            ) : (
              <p className="text-muted-foreground">No description available</p>
            )}
          </DashboardWidget>
        </TabsContent>
      </Tabs>

      <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>
          Market data only. Not financial advice. Past performance does not
          guarantee future results.
        </span>
      </div>
    </div>
  );
}
