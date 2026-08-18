import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Info, Receipt } from "lucide-react";
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
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { AddTransactionDialog } from "../components/AddTransactionDialog";
import {
  getHolding,
  getLedger,
  getPortfolioById,
} from "../data/portfolio.data";
import { formatCurrency, formatDateLabel, formatQty } from "../lib/format";

export function HoldingDetailPage() {
  const { portfolioId, symbol } = useParams();
  const navigate = useNavigate();
  const [addTxOpen, setAddTxOpen] = useState(false);

  const portfolio = portfolioId ? getPortfolioById(portfolioId) : undefined;
  const holding =
    portfolioId && symbol ? getHolding(portfolioId, symbol) : undefined;

  if (portfolioId && (!portfolio || (symbol && !holding))) {
    return <Navigate to={`/app/portfolio/${portfolioId}`} replace />;
  }

  if (!portfolio || !holding) {
    return (
      <FeaturePageShell
        title={symbol ?? "Holding"}
        description="Transaction ledger for this holding."
      >
        <EmptyState
          title="No transactions yet"
          description="Buy and sell activity for this holding will appear here."
          icon={<Receipt className="h-5 w-5" />}
        />
      </FeaturePageShell>
    );
  }

  const ledger = getLedger(portfolio.id, holding.symbol);
  const value = holding.qty * holding.current;

  return (
    <FeaturePageShell
      title={`${holding.symbol} · ${holding.name}`}
      description={`${ledger.length} transaction${ledger.length === 1 ? "" : "s"} · first bought ${holding.firstBoughtLabel}`}
      action={
        <Button onClick={() => setAddTxOpen(true)}>Add transaction</Button>
      }
    >
      <button
        type="button"
        onClick={() => navigate(`/app/portfolio/${portfolio.id}`)}
        className="-mt-2 mb-2 inline-flex items-center gap-1.5 self-start text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {portfolio.name}
      </button>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5 rounded-xl border border-border/70 bg-card p-5">
          <span className="text-xs text-muted-foreground">Quantity</span>
          <span className="font-display text-2xl font-semibold tabular-nums">
            {formatQty(holding.qty, 6)}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 rounded-xl border border-border/70 bg-card p-5">
          <span className="text-xs text-muted-foreground">Avg entry</span>
          <span className="font-display text-2xl font-semibold tabular-nums">
            {formatCurrency(holding.avgEntry, portfolio.currency)}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 rounded-xl border border-border/70 bg-card p-5">
          <span className="text-xs text-muted-foreground">Value</span>
          <span className="font-display text-2xl font-semibold tabular-nums">
            {formatCurrency(value, portfolio.currency)}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            as of 14:32 UTC · live
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-background shadow-sm">
        <div className="border-b border-border/70 bg-muted/30 px-4 py-3">
          <h2 className="text-base font-semibold">Transaction ledger</h2>
          <p className="text-xs text-muted-foreground">
            Read-only · newest last
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Fee</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledger.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {formatDateLabel(t.date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{t.side}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatQty(t.qty, 6)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(t.price, portfolio.currency)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {formatCurrency(t.fee, portfolio.currency)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold tabular-nums ${t.value < 0 ? "text-down" : "text-foreground"}`}
                  >
                    {t.value < 0 ? "−" : ""}
                    {formatCurrency(Math.abs(t.value), portfolio.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Transactions are immutable. To correct an entry, add an offsetting
          transaction — both remain visible.
        </span>
      </div>

      <AddTransactionDialog
        open={addTxOpen}
        onOpenChange={setAddTxOpen}
        symbol={holding.symbol}
      />
    </FeaturePageShell>
  );
}
