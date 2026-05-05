import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { useForexStore } from "@/features/forex/store/forexStore";
import { useForexSignalR } from "@/features/forex/services/useForexSignalR";
import { act } from "react";

const priceUpdateHandlers: Array<
  (update: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    timestamp: number;
    bid?: number;
    ask?: number;
  }) => void
> = [];

vi.mock("@/features/market/services/signalr.service", () => ({
  getSignalRService: () => ({
    subscribeToPrice: vi.fn(),
    unsubscribeFromPrice: vi.fn(),
    onPriceUpdate: (handler: (update: unknown) => void) => {
      priceUpdateHandlers.push(
        handler as (update: {
          symbol: string;
          price: number;
          change: number;
          changePercent: number;
          volume: number;
          timestamp: number;
          bid?: number;
          ask?: number;
        }) => void,
      );
    },
  }),
}));

function RealtimeHarness() {
  useForexSignalR(true);
  return null;
}

describe("Forex realtime updates", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    priceUpdateHandlers.length = 0;
    useForexStore.setState({
      selectedPair: "EUR/USD",
      selectedTimeframe: "1D",
      searchQuery: "",
      recentPairs: ["EUR/USD"],
      liveQuotes: {},
      historicalSeries: {},
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("batches forex price updates into the store", () => {
    render(<RealtimeHarness />);

    expect(priceUpdateHandlers.length).toBeGreaterThan(0);

    priceUpdateHandlers[0]({
      symbol: "EUR/USD",
      price: 1.0987,
      change: 0.0012,
      changePercent: 0.11,
      volume: 1_100_000,
      timestamp: Date.now(),
      bid: 1.0986,
      ask: 1.0988,
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(useForexStore.getState().liveQuotes["EUR/USD"]?.price).toBe(1.0987);
  });
});
