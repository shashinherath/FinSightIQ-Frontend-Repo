import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ForexHistoricalSeries,
  ForexQuote,
  ForexTimeframe,
} from "../types/forex.types";

interface ForexState {
  selectedPair: string;
  selectedTimeframe: ForexTimeframe;
  searchQuery: string;
  recentPairs: string[];
  liveQuotes: Record<string, ForexQuote>;
  historicalSeries: Record<string, ForexHistoricalSeries>;
  setSelectedPair: (pair: string) => void;
  setSelectedTimeframe: (timeframe: ForexTimeframe) => void;
  setSearchQuery: (query: string) => void;
  addRecentPair: (pair: string) => void;
  setLiveQuote: (quote: ForexQuote) => void;
  setLiveQuotes: (quotes: ForexQuote[]) => void;
  setHistoricalSeries: (series: ForexHistoricalSeries) => void;
}

export const useForexStore = create<ForexState>()(
  persist(
    (set) => ({
      selectedPair: "EUR/USD",
      selectedTimeframe: "1D",
      searchQuery: "",
      recentPairs: ["EUR/USD", "GBP/USD", "USD/JPY"],
      liveQuotes: {},
      historicalSeries: {},
      setSelectedPair: (pair) => set({ selectedPair: pair }),
      setSelectedTimeframe: (timeframe) =>
        set({ selectedTimeframe: timeframe }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      addRecentPair: (pair) =>
        set((state) => ({
          recentPairs: [
            pair,
            ...state.recentPairs.filter((item) => item !== pair),
          ].slice(0, 8),
        })),
      setLiveQuote: (quote) =>
        set((state) => ({
          liveQuotes: { ...state.liveQuotes, [quote.symbol]: quote },
        })),
      setLiveQuotes: (quotes) =>
        set((state) => ({
          liveQuotes: quotes.reduce<Record<string, ForexQuote>>(
            (accumulator, quote) => {
              accumulator[quote.symbol] = quote;
              return accumulator;
            },
            { ...state.liveQuotes },
          ),
        })),
      setHistoricalSeries: (series) =>
        set((state) => ({
          historicalSeries: {
            ...state.historicalSeries,
            [series.pair]: series,
          },
        })),
    }),
    {
      name: "finsightiq-forex-store",
      partialize: (state) => ({
        selectedPair: state.selectedPair,
        selectedTimeframe: state.selectedTimeframe,
        recentPairs: state.recentPairs,
      }),
    },
  ),
);
