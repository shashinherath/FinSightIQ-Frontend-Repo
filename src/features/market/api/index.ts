/**
 * Market API Integration Layer
 * Handles all market data API calls
 */

import axios from "axios";
import type {
  StockQuote,
  StockDetails,
  MarketOverview,
  SearchSuggestions,
  SearchResult,
  HistoricalPriceData,
  TopMovers,
  MarketStatistics,
  CompanyInfo,
  Watchlist,
  WatchlistItem,
} from "@/features/market/types";

// Configure API client
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
});

// Add request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================================================
// MARKET DATA APIs
// ============================================================================

/**
 * Get live stock quote
 */
export const getStockQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    const response = await apiClient.get<StockQuote>(
      `/market/quotes/${symbol}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch quote for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get multiple stock quotes (batch)
 */
export const getStockQuotesBatch = async (
  symbols: string[],
): Promise<StockQuote[]> => {
  try {
    const response = await apiClient.post<StockQuote[]>(
      "/market/quotes/batch",
      {
        symbols,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch batch quotes:", error);
    throw error;
  }
};

/**
 * Get market overview (indexes, top movers, trending)
 */
export const getMarketOverview = async (): Promise<MarketOverview> => {
  try {
    const response = await apiClient.get<MarketOverview>("/market/overview");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch market overview:", error);
    throw error;
  }
};

/**
 * Get top movers (gainers, losers, most active)
 */
export const getTopMovers = async (): Promise<TopMovers> => {
  try {
    const response = await apiClient.get<TopMovers>("/market/top-movers");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch top movers:", error);
    throw error;
  }
};

/**
 * Get historical price data with optional technical indicators
 */
export const getHistoricalPrices = async (
  symbol: string,
  timeframe: "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y" = "1M",
  includeIndicators: boolean = true,
): Promise<HistoricalPriceData> => {
  try {
    const response = await apiClient.get<HistoricalPriceData>(
      `/market/historical/${symbol}`,
      {
        params: {
          timeframe,
          indicators: includeIndicators,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch historical data for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get market statistics for a stock
 */
export const getMarketStatistics = async (
  symbol: string,
): Promise<MarketStatistics> => {
  try {
    const response = await apiClient.get<MarketStatistics>(
      `/market/statistics/${symbol}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch statistics for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get company information
 */
export const getCompanyInfo = async (symbol: string): Promise<CompanyInfo> => {
  try {
    const response = await apiClient.get<CompanyInfo>(
      `/market/company-info/${symbol}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch company info for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get full stock details
 */
export const getStockDetails = async (
  symbol: string,
  includeHistorical: boolean = true,
): Promise<StockDetails> => {
  try {
    const response = await apiClient.get<StockDetails>(
      `/market/stock-details/${symbol}`,
      {
        params: {
          includeHistorical,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch stock details for ${symbol}:`, error);
    throw error;
  }
};

// ============================================================================
// SEARCH APIs
// ============================================================================

/**
 * Search for stocks/symbols with autocomplete
 */
export const searchSymbols = async (
  query: string,
  limit: number = 10,
): Promise<SearchResult[]> => {
  try {
    if (!query.trim()) {
      return [];
    }

    const response = await apiClient.get<SearchResult[]>("/market/search", {
      params: {
        query: query.trim(),
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to search symbols:", error);
    throw error;
  }
};

/**
 * Get search suggestions (recent + trending)
 */
export const getSearchSuggestions = async (): Promise<SearchSuggestions> => {
  try {
    const response = await apiClient.get<SearchSuggestions>(
      "/market/search-suggestions",
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch search suggestions:", error);
    throw error;
  }
};

// ============================================================================
// WATCHLIST APIs
// ============================================================================

/**
 * Get all watchlists for user
 */
export const getWatchlists = async (): Promise<Watchlist[]> => {
  try {
    const response = await apiClient.get<Watchlist[]>("/market/watchlists");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch watchlists:", error);
    throw error;
  }
};

/**
 * Get single watchlist with items
 */
export const getWatchlist = async (watchlistId: string): Promise<Watchlist> => {
  try {
    const response = await apiClient.get<Watchlist>(
      `/market/watchlists/${watchlistId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch watchlist ${watchlistId}:`, error);
    throw error;
  }
};

/**
 * Create new watchlist
 */
export const createWatchlist = async (name: string): Promise<Watchlist> => {
  try {
    const response = await apiClient.post<Watchlist>("/market/watchlists", {
      name,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create watchlist:", error);
    throw error;
  }
};

/**
 * Update watchlist name
 */
export const updateWatchlist = async (
  watchlistId: string,
  name: string,
): Promise<Watchlist> => {
  try {
    const response = await apiClient.put<Watchlist>(
      `/market/watchlists/${watchlistId}`,
      { name },
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update watchlist ${watchlistId}:`, error);
    throw error;
  }
};

/**
 * Delete watchlist
 */
export const deleteWatchlist = async (watchlistId: string): Promise<void> => {
  try {
    await apiClient.delete(`/market/watchlists/${watchlistId}`);
  } catch (error) {
    console.error(`Failed to delete watchlist ${watchlistId}:`, error);
    throw error;
  }
};

/**
 * Add symbol to watchlist
 */
export const addToWatchlist = async (
  watchlistId: string,
  symbol: string,
): Promise<WatchlistItem> => {
  try {
    const response = await apiClient.post<WatchlistItem>(
      `/market/watchlists/${watchlistId}/items`,
      { symbol },
    );
    return response.data;
  } catch (error) {
    console.error(
      `Failed to add ${symbol} to watchlist ${watchlistId}:`,
      error,
    );
    throw error;
  }
};

/**
 * Remove symbol from watchlist
 */
export const removeFromWatchlist = async (
  watchlistId: string,
  itemId: string,
): Promise<void> => {
  try {
    await apiClient.delete(`/market/watchlists/${watchlistId}/items/${itemId}`);
  } catch (error) {
    console.error(
      `Failed to remove item ${itemId} from watchlist ${watchlistId}:`,
      error,
    );
    throw error;
  }
};

/**
 * Reorder watchlist items
 */
export const reorderWatchlistItems = async (
  watchlistId: string,
  itemIds: string[],
): Promise<Watchlist> => {
  try {
    const response = await apiClient.post<Watchlist>(
      `/market/watchlists/${watchlistId}/reorder`,
      { itemIds },
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to reorder watchlist ${watchlistId}:`, error);
    throw error;
  }
};

/**
 * Set price alert on watchlist item
 */
export const setPriceAlert = async (
  watchlistId: string,
  itemId: string,
  alertPrice: number,
): Promise<WatchlistItem> => {
  try {
    const response = await apiClient.post<WatchlistItem>(
      `/market/watchlists/${watchlistId}/items/${itemId}/alert`,
      { alertPrice },
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to set price alert:`, error);
    throw error;
  }
};

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

export const isMarketDataError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 404 || error.response?.status === 400;
  }
  return false;
};

export const getMarketDataErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch market data"
    );
  }
  return "An unexpected error occurred";
};
