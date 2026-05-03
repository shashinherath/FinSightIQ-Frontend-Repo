/**
 * Watchlist Panel Component
 */

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useWatchlists } from "@/features/market/hooks/useMarketQueries";
import { useWatchlistStore } from "@/features/market/store";
import { Button } from "@/shared/ui/button";
import { WatchlistTable } from "./WatchlistTable";
import { cn } from "@/shared/utils/cn";

export interface WatchlistPanelProps {
  onSymbolClick?: (symbol: string) => void;
}

export function WatchlistPanel({ onSymbolClick }: WatchlistPanelProps) {
  const [expandedWatchlist, setExpandedWatchlist] = useState<string | null>(
    null,
  );

  const { data: watchlists = [], isLoading } = useWatchlists();
  const { activeWatchlistId, setActiveWatchlistId } = useWatchlistStore();

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-slate-800 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (watchlists.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-slate-400 mb-4">No watchlists yet</p>
        <Button size="sm" onClick={() => {}} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Watchlist
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {watchlists.map((watchlist) => (
        <div
          key={watchlist.id}
          className="border border-slate-700 rounded-lg overflow-hidden"
        >
          {/* Watchlist Header */}
          <button
            onClick={() => {
              setActiveWatchlistId(
                activeWatchlistId === watchlist.id ? null : watchlist.id,
              );
              setExpandedWatchlist(
                expandedWatchlist === watchlist.id ? null : watchlist.id,
              );
            }}
            className={cn(
              "w-full px-4 py-3 flex items-center justify-between",
              "hover:bg-slate-800/50 transition-colors duration-150",
              activeWatchlistId === watchlist.id && "bg-slate-800",
            )}
          >
            <div className="text-left">
              <p className="font-semibold text-slate-100">{watchlist.name}</p>
              <p className="text-xs text-slate-400">
                {watchlist.items.length} items
              </p>
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-slate-400 transition-transform duration-200",
                expandedWatchlist === watchlist.id && "rotate-180",
              )}
            />
          </button>

          {/* Watchlist Content */}
          {expandedWatchlist === watchlist.id && (
            <div className="border-t border-slate-700 bg-slate-900/50">
              <WatchlistTable
                watchlist={watchlist}
                onSymbolClick={onSymbolClick}
              />
            </div>
          )}
        </div>
      ))}

      {/* Add New Watchlist Button */}
      <Button variant="outline" className="w-full gap-2" onClick={() => {}}>
        <Plus className="h-4 w-4" />
        New Watchlist
      </Button>
    </div>
  );
}
