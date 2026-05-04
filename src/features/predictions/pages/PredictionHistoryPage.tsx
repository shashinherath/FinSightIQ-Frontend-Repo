import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { Button } from "@/shared/ui/button";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { EmptyState } from "@/shared/components/EmptyState";
import {
  HistoricalForecastViewer,
  PredictionHistoryTable,
} from "@/features/predictions/components/history";
import {
  usePredictionDetails,
  usePredictionHistory,
} from "@/features/predictions/query/prediction.query";
import { useAnalyticsStore } from "@/features/predictions/store/analyticsStore";
import { sortHistory } from "@/features/predictions/query/prediction.mapper";
import {
  formatCurrency,
  formatDateTime,
} from "@/features/predictions/utils/format";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  ForecastChart,
  ConfidenceBand,
  PredictionOverlay,
} from "@/features/predictions/components/charts";

export function PredictionHistoryPage() {
  const navigate = useNavigate();
  const {
    historyFilterSymbol,
    historySortField,
    historySortDirection,
    setHistoryFilterSymbol,
    setHistorySort,
  } = useAnalyticsStore();

  const { data: history = [], isLoading } = usePredictionHistory(
    historyFilterSymbol === "ALL" ? undefined : historyFilterSymbol,
  );

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: selectedPrediction, isLoading: isLoadingSelected } =
    usePredictionDetails(selectedId || "");

  const sortedHistory = useMemo(
    () => sortHistory(history, historySortField, historySortDirection),
    [history, historySortField, historySortDirection],
  );

  const totalPages = Math.max(1, Math.ceil(sortedHistory.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedHistory.slice(start, start + pageSize);
  }, [page, pageSize, sortedHistory]);

  const exportCsv = () => {
    const rows = [
      [
        "Symbol",
        "Model",
        "Horizon",
        "Predicted",
        "Confidence",
        "Created",
        "Recommendation",
      ],
      ...sortedHistory.map((item) => [
        item.symbol,
        item.model,
        item.horizon,
        formatCurrency(item.predictedPrice),
        `${item.confidence.toFixed(0)}%`,
        formatDateTime(item.createdAt),
        item.recommendation,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "prediction-history.csv");
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Prediction History", 14, 16);
    doc.setFontSize(10);

    const lines = sortedHistory
      .slice(0, 18)
      .map(
        (item) =>
          `${item.symbol} ${item.model} ${item.horizon} ${formatCurrency(
            item.predictedPrice,
          )} ${item.confidence.toFixed(0)}% ${formatDateTime(item.createdAt)}`,
      );

    lines.forEach((line, index) => {
      doc.text(line, 14, 30 + index * 6);
    });

    doc.save("prediction-history.pdf");
  };

  return (
    <FeaturePageShell
      title="Prediction History"
      description="Browse, filter, and export prior forecasts."
      action={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportCsv}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={exportPdf}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      }
    >
      <motion.section
        className="grid gap-4 rounded-xl border border-border/60 bg-background p-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="symbol">Filter Symbol</Label>
            <Input
              id="symbol"
              placeholder="ALL"
              value={historyFilterSymbol}
              onChange={(event) => {
                setPage(1);
                setHistoryFilterSymbol(
                  event.target.value.toUpperCase() || "ALL",
                );
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label>Sort Field</Label>
            <div className="flex gap-2">
              {(["createdAt", "confidence", "predictedPrice"] as const).map(
                (field) => (
                  <Button
                    key={field}
                    type="button"
                    variant={historySortField === field ? "default" : "outline"}
                    onClick={() => {
                      setPage(1);
                      setHistorySort(field, historySortDirection);
                    }}
                  >
                    {field}
                  </Button>
                ),
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Sort Direction</Label>
            <div className="flex gap-2">
              {(["desc", "asc"] as const).map((direction) => (
                <Button
                  key={direction}
                  type="button"
                  variant={
                    historySortDirection === direction ? "default" : "outline"
                  }
                  onClick={() => {
                    setPage(1);
                    setHistorySort(historySortField, direction);
                  }}
                >
                  {direction.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {isLoading ? (
        <div className="rounded-xl border border-border/60 bg-background p-6">
          Loading prediction history...
        </div>
      ) : sortedHistory.length === 0 ? (
        <EmptyState
          title="No predictions"
          description="Run a prediction to populate the history feed."
        />
      ) : (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
        >
          <PredictionHistoryTable
            items={pageItems}
            onSelect={(item) => setSelectedId(item.id)}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
          <HistoricalForecastViewer title="Historical forecast review">
            {!selectedId ? (
              <EmptyState
                title="Select a prediction"
                description="Choose a row to review historical forecast details."
              />
            ) : isLoadingSelected ? (
              <Skeleton className="h-[240px] w-full" />
            ) : selectedPrediction ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedPrediction.symbol} · {selectedPrediction.model}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(selectedPrediction.createdAt)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(`/app/predictions/${selectedPrediction.id}`)
                    }
                  >
                    View details
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <PredictionOverlay
                    label="Forecast"
                    value={formatCurrency(selectedPrediction.predictedPrice)}
                  />
                  <ConfidenceBand
                    lower={formatCurrency(
                      selectedPrediction.confidenceInterval.lower,
                    )}
                    upper={formatCurrency(
                      selectedPrediction.confidenceInterval.upper,
                    )}
                  />
                </div>
                <ForecastChart
                  symbol={selectedPrediction.symbol}
                  historicalSeries={selectedPrediction.historicalSeries}
                  forecastSeries={selectedPrediction.forecastSeries}
                  height={240}
                />
              </div>
            ) : (
              <EmptyState
                title="Prediction unavailable"
                description="Unable to load this prediction."
              />
            )}
          </HistoricalForecastViewer>
        </motion.div>
      )}
    </FeaturePageShell>
  );
}
