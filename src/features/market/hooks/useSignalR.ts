/**
 * SignalR Hook for Component Integration
 * Manages subscription lifecycle automatically
 */

import { useEffect, useCallback, useRef } from "react";
import {
  getSignalRService,
  initializeSignalRService,
} from "@/features/market/services/signalr.service";
import type { SignalRServiceConfig } from "@/features/market/services/signalr.service";
import { useRealtimeStore, useMarketStore } from "@/features/market/store";
import type { RealtimePriceUpdate, MarketEvent } from "@/features/market/types";

/**
 * Hook to use SignalR service in components
 * Automatically handles connection lifecycle
 */
export const useSignalR = (
  autoConnect: boolean = true,
  config?: SignalRServiceConfig,
) => {
  const isInitialized = useRef(false);
  const { isConnected } = useRealtimeStore();

  useEffect(() => {
    if (!autoConnect || isInitialized.current) return;

    const initializeAndConnect = async () => {
      try {
        // Initialize service if not already done
        if (!isInitialized.current) {
          const defaultConfig: SignalRServiceConfig = {
            url:
              import.meta.env.VITE_SIGNALR_URL ||
              "https://localhost:5000/market-hub",
            ...config,
          };
          initializeSignalRService(defaultConfig);
          isInitialized.current = true;
        }

        const service = getSignalRService();

        if (!service.isConnected()) {
          await service.connect();
        }
      } catch (error) {
        console.error("Failed to initialize SignalR:", error);
      }
    };

    initializeAndConnect();
  }, [autoConnect, config]);

  return { isConnected };
};

/**
 * Hook to subscribe to a single stock price
 */
export const useSubscribeToPrice = (
  symbol: string | null,
  options?: {
    onUpdate?: (data: RealtimePriceUpdate) => void;
    enabled?: boolean;
  },
) => {
  const serviceRef = useRef<ReturnType<typeof getSignalRService> | null>(null);
  const callbackRef = useRef(options?.onUpdate);
  const registeredRef = useRef(false);

  useEffect(() => {
    callbackRef.current = options?.onUpdate;
  }, [options?.onUpdate]);

  useEffect(() => {
    if (!symbol || options?.enabled === false) return;

    try {
      const service = getSignalRService();
      serviceRef.current = service;

      // Subscribe to price updates
      service.subscribeToPrice(symbol);

      // Register one shared listener that gates by symbol
      if (!registeredRef.current) {
        service.onPriceUpdate((data) => {
          if (data.symbol === symbol) {
            callbackRef.current?.(data);
          }
        });
        registeredRef.current = true;
      }
    } catch (error) {
      console.error(`Failed to subscribe to ${symbol}:`, error);
    }

    // Cleanup on unmount
    return () => {
      try {
        if (serviceRef.current && symbol) {
          serviceRef.current.unsubscribeFromPrice(symbol);
        }
      } catch (error) {
        console.error(`Failed to unsubscribe from ${symbol}:`, error);
      }
    };
  }, [symbol, options?.enabled]);
};

/**
 * Hook to subscribe to multiple stock prices
 */
export const useSubscribeToMultiplePrices = (
  symbols: string[] = [],
  options?: {
    onUpdate?: (data: RealtimePriceUpdate) => void;
    enabled?: boolean;
  },
) => {
  const serviceRef = useRef<ReturnType<typeof getSignalRService> | null>(null);
  const previousSymbolsRef = useRef<string[]>([]);
  const callbackRef = useRef(options?.onUpdate);
  const registeredRef = useRef(false);

  useEffect(() => {
    callbackRef.current = options?.onUpdate;
  }, [options?.onUpdate]);

  useEffect(() => {
    if (options?.enabled === false) return;

    try {
      const service = getSignalRService();
      serviceRef.current = service;

      // Determine added and removed symbols
      const previousSymbols = previousSymbolsRef.current;
      const addedSymbols = symbols.filter((s) => !previousSymbols.includes(s));
      const removedSymbols = previousSymbols.filter(
        (s) => !symbols.includes(s),
      );

      // Unsubscribe from removed symbols
      removedSymbols.forEach((symbol) => {
        service.unsubscribeFromPrice(symbol);
      });

      // Subscribe to new symbols
      addedSymbols.forEach((symbol) => {
        service.subscribeToPrice(symbol);
      });

      // Register one shared listener for tracked symbols
      if (!registeredRef.current) {
        service.onPriceUpdate((data) => {
          callbackRef.current?.(data);
        });
        registeredRef.current = true;
      }

      previousSymbolsRef.current = symbols;
    } catch (error) {
      console.error("Failed to subscribe to multiple prices:", error);
    }

    // Cleanup on unmount
    return () => {
      try {
        if (serviceRef.current && symbols.length > 0) {
          serviceRef.current.unsubscribeFromMultipleSymbols(symbols);
        }
      } catch (error) {
        console.error("Failed to unsubscribe from multiple prices:", error);
      }
    };
  }, [symbols, options?.enabled]);
};

/**
 * Hook to listen to market events
 */
export const useMarketEvents = (options?: {
  onEvent?: (event: MarketEvent) => void;
  enabled?: boolean;
}) => {
  const serviceRef = useRef<ReturnType<typeof getSignalRService> | null>(null);
  const callbackRef = useRef(options?.onEvent);

  useEffect(() => {
    callbackRef.current = options?.onEvent;
  }, [options?.onEvent]);

  useEffect(() => {
    if (options?.enabled === false) return;

    try {
      const service = getSignalRService();
      serviceRef.current = service;

      service.onMarketEvent((event) => {
        callbackRef.current?.(event);
      });
    } catch (error) {
      console.error("Failed to setup market events listener:", error);
    }
  }, [options?.enabled]);
};

/**
 * Hook to watch symbols and update store
 * Automatically subscribes/unsubscribes based on watchlist changes
 */
export const useWatchListSubscriptions = (enabled: boolean = true) => {
  const { watchedSymbols } = useMarketStore();
  const serviceRef = useRef<ReturnType<typeof getSignalRService> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    try {
      const service = getSignalRService();
      serviceRef.current = service;

      // Subscribe to all watched symbols
      watchedSymbols.forEach((symbol) => {
        service.subscribeToPrice(symbol);
      });
    } catch (error) {
      console.error("Failed to subscribe to watched symbols:", error);
    }

    return () => {
      try {
        if (serviceRef.current && watchedSymbols.size > 0) {
          serviceRef.current.unsubscribeFromMultipleSymbols(
            Array.from(watchedSymbols),
          );
        }
      } catch (error) {
        console.error("Failed to unsubscribe from watched symbols:", error);
      }
    };
  }, [watchedSymbols, enabled]);
};

/**
 * Hook to get realtime price with updates
 */
export const useRealtimePrice = (symbol: string | null) => {
  const { realtimePrices } = useMarketStore();
  const price = symbol ? realtimePrices.get(symbol) : undefined;

  // Subscribe to price updates
  useSubscribeToPrice(symbol);

  return price;
};

/**
 * Hook to get multiple realtime prices with updates
 */
export const useRealtimePrices = (symbols: string[] = []) => {
  const { realtimePrices } = useMarketStore();
  const prices = symbols
    .map((symbol) => realtimePrices.get(symbol))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((price): price is any => !!price);

  // Subscribe to price updates
  useSubscribeToMultiplePrices(symbols);

  return prices;
};

/**
 * Hook to manage SignalR connection manually
 */
export const useSignalRConnection = () => {
  const { isConnected } = useRealtimeStore();

  const connect = useCallback(async () => {
    try {
      const service = getSignalRService();
      if (!service.isConnected()) {
        await service.connect();
      }
    } catch (error) {
      console.error("Failed to connect SignalR:", error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      const service = getSignalRService();
      await service.disconnect();
    } catch (error) {
      console.error("Failed to disconnect SignalR:", error);
      throw error;
    }
  }, []);

  return {
    isConnected,
    connect,
    disconnect,
  };
};
