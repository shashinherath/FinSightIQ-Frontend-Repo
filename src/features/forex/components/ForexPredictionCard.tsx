import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { cn } from "@/shared/utils/cn";
import type { PredictionResult } from "@/features/predictions/types/prediction.types";

export function ForexPredictionCard({
  prediction,
}: {
  prediction: PredictionResult;
}) {
  const bullish =
    prediction.recommendation.signal === "BUY" || prediction.direction === "UP";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Forex forecast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Signal</p>
            <p
              className={cn(
                "text-2xl font-semibold",
                bullish ? "text-emerald-500" : "text-rose-500",
              )}
            >
              {prediction.recommendation.signal}
            </p>
          </div>
          <Badge variant={bullish ? "default" : "destructive"}>
            {prediction.direction}
          </Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Confidence</p>
            <p className="text-lg font-semibold text-foreground">
              {prediction.confidence.toFixed(0)}%
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Target</p>
            <p className="text-lg font-semibold text-foreground">
              {prediction.predictedPrice.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Why this matters</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {prediction.recommendation.reason}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
