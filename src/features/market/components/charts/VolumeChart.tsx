import type { OHLCData } from "@/features/market/types";
import { TradingViewVolumeChart } from "@/shared/components/TradingViewCharts";

export interface VolumeChartProps {
  data: OHLCData[];
  height?: number;
}

export function VolumeChart({ data, height = 150 }: VolumeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-slate-900 rounded-lg"
        style={{ height }}
      >
        <p className="text-slate-400">No volume data</p>
      </div>
    );
  }

  return <TradingViewVolumeChart data={data} height={height} />;
}
