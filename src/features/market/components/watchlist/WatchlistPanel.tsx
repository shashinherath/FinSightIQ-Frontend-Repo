/**
 * Watchlist Panel Component
 */

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import {
  useCreateWatchlist,
  useWatchlists,
} from "@/features/market/hooks/useMarketQueries";
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
  const [isCreating, setIsCreating] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  const { data: watchlists = [], isLoading } = useWatchlists();
  const { mutateAsync: createWatchlist, isPending: isCreatePending } =
    useCreateWatchlist();
  const { activeWatchlistId, setActiveWatchlistId, setDefaultWatchlistId } =
    useWatchlistStore();

  const submitCreateWatchlist = async () => {
    const trimmedName = newWatchlistName.trim();
    if (!trimmedName) {
      setCreateError("Watchlist name is required.");
      return;
    }

    try {
      setCreateError(null);
      const created = await createWatchlist(trimmedName);
      setNewWatchlistName("");
      setIsCreating(false);
      setActiveWatchlistId(created.id);
      setDefaultWatchlistId(created.id);
      setExpandedWatchlist(created.id);
    } catch (error) {
      console.error("Failed to create watchlist:", error);
      setCreateError("Failed to create watchlist.");
    }
  };

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
        <Button
          size="sm"
          onClick={() => setIsCreating(true)}
          className="gap-2"
          disabled={isCreatePending}
        >
          <Plus className="h-4 w-4" />
          Create Watchlist
        </Button>
        {isCreating && (
          <div className="mt-4 space-y-2 text-left">
            <input
              value={newWatchlistName}
              onChange={(e) => setNewWatchlistName(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-700 bg-slate-900 text-slate-100"
              placeholder="Watchlist name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void submitCreateWatchlist();
                }
              }}
            />
            {createError && (
              <p className="text-xs text-red-400 text-left">{createError}</p>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => void submitCreateWatchlist()}
                disabled={isCreatePending}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setCreateError(null);
                  setNewWatchlistName("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
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
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => setIsCreating((prev) => !prev)}
      >
        <Plus className="h-4 w-4" />
        New Watchlist
      </Button>
      {isCreating && (
        <div className="space-y-2 border border-slate-700 rounded-lg p-3 bg-slate-900/40">
          <input
            value={newWatchlistName}
            onChange={(e) => setNewWatchlistName(e.target.value)}
            className="w-full px-3 py-2 rounded border border-slate-700 bg-slate-900 text-slate-100"
            placeholder="Watchlist name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void submitCreateWatchlist();
              }
            }}
          />
          {createError && <p className="text-xs text-red-400">{createError}</p>}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => void submitCreateWatchlist()}
              disabled={isCreatePending}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setCreateError(null);
                setNewWatchlistName("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
