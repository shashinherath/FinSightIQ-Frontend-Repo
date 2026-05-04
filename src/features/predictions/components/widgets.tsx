import { AlertTriangle, RefreshCcw, Sparkles } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";
import type { PredictionFeedItem } from "@/features/predictions/store/predictionStore";
import type { PredictionHistoryItem } from "@/features/predictions/types/prediction.types";
import {
  formatCurrency,
  formatPercent,
  formatDateTime,
} from "@/features/predictions/utils/format";

export function AIFeedWidget({
  items,
  onRetry,
}: {
  items: PredictionFeedItem[];
  onRetry?: (item: PredictionFeedItem) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
        No prediction activity yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.slice(0, 6).map((item) => (
        <div
          key={item.id}
          className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {item.symbol} · {item.model}
            </span>
            <span>{formatDateTime(item.createdAt)}</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {item.status === "pending"
              ? "Generating forecast..."
              : item.status === "error"
                ? item.error || "Prediction failed"
                : item.prediction
                  ? `Forecast ${formatCurrency(item.prediction.predictedPrice)}`
                  : "Prediction ready"}
          </p>
          <Badge
            variant={
              item.status === "success"
                ? "default"
                : item.status === "error"
                  ? "destructive"
                  : "secondary"
            }
            className="mt-2"
          >
            {item.status}
          </Badge>
          {item.status === "error" && onRetry && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="mt-2"
              onClick={() => onRetry(item)}
            >
              <RefreshCcw className="mr-2 h-3.5 w-3.5" />
              Retry
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

export function HighConfidenceSignals({
  items,
}: {
  items: PredictionHistoryItem[];
}) {
  return (
    <div className="space-y-3">
      {items.slice(0, 5).map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">
              {item.symbol}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.model} · {formatPercent(item.confidence, 0)}
            </p>
          </div>
          <Badge>{item.recommendation}</Badge>
        </div>
      ))}
    </div>
  );
}

export function TrendingPredictions({
  items,
}: {
  items: PredictionHistoryItem[];
}) {
  return (
    <div className="space-y-3">
      {items.slice(0, 5).map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">
              {item.symbol}
            </p>
            <p className="text-xs text-muted-foreground">{item.horizon}</p>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDateTime(item.createdAt)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ModelAccuracySnapshot({ value }: { value: number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        Overall accuracy
      </div>
      <p className="mt-3 text-2xl font-semibold text-foreground">
        {formatPercent(value, 0)}
      </p>
    </div>
  );
}

export function MarketForecastSummary({
  symbol,
  price,
  confidence,
}: {
  symbol: string;
  price: number;
  confidence: number;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
      <p className="text-xs text-muted-foreground">Forecast summary</p>
      <p className="mt-2 text-lg font-semibold text-foreground">
        {symbol} {formatCurrency(price)}
      </p>
      <p className="text-xs text-muted-foreground">
        Confidence {formatPercent(confidence, 0)}
      </p>
    </div>
  );
}

export function RiskAlertWidget({ alerts }: { alerts: string[] }) {
  return (
    <div className="space-y-3">
      {alerts.length === 0 ? (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
          No active risk alerts.
        </div>
      ) : (
        alerts.map((alert, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2 rounded-lg border border-border/60 bg-destructive/10 px-3 py-2 text-sm text-destructive",
            )}
          >
            <AlertTriangle className="h-4 w-4" />
            {alert}
          </div>
        ))
      )}
    </div>
  );
}
