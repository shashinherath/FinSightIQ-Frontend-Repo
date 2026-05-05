import { create } from "zustand";
import type {
  MarketSentiment,
  SymbolSentiment,
} from "../types/sentiment.types";

interface SentimentState {
  market?: MarketSentiment;
  symbol?: Record<string, SymbolSentiment>;
  setMarket: (m: MarketSentiment) => void;
  setSymbol: (s: SymbolSentiment) => void;
}

export const useSentimentStore = create<SentimentState>((set) => ({
  market: undefined,
  symbol: {},
  setMarket: (m) => set({ market: m }),
  setSymbol: (s) =>
    set((state) => ({ symbol: { ...(state.symbol || {}), [s.symbol]: s } })),
}));
