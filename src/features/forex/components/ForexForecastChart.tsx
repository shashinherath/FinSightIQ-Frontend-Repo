import { ForecastChart } from "@/features/predictions/components/charts";
import type { PredictionResult } from "@/features/predictions/types/prediction.types";

export function ForexForecastChart({
  pair,
  prediction,
}: {
  pair: string;
  prediction: PredictionResult;
}) {
  return (
    <ForecastChart
      symbol={pair}
      historicalSeries={prediction.historicalSeries}
      forecastSeries={prediction.forecastSeries}
      showConfidence
    />
  );
}
