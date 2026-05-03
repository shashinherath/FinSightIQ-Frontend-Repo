/**
 * Market Search Page
 * Dedicated search interface for finding and analyzing stocks
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { useSearchSymbols } from "@/features/market/hooks/useMarketQueries";
import type { SearchResult } from "@/features/market/types";
import {
  DashboardWidget,
  WidgetSkeleton,
} from "@/features/market/components/dashboard/DashboardWidget";
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && !searchHistory.includes(searchQuery)) {
      const updated = [searchQuery, ...searchHistory].slice(0, 10);
      setSearchHistory(updated);
      localStorage.setItem("market_search_history", JSON.stringify(updated));
    }
  };

  const handleSelectResult = (symbol: string) => {
    navigate(`/market/stock/${symbol}`);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("market_search_history");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-4">Find Stocks</h1>
        <p className="text-slate-400">
          Search and analyze stocks from markets worldwide
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by symbol or company name..."
            className={cn(
              "w-full pl-14 pr-6 py-3 bg-slate-800 border border-slate-700 rounded-lg",
              "text-slate-100 placeholder-slate-500 text-lg",
              "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
              "transition-all duration-200",
            )}
            autoFocus
          />
        </div>
      </form>

      {/* Search Results */}
      {searchQuery ? (
        <DashboardWidget
          title={`Search Results${searchQuery ? `: "${searchQuery}"` : ""}`}
          description={
            isLoading ? "Searching..." : `Found ${searchResults.length} results`
          }
          loading={isLoading}
        >
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((result) => (
                <SearchResultCard
                  key={result.symbol}
                  result={result}
                  onClick={() => handleSelectResult(result.symbol)}
                />
              ))}
            </div>
          ) : !isLoading ? (
            <div className="text-center py-8">
              <p className="text-slate-400">
                No results found for "{searchQuery}"
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Try searching with a different symbol or company name
              </p>
            </div>
          ) : (
            <WidgetSkeleton lines={5} />
          )}
        </DashboardWidget>
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
                  "w-full text-left px-4 py-3 rounded-lg border border-slate-700",
                  "bg-slate-800/30 hover:bg-slate-700/50 transition-colors duration-150",
                )}
              >
                <p className="font-semibold text-slate-100">{query}</p>
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

      {/* Quick Tips */}
      {!searchQuery && (
        <DashboardWidget
          title="Search Tips"
          description="How to search effectively"
        >
          <ul className="space-y-3 text-slate-300 text-sm">
            <li className="flex gap-3">
              <span className="font-bold text-blue-400 flex-shrink-0">1.</span>
              <span>
                Enter a stock symbol (e.g., AAPL, GOOGL, MSFT) to find specific
                companies
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400 flex-shrink-0">2.</span>
              <span>Type a company name to search by business name</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400 flex-shrink-0">3.</span>
              <span>
                Results include stocks, ETFs, and other investment products
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400 flex-shrink-0">4.</span>
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

// ============================================================================
// SEARCH RESULT CARD
// ============================================================================

interface SearchResultCardProps {
  result: SearchResult;
  onClick?: () => void;
}

function SearchResultCard({ result, onClick }: SearchResultCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-4 rounded-lg border border-slate-700",
        "bg-slate-800/30 hover:bg-slate-700/50 hover:border-slate-600",
        "transition-all duration-150 flex items-center justify-between group",
      )}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <p className="font-bold text-lg text-slate-100 group-hover:text-blue-400 transition-colors">
            {result.symbol}
          </p>
          <span className="text-xs bg-slate-700 px-2.5 py-1 rounded text-slate-300">
            {result.exchange}
          </span>
          <span className="text-xs bg-slate-700/50 px-2.5 py-1 rounded text-slate-400">
            {result.type}
          </span>
        </div>
        <p className="text-sm text-slate-400">{result.name}</p>
      </div>

      {/* Match Score */}
      {result.matchScore && result.matchScore < 1 && (
        <div className="ml-4 text-right">
          <p className="text-xs text-slate-500">
            Match: {(result.matchScore * 100).toFixed(0)}%
          </p>
        </div>
      )}
    </button>
  );
}
