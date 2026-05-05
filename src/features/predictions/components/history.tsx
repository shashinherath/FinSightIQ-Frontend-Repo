import { useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Badge } from "@/shared/ui/badge";
import type { PredictionHistoryItem } from "@/features/predictions/types/prediction.types";
import {
  formatCurrency,
  formatDateTime,
  formatPercent,
} from "@/features/predictions/utils/format";
import { cn } from "@/shared/utils/cn";

export function PredictionAccuracyBadge({ success }: { success?: boolean }) {
  if (success === undefined) return <Badge variant="secondary">Pending</Badge>;
  return (
    <Badge variant={success ? "default" : "destructive"}>
      {success ? "Accurate" : "Missed"}
    </Badge>
  );
}

export function PredictionHistoryTable({
  items,
  onSelect,
}: {
  items: PredictionHistoryItem[];
  onSelect?: (item: PredictionHistoryItem) => void;
}) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const shouldVirtualize = items.length > 20;

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8,
  });

  const virtualItems = shouldVirtualize ? rowVirtualizer.getVirtualItems() : [];
  const totalHeight = shouldVirtualize
    ? rowVirtualizer.getTotalSize()
    : items.length * 56;

  const headers = useMemo(
    () => [
      "Symbol",
      "Model",
      "Horizon",
      "Predicted",
      "Confidence",
      "Created",
      "Outcome",
    ],
    [],
  );

  return (
    <div className="rounded-xl border border-border/60 bg-background">
      <div className="border-b border-border/60">
        <div className="grid grid-cols-7 gap-2 px-4 py-3 text-xs text-muted-foreground">
          {headers.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
      <div ref={parentRef} className="max-h-[480px] overflow-auto">
        {shouldVirtualize ? (
          <div style={{ height: totalHeight }} className="relative">
            {virtualItems.map((virtualRow) => {
              const item = items[virtualRow.index];
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onSelect?.(item)}
                  className={cn(
                    "absolute left-0 right-0 grid grid-cols-7 gap-2 px-4 text-left text-sm",
                    "border-b border-border/40 py-3 transition-colors hover:bg-muted/30",
                  )}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                    height: `${virtualRow.size}px`,
                  }}
                >
                  <span className="font-semibold text-foreground">
                    {item.symbol}
                  </span>
                  <span className="text-muted-foreground">{item.model}</span>
                  <span className="text-muted-foreground">{item.horizon}</span>
                  <span className="text-foreground">
                    {formatCurrency(item.predictedPrice)}
                  </span>
                  <span className="text-foreground">
                    {formatPercent(item.confidence, 0)}
                  </span>
                  <span className="text-muted-foreground">
                    {formatDateTime(item.createdAt)}
                  </span>
                  <span>
                    <PredictionAccuracyBadge success={item.success} />
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            {items.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => onSelect?.(item)}
                className={cn(
                  "grid w-full grid-cols-7 gap-2 px-4 py-3 text-left text-sm",
                  "border-b border-border/40 transition-colors hover:bg-muted/30",
                )}
              >
                <span className="font-semibold text-foreground">
                  {item.symbol}
                </span>
                <span className="text-muted-foreground">{item.model}</span>
                <span className="text-muted-foreground">{item.horizon}</span>
                <span className="text-foreground">
                  {formatCurrency(item.predictedPrice)}
                </span>
                <span className="text-foreground">
                  {formatPercent(item.confidence, 0)}
                </span>
                <span className="text-muted-foreground">
                  {formatDateTime(item.createdAt)}
                </span>
                <span>
                  <PredictionAccuracyBadge success={item.success} />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function PredictionTimeline({
  items,
}: {
  items: PredictionHistoryItem[];
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <h4 className="text-sm font-semibold text-foreground">Recent timeline</h4>
      <div className="mt-4 space-y-3">
        {items.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-sm"
          >
            <div>
              <p className="font-medium text-foreground">
                {item.symbol} {item.horizon}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(item.createdAt)}
              </p>
            </div>
            <PredictionAccuracyBadge success={item.success} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HistoricalForecastViewer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <div className="mt-4">{children}</div>
    </div>
  );
}
