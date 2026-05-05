import type { OHLCData, TechnicalIndicators } from "@/features/market/types";
import { useMarketStore } from "@/features/market/store";
import { TradingViewCandlestickChart } from "@/shared/components/TradingViewCharts";

export interface CandlestickChartProps {
  symbol: string;
  data: OHLCData[];
  indicators?: TechnicalIndicators;
  height?: number;
  loading?: boolean;
  showIndicators?: boolean;
}

export function CandlestickChart({
  symbol,
  data,
  indicators,
  height = 400,
  loading = false,
  showIndicators = true,
}: CandlestickChartProps) {
  const { indicatorsShown } = useMarketStore();

  if (loading) {
    return (
      <div
        className="flex items-center justify-center bg-slate-900 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          <p className="mt-4 text-slate-400">Loading chart...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-slate-900 rounded-lg"
        style={{ height }}
      >
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <TradingViewCandlestickChart
        data={data}
        height={height}
        loading={loading}
        overlays={
          showIndicators
            ? [
                ...(indicators?.sma && indicatorsShown.sma
                  ? [
                      {
                        name: `${symbol} SMA`,
                        color: "#38bdf8",
                        values: indicators.sma
                          .map((value, index) => {
                            const candle = data[index];
                            return candle && value != null
                              ? { timestamp: candle.timestamp, value }
                              : null;
                          })
                          .filter(
                            (
                              entry,
                            ): entry is { timestamp: number; value: number } =>
                              entry !== null,
                          ),
                      },
                    ]
                  : []),
                ...(indicators?.ema && indicatorsShown.ema
                  ? [
                      {
                        name: `${symbol} EMA`,
                        color: "#f59e0b",
                        values: indicators.ema
                          .map((value, index) => {
                            const candle = data[index];
                            return candle && value != null
                              ? { timestamp: candle.timestamp, value }
                              : null;
                          })
                          .filter(
                            (
                              entry,
                            ): entry is { timestamp: number; value: number } =>
                              entry !== null,
                          ),
                      },
                    ]
                  : []),
              ]
            : []
        }
      />
    </div>
  );
}
