/**
 * Candlestick Chart Component
 * Financial charting with ApexCharts
 */

import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { OHLCData, TechnicalIndicators } from "@/features/market/types";
import { useMarketStore } from "@/features/market/store";

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

  // Format data for ApexCharts candlestick
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    return data.map((candle) => ({
      x: new Date(candle.timestamp),
      y: [candle.open, candle.high, candle.low, candle.close],
    }));
  }, [data]);

  // Prepare series data
  const series = useMemo(() => {
    const candleData = {
      name: `${symbol} OHLC`,
      data: chartData,
    };

    // Add technical indicators if present
    const indicatorSeries = [];

    if (showIndicators && indicators?.sma && indicatorsShown.sma) {
      indicatorSeries.push({
        name: "SMA",
        type: "line" as const,
        data: indicators.sma.map((value, index) => ({
          x: chartData[index]?.x,
          y: value?.toFixed(2),
        })),
      });
    }

    if (showIndicators && indicators?.ema && indicatorsShown.ema) {
      indicatorSeries.push({
        name: "EMA",
        type: "line" as const,
        data: indicators.ema.map((value, index) => ({
          x: chartData[index]?.x,
          y: value?.toFixed(2),
        })),
      });
    }

    return [candleData, ...indicatorSeries];
  }, [chartData, symbol, indicators, indicatorsShown, showIndicators]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "candlestick",
      height: height,
      zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: true,
      },
      toolbar: {
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        autoSelected: "zoom",
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    theme: {
      mode: "dark",
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#10b981",
          downward: "#ef4444",
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      theme: "dark",
      x: {
        format: "dd MMM yyyy HH:mm",
      },
      y: {
        formatter: (value) => {
          if (typeof value === "number") {
            return value.toFixed(2);
          }
          return value;
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#404040",
      padding: {
        left: 20,
        right: 20,
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
        },
      },
    },
  };

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

  if (!chartData || chartData.length === 0) {
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
      <ReactApexChart
        options={options}
        series={series as ApexCharts.ApexOptions["series"]}
        type="candlestick"
        height={height}
      />
    </div>
  );
}
