import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { EmptyState } from "@/shared/components/EmptyState";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  ForecastChart,
  PredictionOverlay,
  ConfidenceBand,
} from "@/features/predictions/components/charts";
import {
  RecommendationCard,
  TrendDirectionIndicator,
  ConfidenceRing,
} from "@/features/predictions/components/summary";
import {
  PredictionExplanationCard,
  FeatureImportanceBar,
} from "@/features/predictions/components/explainability";
import { usePredictionDetails } from "@/features/predictions/query/prediction.query";
import {
  formatCurrency,
  formatDateTime,
  formatPercent,
} from "@/features/predictions/utils/format";

const MultiModelChart = lazy(() =>
  import("@/features/predictions/components/charts").then((module) => ({
    default: module.MultiModelChart,
  })),
);

const ShapFeatureChart = lazy(() =>
  import("@/features/predictions/components/explainability").then((module) => ({
    default: module.ShapFeatureChart,
  })),
);

export function PredictionDetailsPage() {
  const { predictionId } = useParams();
  const { data: prediction, isLoading } = usePredictionDetails(
    predictionId || "",
  );

  if (isLoading) {
    return (
      <FeaturePageShell
        title="Prediction Details"
        description="Loading forecast details..."
      >
        <Skeleton className="h-[420px] w-full" />
      </FeaturePageShell>
    );
  }

  if (!prediction) {
    return (
      <FeaturePageShell
        title="Prediction Details"
        description="No prediction found."
      >
        <EmptyState
          title="Prediction missing"
          description="The requested prediction could not be found."
        />
      </FeaturePageShell>
    );
  }

  return (
    <FeaturePageShell
      title={`Prediction ${prediction.symbol}`}
      description={`Generated ${formatDateTime(prediction.createdAt)} · ${prediction.model} ${prediction.horizon}`}
    >
      <motion.section
        className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="space-y-6">
          <ForecastChart
            symbol={prediction.symbol}
            historicalSeries={prediction.historicalSeries}
            forecastSeries={prediction.forecastSeries}
          />

          <Suspense fallback={<Skeleton className="h-[260px] w-full" />}>
            <MultiModelChart modelComparisons={prediction.modelComparisons} />
          </Suspense>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-background p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Current</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatCurrency(prediction.currentPrice)}
                </p>
              </div>
              <TrendDirectionIndicator direction={prediction.direction} />
            </div>
            <div className="mt-4 flex gap-3">
              <PredictionOverlay
                label="Forecast"
                value={formatCurrency(prediction.predictedPrice)}
                tone={
                  prediction.predictedPrice > prediction.currentPrice
                    ? "positive"
                    : "negative"
                }
              />
              <ConfidenceBand
                lower={formatCurrency(prediction.confidenceInterval.lower)}
                upper={formatCurrency(prediction.confidenceInterval.upper)}
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <ConfidenceRing value={prediction.confidence} />
              <div>
                <p className="text-xs text-muted-foreground">Confidence</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatPercent(prediction.confidence, 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Sentiment{" "}
                  {formatPercent(prediction.sentimentCorrelation * 100, 0)}
                </p>
              </div>
            </div>
          </div>
          <RecommendationCard recommendation={prediction.recommendation} />
          <PredictionExplanationCard
            text={`Forecast confidence is ${formatPercent(
              prediction.confidence,
              0,
            )} based on model ${prediction.model} with horizon ${prediction.horizon}.`}
          />
        </div>
      </motion.section>

      <motion.section
        className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
      >
        <Suspense fallback={<Skeleton className="h-[260px] w-full" />}>
          <ShapFeatureChart features={prediction.shap} />
        </Suspense>
        <div className="space-y-2">
          {prediction.shap.slice(0, 6).map((feature) => (
            <FeatureImportanceBar key={feature.feature} feature={feature} />
          ))}
        </div>
      </motion.section>
    </FeaturePageShell>
  );
}
