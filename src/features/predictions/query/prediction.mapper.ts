import type {
  PredictionHistoryItem,
  PredictionResult,
  RecommendationSignal,
  TrendDirection,
} from "@/features/predictions/types/prediction.types";

export const normalizePrediction = (
  prediction: PredictionResult,
): PredictionResult => ({
  ...prediction,
  symbol: prediction.symbol.toUpperCase(),
});

export const signalToBadgeVariant = (signal: RecommendationSignal) =>
  signal === "BUY"
    ? "default"
    : signal === "HOLD"
      ? "secondary"
      : "destructive";

export const directionToColor = (direction: TrendDirection) =>
  direction === "UP"
    ? "text-emerald-500"
    : direction === "DOWN"
      ? "text-destructive"
      : "text-amber-500";

export const sortHistory = (
  items: PredictionHistoryItem[],
  field: keyof PredictionHistoryItem,
  direction: "asc" | "desc",
) => {
  const sorted = [...items].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av).localeCompare(String(bv));
  });
  return direction === "asc" ? sorted : sorted.reverse();
};
