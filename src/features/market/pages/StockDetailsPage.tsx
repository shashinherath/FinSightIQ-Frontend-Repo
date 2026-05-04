/**
 * Stock Details Page
 * Comprehensive stock analysis page with charts and detailed information
 */

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import {
  useStockQuote,
  useHistoricalPrices,
  useMarketStatistics,
  useCompanyInfo,
} from "@/features/market/hooks/useMarketQueries";
import { useSubscribeToPrice } from "@/features/market/hooks/useSignalR";
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
import { cn } from "@/shared/utils/cn";

export function StockDetailsPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();

  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y"
  >("1M");
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

  // Subscribe to realtime updates
  useSubscribeToPrice(symbol || "");

  if (!symbol) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-slate-400">Stock symbol not found</p>
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

  const timeframes = ["1D", "1W", "1M", "3M", "6M", "1Y", "5Y"] as const;

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Navigation */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/app/market")}
            className="text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
              {quoteLoading ? "Loading..." : symbol}
            </h1>
            {company && <p className="text-slate-400">{company.name}</p>}
          </div>
        </div>
        <AddToWatchlistButton symbol={symbol} showText />
      </div>

      {/* Quote Header */}
      {quote && (
        <div className="border border-slate-700 rounded-lg bg-slate-800/50 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-5xl font-bold text-slate-100 mb-2">
                ${quote.price.toFixed(2)}
              </p>
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "text-lg font-semibold",
                    quote.priceChange >= 0 ? "text-green-400" : "text-red-400",
                  )}
                >
                  {quote.priceChange >= 0 ? "+" : ""}
                  {quote.priceChange.toFixed(2)}
                </span>
                <span
                  className={cn(
                    "text-lg font-semibold",
                    quote.priceChangePercent >= 0
                      ? "text-green-400"
                      : "text-red-400",
                  )}
                >
                  {quote.priceChangePercent >= 0 ? "+" : ""}
                  {quote.priceChangePercent.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="text-right text-slate-400 text-sm">
              <p>{quote.exchange}</p>
              <p className="mt-2">
                {new Date(quote.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Open
                </p>
                <p className="font-semibold text-slate-100">
                  ${stats.open.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  High
                </p>
                <p className="font-semibold text-slate-100">
                  ${stats.high.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Low
                </p>
                <p className="font-semibold text-slate-100">
                  ${stats.low.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Volume
                </p>
                <p className="font-semibold text-slate-100">
                  {(stats.volume / 1_000_000).toFixed(1)}M
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts */}
      <DashboardWidget
        title="Price Chart"
        description={`${selectedTimeframe} timeframe`}
        collapsible
        loading={historicalLoading}
      >
        <div className="space-y-4">
          {/* Timeframe Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant={selectedTimeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedTimeframe(tf as typeof selectedTimeframe);
                  setTimeframe(tf as typeof selectedTimeframe);
                }}
                className="flex-shrink-0"
              >
                {tf}
              </Button>
            ))}
          </div>

          {/* Candlestick Chart */}
          {historicalData && historicalData.data.length > 0 ? (
            <>
              <CandlestickChart
                symbol={symbol}
                data={historicalData.data}
                indicators={historicalData.indicators}
                height={500}
                loading={historicalLoading}
              />

              {/* Volume Chart */}
              <DashboardWidget
                title="Volume"
                description="Trading volume"
                collapsible
              >
                <VolumeChart data={historicalData.data} height={200} />
              </DashboardWidget>
            </>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400">No chart data available</p>
            </div>
          )}
        </div>
      </DashboardWidget>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Statistics */}
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
            <p className="text-slate-400">No data available</p>
          )}
        </DashboardWidget>

        {/* Company Information */}
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
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Sector
                  </p>
                  <p className="text-slate-100">{company.sector}</p>
                </div>
              )}
              {company.industry && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Industry
                  </p>
                  <p className="text-slate-100">{company.industry}</p>
                </div>
              )}
              {company.ceo && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    CEO
                  </p>
                  <p className="text-slate-100">{company.ceo}</p>
                </div>
              )}
              {company.headquarters && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Headquarters
                  </p>
                  <p className="text-slate-100">{company.headquarters}</p>
                </div>
              )}
              {company.employeeCount && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    Employees
                  </p>
                  <p className="text-slate-100">
                    {company.employeeCount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-400">No data available</p>
          )}
        </DashboardWidget>

        {/* Company Description */}
        <DashboardWidget
          title="About"
          description="Company overview"
          collapsible
          loading={companyLoading}
        >
          {companyLoading ? (
            <WidgetSkeleton lines={6} />
          ) : company?.description ? (
            <p className="text-slate-300 text-sm leading-relaxed">
              {company.description}
            </p>
          ) : (
            <p className="text-slate-400">No description available</p>
          )}
        </DashboardWidget>
      </div>
    </div>
  );
}
