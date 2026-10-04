import { useState } from "react";
import { AlertCircle, TriangleAlert } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface PredHistoryRow {
  issued: string;
  sym: string;
  model: string;
  horizon: string;
  mid: string;
  band: string;
  actual: string;
  err: number;
  hit: boolean;
}

const PRED_HISTORY: PredHistoryRow[] = [
  {
    issued: "2026-08-03",
    sym: "NVDA",
    model: "ENSEMBLE",
    horizon: "7D",
    mid: "176.40",
    band: "169.10 – 183.70",
    actual: "179.40",
    err: 1.7,
    hit: true,
  },
  {
    issued: "2026-08-03",
    sym: "MSFT",
    model: "LSTM",
    horizon: "7D",
    mid: "524.80",
    band: "512.40 – 537.20",
    actual: "518.90",
    err: 1.14,
    hit: false,
  },
  {
    issued: "2026-07-27",
    sym: "AAPL",
    model: "ENSEMBLE",
    horizon: "14D",
    mid: "226.10",
    band: "216.80 – 235.40",
    actual: "229.80",
    err: 1.61,
    hit: true,
  },
  {
    issued: "2026-07-27",
    sym: "NVDA",
    model: "PROPHET",
    horizon: "14D",
    mid: "170.20",
    band: "158.90 – 181.50",
    actual: "178.10",
    err: 4.44,
    hit: true,
  },
  {
    issued: "2026-07-20",
    sym: "JPM",
    model: "ARIMA",
    horizon: "7D",
    mid: "299.60",
    band: "293.10 – 306.10",
    actual: "296.90",
    err: 0.91,
    hit: false,
  },
  {
    issued: "2026-07-20",
    sym: "TSLA",
    model: "ENSEMBLE",
    horizon: "30D",
    mid: "358.40",
    band: "331.20 – 385.60",
    actual: "341.20",
    err: 5.04,
    hit: false,
  },
];

const ACCURACY_DATA = [
  {
    model: "ENSEMBLE",
    mape: "3.62%",
    dir: 0.73,
    dirPct: "73%",
    n: 90,
    assessment: "Good",
    tone: "good",
  },
  {
    model: "LSTM",
    mape: "3.98%",
    dir: 0.69,
    dirPct: "69%",
    n: 90,
    assessment: "Good",
    tone: "good",
  },
  {
    model: "PROPHET",
    mape: "4.71%",
    dir: 0.63,
    dirPct: "63%",
    n: 90,
    assessment: "Acceptable",
    tone: "ok",
  },
  {
    model: "ARIMA",
    mape: "5.04%",
    dir: 0.51,
    dirPct: "51%",
    n: 90,
    assessment: "Near chance",
    tone: "bad",
  },
];

export function PredictionsDashboardPage() {
  const [tab, setTab] = useState<"history" | "accuracy">("accuracy");
  const [symbol, setSymbol] = useState("NVDA");
  const [windowRange, setWindowRange] = useState("90d");

  return (
    <section
      className="flex flex-col gap-5"
      data-screen-label="S-13 Model accuracy"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Predictions
          </h1>
          <p className="text-sm text-muted-foreground">
            Resolved forecasts and back-tested model accuracy.
          </p>
        </div>

        <div className="flex items-end gap-2">
          <label className="flex flex-col gap-1.5 font-body text-xs font-medium text-muted-foreground">
            <span>Symbol</span>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="h-10 rounded-md border border-border bg-card px-3 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option>NVDA</option>
              <option>AAPL</option>
              <option>MSFT</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 font-body text-xs font-medium text-muted-foreground">
            <span>Window</span>
            <select
              value={windowRange}
              onChange={(e) => setWindowRange(e.target.value)}
              className="h-10 rounded-md border border-border bg-card px-3 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option>90d</option>
              <option>30d</option>
              <option>14d</option>
            </select>
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-fit items-center gap-1 rounded-lg border border-border bg-card p-1">
        <button
          onClick={() => setTab("history")}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
            tab === "history"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          History
        </button>
        <button
          onClick={() => setTab("accuracy")}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
            tab === "accuracy"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Model accuracy
        </button>
      </div>

      {tab === "history" && (
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-4 py-3">
              <div>
                <h2 className="text-base font-semibold">Resolved forecasts</h2>
                <p className="text-xs text-muted-foreground">
                  What was predicted against what happened
                </p>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                42 resolved · 30 called direction correctly
              </span>
            </div>

            <div
              role="table"
              aria-label="Prediction history"
              className="overflow-x-auto"
            >
              <div className="min-w-[980px]">
                <div
                  role="row"
                  className="grid h-12 grid-cols-[112px_84px_104px_72px_1.4fr_1fr_84px_108px] items-center gap-x-4 border-b border-border px-4 text-xs font-medium text-muted-foreground"
                >
                  <div role="columnheader">Issued</div>
                  <div role="columnheader">Symbol</div>
                  <div role="columnheader">Model</div>
                  <div role="columnheader">Horizon</div>
                  <div role="columnheader" className="text-right">
                    Predicted
                  </div>
                  <div role="columnheader" className="text-right">
                    Actual
                  </div>
                  <div role="columnheader" className="text-right">
                    Error
                  </div>
                  <div role="columnheader">Direction</div>
                </div>

                {PRED_HISTORY.map((p, idx) => {
                  const errColor =
                    p.err <= 2
                      ? "text-foreground"
                      : p.err <= 4
                        ? "text-hold"
                        : "text-down";
                  const hitColor = p.hit ? "text-up" : "text-down";
                  const hitGlyph = p.hit ? "▲" : "▼";
                  const hitText = p.hit ? "Correct" : "Missed";

                  return (
                    <div
                      key={idx}
                      role="row"
                      className="grid grid-cols-[112px_84px_104px_72px_1.4fr_1fr_84px_108px] items-center gap-x-4 border-b border-border px-4 py-3.5 transition-colors hover:bg-muted/40"
                    >
                      <div
                        role="cell"
                        className="text-xs text-muted-foreground tabular-nums"
                      >
                        {p.issued}
                      </div>
                      <div
                        role="cell"
                        className="font-display text-sm font-semibold"
                      >
                        {p.sym}
                      </div>
                      <div role="cell" className="font-mono text-xs">
                        {p.model}
                      </div>
                      <div role="cell" className="font-mono text-xs">
                        {p.horizon}
                      </div>
                      <div
                        role="cell"
                        className="flex flex-col gap-0.5 text-right"
                      >
                        <span className="text-sm tabular-nums">{p.mid}</span>
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          {p.band}
                        </span>
                      </div>
                      <div
                        role="cell"
                        className="text-right text-sm tabular-nums"
                      >
                        {p.actual}
                      </div>
                      <div
                        role="cell"
                        className={cn(
                          "text-right text-sm tabular-nums",
                          errColor,
                        )}
                      >
                        {p.err.toFixed(2)}%
                      </div>
                      <div role="cell" className="flex items-center gap-2">
                        <span className={cn("text-sm", hitColor)}>
                          {hitGlyph}
                        </span>
                        <span className={cn("text-xs font-medium", hitColor)}>
                          {hitText}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            A forecast resolves once its target date has passed and a closing
            price exists. Unresolved forecasts are excluded from every accuracy
            figure.
          </p>

          <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span>
              Model output only. Not financial advice. Past accuracy does not
              guarantee future results.
            </span>
          </div>
        </div>
      )}

      {tab === "accuracy" && (
        <div className="flex flex-col gap-5">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm">
            <div
              role="table"
              aria-label="Model accuracy"
              className="overflow-x-auto"
            >
              <div className="min-w-[820px]">
                <div
                  role="row"
                  className="grid h-12 grid-cols-[140px_1fr_1.2fr_96px_1.4fr] items-center gap-x-4 border-b border-border px-4 text-xs font-medium text-muted-foreground"
                >
                  <div role="columnheader">Model</div>
                  <div role="columnheader" className="text-right">
                    MAPE
                  </div>
                  <div role="columnheader" className="text-right">
                    Directional accuracy
                  </div>
                  <div role="columnheader" className="text-right">
                    Sample
                  </div>
                  <div role="columnheader">Assessment</div>
                </div>

                {ACCURACY_DATA.map((m) => {
                  const dirColor =
                    m.tone === "good"
                      ? "bg-up"
                      : m.tone === "ok"
                        ? "bg-hold"
                        : "bg-down";
                  const dotColor =
                    m.tone === "good"
                      ? "bg-up"
                      : m.tone === "ok"
                        ? "bg-hold"
                        : "bg-down";

                  return (
                    <div
                      key={m.model}
                      role="row"
                      className="grid grid-cols-[140px_1fr_1.2fr_96px_1.4fr] items-center gap-x-4 border-b border-border px-4 py-3.5 transition-colors hover:bg-muted/40"
                    >
                      <div
                        role="cell"
                        className="font-mono text-xs font-semibold"
                      >
                        {m.model}
                      </div>
                      <div
                        role="cell"
                        className="text-right text-sm tabular-nums"
                      >
                        {m.mape}
                      </div>
                      <div
                        role="cell"
                        className="flex items-center justify-end gap-2.5"
                      >
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn("h-full rounded-full", dirColor)}
                            style={{ width: m.dirPct }}
                          />
                        </div>
                        <span className="min-w-9 text-right text-sm tabular-nums">
                          {m.dir.toFixed(2)}
                        </span>
                      </div>
                      <div
                        role="cell"
                        className="text-right text-xs text-muted-foreground tabular-nums"
                      >
                        {m.n}
                      </div>
                      <div role="cell" className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-2 w-2 shrink-0 rounded-full",
                            dotColor,
                          )}
                        />
                        <span className="text-xs font-medium">
                          {m.assessment}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            role="status"
            className="flex items-start gap-3 rounded-lg border border-hold/60 bg-hold-tint p-4"
          >
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-hold" />
            <div>
              <p className="font-semibold text-sm">
                Read both numbers together
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground max-w-[78ch]">
                ARIMA's 5.04% error looks close to the ensemble, but its
                directional accuracy of 0.51 is barely better than a coin flip.
                A low error rate on a slow-moving series can be achieved by
                predicting little change.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span>
              Model output only. Not financial advice. Past accuracy does not
              guarantee future results.
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
