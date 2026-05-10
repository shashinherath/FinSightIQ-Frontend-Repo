import { cn } from "@/shared/utils/cn";
import type { ForexSearchResult } from "../types/forex.types";

export function ForexSearchDropdown({
  results,
  activeIndex,
  onSelect,
}: {
  results: ForexSearchResult[];
  activeIndex: number;
  onSelect: (result: ForexSearchResult) => void;
}) {
  if (results.length === 0) return null;

  return (
    <div
      className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border/60 bg-card text-card-foreground shadow-xl"
      style={{ backgroundColor: "hsl(var(--card))", opacity: 1 }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl bg-card"
      />
      <div className="relative max-h-80 overflow-auto p-2">
        {results.map((result, index) => (
          <button
            key={result.symbol}
            type="button"
            onClick={() => onSelect(result)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition",
              index === activeIndex ? "bg-muted/60" : "hover:bg-muted/30",
            )}
            role="option"
            aria-selected={index === activeIndex}
          >
            <div>
              <p className="text-sm font-semibold text-foreground">
                {result.symbol}
              </p>
              <p className="text-xs text-muted-foreground">
                {result.displayName}
              </p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>{result.price.toFixed(4)}</p>
              <p>{result.dailyChangePercent.toFixed(2)}%</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
