import { ArrowUpRight, Info, RefreshCw, Sparkles } from "lucide-react";
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

interface WatchRow {
  sym: string;
  name: string;
  price: string;
  chg: number;
  fc: string;
  fcBand: string;
  sent: number;
  sentNote?: string;
  stale?: boolean;
  freshness: string;
  spark: number[];
}

const WATCHLIST: WatchRow[] = [
  {
    sym: "NVDA",
    name: "NVIDIA Corp",
    price: "182.44",
    chg: 1.59,
    fc: "188.60",
    fcBand: "±8.70",
    sent: 0.42,
    freshness: "as of 14:32 UTC",
    spark: [
      163.2, 160.8, 166.4, 171.1, 168.3, 173.9, 177.2, 175.6, 179.4, 178.1,
      182.44,
    ],
  },
  {
    sym: "AAPL",
    name: "Apple Inc.",
    price: "231.18",
    chg: 1.04,
    fc: "234.10",
    fcBand: "±6.20",
    sent: 0.28,
    freshness: "as of 14:32 UTC",
    spark: [224.1, 226.4, 225.0, 228.9, 227.2, 229.8, 231.18],
  },
  {
    sym: "MSFT",
    name: "Microsoft Corp",
    price: "517.60",
    chg: -0.62,
    fc: "512.85",
    fcBand: "±14.40",
    sent: 0.11,
    freshness: "as of 14:32 UTC",
    spark: [524.0, 521.5, 523.8, 519.2, 520.4, 518.9, 517.6],
  },
  {
    sym: "AMZN",
    name: "Amazon.com Inc.",
    price: "228.75",
    chg: 0.41,
    fc: "231.60",
    fcBand: "±9.10",
    sent: -0.06,
    freshness: "as of 14:32 UTC",
    spark: [225.9, 227.4, 226.1, 227.8, 228.0, 227.6, 228.75],
  },
  {
    sym: "JPM",
    name: "JPMorgan Chase",
    price: "296.12",
    chg: -0.18,
    fc: "294.30",
    fcBand: "±5.80",
    sent: 0.05,
    freshness: "as of 14:32 UTC",
    spark: [298.4, 297.9, 298.8, 297.1, 296.9, 296.4, 296.12],
  },
  {
    sym: "TSLA",
    name: "Tesla Inc.",
    price: "341.20",
    chg: 0,
    fc: "—",
    fcBand: "forecast stale",
    sent: -0.24,
    sentNote: "low conf.",
    stale: true,
    freshness: "⚠ as of 12:10 UTC · stale",
    spark: [352.1, 349.6, 346.2, 347.8, 344.0, 342.6, 341.2],
  },
];

const OVERVIEW_CARDS = [
  {
    label: "Total value",
    value: "$103,918.65",
    change: "+0.72%",
    trend: "up" as const,
    note: "across 2 portfolios",
  },
  {
    label: "Today",
    value: "+$742.18",
    change: "+0.72%",
    trend: "up" as const,
    note: "since 00:00 UTC",
  },
  {
    label: "Open alerts",
    value: "4",
    change: "1 new",
    trend: "flat" as const,
    note: "triggered in 24 hours",
  },
];

const PREDICTIONS = [
  { symbol: "MSFT", confidence: "92%", signal: "BUY" },
  { symbol: "AMZN", confidence: "76%", signal: "HOLD" },
  { symbol: "META", confidence: "68%", signal: "BUY" },
];

const TOP_MOVERS = [
  { symbol: "PLTR", change: "+6.2%", trend: "up" as const },
  { symbol: "NET", change: "+4.8%", trend: "up" as const },
  { symbol: "SNOW", change: "-3.9%", trend: "down" as const },
];

function formatChange(chg: number) {
  const glyph = chg > 0 ? "▲" : chg < 0 ? "▼" : "—";
  const text = `${chg > 0 ? "+" : ""}${chg.toFixed(2)}%`;
  return { glyph, text };
}

function changeTone(chg: number) {
  if (chg > 0) return "text-up-strong";
  if (chg < 0) return "text-down";
  return "text-muted-foreground";
}

function Sparkline({ data }: { data: number[] }) {
  const width = 72;
  const height = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const trendUp = data[data.length - 1] >= data[0];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn(trendUp ? "text-up-strong" : "text-down")}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SentimentBar({ sent }: { sent: number }) {
  const clamped = Math.max(-1, Math.min(1, sent));
  const isPositive = clamped >= 0;
  const widthPct = Math.abs(clamped) * 50;
  const leftPct = isPositive ? 50 : 50 - widthPct;

  return (
    <div className="relative h-1.5 w-[88px] overflow-hidden rounded-full bg-muted">
      <div
        className={cn(
          "absolute top-0 bottom-0 rounded-full",
          isPositive ? "bg-up-strong" : "bg-down",
        )}
        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
      />
      <div className="absolute inset-y-0 left-1/2 w-px bg-border" />
    </div>
  );
}

export function DashboardPage() {
  const isLoading = false;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className="relative inline-flex h-2.5 w-2.5"
              aria-hidden="true"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live" />
            </span>
            <Badge variant="secondary">Live</Badge>
            as of 14:32 UTC · updated 30 seconds ago
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Your tracked symbols, forecasts and open alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Create alert</Button>
          <Button>
            New forecast
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {OVERVIEW_CARDS.map((card) => (
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
          title="Watchlist"
          description="Live prices for your tracked symbols"
          action={
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Updated 30 seconds ago
              </span>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          }
        >
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : WATCHLIST.length === 0 ? (
            <EmptyState
              title="No symbols yet"
              description="Add symbols to build a personalized watchlist."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-right">7d forecast</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead className="text-right">30d</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {WATCHLIST.map((row) => {
                  const { glyph, text } = formatChange(row.chg);
                  return (
                    <TableRow key={row.sym} className="cursor-pointer">
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-display text-sm font-semibold">
                            {row.sym}
                          </span>
                          <span className="truncate text-[11px] text-muted-foreground">
                            {row.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold tabular-nums">
                            {row.price}
                          </span>
                          <span
                            className={cn(
                              "text-[11px] tabular-nums",
                              row.stale
                                ? "text-hold-strong"
                                : "text-muted-foreground",
                            )}
                          >
                            {row.freshness}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right text-sm font-semibold tabular-nums",
                          changeTone(row.chg),
                        )}
                      >
                        {glyph} {text}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={cn(
                              "text-sm tabular-nums",
                              row.stale && "text-muted-foreground",
                            )}
                          >
                            {row.fc}
                          </span>
                          <span className="text-[11px] tabular-nums text-muted-foreground">
                            {row.fcBand}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <SentimentBar sent={row.sent} />
                          <span className="whitespace-nowrap text-xs tabular-nums">
                            {row.sent > 0 ? "+" : ""}
                            {row.sent.toFixed(2)}
                          </span>
                          {row.sentNote && (
                            <span className="whitespace-nowrap text-[11px] text-hold-strong">
                              {row.sentNote}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Sparkline data={row.spark} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </DashboardCard>

        <DashboardCard
          title="AI Predictions"
          description="Top confidence signals"
          action={<Button variant="ghost">View all</Button>}
        >
          <div className="space-y-4">
            {PREDICTIONS.map((prediction) => (
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
                    prediction.signal === "BUY" && "bg-up-strong text-white",
                    prediction.signal === "HOLD" && "bg-hold-strong text-white",
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
          title="Portfolio snapshot"
          description="Today's allocation and performance"
          action={<Button variant="ghost">Open portfolio</Button>}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">Net worth</p>
              <p className="text-xl font-semibold">$248,920</p>
              <p className="text-xs text-up-strong">+3.4% this week</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">Risk score</p>
              <p className="text-xl font-semibold">Moderate</p>
              <p className="text-xs text-muted-foreground">
                Balanced growth allocation
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">Cash available</p>
              <p className="text-xl font-semibold">$18,240</p>
              <p className="text-xs text-up-strong">Ready to deploy</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">Forecast bias</p>
              <p className="text-xl font-semibold">Bullish</p>
              <p className="text-xs text-muted-foreground">
                AI signals skew positive
              </p>
            </div>
          </div>
        </DashboardCard>

        <div className="grid gap-6">
          <DashboardCard
            title="Market sentiment"
            description="News-driven momentum"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Sentiment index
                </span>
                <span className="text-sm font-semibold text-up-strong">
                  Positive
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-2 w-3/4 rounded-full bg-up-strong" />
              </div>
              <p className="text-xs text-muted-foreground">
                AI models detected sustained optimism across technology and
                industrial sectors.
              </p>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Top movers"
            description="Largest intraday moves"
          >
            <div className="space-y-3">
              {TOP_MOVERS.map((mover) => (
                <div
                  key={mover.symbol}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium">{mover.symbol}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      mover.trend === "up" && "text-up-strong",
                      mover.trend === "down" && "text-down",
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

      <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <span>
          Model output only. Not financial advice. Past accuracy does not
          guarantee future results.
        </span>
      </div>
    </div>
  );
}
