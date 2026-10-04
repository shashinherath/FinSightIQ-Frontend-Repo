import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { EmptyState } from "@/shared/components/EmptyState";
import { cn } from "@/shared/utils/cn";

interface MarketItem {
  sym: string;
  name: string;
  exchange: string;
  price: string;
  chg: number;
  volume: string;
  watched: boolean;
}

const MARKETS_DATA: MarketItem[] = [
  {
    sym: "NVDA",
    name: "NVIDIA Corp",
    exchange: "NASDAQ",
    price: "182.44",
    chg: 1.59,
    volume: "44.1M",
    watched: true,
  },
  {
    sym: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    price: "231.18",
    chg: 1.04,
    volume: "38.6M",
    watched: true,
  },
  {
    sym: "MSFT",
    name: "Microsoft Corp",
    exchange: "NASDAQ",
    price: "517.60",
    chg: -0.62,
    volume: "19.4M",
    watched: true,
  },
  {
    sym: "AMZN",
    name: "Amazon.com Inc.",
    exchange: "NASDAQ",
    price: "228.75",
    chg: 0.41,
    volume: "31.2M",
    watched: true,
  },
  {
    sym: "JPM",
    name: "JPMorgan Chase & Co.",
    exchange: "NYSE",
    price: "296.12",
    chg: -0.18,
    volume: "8.9M",
    watched: true,
  },
  {
    sym: "TSLA",
    name: "Tesla Inc.",
    exchange: "NASDAQ",
    price: "341.20",
    chg: 0,
    volume: "62.7M",
    watched: true,
  },
  {
    sym: "ASML",
    name: "ASML Holding NV",
    exchange: "NASDAQ",
    price: "918.40",
    chg: 2.14,
    volume: "1.4M",
    watched: false,
  },
  {
    sym: "XOM",
    name: "Exxon Mobil Corp",
    exchange: "NYSE",
    price: "112.86",
    chg: -1.07,
    volume: "14.8M",
    watched: false,
  },
  {
    sym: "SHEL",
    name: "Shell plc",
    exchange: "LSE",
    price: "2,914.50",
    chg: 0.36,
    volume: "6.1M",
    watched: false,
  },
];

export function MarketSearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [exchange, setExchange] = useState("All exchanges");
  const [assetClass, setAssetClass] = useState("stock");
  const [watchedState, setWatchedState] = useState<Record<string, boolean>>(
    () => MARKETS_DATA.reduce((acc, m) => ({ ...acc, [m.sym]: m.watched }), {}),
  );

  const toggleWatch = (sym: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchedState((prev) => ({ ...prev, [sym]: !prev[sym] }));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    return MARKETS_DATA.filter((m) => {
      const matchQuery =
        !q || m.sym.includes(q) || m.name.toUpperCase().includes(q);
      const matchEx = exchange === "All exchanges" || m.exchange === exchange;
      return matchQuery && matchEx;
    });
  }, [query, exchange]);

  const movers = useMemo(
    () => [...MARKETS_DATA].sort((a, b) => b.chg - a.chg),
    [],
  );
  const gainers = movers.slice(0, 3);
  const losers = movers.slice(-3).reverse();

  const resultCount =
    filtered.length === MARKETS_DATA.length
      ? "All covered symbols"
      : `${filtered.length} ${filtered.length === 1 ? "match" : "matches"}`;

  return (
    <section
      className="flex flex-col gap-5"
      data-screen-label="S-04 Symbol search"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Markets
          </h1>
          <p className="text-sm text-muted-foreground">
            Search global symbols and open a detail view.
          </p>
        </div>

        {/* Asset class toggle — prototype shows Stocks and Forex only */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {(["stock", "forex"] as const).map((ac) => (
            <button
              key={ac}
              onClick={() => setAssetClass(ac)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                assetClass === ac
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {ac === "stock" ? "Stocks" : "Forex"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex min-w-[240px] flex-1 flex-col gap-2">
          <label
            htmlFor="mkt-search"
            className="text-xs font-medium text-muted-foreground"
          >
            Search by symbol or company
          </label>
          <input
            id="mkt-search"
            type="search"
            placeholder="NVDA, Apple, semiconductors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex min-w-[160px] flex-col gap-2">
          <label
            htmlFor="mkt-exchange"
            className="text-xs font-medium text-muted-foreground"
          >
            Exchange
          </label>
          <select
            id="mkt-exchange"
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option>All exchanges</option>
            <option>NASDAQ</option>
            <option>NYSE</option>
            <option>LSE</option>
          </select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-4 py-3">
            <div>
              <h2 className="text-base font-semibold">{resultCount}</h2>
              <p className="text-xs text-muted-foreground">
                Click a row to open its chart, forecast and sentiment
              </p>
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              as of 14:32 UTC · live
            </span>
          </div>

          <div
            role="table"
            aria-label="Symbol search results"
            className="overflow-x-auto"
          >
            <div className="min-w-[880px]">
              <div
                role="row"
                className="grid h-12 grid-cols-[100px_1.6fr_96px_1fr_1fr_1fr_56px] items-center gap-x-4 border-b border-border px-4 text-xs font-medium text-muted-foreground"
              >
                <div role="columnheader">Symbol</div>
                <div role="columnheader">Company</div>
                <div role="columnheader">Exchange</div>
                <div role="columnheader" className="text-right">
                  Price
                </div>
                <div role="columnheader" className="text-right">
                  Change
                </div>
                <div role="columnheader" className="text-right">
                  Volume
                </div>
                <div role="columnheader" />
              </div>

              {filtered.map((m) => {
                const isUp = m.chg > 0;
                const isDown = m.chg < 0;
                const chgGlyph = isUp ? "▲" : isDown ? "▼" : "─";
                const chgText =
                  (isUp ? "+" : isDown ? "−" : "") +
                  Math.abs(m.chg).toFixed(2) +
                  "%";
                const chgColor = isUp
                  ? "text-up"
                  : isDown
                    ? "text-down"
                    : "text-muted-foreground";
                const isWatched = watchedState[m.sym];

                return (
                  <div
                    key={m.sym}
                    role="row"
                    onClick={() => navigate(`/app/market/stock/${m.sym}`)}
                    className="grid grid-cols-[100px_1.6fr_96px_1fr_1fr_1fr_56px] items-center gap-x-4 border-b border-border px-4 py-3.5 transition-colors cursor-pointer hover:bg-muted/40"
                  >
                    <div
                      role="cell"
                      className="font-display text-sm font-semibold"
                    >
                      {m.sym}
                    </div>
                    <div role="cell" className="truncate text-sm">
                      {m.name}
                    </div>
                    <div role="cell" className="text-xs text-muted-foreground">
                      {m.exchange}
                    </div>
                    <div
                      role="cell"
                      className="text-right text-sm font-semibold tabular-nums"
                    >
                      {m.price}
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
                      className="text-right text-xs text-muted-foreground tabular-nums"
                    >
                      {m.volume}
                    </div>
                    <div role="cell" className="flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => toggleWatch(m.sym, e)}
                        aria-label="Add to watchlist"
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent",
                          isWatched ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        <Star
                          className={cn("h-4 w-4", isWatched && "fill-primary")}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <EmptyState
            title={`No symbols match “${query}”`}
            description="Check the ticker, or search by company name. Coverage is US, UK and EU listed equities."
          />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Top Gainers" description="Best performing stocks">
          <div className="flex flex-col gap-2">
            {gainers.map((g) => (
              <div
                key={g.sym}
                onClick={() => navigate(`/app/market/stock/${g.sym}`)}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors cursor-pointer hover:bg-muted/40"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-display text-sm font-semibold">
                    {g.sym}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {g.name}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm font-semibold tabular-nums">
                    {g.price}
                  </span>
                  <span className="text-xs font-semibold text-up tabular-nums">
                    ▲ +{g.chg.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Top Losers"
          description="Weakest performers today"
        >
          <div className="flex flex-col gap-2">
            {losers.map((l) => (
              <div
                key={l.sym}
                onClick={() => navigate(`/app/market/stock/${l.sym}`)}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors cursor-pointer hover:bg-muted/40"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-display text-sm font-semibold">
                    {l.sym}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {l.name}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm font-semibold tabular-nums">
                    {l.price}
                  </span>
                  <span className="text-xs font-semibold text-down tabular-nums">
                    ▼ −{Math.abs(l.chg).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </section>
  );
}
