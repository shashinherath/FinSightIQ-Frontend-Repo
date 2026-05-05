import { Card, CardContent } from "@/shared/ui/card";
import { cn } from "@/shared/utils/cn";
import type { ForexSearchResult } from "../types/forex.types";

export function ForexResultCard({
  result,
  onSelect,
}: {
  result: ForexSearchResult;
  onSelect?: () => void;
}) {
  const positive = result.dailyChangePercent >= 0;

  return (
    <button type="button" onClick={onSelect} className="w-full text-left">
      <Card className="border-border/60 transition hover:border-primary/40 hover:bg-muted/20">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {result.symbol}
            </p>
            <p className="text-xs text-muted-foreground">
              {result.displayName}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {result.baseCurrency} / {result.quoteCurrency} · Spread{" "}
              {result.spread.toFixed(5)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">
              {result.price.toFixed(4)}
            </p>
            <p
              className={cn(
                "text-xs font-medium",
                positive ? "text-emerald-500" : "text-rose-500",
              )}
            >
              {positive ? "+" : ""}
              {result.dailyChangePercent.toFixed(2)}%
            </p>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {result.trend}
            </p>
          </div>
          <span className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
            Analyze
          </span>
        </CardContent>
      </Card>
    </button>
  );
}
