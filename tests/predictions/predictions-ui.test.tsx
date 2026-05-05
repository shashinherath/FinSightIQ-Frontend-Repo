import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PredictionForm } from "@/features/predictions/components/PredictionForm";
import { RecommendationCard } from "@/features/predictions/components/summary";
import { PredictionHistoryTable } from "@/features/predictions/components/history";
import { AIFeedWidget } from "@/features/predictions/components/widgets";

const recommendation = {
  signal: "BUY" as const,
  confidence: 82,
  riskLevel: "LOW" as const,
  reason: "Momentum aligns with forecast.",
  supportingIndicators: [],
};

describe("predictions UI", () => {
  it("submits the prediction form with defaults", async () => {
    const onSubmit = vi.fn();
    render(<PredictionForm onSubmit={onSubmit} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Generate Prediction" }),
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(onSubmit).toHaveBeenCalledWith({
      symbol: "AAPL",
      model: "ENSEMBLE",
      horizon: "14D",
      confidencePreference: "MEDIUM",
    });
  });

  it("renders recommendation card metadata", () => {
    render(<RecommendationCard recommendation={recommendation} />);
    expect(screen.getByText("Recommendation")).toBeInTheDocument();
    expect(screen.getByText("LOW Risk")).toBeInTheDocument();
    expect(screen.getByText("BUY")).toBeInTheDocument();
  });

  it("handles history row selection", () => {
    const onSelect = vi.fn();
    render(
      <PredictionHistoryTable
        items={[
          {
            id: "history-1",
            symbol: "AAPL",
            model: "LSTM",
            horizon: "7D",
            createdAt: Date.now(),
            predictedPrice: 142,
            confidence: 74,
            direction: "UP",
            recommendation: "BUY",
            success: true,
          },
        ]}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByText("AAPL"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("retries failed feed item", () => {
    const onRetry = vi.fn();
    render(
      <AIFeedWidget
        items={[
          {
            id: "feed-1",
            symbol: "AAPL",
            model: "ARIMA",
            horizon: "7D",
            confidencePreference: "MEDIUM",
            createdAt: Date.now(),
            status: "error",
            error: "Failed",
          },
        ]}
        onRetry={onRetry}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
