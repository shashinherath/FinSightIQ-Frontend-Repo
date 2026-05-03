/**
 * Market Overview Page
 * Displays market dashboard with indexes, top movers, and trending stocks
 */

import { useNavigate } from "react-router-dom";
import {
  useMarketOverview,
  useTopMovers,
} from "@/features/market/hooks/useMarketQueries";
import {
  DashboardWidget,
  WidgetSkeleton,
} from "@/features/market/components/dashboard/DashboardWidget";
import {
  MarketSummaryCard,
  TopMoverItem,
} from "@/features/market/components/dashboard/MarketCards";
import { StockSearchInput } from "@/features/market/components/search/StockSearchInput";
import { useSignalR } from "@/features/market/hooks/useSignalR";
import { cn } from "@/shared/utils/cn";

export function MarketOverviewPage() {
  const navigate = useNavigate();

  // Initialize SignalR for realtime updates
  useSignalR(true);

  const { data: overview, isLoading: overviewLoading } = useMarketOverview({
    refetchInterval: 15000,
  });
  const { data: topMovers, isLoading: moversLoading } = useTopMovers({
    refetchInterval: 15000,
  });

  const handleSymbolSelect = (symbol: string) => {
    navigate(`/app/market/stock/${symbol}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Market Overview
        </h1>
        <p className="text-slate-400">
          Track live market data across global exchanges
        </p>
      </div>

      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-slate-900 pb-4">
        <StockSearchInput onSelect={handleSymbolSelect} />
      </div>

      {/* Market Indexes */}
      <DashboardWidget
        title="Market Indexes"
        description="Major market indexes"
        loading={overviewLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewLoading ? (
            [...Array(4)].map((_, i) => <WidgetSkeleton key={i} lines={3} />)
          ) : overview?.indexes.length ? (
            overview.indexes.map((index) => (
              <MarketSummaryCard
                key={index.symbol}
                index={index}
                onClick={() => handleSymbolSelect(index.symbol)}
              />
            ))
          ) : (
            <p className="text-slate-400">No market data available</p>
          )}
        </div>
      </DashboardWidget>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Gainers */}
        <DashboardWidget
          title="Top Gainers"
          description="Best performing stocks"
          loading={moversLoading}
        >
          <div className="space-y-3">
            {moversLoading ? (
              [...Array(5)].map((_, i) => <WidgetSkeleton key={i} lines={2} />)
            ) : topMovers?.gainers.length ? (
              topMovers.gainers.slice(0, 5).map((stock) => (
                <TopMoverItem
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.priceChange}
                  changePercent={stock.priceChangePercent}
                  volume={stock.price * 1000000} // Mock volume
                  onClick={() => handleSymbolSelect(stock.symbol)}
                />
              ))
            ) : (
              <p className="text-slate-400 text-sm">No data available</p>
            )}
          </div>
        </DashboardWidget>

        {/* Top Losers */}
        <DashboardWidget
          title="Top Losers"
          description="Worst performing stocks"
          loading={moversLoading}
        >
          <div className="space-y-3">
            {moversLoading ? (
              [...Array(5)].map((_, i) => <WidgetSkeleton key={i} lines={2} />)
            ) : topMovers?.losers.length ? (
              topMovers.losers.slice(0, 5).map((stock) => (
                <TopMoverItem
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.priceChange}
                  changePercent={stock.priceChangePercent}
                  volume={stock.price * 1000000} // Mock volume
                  onClick={() => handleSymbolSelect(stock.symbol)}
                />
              ))
            ) : (
              <p className="text-slate-400 text-sm">No data available</p>
            )}
          </div>
        </DashboardWidget>

        {/* Most Active */}
        <DashboardWidget
          title="Most Active"
          description="Highest trading volume"
          loading={moversLoading}
        >
          <div className="space-y-3">
            {moversLoading ? (
              [...Array(5)].map((_, i) => <WidgetSkeleton key={i} lines={2} />)
            ) : topMovers?.mostActive.length ? (
              topMovers.mostActive.slice(0, 5).map((stock) => (
                <TopMoverItem
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.priceChange}
                  changePercent={stock.priceChangePercent}
                  volume={stock.price * 1000000} // Mock volume
                  onClick={() => handleSymbolSelect(stock.symbol)}
                />
              ))
            ) : (
              <p className="text-slate-400 text-sm">No data available</p>
            )}
          </div>
        </DashboardWidget>
      </div>

      {/* Trending Stocks */}
      <DashboardWidget
        title="Trending"
        description="Popular stocks this week"
        loading={overviewLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewLoading ? (
            [...Array(4)].map((_, i) => <WidgetSkeleton key={i} lines={3} />)
          ) : overview?.trendingStocks.length ? (
            overview.trendingStocks.map((stock) => (
              <TopMoverItem
                key={stock.symbol}
                symbol={stock.symbol}
                name={stock.name}
                price={stock.price}
                change={stock.priceChange}
                changePercent={stock.priceChangePercent}
                onClick={() => handleSymbolSelect(stock.symbol)}
              />
            ))
          ) : (
            <p className="text-slate-400">No trending data available</p>
          )}
        </div>
      </DashboardWidget>

      {/* Market Status */}
      {overview && (
        <div
          className={cn(
            "p-4 rounded-lg border",
            overview.marketStatus === "OPEN"
              ? "border-green-700/30 bg-green-900/10"
              : "border-slate-700 bg-slate-800/50",
          )}
        >
          <p
            className={cn(
              "text-sm font-semibold",
              overview.marketStatus === "OPEN"
                ? "text-green-400"
                : "text-slate-400",
            )}
          >
            Market Status: {overview.marketStatus.replace(/_/g, " ")}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Last updated: {new Date(overview.timestamp).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}
