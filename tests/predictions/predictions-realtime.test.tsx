import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePredictionSignalR } from "@/features/predictions/services/usePredictionSignalR";
import { usePredictionStore } from "@/features/predictions/store/predictionStore";

const connectMock = vi.fn();
const disconnectMock = vi.fn();
const onEventMock = vi.fn();
let handler:
  | ((event: {
      type: string;
      timestamp: number;
      payload: Record<string, unknown>;
    }) => void)
  | null = null;

vi.mock("@/features/predictions/services/prediction.signalr.service", () => ({
  initializePredictionSignalR: () => ({
    connect: connectMock,
    disconnect: disconnectMock,
  }),
  getPredictionSignalR: () => ({
    onEvent: (cb: typeof handler) => {
      handler = cb;
      onEventMock(cb);
      return () => {
        handler = null;
      };
    },
  }),
}));

function TestHarness() {
  usePredictionSignalR(true);
  return null;
}

describe("prediction realtime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    connectMock.mockReset();
    disconnectMock.mockReset();
    onEventMock.mockReset();
    handler = null;
    usePredictionStore.setState({ realtimeEvents: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("batches incoming events into store", () => {
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <TestHarness />
      </QueryClientProvider>,
    );

    expect(connectMock).toHaveBeenCalled();

    handler?.({
      type: "CONFIDENCE_CHANGED",
      timestamp: Date.now(),
      payload: { score: 70 },
    });
    handler?.({
      type: "MODEL_ACCURACY_UPDATED",
      timestamp: Date.now(),
      payload: { score: 72 },
    });

    vi.advanceTimersByTime(700);

    const { realtimeEvents } = usePredictionStore.getState();
    expect(realtimeEvents.length).toBe(2);
  });
});
