export type PredictionModel = "PROPHET" | "ARIMA" | "LSTM" | "ENSEMBLE";
export type ForecastHorizon = "1D" | "7D" | "14D" | "30D" | "90D";
export type ConfidencePreference = "LOW" | "MEDIUM" | "HIGH";
export type RecommendationSignal = "BUY" | "HOLD" | "SELL";
export type TrendDirection = "UP" | "DOWN" | "SIDEWAYS";

export interface PredictionRequest {
  symbol: string;
  model: PredictionModel;
  horizon: ForecastHorizon;
  confidencePreference: ConfidencePreference;
}

export interface ForecastPoint {
  timestamp: number;
  value: number;
  upper: number;
  lower: number;
}

export interface ConfidenceInterval {
  upper: number;
  lower: number;
  confidence: number;
}

export interface RecommendationDetails {
  signal: RecommendationSignal;
  confidence: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  reason: string;
  supportingIndicators: Array<{
    name: string;
    value: number;
    contribution: number;
  }>;
}

export interface ShapFeatureContribution {
  feature: string;
  value: number;
  impact: number;
  direction: "POSITIVE" | "NEGATIVE";
}

export interface PredictionResult {
  id: string;
  symbol: string;
  model: PredictionModel;
  horizon: ForecastHorizon;
  createdAt: number;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  direction: TrendDirection;
  recommendation: RecommendationDetails;
  confidenceInterval: ConfidenceInterval;
  historicalSeries: Array<{
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  forecastSeries: ForecastPoint[];
  modelComparisons: Record<PredictionModel, ForecastPoint[]>;
  shap: ShapFeatureContribution[];
  sentimentCorrelation: number;
  accuracy?: number;
}

export interface PredictionHistoryItem {
  id: string;
  symbol: string;
  model: PredictionModel;
  horizon: ForecastHorizon;
  createdAt: number;
  predictedPrice: number;
  actualPrice?: number;
  confidence: number;
  direction: TrendDirection;
  recommendation: RecommendationSignal;
  success?: boolean;
}

export interface ModelMetricSnapshot {
  model: PredictionModel;
  mape: number;
  rmse: number;
  directionalAccuracy: number;
  confidenceAverage: number;
  successRate: number;
  trend: Array<{ timestamp: number; accuracy: number }>;
}

export interface PredictionAccuracySummary {
  overallAccuracy: number;
  directionalAccuracy: number;
  totalPredictions: number;
  successfulPredictions: number;
}

export type PredictionRealtimeEventType =
  | "PREDICTION_COMPLETED"
  | "CONFIDENCE_CHANGED"
  | "MARKET_SIGNAL_ALERT"
  | "MODEL_ACCURACY_UPDATED"
  | "RECOMMENDATION_CHANGED";

export interface PredictionRealtimeEvent {
  type: PredictionRealtimeEventType;
  timestamp: number;
  payload: Record<string, unknown>;
}
