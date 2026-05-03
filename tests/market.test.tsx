import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MarketOverviewPage } from "@/features/market/pages/MarketOverviewPage";
import { MarketSearchPage } from "@/features/market/pages/MarketSearchPage";
import { WatchlistPanel } from "@/features/market/components/watchlist/WatchlistPanel";
import { WatchlistTable } from "@/features/market/components/watchlist/WatchlistTable";
import { useSearchSymbols } from "@/features/market/hooks/useMarketQueries";

const navigateMock = vi.fn();
const createWatchlistMock = vi.fn();
const reorderMock = vi.fn();
const setPriceAlertMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@/features/market/hooks/useSignalR", () => ({
  useSignalR: vi.fn(),
  useRealtimePrices: vi.fn(() => []),
}));

vi.mock("@/features/market/components/charts", () => ({
  SparklineChart: () => <div data-testid="sparkline-chart" />,
}));

vi.mock("@/features/market/hooks/useMarketQueries", async () => {
  const actual = await vi.importActual(
    "@/features/market/hooks/useMarketQueries",
  );
  return {
    ...actual,
    useMarketOverview: vi.fn(() => ({
      data: {
        indexes: [
          {
            symbol: "SPX",
            name: "S&P 500",
            value: 5000,
            change: 10,
            changePercent: 0.2,
            timestamp: Date.now(),
          },
        ],
        trendingStocks: [],
        marketStatus: "OPEN",
        timestamp: Date.now(),
      },
      isLoading: false,
    })),
    useTopMovers: vi.fn(() => ({
      data: { gainers: [], losers: [], mostActive: [] },
      isLoading: false,
    })),
    useSearchSuggestions: vi.fn(() => ({
      data: { trendingSearches: [], recentSearches: [], results: [] },
    })),
    useSearchSymbols: vi.fn(() => ({ data: [], isLoading: false })),
    useWatchlists: vi.fn(() => ({
      data: [
        {
          id: "wl-1",
          name: "Main",
          items: [
            {
              id: "aapl-1",
              symbol: "AAPL",
              name: "Apple",
              addedAt: Date.now(),
            },
            {
              id: "msft-1",
              symbol: "MSFT",
              name: "Microsoft",
              addedAt: Date.now(),
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isDefault: true,
        },
      ],
      isLoading: false,
    })),
    useCreateWatchlist: vi.fn(() => ({
      mutateAsync: createWatchlistMock,
      isPending: false,
    })),
    useRemoveFromWatchlist: vi.fn(() => ({ mutate: vi.fn() })),
    useReorderWatchlist: vi.fn(() => ({
      mutateAsync: reorderMock,
      isPending: false,
    })),
    useSetPriceAlert: vi.fn(() => ({
      mutateAsync: setPriceAlertMock,
      isPending: false,
    })),
  };
});

const wrap = (ui: React.ReactNode) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
};

describe("market routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("navigates from overview to /app/market/stock/:symbol", () => {
    wrap(<MarketOverviewPage />);
    fireEvent.click(screen.getByText("S&P 500"));
    expect(navigateMock).toHaveBeenCalledWith("/app/market/stock/SPX");
  });

  it("navigates from search page to /app/market/stock/:symbol", async () => {
    const mockedSearch = vi.mocked(useSearchSymbols);
    mockedSearch.mockReturnValue({
      data: [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          exchange: "NASDAQ",
          currency: "USD",
          type: "STOCK",
          matchScore: 1,
        },
      ],
      isLoading: false,
    } as never);

    wrap(<MarketSearchPage />);
    fireEvent.change(
      screen.getByPlaceholderText("Search by symbol or company name..."),
      {
        target: { value: "AAPL" },
      },
    );
    fireEvent.click(screen.getByText("AAPL"));
    expect(navigateMock).toHaveBeenCalledWith("/app/market/stock/AAPL");
  });
});

describe("watchlist flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createWatchlistMock.mockResolvedValue({ id: "wl-new" });
    reorderMock.mockResolvedValue({});
    setPriceAlertMock.mockResolvedValue({});
  });

  it("creates a watchlist from panel", async () => {
    wrap(<WatchlistPanel />);
    fireEvent.click(screen.getByText("New Watchlist"));
    fireEvent.change(screen.getByPlaceholderText("Watchlist name"), {
      target: { value: "Growth" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(createWatchlistMock).toHaveBeenCalledWith("Growth");
    });
  });

  it("reorders watchlist items with up/down controls", async () => {
    const watchlist = {
      id: "wl-1",
      name: "Main",
      items: [
        { id: "aapl-1", symbol: "AAPL", name: "Apple", addedAt: Date.now() },
        {
          id: "msft-1",
          symbol: "MSFT",
          name: "Microsoft",
          addedAt: Date.now(),
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDefault: true,
    };

    wrap(<WatchlistTable watchlist={watchlist} />);
    fireEvent.click(screen.getByRole("button", { name: "Move AAPL down" }));

    await waitFor(() => {
      expect(reorderMock).toHaveBeenCalled();
    });
  });

  it("sets a price alert for a row", async () => {
    const watchlist = {
      id: "wl-1",
      name: "Main",
      items: [
        { id: "aapl-1", symbol: "AAPL", name: "Apple", addedAt: Date.now() },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDefault: true,
    };

    wrap(<WatchlistTable watchlist={watchlist} />);
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "200" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Set alert for AAPL" }));

    await waitFor(() => {
      expect(setPriceAlertMock).toHaveBeenCalled();
    });
  });

  it("clears an existing alert", async () => {
    const watchlist = {
      id: "wl-1",
      name: "Main",
      items: [
        {
          id: "aapl-1",
          symbol: "AAPL",
          name: "Apple",
          addedAt: Date.now(),
          alert: 210,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDefault: true,
    };

    wrap(<WatchlistTable watchlist={watchlist} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Clear alert for AAPL" }),
    );

    await waitFor(() => {
      expect(setPriceAlertMock).toHaveBeenCalledWith({
        itemId: "aapl-1",
        alertPrice: 0,
      });
    });
  });
});
