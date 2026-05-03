/**
 * Watchlist Table Component
 */

import { useMemo } from "react";
import { Trash2, AlertCircle } from "lucide-react";
import type { Watchlist, StockQuote } from "@/features/market/types";
import { useRealtimePrices } from "@/features/market/hooks/useSignalR";
import { useRemoveFromWatchlist } from "@/features/market/hooks/useMarketQueries";
import { Button } from "@/shared/ui/button";

import { cn } from "@/shared/utils/cn";

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
  const { mutate: removeFromWatchlist } = useRemoveFromWatchlist(watchlist.id);

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
      };
    });
  }, [watchlist.items, realtimePrices, quotes]);

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
            <th className="text-center px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {tableData.map(({ item, price, change, changePercent, volume }) => (
            <tr
              key={item.id}
              className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors duration-150 cursor-pointer"
              onClick={() => onSymbolClick?.(item.symbol)}
            >
              {/* Symbol */}
              <td className="px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-100">{item.symbol}</p>
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
                {/* Placeholder for sparkline */}
                <div className="h-10 bg-slate-700/50 rounded" />
              </td>

              {/* Actions */}
              <td className="px-4 py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(item.id);
                  }}
                  className="text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
