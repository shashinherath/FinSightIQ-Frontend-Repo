import type {
  ForecastHorizon,
  ForecastPoint,
  ModelMetricSnapshot,
  PredictionHistoryItem,
  PredictionModel,
  PredictionRequest,
  PredictionResult,
  RecommendationDetails,
  RecommendationSignal,
  ShapFeatureContribution,
} from "@/features/predictions/types/prediction.types";

const MODELS: PredictionModel[] = ["PROPHET", "ARIMA", "LSTM", "ENSEMBLE"];
const FEATURES = [
  "RSI",
  "MACD",
  "Volume",
  "Sentiment",
  "Momentum",
  "SMA-20",
  "EMA-50",
  "Lag-1",
];

const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));

const seeded = (seed: string) => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const horizonDays = (h: ForecastHorizon) =>
  h === "1D" ? 1 : h === "7D" ? 7 : h === "14D" ? 14 : h === "30D" ? 30 : 90;

const buildForecast = (
  startPrice: number,
  days: number,
  rand: () => number,
): ForecastPoint[] => {
  const points: ForecastPoint[] = [];
  let price = startPrice;
  for (let i = 1; i <= days; i += 1) {
    const drift = (rand() - 0.42) * 2.6;
    price = Math.max(5, price + drift);
    const spread = Math.max(0.8, price * 0.018);
    points.push({
      timestamp: Date.now() + i * 24 * 60 * 60 * 1000,
      value: Number(price.toFixed(2)),
      upper: Number((price + spread).toFixed(2)),
      lower: Number((price - spread).toFixed(2)),
    });
  }
  return points;
};

const buildHistorySeries = (startPrice: number, rand: () => number) =>
  Array.from({ length: 120 }, (_, i) => {
    const ts = Date.now() - (119 - i) * 24 * 60 * 60 * 1000;
    const base = startPrice + (rand() - 0.5) * 6 + Math.sin(i / 6) * 2.5;
    const open = base + (rand() - 0.5) * 1.2;
    const close = base + (rand() - 0.5) * 1.4;
    const high = Math.max(open, close) + rand() * 1.5;
    const low = Math.min(open, close) - rand() * 1.5;
    return {
      timestamp: ts,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(1_000_000 + rand() * 90_000_000),
    };
  });

const makeRecommendation = (
  predicted: number,
  current: number,
  confidence: number,
  rand: () => number,
): RecommendationDetails => {
  const diff = ((predicted - current) / current) * 100;
  const signal: RecommendationSignal =
    diff > 1.4 ? "BUY" : diff < -1.2 ? "SELL" : "HOLD";
  const risk = confidence > 80 ? "LOW" : confidence > 65 ? "MEDIUM" : "HIGH";

  return {
    signal,
    confidence,
    riskLevel: risk,
    reason:
      signal === "BUY"
        ? "Positive trend projection with strong momentum and supportive sentiment."
        : signal === "SELL"
          ? "Downside pressure detected with weak technical momentum."
          : "Mixed indicators suggest neutral positioning.",
    supportingIndicators: [
      {
        name: "RSI",
        value: 40 + rand() * 35,
        contribution: (rand() - 0.35) * 24,
      },
      {
        name: "MACD",
        value: -1 + rand() * 2,
        contribution: (rand() - 0.4) * 22,
      },
      { name: "Sentiment", value: rand(), contribution: (rand() - 0.4) * 20 },
      {
        name: "Volume",
        value: 0.5 + rand() * 1.5,
        contribution: (rand() - 0.5) * 18,
      },
    ],
  };
};

const makeShap = (rand: () => number): ShapFeatureContribution[] =>
  FEATURES.map((feature) => {
    const impact = (rand() - 0.5) * 2.5;
    return {
      feature,
      value: Number((rand() * 100).toFixed(2)),
      impact: Number(impact.toFixed(3)),
      direction: impact >= 0 ? "POSITIVE" : "NEGATIVE",
    };
  }).sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

export const generateMockPrediction = async (
  request: PredictionRequest,
): Promise<PredictionResult> => {
  await delay(700);
  const rand = seeded(
    `${request.symbol}-${request.model}-${request.horizon}-${request.confidencePreference}`,
  );
  const currentPrice = Number((60 + rand() * 460).toFixed(2));
  const days = horizonDays(request.horizon);
  const forecast = buildForecast(currentPrice, days, rand);
  const predictedPrice = forecast[forecast.length - 1]?.value ?? currentPrice;
  const confidence = Number((62 + rand() * 34).toFixed(1));
  const recommendation = makeRecommendation(
    predictedPrice,
    currentPrice,
    confidence,
    rand,
  );

  return {
    id: `pred-${Date.now()}-${Math.floor(rand() * 10000)}`,
    symbol: request.symbol.toUpperCase(),
    model: request.model,
    horizon: request.horizon,
    createdAt: Date.now(),
    currentPrice,
    predictedPrice,
    confidence,
    direction:
      predictedPrice > currentPrice + 1
        ? "UP"
        : predictedPrice < currentPrice - 1
          ? "DOWN"
          : "SIDEWAYS",
    recommendation,
    confidenceInterval: {
      upper: forecast[forecast.length - 1]?.upper ?? predictedPrice,
      lower: forecast[forecast.length - 1]?.lower ?? predictedPrice,
      confidence,
    },
    historicalSeries: buildHistorySeries(currentPrice, rand),
    forecastSeries: forecast,
    modelComparisons: MODELS.reduce<Record<PredictionModel, ForecastPoint[]>>(
      (acc, model) => {
        const tweak =
          model === "ENSEMBLE"
            ? 1.02
            : model === "LSTM"
              ? 1.01
              : model === "PROPHET"
                ? 0.995
                : 0.99;
        acc[model] = buildForecast(
          currentPrice * tweak,
          days,
          seeded(`${request.symbol}-${model}-${days}`),
        );
        return acc;
      },
      {} as Record<PredictionModel, ForecastPoint[]>,
    ),
    shap: makeShap(rand),
    sentimentCorrelation: Number((0.3 + rand() * 0.6).toFixed(2)),
    accuracy: Number((58 + rand() * 36).toFixed(1)),
  };
};

export const generateMockPredictionHistory = async (
  symbol?: string,
): Promise<PredictionHistoryItem[]> => {
  await delay();
  return Array.from({ length: 120 }, (_, i) => {
    const rand = seeded(`${symbol || "ALL"}-${i}`);
    const current = 50 + rand() * 400;
    const predicted = current * (0.95 + rand() * 0.1);
    const actual = current * (0.95 + rand() * 0.1);
    const success =
      Math.sign(predicted - current) === Math.sign(actual - current);
    return {
      id: `history-${i + 1}`,
      symbol:
        symbol?.toUpperCase() ||
        ["AAPL", "MSFT", "NVDA", "TSLA", "AMZN"][i % 5],
      model: MODELS[i % MODELS.length],
      horizon: (["1D", "7D", "14D", "30D", "90D"] as ForecastHorizon[])[i % 5],
      createdAt: Date.now() - i * 8 * 60 * 60 * 1000,
      predictedPrice: Number(predicted.toFixed(2)),
      actualPrice: Number(actual.toFixed(2)),
      confidence: Number((60 + rand() * 35).toFixed(1)),
      direction:
        predicted > current ? "UP" : predicted < current ? "DOWN" : "SIDEWAYS",
      recommendation:
        predicted > current * 1.01
          ? "BUY"
          : predicted < current * 0.99
            ? "SELL"
            : "HOLD",
      success,
    };
  });
};

export const generateMockModelAnalytics = async (): Promise<
  ModelMetricSnapshot[]
> => {
  await delay();
  return MODELS.map((model, idx) => {
    const rand = seeded(`model-${model}`);
    return {
      model,
      mape: Number((4 + rand() * 6 + idx * 0.3).toFixed(2)),
      rmse: Number((2 + rand() * 4 + idx * 0.4).toFixed(2)),
      directionalAccuracy: Number((58 + rand() * 34).toFixed(1)),
      confidenceAverage: Number((61 + rand() * 30).toFixed(1)),
      successRate: Number((55 + rand() * 36).toFixed(1)),
      trend: Array.from({ length: 30 }, (_, i) => ({
        timestamp: Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
        accuracy: Number((55 + rand() * 38 + Math.sin(i / 4)).toFixed(2)),
      })),
    };
  });
};

export const generateMockPredictionById = async (
  predictionId: string,
): Promise<PredictionResult> => {
  const request: PredictionRequest = {
    symbol: predictionId.slice(0, 4).replace(/[^A-Za-z]/g, "") || "AAPL",
    model: "ENSEMBLE",
    horizon: "14D",
    confidencePreference: "MEDIUM",
  };
  return generateMockPrediction(request);
};
