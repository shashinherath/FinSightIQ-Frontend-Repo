/**
 * Watchlist Table Component
 */

import { useMemo, useState } from "react";
import {
  Trash2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Bell,
  BellOff,
} from "lucide-react";
import type { Watchlist, StockQuote } from "@/features/market/types";
import { useRealtimePrices } from "@/features/market/hooks/useSignalR";
import {
  useRemoveFromWatchlist,
  useReorderWatchlist,
  useSetPriceAlert,
} from "@/features/market/hooks/useMarketQueries";
import { Button } from "@/shared/ui/button";
import { useWatchlistStore } from "@/features/market/store";

import { cn } from "@/shared/utils/cn";
import { SparklineChart } from "@/features/market/components/charts";

export interface WatchlistTableProps {
  watchlist: Watchlist;
  quotes?: StockQuote[];
  loading?: boolean;
  onSymbolClick?: (symbol: string) => void;
}

export function WatchlistTable({
  watchlist,
  quotes = [],
  loading = false,
  onSymbolClick,
}: WatchlistTableProps) {
  const [alertDrafts, setAlertDrafts] = useState<Record<string, string>>({});
  const { favoriteSymbols, toggleFavorite } = useWatchlistStore();
  const { mutate: removeFromWatchlist } = useRemoveFromWatchlist(watchlist.id);
  const { mutateAsync: reorderWatchlist, isPending: isReordering } =
    useReorderWatchlist(watchlist.id);
  const { mutateAsync: setPriceAlert, isPending: isAlertPending } =
    useSetPriceAlert(watchlist.id);

  const symbols = useMemo(
    () => watchlist.items.map((item) => item.symbol),
    [watchlist.items],
  );

  const realtimePrices = useRealtimePrices(symbols);

  // Combine watchlist items with current prices
  const tableData = useMemo(() => {
    return watchlist.items.map((item) => {
      const latestPrice = realtimePrices.find((p) => p?.symbol === item.symbol);
      const quote = quotes.find((q) => q.symbol === item.symbol);

      return {
        item,
        price: latestPrice?.price || quote?.price || 0,
        change: latestPrice?.change || quote?.priceChange || 0,
        changePercent:
          latestPrice?.changePercent || quote?.priceChangePercent || 0,
        volume: latestPrice?.volume || 0,
        alert: item.alert,
      };
    });
  }, [watchlist.items, realtimePrices, quotes]);

  const reorderByIndex = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= watchlist.items.length || isReordering) {
      return;
    }

    const nextItems = [...watchlist.items];
    const [moved] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, moved);
    const nextIds = nextItems.map((item) => item.id);

    try {
      await reorderWatchlist(nextIds);
    } catch (error) {
      console.error("Failed to reorder watchlist:", error);
    }
  };

  const handleSetAlert = async (itemId: string) => {
    const raw = alertDrafts[itemId];
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }

    try {
      await setPriceAlert({ itemId, alertPrice: parsed });
    } catch (error) {
      console.error("Failed to set price alert:", error);
    }
  };

  const handleClearAlert = async (itemId: string) => {
    try {
      await setPriceAlert({ itemId, alertPrice: 0 });
      setAlertDrafts((prev) => ({ ...prev, [itemId]: "" }));
    } catch (error) {
      console.error("Failed to clear price alert:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-800 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (tableData.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4 opacity-50" />
        <p className="text-slate-400">No items in this watchlist</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Symbol
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Price
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Change
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Volume
            </th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Chart
            </th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Alert
            </th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Order
            </th>
            <th className="text-center px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {tableData.map(
            ({ item, price, change, changePercent, volume, alert }, index) => (
              <tr
                key={item.id}
                className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors duration-150 cursor-pointer"
                onClick={() => onSymbolClick?.(item.symbol)}
              >
                {/* Symbol */}
                <td className="px-4 py-4">
                  <div>
                    <p className="font-semibold text-slate-100">
                      {item.symbol}
                    </p>
                    <p className="text-xs text-slate-400">{item.symbol}</p>
                  </div>
                </td>

                {/* Price */}
                <td className="text-right px-4 py-4 font-semibold text-slate-100">
                  ${price.toFixed(2)}
                </td>

                {/* Change */}
                <td
                  className={cn(
                    "text-right px-4 py-4 font-semibold",
                    change >= 0 ? "text-green-400" : "text-red-400",
                  )}
                >
                  <div>
                    {change >= 0 ? "+" : ""}
                    {change.toFixed(2)}
                  </div>
                  <div className="text-xs opacity-75">
                    {changePercent >= 0 ? "+" : ""}
                    {changePercent.toFixed(2)}%
                  </div>
                </td>

                {/* Volume */}
                <td className="text-right px-4 py-4 text-slate-400">
                  {volume > 0 ? `${(volume / 1_000_000).toFixed(1)}M` : "N/A"}
                </td>

                {/* Chart */}
                <td className="px-4 py-4">
                  <SparklineChart
                    data={
                      Array.from({ length: 12 }, (_, i) => ({
                        timestamp: Date.now() - (11 - i) * 60 * 1000,
                        open: price * (1 - i * 0.0005),
                        high: price * (1 + i * 0.0003),
                        low: price * (1 - i * 0.0008),
                        close: price * (1 + (i - 6) * 0.0004),
                        volume: Math.max(volume, 1),
                      })) || []
                    }
                    height={40}
                  />
                </td>

                {/* Alert */}
                <td className="px-4 py-4">
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="number"
                      value={alertDrafts[item.id] ?? (alert?.toString() || "")}
                      onChange={(e) =>
                        setAlertDrafts((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      placeholder="Price"
                      className="w-20 px-2 py-1 text-xs rounded border border-slate-700 bg-slate-900 text-slate-200"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleSetAlert(item.id)}
                      disabled={isAlertPending}
                      className="text-slate-300"
                      aria-label={`Set alert for ${item.symbol}`}
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                    {alert ? (
                      <button
                        className="text-xs text-amber-300 hover:underline"
                        onClick={() => void handleClearAlert(item.id)}
                        aria-label={`Clear alert for ${item.symbol}`}
                      >
                        ${alert.toFixed(2)}
                      </button>
                    ) : (
                      <BellOff className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                </td>

                {/* Order */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={index === 0 || isReordering}
                      onClick={(e) => {
                        e.stopPropagation();
                        void reorderByIndex(index, index - 1);
                      }}
                      className="text-slate-300"
                      aria-label={`Move ${item.symbol} up`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={index === tableData.length - 1 || isReordering}
                      onClick={(e) => {
                        e.stopPropagation();
                        void reorderByIndex(index, index + 1);
                      }}
                      className="text-slate-300"
                      aria-label={`Move ${item.symbol} down`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchlist(item.id);
                      if (favoriteSymbols.has(item.symbol)) {
                        toggleFavorite(item.symbol);
                      }
                    }}
                    className="text-slate-400 hover:text-red-400"
                    aria-label={`Remove ${item.symbol}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
