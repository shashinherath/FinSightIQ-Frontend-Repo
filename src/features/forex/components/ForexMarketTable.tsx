import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { cn } from "@/shared/utils/cn";
import type { ForexQuote } from "../types/forex.types";
import { PipChangeIndicator } from "./PipChangeIndicator";

export function ForexMarketTable({
  quotes,
  onSelect,
}: {
  quotes: ForexQuote[];
  onSelect?: (pair: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Major currency pairs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_0.8fr] gap-3 px-3 text-xs uppercase tracking-wide text-muted-foreground">
          <span>Pair</span>
          <span>Rate</span>
          <span>Change</span>
          <span>Spread</span>
          <span>Trend</span>
        </div>
        {quotes.map((quote) => (
          <button
            key={quote.symbol}
            type="button"
            onClick={() => onSelect?.(quote.symbol)}
            className={cn(
              "grid w-full grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_0.8fr] items-center gap-3 rounded-lg border border-border/60 px-3 py-3 text-left transition hover:border-primary/40 hover:bg-muted/30",
            )}
          >
            <div>
              <p className="font-semibold text-foreground">{quote.symbol}</p>
              <p className="text-xs text-muted-foreground">
                {quote.baseCurrency} vs {quote.quoteCurrency}
              </p>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {quote.price.toFixed(4)}
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                quote.dailyChangePercent >= 0
                  ? "text-emerald-500"
                  : "text-rose-500",
              )}
            >
              {quote.dailyChangePercent >= 0 ? "+" : ""}
              {quote.dailyChangePercent.toFixed(2)}%
            </span>
            <span className="text-sm text-foreground">
              {quote.spread.toFixed(5)}
            </span>
            <div className="text-xs text-muted-foreground">
              <PipChangeIndicator pipChange={quote.pipChange} />
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
