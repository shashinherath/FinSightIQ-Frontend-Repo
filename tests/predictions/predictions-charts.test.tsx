import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ForecastChart } from "@/features/predictions/components/charts";
import { ShapFeatureChart } from "@/features/predictions/components/explainability";
import { PerformanceHeatmap } from "@/features/predictions/components/analytics";

vi.mock("react-apexcharts", () => ({
  default: () => <div data-testid="apex-chart" />,
}));

describe("prediction charts", () => {
  it("renders forecast chart legend and container", () => {
    render(
      <ForecastChart
        symbol="AAPL"
        historicalSeries={[
          {
            timestamp: Date.now() - 1000,
            open: 100,
            high: 110,
            low: 95,
            close: 108,
          },
        ]}
        forecastSeries={[
          {
            timestamp: Date.now(),
            value: 112,
            upper: 118,
            lower: 104,
          },
        ]}
      />,
    );

    expect(screen.getByText("AAPL Forecast")).toBeInTheDocument();
    expect(screen.getAllByTestId("apex-chart").length).toBeGreaterThan(0);
  });

  it("renders SHAP feature chart", () => {
    render(
      <ShapFeatureChart
        features={[
          { feature: "RSI", value: 44, impact: 0.42, direction: "POSITIVE" },
        ]}
      />,
    );

    expect(screen.getByText("SHAP contribution")).toBeInTheDocument();
  });

  it("renders model performance heatmap", () => {
    render(
      <PerformanceHeatmap
        snapshots={[
          {
            model: "LSTM",
            mape: 4,
            rmse: 2.2,
            directionalAccuracy: 72,
            confidenceAverage: 78,
            successRate: 69,
            trend: [],
          },
        ]}
      />,
    );

    expect(screen.getByText("Performance heatmap")).toBeInTheDocument();
  });
});
