/**
 * Market Feature Exports
 */

// Pages
export { MarketOverviewPage } from "./pages";
export { StockDetailsPage } from "./pages";
export { MarketSearchPage } from "./pages";

// Components
export { StockSearchInput } from "./components/search/StockSearchInput";
export { WatchlistPanel } from "./components/watchlist/WatchlistPanel";
export { WatchlistTable } from "./components/watchlist/WatchlistTable";
export { AddToWatchlistButton } from "./components/watchlist/AddToWatchlistButton";
export {
  DashboardWidget,
  WidgetSkeleton,
} from "./components/dashboard/DashboardWidget";
export {
  MarketSummaryCard,
  TopMoverItem,
  MarketStatisticsPanel,
} from "./components/dashboard/MarketCards";
export {
  CandlestickChart,
  VolumeChart,
  SparklineChart,
} from "./components/charts";

// Hooks
export {
  useStockQuote,
  useStockQuotesBatch,
  useMarketOverview,
  useTopMovers,
  useHistoricalPrices,
  useMarketStatistics,
  useCompanyInfo,
  useStockDetails,
  useSearchSymbols,
  useSearchSuggestions,
  useWatchlists,
  useWatchlist,
  useCreateWatchlist,
  useUpdateWatchlist,
  useDeleteWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useReorderWatchlist,
  marketQueryKeys,
} from "./hooks/useMarketQueries";

export {
  useSignalR,
  useSubscribeToPrice,
  useSubscribeToMultiplePrices,
  useMarketEvents,
  useWatchListSubscriptions,
  useRealtimePrice,
  useRealtimePrices,
  useSignalRConnection,
} from "./hooks/useSignalR";

// Services
export {
  initializeSignalRService,
  getSignalRService,
} from "./services/signalr.service";

// Store
export { useMarketStore, useWatchlistStore, useRealtimeStore } from "./store";

// Types
export type {
  StockQuote,
  OHLCData,
  TechnicalIndicators,
  HistoricalPriceData,
  MarketStatistics,
  CompanyInfo,
  StockDetails,
  MarketIndex,
  TopMovers,
  MarketOverview,
  SearchResult,
  SearchSuggestions,
  WatchlistItem,
  Watchlist,
  RealtimePriceUpdate,
  MarketEvent,
  ApiResponse,
  PaginatedResponse,
} from "./types";

export { MarketEventType } from "./types";

// Utils
export * from "./utils/market.utils";
