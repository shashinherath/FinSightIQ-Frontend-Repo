/**
 * React Query Hooks for Market Data
 * Handles data fetching, caching, and updates
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getStockQuote,
  getStockQuotesBatch,
  getMarketOverview,
  getTopMovers,
  getHistoricalPrices,
  getMarketStatistics,
  getCompanyInfo,
  getStockDetails,
  searchSymbols,
  getSearchSuggestions,
  getWatchlists,
  getWatchlist,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  reorderWatchlistItems,
  setPriceAlert,
} from "@/features/market/api";

// ============================================================================
// QUERY KEYS (for cache management)
// ============================================================================

export const marketQueryKeys = {
  all: ["market"] as const,
  quotes: {
    all: ["market", "quotes"] as const,
    detail: (symbol: string) => ["market", "quotes", symbol] as const,
    batch: (symbols: string[]) =>
      ["market", "quotes", "batch", symbols] as const,
  },
  overview: {
    all: ["market", "overview"] as const,
  },
  topMovers: {
    all: ["market", "top-movers"] as const,
  },
  historical: {
    all: ["market", "historical"] as const,
    detail: (symbol: string, timeframe: string) =>
      ["market", "historical", symbol, timeframe] as const,
  },
  statistics: {
    all: ["market", "statistics"] as const,
    detail: (symbol: string) => ["market", "statistics", symbol] as const,
  },
  company: {
    all: ["market", "company"] as const,
    detail: (symbol: string) => ["market", "company", symbol] as const,
  },
  details: {
    all: ["market", "details"] as const,
    detail: (symbol: string) => ["market", "details", symbol] as const,
  },
  search: {
    all: ["market", "search"] as const,
    query: (query: string) => ["market", "search", query] as const,
    suggestions: ["market", "search-suggestions"] as const,
  },
  watchlists: {
    all: ["market", "watchlists"] as const,
    detail: (watchlistId: string) =>
      ["market", "watchlists", watchlistId] as const,
  },
};

// ============================================================================
// STOCK QUOTE HOOKS
// ============================================================================

/**
 * Fetch single stock quote with realtime updates
 */
export const useStockQuote = (
  symbol: string,
  options?: { enabled?: boolean; refetchInterval?: number },
) => {
  return useQuery({
    queryKey: marketQueryKeys.quotes.detail(symbol),
    queryFn: () => getStockQuote(symbol),
    staleTime: 5 * 1000, // 5 seconds
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: options?.refetchInterval || 10 * 1000, // Update every 10 seconds
    enabled: options?.enabled !== false && !!symbol,
    retry: 2,
  });
};

/**
 * Fetch multiple stock quotes
 */
export const useStockQuotesBatch = (
  symbols: string[],
  options?: { enabled?: boolean; refetchInterval?: number },
) => {
  return useQuery({
    queryKey: marketQueryKeys.quotes.batch(symbols),
    queryFn: () => getStockQuotesBatch(symbols),
    staleTime: 5 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchInterval: options?.refetchInterval || 10 * 1000,
    enabled: options?.enabled !== false && symbols.length > 0,
    retry: 2,
  });
};

// ============================================================================
// MARKET OVERVIEW HOOKS
// ============================================================================

/**
 * Fetch market overview (indexes, movers, trending)
 */
export const useMarketOverview = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: marketQueryKeys.overview.all,
    queryFn: getMarketOverview,
    staleTime: 10 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchInterval: options?.refetchInterval || 15 * 1000,
    enabled: options?.enabled !== false,
    retry: 2,
  });
};

/**
 * Fetch top movers separately
 */
export const useTopMovers = (options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: marketQueryKeys.topMovers.all,
    queryFn: getTopMovers,
    staleTime: 10 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchInterval: options?.refetchInterval || 15 * 1000,
    enabled: options?.enabled !== false,
    retry: 2,
  });
};

// ============================================================================
// HISTORICAL DATA HOOKS
// ============================================================================

/**
 * Fetch historical prices with technical indicators
 */
export const useHistoricalPrices = (
  symbol: string,
  timeframe: "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y" = "1M",
  includeIndicators: boolean = true,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: marketQueryKeys.historical.detail(symbol, timeframe),
    queryFn: () => getHistoricalPrices(symbol, timeframe, includeIndicators),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    enabled: options?.enabled !== false && !!symbol,
    retry: 2,
  });
};

// ============================================================================
// STOCK DETAILS HOOKS
// ============================================================================

/**
 * Fetch market statistics for a stock
 */
export const useMarketStatistics = (
  symbol: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: marketQueryKeys.statistics.detail(symbol),
    queryFn: () => getMarketStatistics(symbol),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled: options?.enabled !== false && !!symbol,
    retry: 2,
  });
};

/**
 * Fetch company information
 */
export const useCompanyInfo = (
  symbol: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: marketQueryKeys.company.detail(symbol),
    queryFn: () => getCompanyInfo(symbol),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    enabled: options?.enabled !== false && !!symbol,
    retry: 2,
  });
};

/**
 * Fetch full stock details (combined quote + stats + company + historical)
 */
export const useStockDetails = (
  symbol: string,
  includeHistorical: boolean = true,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: marketQueryKeys.details.detail(symbol),
    queryFn: () => getStockDetails(symbol, includeHistorical),
    staleTime: 10 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: options?.enabled !== false && !!symbol,
    retry: 2,
  });
};

// ============================================================================
// SEARCH HOOKS
// ============================================================================

/**
 * Search for symbols with debounce
 */
export const useSearchSymbols = (
  query: string,
  limit: number = 10,
  options?: { enabled?: boolean; debounceMs?: number },
) => {
  const debounceMs = options?.debounceMs ?? 300;
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query, debounceMs]);

  return useQuery({
    queryKey: marketQueryKeys.search.query(debouncedQuery),
    queryFn: () => searchSymbols(debouncedQuery, limit),
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled !== false && debouncedQuery.length > 0,
    retry: 1,
  });
};

/**
 * Get search suggestions (recent + trending)
 */
export const useSearchSuggestions = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: marketQueryKeys.search.suggestions,
    queryFn: getSearchSuggestions,
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: options?.enabled !== false,
    retry: 1,
  });
};

// ============================================================================
// WATCHLIST HOOKS
// ============================================================================

/**
 * Fetch all watchlists
 */
export const useWatchlists = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: marketQueryKeys.watchlists.all,
    queryFn: getWatchlists,
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: options?.enabled !== false,
    retry: 2,
  });
};

/**
 * Fetch single watchlist
 */
export const useWatchlist = (
  watchlistId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: marketQueryKeys.watchlists.detail(watchlistId),
    queryFn: () => getWatchlist(watchlistId),
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: options?.enabled !== false && !!watchlistId,
    retry: 2,
  });
};

/**
 * Create watchlist mutation
 */
export const useCreateWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createWatchlist(name),
    onSuccess: (newWatchlist) => {
      // Invalidate watchlists query
      queryClient.invalidateQueries({
        queryKey: marketQueryKeys.watchlists.all,
      });
      // Add to cache
      queryClient.setQueryData(
        marketQueryKeys.watchlists.detail(newWatchlist.id),
        newWatchlist,
      );
    },
  });
};

/**
 * Update watchlist mutation
 */
export const useUpdateWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      watchlistId,
      name,
    }: {
      watchlistId: string;
      name: string;
    }) => updateWatchlist(watchlistId, name),
    onSuccess: (updatedWatchlist) => {
      queryClient.setQueryData(
        marketQueryKeys.watchlists.detail(updatedWatchlist.id),
        updatedWatchlist,
      );
    },
  });
};

/**
 * Delete watchlist mutation
 */
export const useDeleteWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (watchlistId: string) => deleteWatchlist(watchlistId),
    onSuccess: (_, watchlistId) => {
      queryClient.removeQueries({
        queryKey: marketQueryKeys.watchlists.detail(watchlistId),
      });
      queryClient.invalidateQueries({
        queryKey: marketQueryKeys.watchlists.all,
      });
    },
  });
};

/**
 * Add to watchlist mutation
 */
export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      watchlistId,
      symbol,
    }: {
      watchlistId: string;
      symbol: string;
    }) => addToWatchlist(watchlistId, symbol),
    onSuccess: (_, { watchlistId }) => {
      queryClient.invalidateQueries({
        queryKey: marketQueryKeys.watchlists.detail(watchlistId),
      });
      queryClient.invalidateQueries({
        queryKey: marketQueryKeys.watchlists.all,
      });
    },
  });
};

/**
 * Remove from watchlist mutation
 */
export const useRemoveFromWatchlist = (watchlistId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeFromWatchlist(watchlistId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: marketQueryKeys.watchlists.detail(watchlistId),
      });
    },
  });
};

/**
 * Reorder watchlist items mutation
 */
export const useReorderWatchlist = (watchlistId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemIds: string[]) =>
      reorderWatchlistItems(watchlistId, itemIds),
    onSuccess: (reorderedWatchlist) => {
      queryClient.setQueryData(
        marketQueryKeys.watchlists.detail(watchlistId),
        reorderedWatchlist,
      );
    },
  });
};

/**
 * Set price alert mutation
 */
export const useSetPriceAlert = (watchlistId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      alertPrice,
    }: {
      itemId: string;
      alertPrice: number;
    }) => setPriceAlert(watchlistId, itemId, alertPrice),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: marketQueryKeys.watchlists.detail(watchlistId),
      });
    },
  });
};
