import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import type { ForexHistoricalSeries, ForexQuote } from "../types/forex.types";
import { PipChangeIndicator } from "./PipChangeIndicator";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function ForexMetricsPanel({
  quote,
  history,
}: {
  quote: ForexQuote;
  history?: ForexHistoricalSeries;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Market metrics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Metric label="Bid" value={quote.bid.toFixed(4)} />
        <Metric label="Ask" value={quote.ask.toFixed(4)} />
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Spread
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {quote.spread.toFixed(5)}
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Pip change
          </p>
          <div className="mt-2">
            <PipChangeIndicator pipChange={quote.pipChange} />
          </div>
        </div>
        <Metric label="Volatility" value={`${quote.volatility.toFixed(2)}%`} />
        <Metric
          label="Daily range"
          value={`${quote.low.toFixed(4)} - ${quote.high.toFixed(4)}`}
        />
        {history ? (
          <>
            <Metric label="Session high" value={history.high.toFixed(4)} />
            <Metric label="Session low" value={history.low.toFixed(4)} />
            <Metric label="Timeframe" value={history.timeframe} />
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
