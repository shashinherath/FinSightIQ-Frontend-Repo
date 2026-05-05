/**
 * Predictions Feature Exports
 */

// Pages
export {
  PredictionsDashboardPage,
  PredictionHistoryPage,
  ModelAnalyticsPage,
  PredictionDetailsPage,
} from "./pages";

// Components
export { PredictionForm } from "./components/PredictionForm";
export { ModelSelector } from "./components/ModelSelector";
export { ForecastHorizonSelector } from "./components/ForecastHorizonSelector";
export { PredictionSubmitButton } from "./components/PredictionSubmitButton";
export * from "./components/summary";
export * from "./components/explainability";
export * from "./components/history";
export * from "./components/analytics";
export * from "./components/charts";
export * from "./components/widgets";

// Query
export {
  predictionQueryKeys,
  usePredictionHistory,
  usePredictionDetails,
  useGeneratePrediction,
  useModelAnalytics,
  usePredictionAccuracy,
  useShapValues,
  useRecommendation,
} from "./query/prediction.query";

// Services
export { usePredictionSignalR } from "./services/usePredictionSignalR";

// Store
export { usePredictionStore } from "./store/predictionStore";
export { useAnalyticsStore } from "./store/analyticsStore";
export { useAIInsightsStore } from "./store/aiInsightsStore";

// Types
export type * from "./types/prediction.types";
