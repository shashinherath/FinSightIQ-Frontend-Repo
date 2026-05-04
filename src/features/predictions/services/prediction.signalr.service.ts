import * as signalR from "@microsoft/signalr";
import type { PredictionRealtimeEvent } from "@/features/predictions/types/prediction.types";

export interface PredictionSignalRConfig {
  url: string;
  enableMockStream?: boolean;
}

type EventHandler = (event: PredictionRealtimeEvent) => void;

class PredictionSignalRService {
  private connection: signalR.HubConnection | null = null;
  private config: PredictionSignalRConfig;
  private handlers = new Set<EventHandler>();
  private mockTimer: number | null = null;

  constructor(config: PredictionSignalRConfig) {
    this.config = config;
  }

  async connect() {
    if (this.config.enableMockStream) {
      this.startMockStream();
      return;
    }

    if (this.connection?.state === signalR.HubConnectionState.Connected) return;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.config.url)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.connection.on("PredictionEvent", (event: PredictionRealtimeEvent) => {
      this.handlers.forEach((handler) => handler(event));
    });
    await this.connection.start();
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop();
    }
    if (this.mockTimer) {
      window.clearInterval(this.mockTimer);
      this.mockTimer = null;
    }
  }

  onEvent(handler: EventHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private startMockStream() {
    if (this.mockTimer) return;
    this.mockTimer = window.setInterval(() => {
      const events: PredictionRealtimeEvent["type"][] = [
        "PREDICTION_COMPLETED",
        "CONFIDENCE_CHANGED",
        "MARKET_SIGNAL_ALERT",
        "MODEL_ACCURACY_UPDATED",
        "RECOMMENDATION_CHANGED",
      ];
      const type = events[Math.floor(Math.random() * events.length)];
      const event: PredictionRealtimeEvent = {
        type,
        timestamp: Date.now(),
        payload: {
          message:
            type === "MARKET_SIGNAL_ALERT"
              ? "High confidence signal detected"
              : `${type} received`,
          score: Number((60 + Math.random() * 35).toFixed(2)),
        },
      };
      this.handlers.forEach((handler) => handler(event));
    }, 6000);
  }
}

let instance: PredictionSignalRService | null = null;

export const initializePredictionSignalR = (
  config: PredictionSignalRConfig,
) => {
  if (!instance) {
    instance = new PredictionSignalRService(config);
  }
  return instance;
};

export const getPredictionSignalR = () => {
  if (!instance) {
    throw new Error("Prediction SignalR not initialized");
  }
  return instance;
};
