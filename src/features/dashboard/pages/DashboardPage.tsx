import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { OverviewStatCard } from "@/features/dashboard/components/OverviewStatCard";
import { cn } from "@/shared/utils/cn";

export function DashboardPage() {
  const isLoading = false;
  const isForex = false;

  const overviewCards = isForex
    ? [
        {
          label: "EUR/USD",
          value: "1.0842",
          change: "+0.3%",
          trend: "up" as const,
        },
        {
          label: "GBP/USD",
          value: "1.2718",
          change: "-0.1%",
          trend: "down" as const,
        },
        {
          label: "USD/JPY",
          value: "154.62",
          change: "+0.2%",
          trend: "up" as const,
        },
      ]
    : [
        {
          label: "S&P 500",
          value: "5,203.41",
          change: "+1.2%",
          trend: "up" as const,
        },
        {
          label: "NASDAQ",
          value: "16,424.88",
          change: "+0.7%",
          trend: "up" as const,
        },
        {
          label: "Dow Jones",
          value: "38,112.02",
          change: "-0.2%",
          trend: "down" as const,
        },
      ];

  const watchlist = isForex
    ? [
        { symbol: "EUR/USD", price: "1.0842", change: "+0.3%", trend: "up" },
        { symbol: "GBP/USD", price: "1.2718", change: "-0.1%", trend: "down" },
        { symbol: "USD/JPY", price: "154.62", change: "+0.2%", trend: "up" },
      ]
    : [
        { symbol: "AAPL", price: "$188.41", change: "+1.4%", trend: "up" },
        { symbol: "NVDA", price: "$912.18", change: "+2.1%", trend: "up" },
        { symbol: "TSLA", price: "$184.92", change: "-0.8%", trend: "down" },
      ];

  const predictions = isForex
    ? [
        { symbol: "EUR/USD", confidence: "89%", signal: "BUY" },
        { symbol: "GBP/USD", confidence: "73%", signal: "HOLD" },
        { symbol: "USD/JPY", confidence: "64%", signal: "SELL" },
      ]
    : [
        { symbol: "MSFT", confidence: "92%", signal: "BUY" },
        { symbol: "AMZN", confidence: "76%", signal: "HOLD" },
        { symbol: "META", confidence: "68%", signal: "BUY" },
      ];

  const topMovers = isForex
    ? [
        { symbol: "EUR/USD", change: "+0.6%", trend: "up" },
        { symbol: "AUD/USD", change: "+0.4%", trend: "up" },
        { symbol: "USD/CHF", change: "-0.3%", trend: "down" },
      ]
    : [
        { symbol: "PLTR", change: "+6.2%", trend: "up" },
        { symbol: "NET", change: "+4.8%", trend: "up" },
        { symbol: "SNOW", change: "-3.9%", trend: "down" },
      ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className="relative inline-flex h-2.5 w-2.5"
              aria-hidden="true"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <Badge variant="secondary">Live</Badge>
            Updated 30 seconds ago
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {isForex
              ? "Track currency pairs, FX momentum, and AI-generated forecasts in one place."
              : "Track your markets, portfolio, and AI-generated forecasts in one place."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            {isForex ? "Create FX alert" : "Create alert"}
          </Button>
          <Button>
            {isForex ? "New FX forecast" : "New forecast"}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {overviewCards.map((card) => (
          <OverviewStatCard
            key={card.label}
            label={card.label}
            value={card.value}
            change={card.change}
            trend={card.trend}
            icon={<Sparkles className="h-4 w-4 text-muted-foreground" />}
          />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <DashboardCard
          title={isForex ? "FX Watchlist" : "Watchlist"}
          description={
            isForex
              ? "Live prices for your tracked currency pairs"
              : "Live prices for your tracked symbols"
          }
          action={<Button variant="ghost">Manage</Button>}
        >
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : watchlist.length === 0 ? (
            <EmptyState
              title="No symbols yet"
              description="Add symbols to build a personalized watchlist."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isForex ? "Pair" : "Symbol"}</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchlist.map((item) => (
                  <TableRow key={item.symbol}>
                    <TableCell className="font-medium">{item.symbol}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          item.trend === "up" && "text-emerald-500",
                          item.trend === "down" && "text-destructive",
                        )}
                      >
                        {item.change}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DashboardCard>

        <DashboardCard
          title={isForex ? "FX Predictions" : "AI Predictions"}
          description={
            isForex ? "Top FX confidence signals" : "Top confidence signals"
          }
          action={<Button variant="ghost">View all</Button>}
        >
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div
                key={prediction.symbol}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {prediction.symbol}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Confidence {prediction.confidence}
                  </p>
                </div>
                <Badge
                  className={cn(
                    prediction.signal === "BUY" && "bg-emerald-500 text-white",
                    prediction.signal === "HOLD" && "bg-amber-500 text-white",
                  )}
                >
                  {prediction.signal}
                </Badge>
              </div>
            ))}
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <DashboardCard
          title={isForex ? "FX exposure snapshot" : "Portfolio snapshot"}
          description={
            isForex
              ? "Currency exposure and intraday performance"
              : "Today's allocation and performance"
          }
          action={
            <Button variant="ghost">
              {isForex ? "Open FX book" : "Open portfolio"}
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">
                {isForex ? "Base exposure" : "Net worth"}
              </p>
              <p className="text-xl font-semibold">
                {isForex ? "$182,400" : "$248,920"}
              </p>
              <p className="text-xs text-emerald-500">
                {isForex ? "+1.8% this week" : "+3.4% this week"}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">
                {isForex ? "FX risk score" : "Risk score"}
              </p>
              <p className="text-xl font-semibold">
                {isForex ? "Moderate" : "Moderate"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isForex
                  ? "Balanced currency exposure"
                  : "Balanced growth allocation"}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">
                {isForex ? "Margin available" : "Cash available"}
              </p>
              <p className="text-xl font-semibold">
                {isForex ? "$24,100" : "$18,240"}
              </p>
              <p className="text-xs text-emerald-500">
                {isForex ? "Ready for FX trades" : "Ready to deploy"}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">
                {isForex ? "Forecast bias" : "Forecast bias"}
              </p>
              <p className="text-xl font-semibold">
                {isForex ? "USD strong" : "Bullish"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isForex
                  ? "AI signals favor the dollar"
                  : "AI signals skew positive"}
              </p>
            </div>
          </div>
        </DashboardCard>

        <div className="grid gap-6">
          <DashboardCard
            title={isForex ? "FX sentiment" : "Market sentiment"}
            description={
              isForex
                ? "Macro and rate-driven momentum"
                : "News-driven momentum"
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {isForex ? "Rate index" : "Sentiment index"}
                </span>
                <span className="text-sm font-semibold text-emerald-500">
                  {isForex ? "Neutral" : "Positive"}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className={cn(
                    "h-2 rounded-full",
                    isForex ? "w-1/2 bg-blue-500" : "w-3/4 bg-emerald-500",
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {isForex
                  ? "AI models detected steady macro pressure around rates and dollar strength."
                  : "AI models detected sustained optimism across technology and industrial sectors."}
              </p>
            </div>
          </DashboardCard>

          <DashboardCard
            title={isForex ? "Top FX movers" : "Top movers"}
            description={
              isForex ? "Largest intraday pair moves" : "Largest intraday moves"
            }
          >
            <div className="space-y-3">
              {topMovers.map((mover) => (
                <div
                  key={mover.symbol}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium">{mover.symbol}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      mover.trend === "up" && "text-emerald-500",
                      mover.trend === "down" && "text-destructive",
                    )}
                  >
                    {mover.change}
                  </Badge>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </section>
    </div>
  );
}
