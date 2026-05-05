import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  generatePrediction,
  getModelAnalytics,
  getPredictionAccuracy,
  getPredictionById,
  getPredictionHistory,
  getRecommendation,
  getShapValues,
} from "@/features/predictions/api/prediction.api";
import { normalizePrediction } from "@/features/predictions/query/prediction.mapper";
import type { PredictionRequest } from "@/features/predictions/types/prediction.types";

export const predictionQueryKeys = {
  all: ["predictions"] as const,
  history: {
    all: ["predictions", "history"] as const,
    bySymbol: (symbol?: string) =>
      ["predictions", "history", symbol || "ALL"] as const,
  },
  details: {
    all: ["predictions", "details"] as const,
    byId: (id: string) => ["predictions", "details", id] as const,
  },
  analytics: {
    model: ["predictions", "analytics", "models"] as const,
    accuracy: ["predictions", "analytics", "accuracy"] as const,
  },
  explainability: {
    shap: (id: string) => ["predictions", "shap", id] as const,
    recommendation: (id: string) =>
      ["predictions", "recommendation", id] as const,
  },
};

export const usePredictionHistory = (symbol?: string) =>
  useQuery({
    queryKey: predictionQueryKeys.history.bySymbol(symbol),
    queryFn: () => getPredictionHistory(symbol),
    staleTime: 30 * 1000,
    gcTime: 30 * 60 * 1000,
  });

export const usePredictionDetails = (predictionId: string) =>
  useQuery({
    queryKey: predictionQueryKeys.details.byId(predictionId),
    queryFn: async () =>
      normalizePrediction(await getPredictionById(predictionId)),
    enabled: !!predictionId,
    staleTime: 30 * 1000,
  });

export const useGeneratePrediction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: PredictionRequest) => generatePrediction(request),
    onSuccess: (prediction) => {
      queryClient.setQueryData(
        predictionQueryKeys.details.byId(prediction.id),
        prediction,
      );
      queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.history.all,
      });
      queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.analytics.accuracy,
      });
    },
  });
};

export const useModelAnalytics = () =>
  useQuery({
    queryKey: predictionQueryKeys.analytics.model,
    queryFn: getModelAnalytics,
    staleTime: 60 * 1000,
  });

export const usePredictionAccuracy = () =>
  useQuery({
    queryKey: predictionQueryKeys.analytics.accuracy,
    queryFn: getPredictionAccuracy,
    staleTime: 60 * 1000,
  });

export const useShapValues = (predictionId: string) =>
  useQuery({
    queryKey: predictionQueryKeys.explainability.shap(predictionId),
    queryFn: () => getShapValues(predictionId),
    enabled: !!predictionId,
  });

export const useRecommendation = (predictionId: string) =>
  useQuery({
    queryKey: predictionQueryKeys.explainability.recommendation(predictionId),
    queryFn: () => getRecommendation(predictionId),
    enabled: !!predictionId,
  });
