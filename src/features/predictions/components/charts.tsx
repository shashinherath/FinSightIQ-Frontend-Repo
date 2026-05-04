import { memo, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type {
  ForecastPoint,
  PredictionModel,
} from "@/features/predictions/types/prediction.types";
import { formatCurrency } from "@/features/predictions/utils/format";
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
  const historical = useMemo(
    () =>
      historicalSeries.map((point) => ({
        x: new Date(point.timestamp),
        y: [point.open, point.high, point.low, point.close],
      })),
    [historicalSeries],
  );

  const forecast = useMemo(
    () =>
      forecastSeries.map((point) => ({
        x: new Date(point.timestamp),
        y: point.value,
      })),
    [forecastSeries],
  );

  const confidenceBand = useMemo(
    () =>
      forecastSeries.map((point) => ({
        x: new Date(point.timestamp),
        y: [point.lower, point.upper],
      })),
    [forecastSeries],
  );

  const series = useMemo(() => {
    const base = [
      {
        name: "Historical",
        type: "candlestick" as const,
        data: historical,
      },
      {
        name: "Forecast",
        type: "line" as const,
        data: forecast,
      },
    ];

    if (!showConfidence) return base;

    return [
      ...base,
      {
        name: "Confidence",
        type: "rangeArea" as const,
        data: confidenceBand,
      },
    ];
  }, [historical, forecast, confidenceBand, showConfidence]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      height,
      type: "candlestick",
      toolbar: {
        show: true,
        tools: {
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        autoSelected: "zoom",
      },
      zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: true,
      },
    },
    theme: { mode: "dark" },
    stroke: {
      curve: "smooth",
      width: [2, 2, 0],
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#10b981",
          downward: "#ef4444",
        },
      },
    },
    colors: ["#10b981", "#34d399", "#60a5fa"],
    fill: {
      type: ["solid", "solid", "gradient"],
      opacity: [1, 1, 0.18],
    },
    legend: { show: false },
    xaxis: { type: "datetime" },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value),
      },
    },
    tooltip: {
      theme: "dark",
      shared: true,
      x: { format: "dd MMM" },
    },
    dataLabels: { enabled: false },
  };

  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{symbol} Forecast</span>
        <ForecastLegend />
      </div>
      <div role="img" aria-label={`${symbol} forecast chart`}>
        <ReactApexChart
          options={options}
          series={series as ApexCharts.ApexOptions["series"]}
          type="line"
          height={height}
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
  const series = useMemo(
    () =>
      Object.entries(modelComparisons).map(([model, points]) => ({
        name: model,
        data: points.map((point) => ({
          x: new Date(point.timestamp),
          y: point.value,
        })),
      })),
    [modelComparisons],
  );

  const options: ApexCharts.ApexOptions = {
    chart: { type: "line", height, toolbar: { show: false } },
    theme: { mode: "dark" },
    stroke: { curve: "smooth", width: 2 },
    xaxis: { type: "datetime" },
    yaxis: {
      labels: { formatter: (value) => formatCurrency(value) },
    },
    tooltip: { theme: "dark" },
  };

  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <h4 className="text-sm font-semibold text-foreground">
        Multi-model forecast
      </h4>
      <p className="text-xs text-muted-foreground">
        Compare model trajectories for the active horizon.
      </p>
      <div role="img" aria-label="Multi-model forecast chart">
        <ReactApexChart
          options={options}
          series={series as ApexCharts.ApexOptions["series"]}
          type="line"
          height={height}
        />
      </div>
    </div>
  );
});
