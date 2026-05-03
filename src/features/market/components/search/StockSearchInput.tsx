/**
 * Stock Search Input Component
 * Professional search with autocomplete and suggestions
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, Clock, TrendingUp } from "lucide-react";
import {
  useSearchSymbols,
  useSearchSuggestions,
} from "@/features/market/hooks/useMarketQueries";

import { cn } from "@/shared/utils/cn";

export interface StockSearchInputProps {
  onSelect?: (symbol: string) => void;
  className?: string;
  placeholder?: string;
}

export function StockSearchInput({
  onSelect,
  className,
  placeholder = "Search stocks, ETFs...",
}: StockSearchInputProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const stored = localStorage.getItem("stock_recent_searches");
    return stored ? JSON.parse(stored) : [];
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search
  const { data: searchResults = [] } = useSearchSymbols(query, 10, {
    enabled: query.length > 0,
  });

  const { data: suggestions } = useSearchSuggestions({
    enabled: query.length === 0 && isOpen,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle symbol selection
  const handleSelectSymbol = useCallback(
    (symbol: string) => {
      setQuery("");
      setIsOpen(false);

      // Add to recent searches
      const updatedRecent = [
        symbol,
        ...recentSearches.filter((s) => s !== symbol),
      ].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem(
        "stock_recent_searches",
        JSON.stringify(updatedRecent),
      );

      onSelect?.(symbol);
    },
    [recentSearches, onSelect],
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" && query) {
      if (searchResults.length > 0) {
        handleSelectSymbol(searchResults[0].symbol);
      }
    }
  };

  const displayResults = query.length > 0 ? searchResults : [];
  const displaySuggestions =
    query.length === 0 && isOpen
      ? {
          recent: recentSearches.slice(0, 3),
          trending: suggestions?.trendingSearches.slice(0, 3) || [],
        }
      : null;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg",
            "text-slate-100 placeholder-slate-500",
            "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            "transition-all duration-200",
          )}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (displayResults.length > 0 || displaySuggestions) && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg",
            "shadow-lg shadow-black/50 z-50 max-h-96 overflow-y-auto",
          )}
        >
          {/* Search Results */}
          {displayResults.length > 0 && (
            <div>
              <div className="px-4 py-2 border-b border-slate-700">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Results
                </p>
              </div>
              {displayResults.map((result) => (
                <button
                  key={result.symbol}
                  onClick={() => handleSelectSymbol(result.symbol)}
                  className={cn(
                    "w-full px-4 py-3 text-left",
                    "hover:bg-slate-700 transition-colors duration-150",
                    "border-b border-slate-700/50 last:border-b-0",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-100">
                        {result.symbol}
                      </p>
                      <p className="text-sm text-slate-400">{result.name}</p>
                    </div>
                    <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
                      {result.exchange}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {displaySuggestions && (
            <div>
              {/* Recent Searches */}
              {displaySuggestions.recent.length > 0 && (
                <div>
                  <div className="px-4 py-2 border-b border-slate-700">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recent
                    </p>
                  </div>
                  {displaySuggestions.recent.map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => handleSelectSymbol(symbol)}
                      className={cn(
                        "w-full px-4 py-3 text-left text-slate-300",
                        "hover:bg-slate-700 transition-colors duration-150",
                        "border-b border-slate-700/50 last:border-b-0",
                      )}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              )}

              {/* Trending Searches */}
              {displaySuggestions.trending.length > 0 && (
                <div>
                  <div className="px-4 py-2 border-b border-slate-700">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Trending
                    </p>
                  </div>
                  {displaySuggestions.trending.map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => handleSelectSymbol(symbol)}
                      className={cn(
                        "w-full px-4 py-3 text-left text-slate-300",
                        "hover:bg-slate-700 transition-colors duration-150",
                        "border-b border-slate-700/50 last:border-b-0",
                      )}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
