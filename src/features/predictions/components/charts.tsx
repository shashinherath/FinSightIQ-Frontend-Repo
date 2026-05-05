import { memo } from "react";
import type {
  ForecastPoint,
  PredictionModel,
} from "@/features/predictions/types/prediction.types";
import {
  TradingViewCandlestickChart,
  TradingViewLineChart,
} from "@/shared/components/TradingViewCharts";
import { cn } from "@/shared/utils/cn";

export interface ForecastChartProps {
  symbol: string;
  historicalSeries: Array<{
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
  forecastSeries: ForecastPoint[];
  height?: number;
  showConfidence?: boolean;
}

export const ForecastChart = memo(function ForecastChart({
  symbol,
  historicalSeries,
  forecastSeries,
  height = 320,
  showConfidence = true,
}: ForecastChartProps) {
  const overlays = [
    {
      name: "Forecast",
      color: "#34d399",
      values: forecastSeries.map((point) => ({
        timestamp: point.timestamp,
        value: point.value,
      })),
    },
    ...(showConfidence
      ? [
          {
            name: "Lower band",
            color: "#60a5fa",
            values: forecastSeries.map((point) => ({
              timestamp: point.timestamp,
              value: point.lower,
            })),
          },
          {
            name: "Upper band",
            color: "#60a5fa",
            values: forecastSeries.map((point) => ({
              timestamp: point.timestamp,
              value: point.upper,
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{symbol} Forecast</span>
        <ForecastLegend />
      </div>
      <div
        role="img"
        aria-label={`${symbol} forecast chart`}
        data-testid="apex-chart"
      >
        <TradingViewCandlestickChart
          data={historicalSeries}
          height={height}
          overlays={overlays}
        />
      </div>
    </div>
  );
});

export function ForecastLegend() {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-blue-400" />
        Historical
      </span>
      <span className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Forecast
      </span>
      <span className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-blue-300" />
        Band
      </span>
    </div>
  );
}

export function PredictionOverlay({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "positive" | "negative" | "neutral";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs",
        tone === "positive" && "text-emerald-400",
        tone === "negative" && "text-destructive",
      )}
    >
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function ConfidenceBand({
  lower,
  upper,
}: {
  lower: string;
  upper: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs">
      <p className="text-[10px] uppercase text-muted-foreground">Confidence</p>
      <p className="text-sm font-semibold text-foreground">
        {lower} - {upper}
      </p>
    </div>
  );
}

export interface MultiModelChartProps {
  modelComparisons: Record<PredictionModel, ForecastPoint[]>;
  height?: number;
}

export const MultiModelChart = memo(function MultiModelChart({
  modelComparisons,
  height = 300,
}: MultiModelChartProps) {
  const palette = ["#60a5fa", "#34d399", "#f59e0b", "#f472b6", "#a78bfa"];
  const series = Object.entries(modelComparisons).map(
    ([model, points], index) => ({
      name: model,
      values: points.map((point) => ({
        timestamp: point.timestamp,
        value: point.value,
      })),
      color: palette[index % palette.length],
    }),
  );

  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <h4 className="text-sm font-semibold text-foreground">
        Multi-model forecast
      </h4>
      <p className="text-xs text-muted-foreground">
        Compare model trajectories for the active horizon.
      </p>
      <div role="img" aria-label="Multi-model forecast chart">
        <TradingViewLineChart series={series} height={height} />
      </div>
    </div>
  );
});
