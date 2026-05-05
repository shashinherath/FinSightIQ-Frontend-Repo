import { useEffect, useRef } from "react";
import { getSignalRService } from "@/features/market/services/signalr.service";
import { useForexStore } from "../store/forexStore";
import { isForexPair } from "../utils/forex.mapper";
import type { ForexQuote } from "../types/forex.types";

export function useForexSignalR(enabled = true) {
  const bufferRef = useRef<Record<string, ForexQuote>>({});
  const timerRef = useRef<number | null>(null);
  const selectedPair = useForexStore((state) => state.selectedPair);
  const recentPairs = useForexStore((state) => state.recentPairs);

  useEffect(() => {
    if (!enabled) return;

    let service;
    try {
      service = getSignalRService();
    } catch (err) {
      // SignalR not initialized, skip realtime updates
      console.warn(
        "SignalR not initialized, realtime forex updates disabled",
        err,
      );
      return;
    }
    const trackedPairs = Array.from(
      new Set([selectedPair, ...recentPairs]),
    ).filter(Boolean);
    const flush = () => {
      const payload = Object.values(bufferRef.current);
      bufferRef.current = {};
      timerRef.current = null;
      if (payload.length > 0) {
        useForexStore.getState().setLiveQuotes(payload);
      }
    };

    trackedPairs.forEach((pair) => service.subscribeToPrice(pair));

    service.onPriceUpdate((update) => {
      if (!isForexPair(update.symbol)) return;

      bufferRef.current[update.symbol] = {
        symbol: update.symbol,
        baseCurrency: update.symbol.slice(0, 3),
        quoteCurrency: update.symbol.slice(-3),
        name: `${update.symbol.slice(0, 3)} / ${update.symbol.slice(-3)}`,
        region: "Global",
        popularity: 100,
        price: update.price,
        bid: update.bid ?? update.price - 0.0001,
        ask: update.ask ?? update.price + 0.0001,
        spread:
          (update.ask ?? update.price + 0.0001) -
          (update.bid ?? update.price - 0.0001),
        pipChange:
          update.change * (update.symbol.endsWith("JPY") ? 100 : 10000),
        dailyChange: update.change,
        dailyChangePercent: update.changePercent,
        volatility: Math.abs(update.changePercent),
        high: update.price + Math.abs(update.change) * 2,
        low: update.price - Math.abs(update.change) * 2,
        trend:
          update.changePercent > 0.1
            ? "UP"
            : update.changePercent < -0.1
              ? "DOWN"
              : "SIDEWAYS",
        marketStatus: "OPEN",
        timestamp: update.timestamp,
        sparkline: [],
      };

      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(flush, 160);
    });

    return () => {
      trackedPairs.forEach((pair) => service.unsubscribeFromPrice(pair));
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [enabled, recentPairs, selectedPair]);
}
