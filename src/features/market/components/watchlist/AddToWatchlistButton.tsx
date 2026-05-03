/**
 * Add to Watchlist Button Component
 */

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useWatchlistStore } from "@/features/market/store";
import { useAddToWatchlist } from "@/features/market/hooks/useMarketQueries";
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
  const { favoriteSymbols, toggleFavorite } = useWatchlistStore();
  const isFavorite = favoriteSymbols.has(symbol);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: addToWatchlist } = useAddToWatchlist(watchlistId || "");

  const handleClick = async () => {
    try {
      setIsLoading(true);
      toggleFavorite(symbol);

      if (watchlistId) {
        addToWatchlist(symbol);
      }
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
      toggleFavorite(symbol); // Revert on error
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
