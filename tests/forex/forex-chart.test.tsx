import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ForexChart } from "@/features/forex/components/ForexChart";

vi.mock("@/shared/components/TradingViewCharts", () => ({
  TradingViewLineChart: () => <div data-testid="line-chart" />,
  TradingViewCandlestickChart: () => <div data-testid="candlestick-chart" />,
}));

const historical = {
  pair: "EUR/USD",
  timeframe: "1D" as const,
  data: Array.from({ length: 12 }).map((_, index) => ({
    timestamp: Date.now() - (11 - index) * 60 * 60 * 1000,
    open: 1.09 + index * 0.001,
    high: 1.092 + index * 0.001,
    low: 1.088 + index * 0.001,
    close: 1.091 + index * 0.001,
    volume: 1_000_000 + index * 10_000,
  })),
  bid: 1.091,
  ask: 1.0912,
  spread: 0.00012,
  pipChange: 14.2,
  volatility: 0.88,
  high: 1.102,
  low: 1.085,
  timestamp: Date.now(),
};

describe("ForexChart", () => {
  it("renders timeframe and chart mode controls", () => {
    render(
      <ForexChart
        pair="EUR/USD"
        chartType="line"
        historical={historical}
        onTimeframeChange={() => void 0}
        onChartTypeChange={() => void 0}
      />,
    );

    expect(screen.getByRole("button", { name: "Line" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Candles" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1D" })).toBeInTheDocument();
    expect(screen.getByText("EUR/USD chart")).toBeInTheDocument();
  });
});
