import { useState } from "react";
import { BellOff, Info, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { cn } from "@/shared/utils/cn";
import { useAlertsStore } from "../store/alertsStore";
import type { AlertRule, AlertType } from "../types/alerts.types";

const METRIC_OPTIONS: { value: AlertType; label: string }[] = [
  { value: "PRICE_TARGET", label: "Price" },
  { value: "SENTIMENT_SHIFT", label: "Sentiment score" },
  { value: "PREDICTION_HIGH_CONFIDENCE", label: "Forecast confidence" },
  { value: "PERCENT_MOVE", label: "Portfolio drawdown" },
  { value: "VOLUME_SPIKE", label: "Volume" },
  { value: "VOLATILITY_SPIKE", label: "Volatility" },
];

// Delivery history is a read-only log of past rule firings; there is no
// mutation surface for it yet, so it is kept as local sample data shaped
// like the design mock rather than wired to a live endpoint.
const ALERT_LOG = [
  {
    id: "log-1",
    at: "17 Aug 13:58 UTC",
    rule: "NVDA price above $180.00",
    value: "$182.44",
    status: "Delivered" as const,
    note: "email",
  },
  {
    id: "log-2",
    at: "17 Aug 13:12 UTC",
    rule: "NVDA price above $180.00",
    value: "$180.90",
    status: "Suppressed" as const,
    note: "within the 1-hour window",
  },
  {
    id: "log-3",
    at: "14 Aug 15:40 UTC",
    rule: "MSFT sentiment below -0.30",
    value: "-0.34",
    status: "Delivered" as const,
    note: "email",
  },
  {
    id: "log-4",
    at: "11 Aug 09:05 UTC",
    rule: "Core growth drawdown above 4.00%",
    value: "4.62%",
    status: "Delivered" as const,
    note: "email",
  },
  {
    id: "log-5",
    at: "6 Aug 14:22 UTC",
    rule: "NVDA price above $180.00",
    value: "$180.20",
    status: "Suppressed" as const,
    note: "within the 1-hour window",
  },
  {
    id: "log-6",
    at: "2 Aug 11:47 UTC",
    rule: "AAPL forecast confidence below 60%",
    value: "57%",
    status: "Delivered" as const,
    note: "email",
  },
];

const deliveredCount = ALERT_LOG.filter((l) => l.status === "Delivered").length;
const suppressedCount = ALERT_LOG.length - deliveredCount;

function formatType(type: AlertType) {
  return METRIC_OPTIONS.find((m) => m.value === type)?.label ?? type;
}

function formatThreshold(rule: AlertRule) {
  if (rule.threshold === undefined) return "—";
  if (rule.type === "SENTIMENT_SHIFT") return rule.threshold.toFixed(2);
  if (rule.type === "PERCENT_MOVE") return `${rule.threshold.toFixed(2)}%`;
  if (rule.type === "PREDICTION_HIGH_CONFIDENCE") return `${rule.threshold}%`;
  return `$${rule.threshold.toFixed(2)}`;
}

/** Compact tab bar matching the prototype's Tabs component style. */
function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { value: string; label: string }[];
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex w-fit items-center gap-0 rounded-lg border border-border bg-card p-1">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
            active === t.value
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function AlertsPage() {
  const { rules, addRule, removeRule, toggleRule } = useAlertsStore();

  const [tab, setTab] = useState<"rules" | "history">("rules");
  const [ruleOpen, setRuleOpen] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [metric, setMetric] = useState<AlertType>("PRICE_TARGET");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [threshold, setThreshold] = useState("");

  const resetForm = () => {
    setSymbol("");
    setMetric("PRICE_TARGET");
    setCondition("above");
    setThreshold("");
  };

  const handleCreateRule = () => {
    const label =
      METRIC_OPTIONS.find((m) => m.value === metric)?.label ?? metric;
    const now = new Date();
    const dateLabel = now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
    });
    addRule({
      id: Date.now().toString(),
      name: `${symbol ? `${symbol.toUpperCase()} ` : ""}${label} ${condition}`,
      type: metric,
      enabled: true,
      threshold: threshold ? Number(threshold) : undefined,
      symbol: symbol ? symbol.toUpperCase() : undefined,
      createdAt: Date.now(),
      meta: `Email · created ${dateLabel}`,
    } as AlertRule);
    setRuleOpen(false);
    resetForm();
  };

  return (
    <FeaturePageShell
      title="Alerts"
      description="Rules that watch your symbols and portfolios."
      action={<Button onClick={() => setRuleOpen(true)}>New rule</Button>}
    >
      <TabBar
        tabs={[
          { value: "rules", label: "Rules" },
          { value: "history", label: "Delivery history" },
        ]}
        active={tab}
        onChange={(v) => setTab(v as "rules" | "history")}
      />

      {tab === "rules" && (
        <div className="flex flex-col gap-4">
          {rules.length === 0 ? (
            <EmptyState
              title="No alerts configured"
              description="Create alert rules to get notified instantly."
              icon={<BellOff className="h-5 w-5" />}
              action={
                <Button size="sm" onClick={() => setRuleOpen(true)}>
                  New rule
                </Button>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm">
              <div
                role="table"
                aria-label="Alert rules"
                className="overflow-x-auto"
              >
                <div className="min-w-[700px]">
                  <div
                    role="row"
                    className="grid h-12 grid-cols-[1.6fr_140px_120px_56px] items-center gap-x-4 border-b border-border px-4 text-xs font-medium text-muted-foreground"
                  >
                    <div role="columnheader">Rule</div>
                    <div role="columnheader" className="text-right">
                      Threshold
                    </div>
                    <div role="columnheader">Status</div>
                    <div role="columnheader" />
                  </div>
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      role="row"
                      className="grid grid-cols-[1.6fr_140px_120px_56px] items-center gap-x-4 border-b border-border px-4 py-3.5 transition-colors last:border-b-0 hover:bg-muted/50"
                    >
                      <div role="cell" className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">{rule.name}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {rule.meta ||
                            formatType(rule.type) +
                              (rule.symbol ? ` · ${rule.symbol}` : "")}
                        </span>
                      </div>
                      <div
                        role="cell"
                        className="text-right text-sm tabular-nums"
                      >
                        {formatThreshold(rule)}
                      </div>
                      <div role="cell">
                        <button
                          type="button"
                          aria-pressed={rule.enabled}
                          onClick={() => toggleRule(rule.id)}
                          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border px-2.5 hover:bg-accent"
                        >
                          <span
                            aria-hidden="true"
                            className={`h-2 w-2 flex-shrink-0 rounded-full ${
                              rule.enabled ? "bg-up" : "bg-muted-foreground"
                            }`}
                          />
                          <span className="text-[13px]">
                            {rule.enabled ? "On" : "Off"}
                          </span>
                        </button>
                      </div>
                      <div role="cell" className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              aria-label="Manage rule"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() => toggleRule(rule.id)}
                            >
                              <Pencil className="h-4 w-4" />
                              {rule.enabled ? "Pause rule" : "Resume rule"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => removeRule(rule.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete rule
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>A triggered rule sends at most one email per hour.</span>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-4 py-3">
              <div>
                <h2 className="text-base font-semibold">Delivery history</h2>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {ALERT_LOG.length} triggers · {deliveredCount} delivered ·{" "}
                {suppressedCount} suppressed
              </span>
            </div>
            <div
              role="table"
              aria-label="Alert delivery history"
              className="overflow-x-auto"
            >
              <div className="min-w-[820px]">
                <div
                  role="row"
                  className="grid h-12 grid-cols-[150px_1.5fr_120px_1.2fr] items-center gap-x-4 border-b border-border px-4 text-xs font-medium text-muted-foreground"
                >
                  <div role="columnheader">Triggered</div>
                  <div role="columnheader">Rule</div>
                  <div role="columnheader" className="text-right">
                    Value
                  </div>
                  <div role="columnheader">Delivery</div>
                </div>
                {ALERT_LOG.map((entry) => (
                  <div
                    key={entry.id}
                    role="row"
                    className="grid grid-cols-[150px_1.5fr_120px_1.2fr] items-center gap-x-4 border-b border-border px-4 py-3.5 transition-colors last:border-b-0 hover:bg-muted/50"
                  >
                    <div
                      role="cell"
                      className="text-[13px] tabular-nums text-muted-foreground"
                    >
                      {entry.at}
                    </div>
                    <div role="cell" className="text-sm">
                      {entry.rule}
                    </div>
                    <div
                      role="cell"
                      className="text-right text-sm tabular-nums"
                    >
                      {entry.value}
                    </div>
                    <div
                      role="cell"
                      className="flex flex-wrap items-center gap-2"
                    >
                      <span
                        className={`h-2 w-2 flex-shrink-0 rounded-full ${
                          entry.status === "Delivered"
                            ? "bg-up"
                            : "bg-muted-foreground"
                        }`}
                      />
                      <span
                        className={cn(
                          "text-[13px]",
                          entry.status === "Delivered"
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {entry.status}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {entry.note}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Suppressed rows stay visible on purpose: a rule that fires often and
            delivers rarely usually has a threshold set too close to the current
            price.
          </p>
        </div>
      )}

      <Dialog
        open={ruleOpen}
        onOpenChange={(open) => {
          setRuleOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New alert rule</DialogTitle>
            <DialogDescription>
              Rules are evaluated on every price tick and every new forecast.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="rule-symbol">Symbol</Label>
              <Input
                id="rule-symbol"
                placeholder="NVDA"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="rule-metric">Metric</Label>
              <select
                id="rule-metric"
                value={metric}
                onChange={(e) => setMetric(e.target.value as AlertType)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {METRIC_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="rule-cond">Condition</Label>
              <select
                id="rule-cond"
                value={condition}
                onChange={(e) =>
                  setCondition(e.target.value as "above" | "below")
                }
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="rule-value">Threshold</Label>
              <Input
                id="rule-value"
                placeholder="195.00"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Delivered by email to your account. A triggered rule sends at most
            one email per hour.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRuleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRule}>Create rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FeaturePageShell>
  );
}

export default AlertsPage;
