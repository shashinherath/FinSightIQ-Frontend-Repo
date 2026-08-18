/**
 * Market Search Page
 * Dedicated search interface for finding and analyzing stocks
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import {
  useSearchSymbols,
  useTopMovers,
} from "@/features/market/hooks/useMarketQueries";
import type { SearchResult } from "@/features/market/types";
import {
  DashboardWidget,
  WidgetSkeleton,
} from "@/features/market/components/dashboard/DashboardWidget";
import { TopMoverItem } from "@/features/market/components/dashboard/MarketCards";
import { AddToWatchlistButton } from "@/features/market/components/watchlist/AddToWatchlistButton";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";

export function MarketSearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const stored = localStorage.getItem("market_search_history");
    return stored ? JSON.parse(stored) : [];
  });

  const { data: searchResults = [], isLoading } = useSearchSymbols(
    searchQuery,
    20,
    { enabled: searchQuery.length > 0 },
  );
  const { data: topMovers, isLoading: moversLoading } = useTopMovers();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && !searchHistory.includes(searchQuery)) {
      const updated = [searchQuery, ...searchHistory].slice(0, 10);
      setSearchHistory(updated);
      localStorage.setItem("market_search_history", JSON.stringify(updated));
    }
  };

  const handleSelectResult = (symbol: string) => {
    navigate(`/app/market/stock/${symbol}`);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("market_search_history");
  };

  return (
    <div className="flex flex-col gap-5 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Markets
          </h1>
          <p className="text-sm text-muted-foreground">
            Search global symbols and open a detail view.
          </p>
        </div>
      </div>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="rounded-xl border border-border bg-card shadow-sm p-4 flex flex-wrap gap-3 items-center"
      >
        <div className="flex-1 min-w-60 flex flex-col gap-2">
          <label
            htmlFor="mkt-search"
            className="text-xs font-medium text-muted-foreground"
          >
            Search by symbol or company
          </label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="mkt-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="NVDA, Apple, semiconductors"
              autoFocus
              className={cn(
                "w-full h-10 pl-9 pr-4 bg-background border border-input rounded-md",
                "text-foreground placeholder:text-muted-foreground text-sm",
                "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                "transition-all duration-200",
              )}
            />
          </div>
        </div>
      </form>

      {/* Search Results */}
      {searchQuery ? (
        <div className="rounded-xl border border-border bg-background overflow-hidden shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/30">
            <div>
              <h2 className="text-base font-semibold">
                {isLoading
                  ? "Searching…"
                  : `${searchResults.length} result${searchResults.length === 1 ? "" : "s"} for "${searchQuery}"`}
              </h2>
              <p className="text-xs text-muted-foreground">
                Click a row to open its chart, statistics and company info
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-4">
              <WidgetSkeleton lines={5} />
            </div>
          ) : searchResults.length > 0 ? (
            <div
              role="table"
              aria-label="Symbol search results"
              className="overflow-x-auto"
            >
              <div className="min-w-[880px]">
                <div
                  role="row"
                  className="grid items-center h-12 px-4 border-b border-border text-xs font-medium text-muted-foreground"
                  style={{
                    gridTemplateColumns: "100px 1.6fr 96px 1fr 1fr 56px",
                    columnGap: 16,
                  }}
                >
                  <div role="columnheader">Symbol</div>
                  <div role="columnheader">Company</div>
                  <div role="columnheader">Exchange</div>
                  <div role="columnheader" className="text-right">
                    Type
                  </div>
                  <div role="columnheader" className="text-right">
                    Match
                  </div>
                  <div role="columnheader" />
                </div>
                {searchResults.map((result: SearchResult) => (
                  <div
                    key={result.symbol}
                    role="row"
                    onClick={() => handleSelectResult(result.symbol)}
                    className="grid items-center cursor-pointer px-4 py-3.5 border-b border-border transition-colors hover:bg-muted/50"
                    style={{
                      gridTemplateColumns: "100px 1.6fr 96px 1fr 1fr 56px",
                      columnGap: 16,
                    }}
                  >
                    <div
                      role="cell"
                      className="font-display text-sm font-semibold"
                    >
                      {result.symbol}
                    </div>
                    <div
                      role="cell"
                      className="text-sm whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {result.name}
                    </div>
                    <div role="cell" className="text-xs text-muted-foreground">
                      {result.exchange}
                    </div>
                    <div
                      role="cell"
                      className="text-right text-xs text-muted-foreground uppercase"
                    >
                      {result.type}
                    </div>
                    <div
                      role="cell"
                      className="text-right text-xs text-muted-foreground tabular-nums"
                    >
                      {result.matchScore && result.matchScore < 1
                        ? `${(result.matchScore * 100).toFixed(0)}%`
                        : "—"}
                    </div>
                    <div
                      role="cell"
                      className="flex justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AddToWatchlistButton
                        symbol={result.symbol}
                        variant="ghost"
                        size="sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                No symbols match &quot;{searchQuery}&quot;
              </p>
              <p className="text-sm text-muted-foreground/80 mt-2">
                Check the ticker, or search by company name. Coverage is US, UK
                and EU listed equities.
              </p>
            </div>
          )}
        </div>
      ) : null}

      {/* Search History */}
      {!searchQuery && searchHistory.length > 0 && (
        <DashboardWidget
          title="Recent Searches"
          description="Your search history"
        >
          <div className="space-y-3">
            {searchHistory.map((query) => (
              <button
                key={query}
                onClick={() => setSearchQuery(query)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg border border-border",
                  "bg-muted/20 hover:bg-muted/40 transition-colors duration-150",
                )}
              >
                <p className="font-semibold text-foreground">{query}</p>
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              className="w-full mt-4"
            >
              Clear History
            </Button>
          </div>
        </DashboardWidget>
      )}

      {/* Top gainers / losers */}
      {!searchQuery && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DashboardWidget
            title="Top Gainers"
            description="Best performing stocks"
            loading={moversLoading}
          >
            <div className="flex flex-col gap-2">
              {topMovers?.gainers && topMovers.gainers.length > 0 ? (
                topMovers.gainers
                  .slice(0, 5)
                  .map((g) => (
                    <TopMoverItem
                      key={g.symbol}
                      symbol={g.symbol}
                      name={g.name}
                      price={g.price}
                      change={g.priceChange}
                      changePercent={g.priceChangePercent}
                      onClick={() => handleSelectResult(g.symbol)}
                    />
                  ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No data available
                </p>
              )}
            </div>
          </DashboardWidget>

          <DashboardWidget
            title="Top Losers"
            description="Weakest performers today"
            loading={moversLoading}
          >
            <div className="flex flex-col gap-2">
              {topMovers?.losers && topMovers.losers.length > 0 ? (
                topMovers.losers
                  .slice(0, 5)
                  .map((g) => (
                    <TopMoverItem
                      key={g.symbol}
                      symbol={g.symbol}
                      name={g.name}
                      price={g.price}
                      change={g.priceChange}
                      changePercent={g.priceChangePercent}
                      onClick={() => handleSelectResult(g.symbol)}
                    />
                  ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No data available
                </p>
              )}
            </div>
          </DashboardWidget>
        </div>
      )}

      {/* Quick Tips */}
      {!searchQuery && (
        <DashboardWidget
          title="Search Tips"
          description="How to search effectively"
        >
          <ul className="space-y-3 text-sm text-foreground/90">
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">1.</span>
              <span>
                Enter a stock symbol (e.g., AAPL, GOOGL, MSFT) to find specific
                companies
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">2.</span>
              <span>Type a company name to search by business name</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">3.</span>
              <span>
                Results include stocks, ETFs, and other investment products
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary flex-shrink-0">4.</span>
              <span>
                Click on any result to view detailed stock information and
                charts
              </span>
            </li>
          </ul>
        </DashboardWidget>
      )}
    </div>
  );
}
