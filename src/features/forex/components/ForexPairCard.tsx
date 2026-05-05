import { Card, CardContent } from "@/shared/ui/card";
import { TradingViewSparklineChart } from "@/shared/components/TradingViewCharts";
import { cn } from "@/shared/utils/cn";
import type { ForexQuote } from "../types/forex.types";
import { PipChangeIndicator } from "./PipChangeIndicator";

export function ForexPairCard({
  quote,
  onClick,
}: {
  quote: ForexQuote;
  onClick?: () => void;
}) {
  const positive = quote.dailyChangePercent >= 0;

  return (
    <Card
      className={cn(
        "group cursor-pointer border-border/60 transition hover:border-primary/40 hover:shadow-lg",
        onClick && "hover:-translate-y-0.5",
      )}
      onClick={onClick}
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {quote.baseCurrency.slice(0, 1)}
                {quote.quoteCurrency.slice(0, 1)}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {quote.symbol}
                </p>
                <p className="text-xs text-muted-foreground">
                  {quote.baseCurrency} / {quote.quoteCurrency} · {quote.region}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-foreground">
              {quote.price.toFixed(4)}
            </p>
            <p
              className={cn(
                "text-xs font-medium",
                positive ? "text-emerald-500" : "text-rose-500",
              )}
            >
              {positive ? "+" : ""}
              {quote.dailyChangePercent.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <PipChangeIndicator pipChange={quote.pipChange} />
          <span className="text-xs text-muted-foreground">
            Spread {quote.spread.toFixed(5)}
          </span>
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/20 p-2">
          <TradingViewSparklineChart
            data={quote.sparkline}
            height={56}
            color={positive ? "green" : "red"}
          />
        </div>
      </CardContent>
    </Card>
  );
}
