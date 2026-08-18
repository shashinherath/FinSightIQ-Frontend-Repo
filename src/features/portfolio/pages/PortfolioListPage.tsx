import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { NewPortfolioDialog } from "../components/NewPortfolioDialog";
import { MiniSparkline } from "../components/MiniSparkline";
import { getPortfolios } from "../data/portfolio.data";
import {
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
} from "../lib/format";

export function PortfolioListPage() {
  const navigate = useNavigate();
  const portfolios = getPortfolios();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <FeaturePageShell
      title="Portfolios"
      description="Every portfolio you track, with live value and profit and loss."
      action={
        <Button onClick={() => setCreateOpen(true)}>New portfolio</Button>
      }
    >
      {portfolios.length === 0 ? (
        <EmptyState
          title="No portfolios yet"
          description="Create a portfolio to start monitoring performance."
          icon={<Wallet className="h-5 w-5" />}
          action={
            <Button onClick={() => setCreateOpen(true)}>
              Create portfolio
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {portfolios.map((p) => {
            const up = p.unrealizedPl >= 0;
            return (
              <button
                key={p.id}
                onClick={() => navigate(`/app/portfolio/${p.id}`)}
                className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-colors hover:border-muted-foreground/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-display text-lg font-semibold">
                      {p.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {p.currency} · {p.holdingsCount} holdings · opened{" "}
                      {p.openedLabel}
                    </span>
                  </div>
                  <MiniSparkline data={p.spark} positive={up} />
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Total value
                    </span>
                    <span className="font-display text-2xl font-semibold tabular-nums">
                      {formatCurrency(p.value, p.currency)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Unrealised
                    </span>
                    <span
                      className={`text-lg font-semibold tabular-nums ${
                        up ? "text-up-strong" : "text-down"
                      }`}
                    >
                      {up ? "▲" : "▼"}{" "}
                      {formatSignedCurrency(p.unrealizedPl, p.currency)}
                    </span>
                    <span
                      className={`text-xs tabular-nums ${
                        up ? "text-up-strong" : "text-down"
                      }`}
                    >
                      {formatPercent(p.unrealizedPct)}
                    </span>
                  </div>
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">
                  Prices as of 14:32 UTC · live
                </span>
              </button>
            );
          })}
        </div>
      )}

      <NewPortfolioDialog open={createOpen} onOpenChange={setCreateOpen} />
    </FeaturePageShell>
  );
}
