import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SentimentDashboardPage from "@/features/sentiment/pages/SentimentDashboardPage";

const useMarketSentimentMock = vi.fn();

vi.mock("@/features/sentiment/query/sentiment.query", () => ({
  useMarketSentiment: () => useMarketSentimentMock(),
}));

vi.mock("@/features/sentiment/components/SentimentScoreCard", () => ({
  SentimentScoreCard: ({ title, score }: { title?: string; score: number }) => (
    <div data-testid="score-card">
      {title}:{score}
    </div>
  ),
}));

vi.mock("@/features/sentiment/components/MarketMoodIndicator", () => ({
  MarketMoodIndicator: ({ mood }: { mood: number }) => (
    <div data-testid="mood-indicator">{mood}</div>
  ),
}));

vi.mock("@/features/sentiment/components/SentimentTrendChart", () => ({
  SentimentTrendChart: ({
    series,
  }: {
    series: Array<{ timestamp: number; score: number }>;
  }) => <div data-testid="trend-chart">{series.length}</div>,
}));

vi.mock("@/features/sentiment/components/NewsFeed", () => ({
  NewsFeed: () => <div data-testid="news-feed" />,
}));

vi.mock("@/features/sentiment/components/SentimentHeatmap", () => ({
  SentimentHeatmap: ({
    data,
  }: {
    data: Array<{ symbol: string; value: number }>;
  }) => (
    <div data-testid="heatmap">
      {data.map((entry) => `${entry.symbol}:${entry.value}`).join("|")}
    </div>
  ),
}));

describe("SentimentDashboardPage", () => {
  beforeEach(() => {
    useMarketSentimentMock.mockReset();
  });

  it("renders fallback sentiment UI when no market data is loaded", () => {
    useMarketSentimentMock.mockReturnValue({ data: undefined });

    render(<SentimentDashboardPage />);

    expect(screen.getByTestId("score-card")).toHaveTextContent(
      "Global Sentiment:0",
    );
    expect(screen.getByTestId("mood-indicator")).toHaveTextContent("0");
    expect(screen.getByTestId("trend-chart")).toHaveTextContent("0");
    expect(screen.getByTestId("heatmap")).toHaveTextContent("");
    expect(screen.getByTestId("news-feed")).toBeInTheDocument();
  });

  it("maps sector sentiment into the heatmap props", () => {
    useMarketSentimentMock.mockReturnValue({
      data: {
        overall: 34,
        bullishRatio: 0.61,
        bearishRatio: 0.39,
        sectors: [
          { sector: "Tech", score: 45, bullish: 18, bearish: 7 },
          { sector: "Energy", score: -12, bullish: 6, bearish: 11 },
        ],
      },
    });

    render(<SentimentDashboardPage />);

    expect(screen.getByTestId("score-card")).toHaveTextContent(
      "Global Sentiment:34",
    );
    expect(screen.getByTestId("heatmap")).toHaveTextContent("Tech:45");
    expect(screen.getByTestId("heatmap")).toHaveTextContent("Energy:-12");
  });
});
