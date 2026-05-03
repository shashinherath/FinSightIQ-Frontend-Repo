/**
 * Volume Chart Component
 */

import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { OHLCData } from "@/features/market/types";

export interface VolumeChartProps {
  data: OHLCData[];
  height?: number;
}

export function VolumeChart({ data, height = 150 }: VolumeChartProps) {
  const series = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    return [
      {
        name: "Volume",
        data: data.map((candle) => ({
          x: new Date(candle.timestamp),
          y: candle.volume,
          fillColor: candle.close >= candle.open ? "#10b981" : "#ef4444",
        })),
      },
    ];
  }, [data]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: height,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    theme: {
      mode: "dark",
    },
    plotOptions: {
      bar: {
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      title: {
        text: "Volume",
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        format: "dd MMM HH:mm",
      },
      y: {
        formatter: (value) => {
          if (typeof value === "number") {
            return `${(value / 1_000_000).toFixed(2)}M`;
          }
          return value;
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#404040",
    },
    colors: ["#3b82f6"],
    states: {
      hover: {
        filter: {
          type: "darken",
        },
      },
    },
  };

  if (!series || series.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-slate-900 rounded-lg"
        style={{ height }}
      >
        <p className="text-slate-400">No volume data</p>
      </div>
    );
  }

  return (
    <ReactApexChart
      options={options}
      series={series as ApexCharts.ApexOptions["series"]}
      type="bar"
      height={height}
    />
  );
}
