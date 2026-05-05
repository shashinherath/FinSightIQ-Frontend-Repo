import { useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import {
  ColorType,
  CrosshairMode,
  createChart,
  type CandlestickData,
  type IChartApi,
  type LineData,
  type Time,
} from "lightweight-charts";
import { cn } from "@/shared/utils/cn";

export interface ChartContainerProps {
  height?: number;
  className?: string;
  children?: ReactNode;
}

function useChartContainer(widthDependent = true) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resize = () => {
      if (!chartRef.current || !container) return;
      chartRef.current.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    resize();

    if (!widthDependent) return;

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [widthDependent]);

  return { containerRef, chartRef };
}

function formatBusinessDay(timestamp: number) {
  const date = new Date(timestamp);
  return {
    year: date.getUTCFullYear(),
    month: (date.getUTCMonth() + 1) as
      | 1
      | 2
      | 3
      | 4
      | 5
      | 6
      | 7
      | 8
      | 9
      | 10
      | 11
      | 12,
    day: date.getUTCDate() as
      | 1
      | 2
      | 3
      | 4
      | 5
      | 6
      | 7
      | 8
      | 9
      | 10
      | 11
      | 12
      | 13
      | 14
      | 15
      | 16
      | 17
      | 18
      | 19
      | 20
      | 21
      | 22
      | 23
      | 24
      | 25
      | 26
      | 27
      | 28
      | 29
      | 30
      | 31,
  };
}

function commonChartOptions(height: number) {
  return {
    autoSize: true,
    height,
    layout: {
      background: { type: ColorType.Solid, color: "transparent" },
      textColor: "#94a3b8",
    },
    grid: {
      vertLines: { color: "rgba(148, 163, 184, 0.12)" },
      horzLines: { color: "rgba(148, 163, 184, 0.12)" },
    },
    crosshair: {
      mode: CrosshairMode.Normal,
    },
    rightPriceScale: {
      borderColor: "rgba(148, 163, 184, 0.18)",
    },
    timeScale: {
      borderColor: "rgba(148, 163, 184, 0.18)",
      timeVisible: true,
      secondsVisible: false,
    },
    handleScroll: {
      mouseWheel: true,
      pressedMouseMove: true,
      horzTouchDrag: true,
      vertTouchDrag: true,
    },
    handleScale: {
      axisPressedMouseMove: true,
      mouseWheel: true,
      pinch: true,
    },
  } as const;
}

export interface TradingViewCandlestickChartProps {
  data: Array<{
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
  height?: number;
  loading?: boolean;
  className?: string;
  overlays?: Array<{
    name: string;
    values: Array<{ timestamp: number; value: number }>;
    color: string;
  }>;
}

export function TradingViewCandlestickChart({
  data,
  height = 400,
  loading = false,
  className,
  overlays = [],
}: TradingViewCandlestickChartProps) {
  const { containerRef, chartRef } = useChartContainer();

  const normalized = useMemo<CandlestickData[] | null>(() => {
    if (!data.length) return null;
    // Deduplicate by business day first
    const seen = new Set<string>();
    const unique = data.filter((item) => {
      const date = new Date(item.timestamp);
      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.map((item) => ({
      time: formatBusinessDay(item.timestamp),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));
  }, [data]);

  const overlaySeriesData = useMemo(() => {
    return overlays.map((overlay) => {
      // Deduplicate by business day first
      const seen = new Set<string>();
      const unique = overlay.values.filter((point) => {
        const date = new Date(point.timestamp);
        const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      const data = unique.map((point) => ({
        time: formatBusinessDay(point.timestamp),
        value: point.value,
      })) as LineData<Time>[];

      return {
        name: overlay.name,
        data,
        color: overlay.color,
      };
    });
  }, [overlays]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || loading) return;

    container.innerHTML = "";
    const chart = createChart(container, commonChartOptions(height));
    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    if (normalized) {
      candleSeries.setData(normalized);
      chart.timeScale().fitContent();
    }

    overlaySeriesData.forEach((overlay) => {
      const line = chart.addLineSeries({
        color: overlay.color,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      line.setData(overlay.data);
    });

    const observer = new ResizeObserver(() => {
      chart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [height, loading, normalized, overlaySeriesData, containerRef, chartRef]);

  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/20",
          className,
        )}
        style={{ height }}
      >
        <p className="text-sm text-muted-foreground">Loading chart...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/20",
          className,
        )}
        style={{ height }}
      >
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("w-full", className)}
      style={{ height }}
    />
  );
}

export interface TradingViewVolumeChartProps {
  data: Array<{
    timestamp: number;
    open: number;
    close: number;
    volume: number;
  }>;
  height?: number;
  loading?: boolean;
  className?: string;
}

export function TradingViewVolumeChart({
  data,
  height = 150,
  loading = false,
  className,
}: TradingViewVolumeChartProps) {
  const { containerRef, chartRef } = useChartContainer();

  const normalized = useMemo<LineData<Time>[] | null>(() => {
    if (!data.length) return null;
    // Deduplicate by business day first
    const seen = new Set<string>();
    const unique = data.filter((item) => {
      const date = new Date(item.timestamp);
      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.map((item) => ({
      time: formatBusinessDay(item.timestamp),
      value: item.volume,
    }));
  }, [data]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || loading) return;

    container.innerHTML = "";
    const chart = createChart(container, commonChartOptions(height));
    chartRef.current = chart;

    const volumeSeries = chart.addLineSeries({
      color: "#38bdf8",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    if (normalized) {
      volumeSeries.setData(normalized);
      chart.timeScale().fitContent();
    }

    const observer = new ResizeObserver(() => {
      chart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [height, loading, normalized, containerRef, chartRef]);

  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/20",
          className,
        )}
        style={{ height }}
      >
        <p className="text-sm text-muted-foreground">Loading chart...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/20",
          className,
        )}
        style={{ height }}
      >
        <p className="text-sm text-muted-foreground">No volume data</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("w-full", className)}
      style={{ height }}
    />
  );
}

export interface TradingViewSparklineChartProps {
  data: Array<{ timestamp: number; close: number }>;
  height?: number;
  className?: string;
  color?: "green" | "red" | "blue";
}

export function TradingViewSparklineChart({
  data,
  height = 60,
  className,
  color = "blue",
}: TradingViewSparklineChartProps) {
  const { containerRef, chartRef } = useChartContainer();

  const normalized = useMemo<LineData<Time>[] | null>(() => {
    if (!data.length) return null;
    // Deduplicate by business day first
    const seen = new Set<string>();
    const unique = data.filter((item) => {
      const date = new Date(item.timestamp);
      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.map((item) => ({
      time: formatBusinessDay(item.timestamp),
      value: item.close,
    }));
  }, [data]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";
    const chart = createChart(container, {
      ...commonChartOptions(height),
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94a3b8",
      },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      rightPriceScale: { visible: false },
      leftPriceScale: { visible: false },
      timeScale: { visible: false },
      crosshair: { mode: CrosshairMode.Normal },
    });
    chartRef.current = chart;

    const line = chart.addLineSeries({
      color:
        color === "green" ? "#10b981" : color === "red" ? "#ef4444" : "#38bdf8",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    if (normalized) {
      line.setData(normalized);
      chart.timeScale().fitContent();
    }

    const observer = new ResizeObserver(() => {
      chart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [height, normalized, color, containerRef, chartRef]);

  if (!data.length) {
    return (
      <div
        className={cn("rounded bg-muted/20", className)}
        style={{ height }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("w-full", className)}
      style={{ height }}
    />
  );
}

export interface TradingViewLineChartProps {
  series: Array<{
    name: string;
    values: Array<{ timestamp: number; value: number }>;
    color: string;
  }>;
  height?: number;
  className?: string;
  showLegend?: boolean;
}

export function TradingViewLineChart({
  series,
  height = 300,
  className,
  showLegend = true,
}: TradingViewLineChartProps) {
  const { containerRef, chartRef } = useChartContainer();

  const normalizedSeries = useMemo(
    () =>
      series.map((entry) => {
        // Deduplicate by business day first
        const seen = new Set<string>();
        const unique = entry.values.filter((point) => {
          const date = new Date(point.timestamp);
          const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        const data = unique.map((point) => ({
          time: formatBusinessDay(point.timestamp),
          value: point.value,
        })) as LineData<Time>[];

        return {
          ...entry,
          data,
        };
      }),
    [series],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";
    const chart = createChart(container, commonChartOptions(height));
    chartRef.current = chart;

    normalizedSeries.forEach((entry) => {
      const line = chart.addLineSeries({
        color: entry.color,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      line.setData(entry.data);
    });

    if (normalizedSeries.length > 0) {
      chart.timeScale().fitContent();
    }

    const observer = new ResizeObserver(() => {
      chart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [height, normalizedSeries, containerRef, chartRef]);

  return (
    <div className={cn("space-y-2", className)}>
      {showLegend && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {series.map((entry) => (
            <span key={entry.name} className="flex items-center gap-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
          ))}
        </div>
      )}
      <div ref={containerRef} className="w-full" style={{ height }} />
    </div>
  );
}
