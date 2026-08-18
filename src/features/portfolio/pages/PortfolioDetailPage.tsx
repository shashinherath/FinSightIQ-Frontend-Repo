import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { AddHoldingDialog } from "../components/AddHoldingDialog";
import { BenchmarkChart } from "../components/BenchmarkChart";
import {
  getAnalytics,
  getHoldingsByPortfolio,
  getPortfolioById,
} from "../data/portfolio.data";
import {
  formatCurrency,
  formatPercent,
  formatQty,
  formatSignedCurrency,
} from "../lib/format";

function StatCard({
  label,
  value,
  valueClassName,
  hint,
  hintClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  hint?: string;
  hintClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-border/70 bg-card p-5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`font-display text-2xl font-semibold tabular-nums ${valueClassName ?? ""}`}
      >
        {value}
      </span>
      {hint && (
        <span
          className={`text-xs tabular-nums ${hintClassName ?? "text-muted-foreground"}`}
        >
          {hint}
        </span>
      )}
    </div>
  );
}

export function PortfolioDetailPage() {
  const { portfolioId } = useParams();
  const navigate = useNavigate();
  const [addHoldingOpen, setAddHoldingOpen] = useState(false);

  const portfolio = portfolioId ? getPortfolioById(portfolioId) : undefined;

  if (portfolioId && !portfolio) {
    return <Navigate to="/app/portfolio" replace />;
  }

  if (!portfolio) {
    return (
      <FeaturePageShell
        title="Portfolio"
        description="Holdings, value history, and benchmark comparison."
      >
        <EmptyState
          title="Portfolio not found"
          description="Choose a portfolio from the list to see its holdings."
          icon={<Briefcase className="h-5 w-5" />}
        />
      </FeaturePageShell>
    );
  }

  const holdings = getHoldingsByPortfolio(portfolio.id);
  const analytics = getAnalytics(portfolio.id);
  const unrealizedUp = portfolio.unrealizedPl >= 0;

  return (
    <FeaturePageShell
      title={`${portfolio.name} · ${portfolio.currency}`}
      description={`${holdings.length} holdings · opened ${portfolio.openedLabel}`}
      action={
        <Button onClick={() => setAddHoldingOpen(true)}>Add holding</Button>
      }
    >
      <Tabs defaultValue="holdings">
        <TabsList>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total value"
              value={formatCurrency(portfolio.value, portfolio.currency)}
              hint={`cost basis ${formatCurrency(portfolio.costBasis, portfolio.currency)}`}
            />
            <StatCard
              label="Unrealised"
              value={`${unrealizedUp ? "▲" : "▼"} ${formatSignedCurrency(portfolio.unrealizedPl, portfolio.currency)}`}
              valueClassName={unrealizedUp ? "text-up-strong" : "text-down"}
              hint={formatPercent(portfolio.unrealizedPct)}
              hintClassName={unrealizedUp ? "text-up-strong" : "text-down"}
            />
            <StatCard
              label="Realised"
              value={`▲ ${formatSignedCurrency(portfolio.realizedPl, portfolio.currency)}`}
              valueClassName="text-up-strong"
              hint="Prices as of 14:32 UTC · live"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-border/70 bg-background shadow-sm">
            <div className="border-b border-border/70 bg-muted/30 px-4 py-3">
              <h2 className="text-base font-semibold">Holdings</h2>
              <p className="text-xs text-muted-foreground">
                Click a row for its transaction ledger
              </p>
            </div>
            <div className="overflow-x-auto">
              <Table className="min-w-[760px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Avg entry</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Unrealised</TableHead>
                    <TableHead className="text-right">Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdings.map((h) => {
                    const up = h.pl >= 0;
                    return (
                      <TableRow
                        key={h.id}
                        className="cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/app/portfolio/${portfolio.id}/holdings/${h.symbol}`,
                          )
                        }
                      >
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-display text-sm font-semibold">
                              {h.symbol}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {h.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatQty(h.qty)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(h.avgEntry, portfolio.currency)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(h.current, portfolio.currency)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end gap-0.5">
                            <span
                              className={`text-sm font-semibold tabular-nums ${up ? "text-up-strong" : "text-down"}`}
                            >
                              {up ? "▲" : "▼"}{" "}
                              {formatSignedCurrency(h.pl, portfolio.currency)}
                            </span>
                            <span
                              className={`text-[11px] tabular-nums ${up ? "text-up-strong" : "text-down"}`}
                            >
                              {formatPercent(h.plPct)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-sm tabular-nums">
                              {h.weight.toFixed(2)}%
                            </span>
                            <div className="h-1 w-16 rounded-full bg-muted">
                              <div
                                className="h-1 rounded-full bg-primary"
                                style={{ width: `${Math.min(h.weight, 100)}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Return since inception"
              value={formatPercent(analytics.summary.returnSinceInceptionPct)}
              valueClassName="text-up-strong"
              hint={`benchmark ${formatPercent(analytics.summary.benchmarkReturnPct)}`}
            />
            <StatCard
              label="Max drawdown"
              value={formatPercent(analytics.summary.maxDrawdownPct)}
              valueClassName="text-down"
              hint={analytics.summary.drawdownWindowLabel}
            />
            <StatCard
              label="Annualised volatility"
              value={`${analytics.summary.annualisedVolatilityPct.toFixed(1)}%`}
              hint={`${analytics.summary.tradingDays} trading days`}
            />
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-base font-semibold">
                Value against benchmark
              </h2>
              <span className="text-xs tabular-nums text-muted-foreground">
                {portfolio.openedLabel} – 17 Aug 2026 · indexed to 100
              </span>
            </div>
            <BenchmarkChart
              data={analytics.benchmarkSeries}
              portfolioName={portfolio.name}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
            <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div>
                <h3 className="text-base font-semibold">Allocation</h3>
                <p className="text-xs text-muted-foreground">
                  By position, then by sector
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {analytics.allocation.map((a) => (
                  <div
                    key={a.label}
                    className="grid grid-cols-[96px_1fr_64px] items-center gap-3"
                  >
                    <span className="text-sm font-medium">{a.label}</span>
                    <div className="h-2.5 rounded-full bg-muted">
                      <div
                        className="h-2.5 rounded-full"
                        style={{ width: `${a.pct}%`, background: a.color }}
                      />
                    </div>
                    <span className="text-right text-sm tabular-nums">
                      {a.pct.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-border" />
              <div className="flex flex-col gap-3">
                {analytics.sectors.map((s) => (
                  <div
                    key={s.label}
                    className="grid grid-cols-[96px_1fr_64px] items-center gap-3"
                  >
                    <span className="text-sm text-muted-foreground">
                      {s.label}
                    </span>
                    <div className="h-2.5 rounded-full bg-muted">
                      <div
                        className="h-2.5 rounded-full"
                        style={{ width: `${s.pct}%`, background: s.color }}
                      />
                    </div>
                    <span className="text-right text-sm tabular-nums">
                      {s.pct.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {analytics.sectors[0]?.label} is{" "}
                {analytics.sectors[0]?.pct.toFixed(1)}% of this portfolio.
                Stated as a fact, not a recommendation to rebalance.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-border/70 bg-background shadow-sm">
              <div className="border-b border-border/70 bg-muted/30 px-4 py-3">
                <h3 className="text-base font-semibold">
                  Contribution to return
                </h3>
                <p className="text-xs text-muted-foreground">
                  Share of the portfolio&apos;s{" "}
                  {formatPercent(analytics.summary.returnSinceInceptionPct)}{" "}
                  gain
                </p>
              </div>
              <div className="overflow-x-auto">
                <Table className="min-w-[420px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead className="text-right">P&amp;L</TableHead>
                      <TableHead className="text-right">Return</TableHead>
                      <TableHead className="text-right">Contribution</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.contribution.map((c) => {
                      const up = c.pl >= 0;
                      return (
                        <TableRow key={c.symbol}>
                          <TableCell className="font-display text-sm font-semibold">
                            {c.symbol}
                          </TableCell>
                          <TableCell
                            className={`text-right tabular-nums ${up ? "text-up-strong" : "text-down"}`}
                          >
                            {up ? "▲" : "▼"}{" "}
                            {formatSignedCurrency(c.pl, portfolio.currency)}
                          </TableCell>
                          <TableCell
                            className={`text-right tabular-nums ${up ? "text-up-strong" : "text-down"}`}
                          >
                            {formatPercent(c.returnPct)}
                          </TableCell>
                          <TableCell className="text-right font-semibold tabular-nums">
                            {formatPercent(c.contributionPct)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AddHoldingDialog
        open={addHoldingOpen}
        onOpenChange={setAddHoldingOpen}
      />
    </FeaturePageShell>
  );
}
