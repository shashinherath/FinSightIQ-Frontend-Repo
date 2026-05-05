import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  TradingViewCandlestickChart,
  TradingViewLineChart,
} from "@/shared/components/TradingViewCharts";
import type {
  ForexHistoricalSeries,
  ForexTimeframe,
} from "../types/forex.types";

const TIMEFRAMES: ForexTimeframe[] = ["1H", "4H", "1D", "1W", "1M"];

export function ForexChart({
  pair,
  chartType,
  historical,
  onTimeframeChange,
  onChartTypeChange,
}: {
  pair: string;
  chartType: "line" | "candlestick";
  historical: ForexHistoricalSeries;
  onTimeframeChange: (timeframe: ForexTimeframe) => void;
  onChartTypeChange: (type: "line" | "candlestick") => void;
}) {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base">{pair} chart</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={chartType === "line" ? "default" : "outline"}
              onClick={() => onChartTypeChange("line")}
            >
              Line
            </Button>
            <Button
              type="button"
              size="sm"
              variant={chartType === "candlestick" ? "default" : "outline"}
              onClick={() => onChartTypeChange("candlestick")}
            >
              Candles
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {TIMEFRAMES.map((timeframe) => (
            <Button
              key={timeframe}
              type="button"
              size="sm"
              variant={
                historical.timeframe === timeframe ? "default" : "outline"
              }
              onClick={() => onTimeframeChange(timeframe)}
            >
              {timeframe}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {chartType === "line" ? (
          <TradingViewLineChart
            series={[
              {
                name: pair,
                color: "#38bdf8",
                values: historical.data.map((point) => ({
                  timestamp: point.timestamp,
                  value: point.close,
                })),
              },
            ]}
            height={360}
          />
        ) : (
          <TradingViewCandlestickChart data={historical.data} height={360} />
        )}
      </CardContent>
    </Card>
  );
}
