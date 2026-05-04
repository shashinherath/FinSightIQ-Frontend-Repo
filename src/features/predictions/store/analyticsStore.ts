import { create } from "zustand";
import type {
  PredictionHistoryItem,
  PredictionModel,
} from "@/features/predictions/types/prediction.types";

interface AnalyticsStoreState {
  historyFilterSymbol: string;
  historySortField: keyof PredictionHistoryItem;
  historySortDirection: "asc" | "desc";
  selectedModels: PredictionModel[];
  setHistoryFilterSymbol: (symbol: string) => void;
  setHistorySort: (
    field: keyof PredictionHistoryItem,
    direction: "asc" | "desc",
  ) => void;
  toggleModel: (model: PredictionModel) => void;
}

export const useAnalyticsStore = create<AnalyticsStoreState>((set) => ({
  historyFilterSymbol: "ALL",
  historySortField: "createdAt",
  historySortDirection: "desc",
  selectedModels: ["PROPHET", "ARIMA", "LSTM", "ENSEMBLE"],
  setHistoryFilterSymbol: (historyFilterSymbol) => set({ historyFilterSymbol }),
  setHistorySort: (historySortField, historySortDirection) =>
    set({ historySortField, historySortDirection }),
  toggleModel: (model) =>
    set((state) => ({
      selectedModels: state.selectedModels.includes(model)
        ? state.selectedModels.filter((m) => m !== model)
        : [...state.selectedModels, model],
    })),
}));
