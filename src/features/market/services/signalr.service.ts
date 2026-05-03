/**
 * SignalR Service for Realtime Market Data
 * Handles WebSocket connections and message subscriptions
 */

import * as signalR from "@microsoft/signalr";
import type { RealtimePriceUpdate, MarketEvent } from "@/features/market/types";
import { MarketEventType } from "@/features/market/types";
import { useRealtimeStore, useMarketStore } from "@/features/market/store";

export interface SignalRServiceConfig {
  url: string;
  reconnectPolicy?: signalR.IRetryPolicy;
  logging?: signalR.LogLevel | signalR.ILogger;
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private config: SignalRServiceConfig;
  private reconnectAttempts = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor(config: SignalRServiceConfig) {
    this.config = {
      ...config,
      reconnectPolicy: config.reconnectPolicy || this.getDefaultRetryPolicy(),
      logging: config.logging || signalR.LogLevel.Warning,
    };
  }

  /**
   * Get exponential backoff retry policy
   */
  private getDefaultRetryPolicy(): signalR.IRetryPolicy {
    const delays = [1000, 2000, 5000, 10000, 30000];

    return {
      nextRetryDelayInMilliseconds: ({ previousRetryCount }) => {
        return delays[previousRetryCount] ?? null;
      },
    };
  }

  /**
   * Initialize SignalR connection
   */
  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log("SignalR already connected");
      return;
    }

    try {
      useRealtimeStore.setState({ isConnecting: true, error: null });

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.config.url, {
          accessTokenFactory: () => localStorage.getItem("auth_token") || "",
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets,
          withCredentials: true,
        })
        .withAutomaticReconnect(
          this.config.reconnectPolicy || this.getDefaultRetryPolicy(),
        )
        .withHubProtocol(new signalR.JsonHubProtocol())
        .configureLogging(this.config.logging || signalR.LogLevel.Warning)
        .build();

      // Setup connection event handlers
      this.setupConnectionHandlers();

      // Start connection
      await this.connection.start();
      console.log("SignalR connected successfully");

      this.reconnectAttempts = 0;
      useRealtimeStore.setState({
        isConnected: true,
        isConnecting: false,
        error: null,
        lastConnectionTime: Date.now(),
      });
    } catch (error) {
      console.error("Failed to connect SignalR:", error);
      useRealtimeStore.setState({
        isConnecting: false,
        error: error instanceof Error ? error.message : "Connection failed",
      });
      throw error;
    }
  }

  /**
   * Setup connection event handlers
   */
  private setupConnectionHandlers(): void {
    if (!this.connection) return;

    // Reconnecting event
    this.connection.onreconnecting((error) => {
      console.log("SignalR reconnecting...", error);
      this.reconnectAttempts++;
      useRealtimeStore.setState({
        isConnecting: true,
        isConnected: false,
      });
    });

    // Reconnected event
    this.connection.onreconnected((connectionId) => {
      console.log("SignalR reconnected:", connectionId);
      this.reconnectAttempts = 0;
      useRealtimeStore.setState({
        isConnecting: false,
        isConnected: true,
        error: null,
        lastConnectionTime: Date.now(),
      });

      // Resubscribe to all watched symbols
      this.resubscribeWatchedSymbols();
    });

    // Closed event
    this.connection.onclose((error) => {
      console.log("SignalR connection closed:", error);
      useRealtimeStore.setState({
        isConnected: false,
        isConnecting: false,
        error: error?.message || "Connection closed",
      });
    });
  }

  /**
   * Disconnect from SignalR
   */
  async disconnect(): Promise<void> {
    if (!this.connection) return;

    try {
      await this.connection.stop();
      this.connection = null;
      this.messageHandlers.clear();
      useRealtimeStore.setState({
        isConnected: false,
        isConnecting: false,
      });
      console.log("SignalR disconnected");
    } catch (error) {
      console.error("Error disconnecting SignalR:", error);
    }
  }

  /**
   * Subscribe to real-time price updates for a symbol
   */
  subscribeToPrice(symbol: string): void {
    if (!this.connection) {
      console.error("SignalR not connected");
      return;
    }

    try {
      this.connection.invoke("SubscribeToPrice", symbol).catch((error) => {
        console.error(`Failed to subscribe to ${symbol}:`, error);
        useRealtimeStore.setState((state) => ({
          subscriptionErrors: new Map(state.subscriptionErrors).set(
            symbol,
            error.message,
          ),
        }));
      });

      useRealtimeStore.setState((state) => {
        const newSubscribed = new Set(state.subscribedSymbols);
        newSubscribed.add(symbol);
        return { subscribedSymbols: newSubscribed };
      });
    } catch (error) {
      console.error(`Error subscribing to ${symbol}:`, error);
    }
  }

  /**
   * Unsubscribe from real-time price updates for a symbol
   */
  unsubscribeFromPrice(symbol: string): void {
    if (!this.connection) return;

    try {
      this.connection.invoke("UnsubscribeFromPrice", symbol).catch((error) => {
        console.error(`Failed to unsubscribe from ${symbol}:`, error);
      });

      useRealtimeStore.setState((state) => {
        const newSubscribed = new Set(state.subscribedSymbols);
        newSubscribed.delete(symbol);
        return { subscribedSymbols: newSubscribed };
      });
    } catch (error) {
      console.error(`Error unsubscribing from ${symbol}:`, error);
    }
  }

  /**
   * Subscribe to multiple symbols
   */
  subscribeToMultipleSymbols(symbols: string[]): void {
    symbols.forEach((symbol) => this.subscribeToPrice(symbol));
  }

  /**
   * Unsubscribe from multiple symbols
   */
  unsubscribeFromMultipleSymbols(symbols: string[]): void {
    symbols.forEach((symbol) => this.unsubscribeFromPrice(symbol));
  }

  /**
   * Resubscribe to all watched symbols after reconnection
   */
  private resubscribeWatchedSymbols(): void {
    const { watchedSymbols } = useMarketStore.getState();
    watchedSymbols.forEach((symbol) => {
      this.subscribeToPrice(symbol);
    });
  }

  /**
   * Listen to price update messages
   */
  onPriceUpdate(callback: (data: RealtimePriceUpdate) => void): void {
    if (!this.connection) {
      console.error("SignalR not connected");
      return;
    }

    this.connection.on("PriceUpdate", (data: RealtimePriceUpdate) => {
      callback(data);
      // Update market store with new price
      useMarketStore.setState((state) => {
        const newPrices = new Map(state.realtimePrices);
        newPrices.set(data.symbol, data);
        return {
          realtimePrices: newPrices,
          lastUpdateTimestamp: Date.now(),
        };
      });
    });
  }

  /**
   * Listen to market event messages
   */
  onMarketEvent(callback: (event: MarketEvent) => void): void {
    if (!this.connection) {
      console.error("SignalR not connected");
      return;
    }

    this.connection.on("MarketEvent", (event: MarketEvent) => {
      callback(event);
      this.handleMarketEvent(event);
    });
  }

  /**
   * Handle market events (trading halts, circuit breakers, etc.)
   */
  private handleMarketEvent(event: MarketEvent): void {
    switch (event.type) {
      case MarketEventType.TRADING_HALT:
        console.warn("Trading halt detected:", event.data);
        break;

      case MarketEventType.CIRCUIT_BREAKER:
        console.warn("Circuit breaker triggered:", event.data);
        break;

      case MarketEventType.MARKET_STATUS_CHANGE:
        console.log("Market status changed:", event.data);
        // Update market status in store
        if (event.data.status) {
          useMarketStore.setState({
            isMarketOpen: event.data.status === "OPEN",
          });
        }
        break;

      case MarketEventType.ERROR:
        console.error("Market error:", event.data);
        useRealtimeStore.setState({
          error: event.data.message || "Market error occurred",
        });
        break;

      default:
        console.log("Market event:", event);
    }
  }

  /**
   * Send custom message to server
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendMessage(methodName: string, ...args: any[]): Promise<any> {
    if (!this.connection) {
      throw new Error("SignalR not connected");
    }

    try {
      return await this.connection.invoke(methodName, ...args);
    } catch (error) {
      console.error(`Error invoking ${methodName}:`, error);
      throw error;
    }
  }

  /**
   * Listen to custom message
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMessage(methodName: string, callback: (data: any) => void): void {
    if (!this.connection) {
      console.error("SignalR not connected");
      return;
    }

    this.connection.on(methodName, callback);
    this.messageHandlers.set(methodName, callback);
  }

  /**
   * Stop listening to custom message
   */
  offMessage(methodName: string): void {
    if (!this.connection) return;

    const handler = this.messageHandlers.get(methodName);
    if (handler) {
      this.connection.off(methodName, handler);
      this.messageHandlers.delete(methodName);
    }
  }

  /**
   * Get connection state
   */
  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state ?? null;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

// Singleton instance
let signalRServiceInstance: SignalRService | null = null;

/**
 * Initialize SignalR service (should be called once in app initialization)
 */
export const initializeSignalRService = (
  config: SignalRServiceConfig,
): SignalRService => {
  if (signalRServiceInstance) {
    return signalRServiceInstance;
  }

  signalRServiceInstance = new SignalRService(config);
  return signalRServiceInstance;
};

/**
 * Get SignalR service instance
 */
export const getSignalRService = (): SignalRService => {
  if (!signalRServiceInstance) {
    throw new Error(
      "SignalR service not initialized. Call initializeSignalRService first.",
    );
  }
  return signalRServiceInstance;
};

export default SignalRService;
