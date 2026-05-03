/**
 * Add to Watchlist Button Component
 */

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useWatchlistStore } from "@/features/market/store";
import {
  useAddToWatchlist,
  useCreateWatchlist,
  useWatchlists,
} from "@/features/market/hooks/useMarketQueries";
import { cn } from "@/shared/utils/cn";

export interface AddToWatchlistButtonProps {
  symbol: string;
  watchlistId?: string;
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "default" | "lg";
  showText?: boolean;
}

export function AddToWatchlistButton({
  symbol,
  watchlistId,
  className,
  variant = "outline",
  size = "sm",
  showText = false,
}: AddToWatchlistButtonProps) {
  const {
    favoriteSymbols,
    toggleFavorite,
    activeWatchlistId,
    defaultWatchlistId,
    setDefaultWatchlistId,
    setActiveWatchlistId,
  } = useWatchlistStore();
  const isFavorite = favoriteSymbols.has(symbol);
  const [isLoading, setIsLoading] = useState(false);
  const { data: watchlists = [] } = useWatchlists();
  const { mutateAsync: createWatchlist } = useCreateWatchlist();

  const resolvedWatchlistId =
    watchlistId ||
    activeWatchlistId ||
    defaultWatchlistId ||
    watchlists.find((w) => w.isDefault)?.id ||
    watchlists[0]?.id ||
    "";

  const { mutateAsync: addToWatchlist } = useAddToWatchlist();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      if (isFavorite) {
        toggleFavorite(symbol);
        return;
      }

      let targetWatchlistId = resolvedWatchlistId;
      if (!targetWatchlistId) {
        const created = await createWatchlist("My Watchlist");
        targetWatchlistId = created.id;
        setDefaultWatchlistId(created.id);
        setActiveWatchlistId(created.id);
      }

      if (!targetWatchlistId) {
        throw new Error("No watchlist available");
      }

      await addToWatchlist({ watchlistId: targetWatchlistId, symbol });
      toggleFavorite(symbol);
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={isFavorite ? "default" : variant}
      size={size}
      className={cn(
        "gap-2 transition-all duration-200",
        isFavorite &&
          "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-yellow-500/30",
        className,
      )}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-all duration-200",
          isFavorite && "fill-current",
        )}
      />
      {showText && (isFavorite ? "Added" : "Add to watchlist")}
    </Button>
  );
}
