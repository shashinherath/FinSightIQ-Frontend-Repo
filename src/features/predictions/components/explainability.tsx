import ReactApexChart from "react-apexcharts";
import type { ShapFeatureContribution } from "@/features/predictions/types/prediction.types";
import { cn } from "@/shared/utils/cn";

export function ShapFeatureChart({
  features,
  height = 260,
}: {
  features: ShapFeatureContribution[];
  height?: number;
}) {
  const series = [
    {
      name: "Impact",
      data: features.map((feature) => feature.impact),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: { type: "bar", height, toolbar: { show: false } },
    theme: { mode: "dark" },
    plotOptions: { bar: { horizontal: true } },
    colors: ["#60a5fa"],
    xaxis: {
      categories: features.map((feature) => feature.feature),
      labels: { style: { colors: "#94a3b8" } },
    },
    tooltip: { theme: "dark" },
    dataLabels: { enabled: false },
  };

  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <h4 className="text-sm font-semibold text-foreground">
        SHAP contribution
      </h4>
      <p className="text-xs text-muted-foreground">
        Feature contribution to the prediction output.
      </p>
      <div role="img" aria-label="SHAP feature contribution chart">
        <ReactApexChart
          options={options}
          series={series as ApexCharts.ApexOptions["series"]}
          type="bar"
          height={height}
        />
      </div>
    </div>
  );
}

export function FeatureImportanceBar({
  feature,
}: {
  feature: ShapFeatureContribution;
}) {
  const tone =
    feature.direction === "POSITIVE" ? "bg-emerald-500" : "bg-destructive";
  return (
    <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{feature.feature}</span>
        <span className="text-foreground">{feature.impact.toFixed(2)}</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className={cn("h-2 rounded-full", tone)}
          style={{ width: `${Math.min(100, Math.abs(feature.impact) * 20)}%` }}
        />
      </div>
    </div>
  );
}

export function PredictionExplanationCard({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-foreground">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        AI Explanation
      </p>
      <p className="mt-2 leading-relaxed">{text}</p>
    </div>
  );
}

export function AIReasoningPanel({ reasons }: { reasons: string[] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <h4 className="text-sm font-semibold text-foreground">AI reasoning</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {reasons.map((reason, index) => (
          <li key={index} className="rounded-md bg-muted/30 px-3 py-2">
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
