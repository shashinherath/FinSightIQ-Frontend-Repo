/**
 * Sparkline Chart Component
 * Small inline chart for quick trend visualization
 */

import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { OHLCData } from "@/features/market/types";

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
  const series = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const closePrices = data.map((candle) => candle.close);
    const isPositive = closePrices[closePrices.length - 1] >= closePrices[0];

    return [
      {
        data: closePrices,
        color:
          color === "green"
            ? "#10b981"
            : color === "red"
              ? "#ef4444"
              : isPositive
                ? "#10b981"
                : "#ef4444",
      },
    ];
  }, [data, color]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      opacity: 0.3,
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "12px",
      },
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
  };

  if (!series || series.length === 0 || !series[0]?.data) {
    return <div className="bg-slate-800 rounded" style={{ height, width }} />;
  }

  return (
    <div style={{ width }}>
      <ReactApexChart
        options={options}
        series={series as ApexCharts.ApexOptions["series"]}
        type="area"
        height={height}
      />
    </div>
  );
}
