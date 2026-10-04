import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
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

function Sparkline({ data }: { data: number[] }) {
  const width = 72;
  const height = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const trendUp = data[data.length - 1] >= data[0];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn(trendUp ? "text-up" : "text-down")}
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
          isPositive ? "bg-up" : "bg-down",
        )}
        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
      />
      <div className="absolute inset-y-0 left-1/2 w-px bg-border" />
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  return (
    <section className="flex flex-col gap-6" data-screen-label="S-03 Dashboard">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Your tracked symbols, forecasts and open alerts.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
          as of 14:32 UTC · live
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <OverviewStatCard
          label="Total value"
          value="$103,918.65"
          change="+0.72%"
          trend="up"
          note="across 2 portfolios"
        />
        <OverviewStatCard
          label="Today"
          value="+$742.18"
          change="+0.72%"
          trend="up"
          note="since 00:00 UTC"
        />
        <OverviewStatCard
          label="Open alerts"
          value="4"
          change="1 new"
          trend="flat"
          note="triggered in 24 hours"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-4 py-3">
          <div>
            <h2 className="text-base font-semibold">Watchlist</h2>
            <p className="text-xs text-muted-foreground">
              Live prices for your tracked symbols
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground tabular-nums">
              Updated 30 seconds ago
            </span>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
            <p className="mt-1 text-xs text-muted-foreground">
              Fetching quotes…
            </p>
          </div>
        ) : (
          <div role="table" aria-label="Watchlist" className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div
                role="row"
                className="grid h-12 grid-cols-[96px_1.1fr_1.1fr_1.5fr_1.7fr_92px] items-center gap-x-4 border-b border-border px-4 text-xs font-medium text-muted-foreground"
              >
                <div role="columnheader">Symbol</div>
                <div role="columnheader" className="text-right">
                  Price
                </div>
                <div role="columnheader" className="text-right">
                  Change
                </div>
                <div role="columnheader" className="text-right">
                  7d forecast
                </div>
                <div role="columnheader">Sentiment</div>
                <div role="columnheader" className="text-right">
                  30d
                </div>
              </div>

              {WATCHLIST.map((row) => {
                const isUp = row.chg > 0;
                const isDown = row.chg < 0;
                const chgGlyph = isUp ? "▲" : isDown ? "▼" : "─";
                const chgText =
                  (isUp ? "+" : isDown ? "−" : "") +
                  Math.abs(row.chg).toFixed(2) +
                  "%";
                const chgColor = isUp
                  ? "text-up"
                  : isDown
                    ? "text-down"
                    : "text-muted-foreground";

                return (
                  <div
                    key={row.sym}
                    role="row"
                    onClick={() => navigate(`/app/market/stock/${row.sym}`)}
                    className="grid grid-cols-[96px_1.1fr_1.1fr_1.5fr_1.7fr_92px] items-center gap-x-4 border-b border-border px-4 py-3.5 transition-colors cursor-pointer hover:bg-muted/40"
                  >
                    <div role="cell" className="flex flex-col gap-0.5">
                      <span className="font-display text-sm font-semibold">
                        {row.sym}
                      </span>
                      <span className="truncate text-[11px] text-muted-foreground">
                        {row.name}
                      </span>
                    </div>

                    <div
                      role="cell"
                      className="flex flex-col gap-0.5 text-right"
                    >
                      <span className="text-sm font-semibold tabular-nums">
                        {row.price}
                      </span>
                      <span
                        className={cn(
                          "text-[11px] tabular-nums",
                          row.stale ? "text-hold" : "text-muted-foreground",
                        )}
                      >
                        {row.freshness}
                      </span>
                    </div>

                    <div
                      role="cell"
                      className={cn(
                        "text-right text-sm font-semibold tabular-nums",
                        chgColor,
                      )}
                    >
                      {chgGlyph} {chgText}
                    </div>

                    <div
                      role="cell"
                      className="flex flex-col gap-0.5 text-right"
                    >
                      <span
                        className={cn(
                          "text-sm tabular-nums",
                          row.stale ? "text-muted-foreground" : "",
                        )}
                      >
                        {row.fc}
                      </span>
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {row.fcBand}
                      </span>
                    </div>

                    <div role="cell" className="flex items-center gap-2">
                      <SentimentBar sent={row.sent} />
                      <span className="whitespace-nowrap text-xs tabular-nums">
                        {row.sent > 0 ? "+" : ""}
                        {row.sent.toFixed(2)}
                      </span>
                      {row.sentNote && (
                        <span className="whitespace-nowrap text-[11px] text-hold">
                          {row.sentNote}
                        </span>
                      )}
                    </div>

                    <div role="cell" className="flex justify-end">
                      <Sparkline data={row.spark} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <span>
          Model output only. Not financial advice. Past accuracy does not
          guarantee future results.
        </span>
      </div>
    </section>
  );
}
