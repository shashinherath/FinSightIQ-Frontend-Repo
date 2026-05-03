/**
 * Market Store - Zustand Global State Management
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { RealtimePriceUpdate } from "@/features/market/types";

// ============================================================================
// MARKET STORE
// ============================================================================

interface MarketStoreState {
  // Realtime data
  realtimePrices: Map<string, RealtimePriceUpdate>;
  selectedSymbol: string | null;
  watchedSymbols: Set<string>;

  // UI State
  searchQuery: string;
  selectedTimeframe: "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y";
  chartType: "candlestick" | "line" | "area";
  indicatorsShown: {
    sma: boolean;
    ema: boolean;
    rsi: boolean;
    macd: boolean;
    bollingerBands: boolean;
  };

  // Market status
  isMarketOpen: boolean;
  lastUpdateTimestamp: number;

  // Actions
  updateRealtimePrice: (update: RealtimePriceUpdate) => void;
  updateRealtimePrices: (updates: RealtimePriceUpdate[]) => void;
  setSelectedSymbol: (symbol: string | null) => void;
  setSearchQuery: (query: string) => void;
  setTimeframe: (
    timeframe: "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "5Y",
  ) => void;
  setChartType: (type: "candlestick" | "line" | "area") => void;
  toggleIndicator: (
    indicator: keyof MarketStoreState["indicatorsShown"],
  ) => void;
  setIndicatorsShown: (indicators: MarketStoreState["indicatorsShown"]) => void;
  setMarketOpen: (isOpen: boolean) => void;
  addWatchedSymbol: (symbol: string) => void;
  removeWatchedSymbol: (symbol: string) => void;
  clearWatchedSymbols: () => void;
  getRealtimePrice: (symbol: string) => RealtimePriceUpdate | undefined;
}

export const useMarketStore = create<MarketStoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      realtimePrices: new Map(),
      selectedSymbol: null,
      watchedSymbols: new Set(),
      searchQuery: "",
      selectedTimeframe: "1M",
      chartType: "candlestick",
      indicatorsShown: {
        sma: true,
        ema: false,
        rsi: false,
        macd: false,
        bollingerBands: false,
      },
      isMarketOpen: true,
      lastUpdateTimestamp: Date.now(),

      // Actions
      updateRealtimePrice: (update) =>
        set((state) => {
          const newPrices = new Map(state.realtimePrices);
          newPrices.set(update.symbol, update);
          return {
            realtimePrices: newPrices,
            lastUpdateTimestamp: Date.now(),
          };
        }),

      updateRealtimePrices: (updates) =>
        set((state) => {
          const newPrices = new Map(state.realtimePrices);
          updates.forEach((update) => {
            newPrices.set(update.symbol, update);
          });
          return {
            realtimePrices: newPrices,
            lastUpdateTimestamp: Date.now(),
          };
        }),

      setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),

      setChartType: (type) => set({ chartType: type }),

      toggleIndicator: (indicator) =>
        set((state) => ({
          indicatorsShown: {
            ...state.indicatorsShown,
            [indicator]: !state.indicatorsShown[indicator],
          },
        })),

      setIndicatorsShown: (indicators) => set({ indicatorsShown: indicators }),

      setMarketOpen: (isOpen) => set({ isMarketOpen: isOpen }),

      addWatchedSymbol: (symbol) =>
        set((state) => {
          const newWatched = new Set(state.watchedSymbols);
          newWatched.add(symbol);
          return { watchedSymbols: newWatched };
        }),

      removeWatchedSymbol: (symbol) =>
        set((state) => {
          const newWatched = new Set(state.watchedSymbols);
          newWatched.delete(symbol);
          return { watchedSymbols: newWatched };
        }),

      clearWatchedSymbols: () => set({ watchedSymbols: new Set() }),

      getRealtimePrice: (symbol) => {
        return get().realtimePrices.get(symbol);
      },
    }),
    { name: "MarketStore" },
  ),
);

// ============================================================================
// WATCHLIST STORE
// ============================================================================

interface WatchlistStoreState {
  // Data
  defaultWatchlistId: string | null;
  favoriteSymbols: Set<string>;
  priceAlerts: Map<string, number>;

  // UI State
  isWatchlistPanelOpen: boolean;
  activeWatchlistId: string | null;

  // Actions
  setDefaultWatchlistId: (id: string | null) => void;
  toggleFavorite: (symbol: string) => void;
  isFavorite: (symbol: string) => boolean;
  setPriceAlert: (symbol: string, price: number) => void;
  removePriceAlert: (symbol: string) => void;
  getPriceAlert: (symbol: string) => number | undefined;
  toggleWatchlistPanel: () => void;
  setActiveWatchlistId: (id: string | null) => void;
  clearWatchlistState: () => void;
}

export const useWatchlistStore = create<WatchlistStoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      defaultWatchlistId: null,
      favoriteSymbols: new Set(),
      priceAlerts: new Map(),
      isWatchlistPanelOpen: false,
      activeWatchlistId: null,

      // Actions
      setDefaultWatchlistId: (id) => set({ defaultWatchlistId: id }),

      toggleFavorite: (symbol) =>
        set((state) => {
          const newFavorites = new Set(state.favoriteSymbols);
          if (newFavorites.has(symbol)) {
            newFavorites.delete(symbol);
          } else {
            newFavorites.add(symbol);
          }
          return { favoriteSymbols: newFavorites };
        }),

      isFavorite: (symbol) => {
        return get().favoriteSymbols.has(symbol);
      },

      setPriceAlert: (symbol, price) =>
        set((state) => {
          const newAlerts = new Map(state.priceAlerts);
          newAlerts.set(symbol, price);
          return { priceAlerts: newAlerts };
        }),

      removePriceAlert: (symbol) =>
        set((state) => {
          const newAlerts = new Map(state.priceAlerts);
          newAlerts.delete(symbol);
          return { priceAlerts: newAlerts };
        }),

      getPriceAlert: (symbol) => {
        return get().priceAlerts.get(symbol);
      },

      toggleWatchlistPanel: () =>
        set((state) => ({
          isWatchlistPanelOpen: !state.isWatchlistPanelOpen,
        })),

      setActiveWatchlistId: (id) => set({ activeWatchlistId: id }),

      clearWatchlistState: () =>
        set({
          defaultWatchlistId: null,
          favoriteSymbols: new Set(),
          priceAlerts: new Map(),
          isWatchlistPanelOpen: false,
          activeWatchlistId: null,
        }),
    }),
    { name: "WatchlistStore" },
  ),
);

// ============================================================================
// REALTIME STORE
// ============================================================================

interface RealtimeStoreState {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastConnectionTime: number | null;

  // Subscriptions
  subscribedSymbols: Set<string>;
  subscriptionErrors: Map<string, string>;

  // Actions
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setError: (error: string | null) => void;
  setLastConnectionTime: (time: number) => void;
  subscribeToSymbol: (symbol: string) => void;
  unsubscribeFromSymbol: (symbol: string) => void;
  setSubscriptionError: (symbol: string, error: string | null) => void;
  getSubscriptionError: (symbol: string) => string | undefined;
  clearAllSubscriptions: () => void;
}

export const useRealtimeStore = create<RealtimeStoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isConnected: false,
      isConnecting: false,
      error: null,
      lastConnectionTime: null,
      subscribedSymbols: new Set(),
      subscriptionErrors: new Map(),

      // Actions
      setConnected: (connected) => set({ isConnected: connected }),

      setConnecting: (connecting) => set({ isConnecting: connecting }),

      setError: (error) => set({ error }),

      setLastConnectionTime: (time) => set({ lastConnectionTime: time }),

      subscribeToSymbol: (symbol) =>
        set((state) => {
          const newSubscriptions = new Set(state.subscribedSymbols);
          newSubscriptions.add(symbol);
          return { subscribedSymbols: newSubscriptions };
        }),

      unsubscribeFromSymbol: (symbol) =>
        set((state) => {
          const newSubscriptions = new Set(state.subscribedSymbols);
          newSubscriptions.delete(symbol);
          return { subscribedSymbols: newSubscriptions };
        }),

      setSubscriptionError: (symbol, error) =>
        set((state) => {
          const newErrors = new Map(state.subscriptionErrors);
          if (error) {
            newErrors.set(symbol, error);
          } else {
            newErrors.delete(symbol);
          }
          return { subscriptionErrors: newErrors };
        }),

      getSubscriptionError: (symbol) => {
        return get().subscriptionErrors.get(symbol);
      },

      clearAllSubscriptions: () =>
        set({
          subscribedSymbols: new Set(),
          subscriptionErrors: new Map(),
          isConnected: false,
          error: null,
        }),
    }),
    { name: "RealtimeStore" },
  ),
);
