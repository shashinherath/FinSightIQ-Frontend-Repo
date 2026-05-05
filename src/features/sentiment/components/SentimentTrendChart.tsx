import { TradingViewLineChart } from "@/shared/components/TradingViewCharts";

export function SentimentTrendChart({
  series,
  height = 180,
}: {
  series: Array<{ timestamp: number; score: number }>;
  height?: number;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-3">
      <TradingViewLineChart
        series={[
          {
            name: "Sentiment",
            color: "#60a5fa",
            values: series.map((s) => ({
              timestamp: s.timestamp,
              value: s.score,
            })),
          },
        ]}
        height={height}
      />
    </div>
  );
}
