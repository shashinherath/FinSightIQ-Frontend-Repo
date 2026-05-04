import { create } from "zustand";
import type {
  ConfidencePreference,
  ForecastHorizon,
  PredictionModel,
  PredictionResult,
  PredictionRealtimeEvent,
} from "@/features/predictions/types/prediction.types";

export type PredictionFeedStatus = "pending" | "success" | "error";

export interface PredictionFeedItem {
  id: string;
  symbol: string;
  model: PredictionModel;
  horizon: ForecastHorizon;
  confidencePreference: ConfidencePreference;
  createdAt: number;
  status: PredictionFeedStatus;
  prediction?: PredictionResult;
  error?: string;
}

interface PredictionStoreState {
  selectedSymbol: string;
  selectedModel: PredictionModel;
  selectedHorizon: ForecastHorizon;
  confidencePreference: ConfidencePreference;
  activePrediction: PredictionResult | null;
  isGenerating: boolean;
  predictionFeed: PredictionFeedItem[];
  realtimeEvents: PredictionRealtimeEvent[];
  setSelectedSymbol: (symbol: string) => void;
  setSelectedModel: (model: PredictionModel) => void;
  setSelectedHorizon: (horizon: ForecastHorizon) => void;
  setConfidencePreference: (preference: ConfidencePreference) => void;
  setActivePrediction: (prediction: PredictionResult | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  addFeedItem: (item: PredictionFeedItem) => void;
  updateFeedItem: (id: string, updates: Partial<PredictionFeedItem>) => void;
  clearFeed: () => void;
  addRealtimeEvents: (events: PredictionRealtimeEvent[]) => void;
  clearRealtimeEvents: () => void;
}

export const usePredictionStore = create<PredictionStoreState>((set) => ({
  selectedSymbol: "AAPL",
  selectedModel: "ENSEMBLE",
  selectedHorizon: "14D",
  confidencePreference: "MEDIUM",
  activePrediction: null,
  isGenerating: false,
  predictionFeed: [],
  realtimeEvents: [],
  setSelectedSymbol: (selectedSymbol) => set({ selectedSymbol }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  setSelectedHorizon: (selectedHorizon) => set({ selectedHorizon }),
  setConfidencePreference: (confidencePreference) =>
    set({ confidencePreference }),
  setActivePrediction: (activePrediction) => set({ activePrediction }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  addFeedItem: (item) =>
    set((state) => ({ predictionFeed: [item, ...state.predictionFeed] })),
  updateFeedItem: (id, updates) =>
    set((state) => ({
      predictionFeed: state.predictionFeed.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    })),
  clearFeed: () => set({ predictionFeed: [] }),
  addRealtimeEvents: (events) =>
    set((state) => ({
      realtimeEvents: [...events, ...state.realtimeEvents].slice(0, 50),
    })),
  clearRealtimeEvents: () => set({ realtimeEvents: [] }),
}));
