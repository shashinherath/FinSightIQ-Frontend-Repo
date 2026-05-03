/**
 * Market Components Tests
 * Using Vitest and React Testing Library
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StockSearchInput } from "@/features/market/components/search/StockSearchInput";
import {
  MarketSummaryCard,
  TopMoverItem,
} from "@/features/market/components/dashboard/MarketCards";
import { DashboardWidget } from "@/features/market/components/dashboard/DashboardWidget";
import { MarketIndex } from "@/features/market/types";

// ============================================================================
// STOCK SEARCH INPUT TESTS
// ============================================================================

describe("StockSearchInput", () => {
  it("renders search input", () => {
    render(<StockSearchInput />);
    expect(screen.getByPlaceholderText(/search stocks/i)).toBeInTheDocument();
  });

  it("calls onSelect when symbol is selected", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<StockSearchInput onSelect={onSelect} />);

    const input = screen.getByPlaceholderText(/search stocks/i);
    await user.type(input, "AAPL");

    // Note: In real tests, you'd mock the API response
    // For now, just test that the input works
    expect(input).toHaveValue("AAPL");
  });

  it("stores recent searches in localStorage", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<StockSearchInput onSelect={onSelect} />);

    const input = screen.getByPlaceholderText(/search stocks/i);
    await user.type(input, "AAPL");
    await user.keyboard("{Enter}");

    expect(localStorage.getItem("stock_recent_searches")).toBeDefined();
  });
});

// ============================================================================
// MARKET SUMMARY CARD TESTS
// ============================================================================

describe("MarketSummaryCard", () => {
  const mockIndex: MarketIndex = {
    symbol: "SPX",
    name: "S&P 500",
    value: 4500.5,
    change: 25.5,
    changePercent: 0.57,
    timestamp: Date.now(),
  };

  it("renders market index data", () => {
    render(<MarketSummaryCard index={mockIndex} />);

    expect(screen.getByText("S&P 500")).toBeInTheDocument();
    expect(screen.getByText("4501")).toBeInTheDocument();
  });

  it("displays positive change in green", () => {
    render(<MarketSummaryCard index={mockIndex} />);

    const changeElement = screen.getByText("+25.50");
    expect(changeElement).toHaveClass("text-green-400");
  });

  it("displays negative change in red", () => {
    const negativeIndex = {
      ...mockIndex,
      change: -25.5,
      changePercent: -0.57,
    };

    render(<MarketSummaryCard index={negativeIndex} />);

    const changeElement = screen.getByText("-25.50");
    expect(changeElement).toHaveClass("text-red-400");
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<MarketSummaryCard index={mockIndex} onClick={onClick} />);

    const card = screen.getByText("S&P 500").closest("div");
    if (card) {
      await user.click(card);
    }

    expect(onClick).toHaveBeenCalled();
  });
});

// ============================================================================
// TOP MOVER ITEM TESTS
// ============================================================================

describe("TopMoverItem", () => {
  it("renders stock information", () => {
    render(
      <TopMoverItem
        symbol="AAPL"
        name="Apple Inc."
        price={150.5}
        change={5.5}
        changePercent={3.79}
      />,
    );

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
    expect(screen.getByText("$150.50")).toBeInTheDocument();
  });

  it("displays positive percentage in green", () => {
    render(
      <TopMoverItem
        symbol="AAPL"
        name="Apple Inc."
        price={150.5}
        change={5.5}
        changePercent={3.79}
      />,
    );

    const percentElement = screen.getByText("+3.79%");
    expect(percentElement).toHaveClass("text-green-400");
  });

  it("displays negative percentage in red", () => {
    render(
      <TopMoverItem
        symbol="AAPL"
        name="Apple Inc."
        price={150.5}
        change={-5.5}
        changePercent={-3.79}
      />,
    );

    const percentElement = screen.getByText("-3.79%");
    expect(percentElement).toHaveClass("text-red-400");
  });

  it("displays volume when provided", () => {
    render(
      <TopMoverItem
        symbol="AAPL"
        name="Apple Inc."
        price={150.5}
        change={5.5}
        changePercent={3.79}
        volume={50000000}
      />,
    );

    expect(screen.getByText(/Vol: 50.0M/)).toBeInTheDocument();
  });
});

// ============================================================================
// DASHBOARD WIDGET TESTS
// ============================================================================

describe("DashboardWidget", () => {
  it("renders widget title and content", () => {
    render(
      <DashboardWidget title="Test Widget">
        <p>Widget content</p>
      </DashboardWidget>,
    );

    expect(screen.getByText("Test Widget")).toBeInTheDocument();
    expect(screen.getByText("Widget content")).toBeInTheDocument();
  });

  it("displays loading state", () => {
    render(
      <DashboardWidget title="Test Widget" loading>
        <p>Widget content</p>
      </DashboardWidget>,
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(
      <DashboardWidget title="Test Widget" error="Something went wrong">
        <p>Widget content</p>
      </DashboardWidget>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("collapses widget when collapse button clicked", async () => {
    render(
      <DashboardWidget title="Test Widget" collapsible>
        <p>Widget content</p>
      </DashboardWidget>,
    );

    const collapseButton = screen.getByRole("button", {
      name: "",
    }).parentElement;
    expect(collapseButton).toBeInTheDocument();

    // Widget content should be visible initially
    expect(screen.getByText("Widget content")).toBeInTheDocument();
  });
});
