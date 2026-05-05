import axios from "axios";
import {
  generateMockModelAnalytics,
  generateMockPrediction,
  generateMockPredictionById,
  generateMockPredictionHistory,
} from "@/features/predictions/mocks/prediction.mocks";
import type {
  ModelMetricSnapshot,
  PredictionHistoryItem,
  PredictionRequest,
  PredictionResult,
  RecommendationDetails,
  ShapFeatureContribution,
} from "@/features/predictions/types/prediction.types";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 15000,
});

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

export const generatePrediction = async (
  request: PredictionRequest,
): Promise<PredictionResult> => {
  if (USE_MOCKS) return generateMockPrediction(request);
  const response = await apiClient.post<PredictionResult>(
    "/predictions/generate",
    request,
  );
  return response.data;
};

export const getPredictionHistory = async (
  symbol?: string,
): Promise<PredictionHistoryItem[]> => {
  if (USE_MOCKS) return generateMockPredictionHistory(symbol);
  const response = await apiClient.get<PredictionHistoryItem[]>(
    "/predictions/history",
    { params: { symbol } },
  );
  return response.data;
};

export const getPredictionById = async (
  predictionId: string,
): Promise<PredictionResult> => {
  if (USE_MOCKS) return generateMockPredictionById(predictionId);
  const response = await apiClient.get<PredictionResult>(
    `/predictions/${predictionId}`,
  );
  return response.data;
};

export const getModelAnalytics = async (): Promise<ModelMetricSnapshot[]> => {
  if (USE_MOCKS) return generateMockModelAnalytics();
  const response = await apiClient.get<ModelMetricSnapshot[]>(
    "/predictions/model-analytics",
  );
  return response.data;
};

export const getShapValues = async (
  predictionId: string,
): Promise<ShapFeatureContribution[]> => {
  if (USE_MOCKS) {
    const prediction = await generateMockPredictionById(predictionId);
    return prediction.shap;
  }
  const response = await apiClient.get<ShapFeatureContribution[]>(
    `/predictions/${predictionId}/shap`,
  );
  return response.data;
};

export const getRecommendation = async (
  predictionId: string,
): Promise<RecommendationDetails> => {
  if (USE_MOCKS) {
    const prediction = await generateMockPredictionById(predictionId);
    return prediction.recommendation;
  }
  const response = await apiClient.get<RecommendationDetails>(
    `/predictions/${predictionId}/recommendation`,
  );
  return response.data;
};

export const getPredictionAccuracy = async (): Promise<{
  overallAccuracy: number;
  directionalAccuracy: number;
  totalPredictions: number;
  successfulPredictions: number;
}> => {
  if (USE_MOCKS) {
    const history = await generateMockPredictionHistory();
    const successful = history.filter((h) => h.success).length;
    return {
      overallAccuracy: Number(((successful / history.length) * 100).toFixed(2)),
      directionalAccuracy: Number(
        ((successful / history.length) * 100).toFixed(2),
      ),
      totalPredictions: history.length,
      successfulPredictions: successful,
    };
  }
  const response = await apiClient.get("/predictions/accuracy");
  return response.data;
};
