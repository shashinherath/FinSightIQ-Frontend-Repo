import type { OHLCData } from "@/features/market/types";
import { TradingViewSparklineChart } from "@/shared/components/TradingViewCharts";

export interface SparklineChartProps {
  data: OHLCData[];
  height?: number;
  width?: string;
  color?: "green" | "red" | "blue";
}

export function SparklineChart({
  data,
  height = 60,
  width = "100%",
  color = "blue",
}: SparklineChartProps) {
  if (!data || data.length === 0) {
    return <div className="bg-slate-800 rounded" style={{ height, width }} />;
  }

  return (
    <div style={{ width }}>
      <TradingViewSparklineChart
        data={data.map((candle) => ({
          timestamp: candle.timestamp,
          close: candle.close,
        }))}
        height={height}
        color={color}
      />
    </div>
  );
}
