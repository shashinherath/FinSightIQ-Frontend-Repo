import ReactApexChart from "react-apexcharts";
import type { ModelMetricSnapshot } from "@/features/predictions/types/prediction.types";
import { formatPercent } from "@/features/predictions/utils/format";
import { cn } from "@/shared/utils/cn";

export function ModelPerformanceCard({
  snapshot,
}: {
  snapshot: ModelMetricSnapshot;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{snapshot.model}</p>
          <p className="text-lg font-semibold text-foreground">
            {formatPercent(snapshot.successRate, 0)} success
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs",
            snapshot.directionalAccuracy > 70
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-amber-500/20 text-amber-400",
          )}
        >
          {formatPercent(snapshot.directionalAccuracy, 0)} directional
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
        <div>
          <p>MAPE</p>
          <p className="text-foreground">{snapshot.mape.toFixed(2)}</p>
        </div>
        <div>
          <p>RMSE</p>
          <p className="text-foreground">{snapshot.rmse.toFixed(2)}</p>
        </div>
        <div>
          <p>Avg confidence</p>
          <p className="text-foreground">
            {formatPercent(snapshot.confidenceAverage, 0)}
          </p>
        </div>
        <div>
          <p>Trend points</p>
          <p className="text-foreground">{snapshot.trend.length}</p>
        </div>
      </div>
    </div>
  );
}

export function AccuracyTrendChart({
  snapshot,
  height = 220,
}: {
  snapshot: ModelMetricSnapshot;
  height?: number;
}) {
  const series = [
    {
      name: `${snapshot.model} accuracy`,
      data: snapshot.trend.map((point) => ({
        x: new Date(point.timestamp),
        y: point.accuracy,
      })),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: { type: "area", height, toolbar: { show: false } },
    theme: { mode: "dark" },
    stroke: { curve: "smooth", width: 2 },
    fill: { opacity: 0.2 },
    xaxis: { type: "datetime" },
    yaxis: { labels: { formatter: (value) => `${value.toFixed(0)}%` } },
    tooltip: { theme: "dark" },
  };

  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <h4 className="text-sm font-semibold text-foreground">Accuracy trend</h4>
      <div role="img" aria-label="Model accuracy trend chart">
        <ReactApexChart
          options={options}
          series={series as ApexCharts.ApexOptions["series"]}
          type="area"
          height={height}
        />
      </div>
    </div>
  );
}

export function ModelComparisonTable({
  snapshots,
}: {
  snapshots: ModelMetricSnapshot[];
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <h4 className="text-sm font-semibold text-foreground">
        Model comparison
      </h4>
      <div className="mt-4 grid gap-3">
        {snapshots.map((snapshot) => (
          <div
            key={snapshot.model}
            className="grid grid-cols-5 gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs"
          >
            <span className="font-semibold text-foreground">
              {snapshot.model}
            </span>
            <span className="text-muted-foreground">
              MAPE {snapshot.mape.toFixed(2)}
            </span>
            <span className="text-muted-foreground">
              RMSE {snapshot.rmse.toFixed(2)}
            </span>
            <span className="text-muted-foreground">
              Dir {formatPercent(snapshot.directionalAccuracy, 0)}
            </span>
            <span className="text-muted-foreground">
              Success {formatPercent(snapshot.successRate, 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PerformanceRadarChart({
  snapshots,
  height = 320,
}: {
  snapshots: ModelMetricSnapshot[];
  height?: number;
}) {
  const categories = ["MAPE", "RMSE", "Dir", "Conf", "Success"];
  const series = snapshots.map((snapshot) => ({
    name: snapshot.model,
    data: [
      100 - snapshot.mape * 8,
      100 - snapshot.rmse * 12,
      snapshot.directionalAccuracy,
      snapshot.confidenceAverage,
      snapshot.successRate,
    ],
  }));

  const options: ApexCharts.ApexOptions = {
    chart: { type: "radar", height, toolbar: { show: false } },
    theme: { mode: "dark" },
    xaxis: { categories },
    yaxis: { show: false },
    tooltip: { theme: "dark" },
  };

  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <h4 className="text-sm font-semibold text-foreground">
        Performance radar
      </h4>
      <div role="img" aria-label="Model performance radar chart">
        <ReactApexChart
          options={options}
          series={series as ApexCharts.ApexOptions["series"]}
          type="radar"
          height={height}
        />
      </div>
    </div>
  );
}

export function PerformanceHeatmap({
  snapshots,
  height = 260,
}: {
  snapshots: ModelMetricSnapshot[];
  height?: number;
}) {
  const categories = ["MAPE", "RMSE", "Dir", "Conf", "Success"];

  const series = snapshots.map((snapshot) => ({
    name: snapshot.model,
    data: [
      { x: categories[0], y: Math.max(0, 100 - snapshot.mape * 8) },
      { x: categories[1], y: Math.max(0, 100 - snapshot.rmse * 12) },
      { x: categories[2], y: snapshot.directionalAccuracy },
      { x: categories[3], y: snapshot.confidenceAverage },
      { x: categories[4], y: snapshot.successRate },
    ],
  }));

  const options: ApexCharts.ApexOptions = {
    chart: { type: "heatmap", height, toolbar: { show: false } },
    theme: { mode: "dark" },
    dataLabels: { enabled: false },
    colors: ["#60a5fa"],
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.45,
        radius: 4,
        useFillColorAsStroke: false,
        colorScale: {
          ranges: [
            { from: 0, to: 50, color: "#f97316" },
            { from: 50, to: 75, color: "#facc15" },
            { from: 75, to: 100, color: "#34d399" },
          ],
        },
      },
    },
    xaxis: { type: "category" },
    tooltip: { theme: "dark" },
  };

  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <h4 className="text-sm font-semibold text-foreground">
        Performance heatmap
      </h4>
      <div role="img" aria-label="Model performance heatmap">
        <ReactApexChart
          options={options}
          series={series as ApexCharts.ApexOptions["series"]}
          type="heatmap"
          height={height}
        />
      </div>
    </div>
  );
}
