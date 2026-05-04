import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowUpRight, Brain, Sparkles } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { EmptyState } from "@/shared/components/EmptyState";
import { PredictionForm } from "@/features/predictions/components/PredictionForm";
import {
  ConfidenceRing,
  ProbabilityBreakdown,
  RecommendationCard,
  RecommendationBreakdown,
  RiskIndicator,
  SignalStrengthMeter,
  TrendDirectionIndicator,
} from "@/features/predictions/components/summary";
import {
  ConfidenceBand,
  ForecastChart,
  ForecastLegend,
  PredictionOverlay,
} from "@/features/predictions/components/charts";
import {
  AIReasoningPanel,
  FeatureImportanceBar,
  PredictionExplanationCard,
  ShapFeatureChart,
} from "@/features/predictions/components/explainability";
import { PredictionTimeline } from "@/features/predictions/components/history";
import {
  useGeneratePrediction,
  useModelAnalytics,
  usePredictionAccuracy,
  usePredictionHistory,
} from "@/features/predictions/query/prediction.query";
import { usePredictionStore } from "@/features/predictions/store/predictionStore";
import { usePredictionSignalR } from "@/features/predictions/services/usePredictionSignalR";
import type {
  ForecastHorizon,
  PredictionModel,
} from "@/features/predictions/types/prediction.types";
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

export function PredictionsDashboardPage() {
  usePredictionSignalR();

  const sectionMotion = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  const {
    selectedSymbol,
    selectedModel,
    selectedHorizon,
    confidencePreference,
    activePrediction,
    isGenerating,
    setSelectedSymbol,
    setSelectedModel,
    setSelectedHorizon,
    setConfidencePreference,
    setActivePrediction,
    setGenerating,
  } = usePredictionStore();

  const { data: history = [], isLoading: historyLoading } =
    usePredictionHistory();
  const { data: accuracySummary } = usePredictionAccuracy();
  const { data: modelAnalytics = [] } = useModelAnalytics();
  const generatePrediction = useGeneratePrediction();

  const handleSubmit = async (values: {
    symbol: string;
    model: PredictionModel;
    horizon: ForecastHorizon;
    confidencePreference: "LOW" | "MEDIUM" | "HIGH";
  }) => {
    setSelectedSymbol(values.symbol);
    setSelectedModel(values.model);
    setSelectedHorizon(values.horizon);
    setConfidencePreference(values.confidencePreference);

    try {
      setGenerating(true);
      const prediction = await generatePrediction.mutateAsync({
        symbol: values.symbol,
        model: values.model,
        horizon: values.horizon,
        confidencePreference: values.confidencePreference,
      });
      setActivePrediction(prediction);
    } catch (error) {
      console.error("Prediction generation failed", error);
    } finally {
      setGenerating(false);
    }
  };

  const summaryPrediction = activePrediction;

  return (
    <FeaturePageShell
      title="Predictions"
      description="Run AI forecasts, inspect model explainability, and monitor live signals."
      action={
        <Button variant="outline">
          New prediction
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      }
    >
      <motion.section
        className="grid gap-6 lg:grid-cols-[1.05fr_1.2fr]"
        {...sectionMotion}
      >
        <div className="space-y-6">
          <PredictionForm
            isSubmitting={isGenerating}
            defaultValues={{
              symbol: selectedSymbol,
              model: selectedModel,
              horizon: selectedHorizon,
              confidencePreference,
            }}
            onSubmit={handleSubmit}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prediction summary</CardTitle>
            </CardHeader>
            <CardContent>
              {!summaryPrediction ? (
                <EmptyState
                  title="No prediction yet"
                  description="Submit a symbol to generate the first forecast."
                  icon={<Brain className="h-5 w-5" />}
                />
              ) : (
                <div className="grid gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Symbol</p>
                      <p className="text-lg font-semibold text-foreground">
                        {summaryPrediction.symbol}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {summaryPrediction.model} · {summaryPrediction.horizon}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(summaryPrediction.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <PredictionOverlay
                        label="Current"
                        value={formatCurrency(summaryPrediction.currentPrice)}
                        tone="neutral"
                      />
                      <PredictionOverlay
                        label="Forecast"
                        value={formatCurrency(summaryPrediction.predictedPrice)}
                        tone={
                          summaryPrediction.predictedPrice >
                          summaryPrediction.currentPrice
                            ? "positive"
                            : "negative"
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[0.4fr_0.6fr]">
                    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-4">
                      <ConfidenceRing value={summaryPrediction.confidence} />
                      <TrendDirectionIndicator
                        direction={summaryPrediction.direction}
                      />
                      <div className="text-xs text-muted-foreground">
                        Sentiment{" "}
                        {formatPercent(
                          summaryPrediction.sentimentCorrelation * 100,
                          0,
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <ProbabilityBreakdown
                        confidence={summaryPrediction.confidence}
                      />
                      <SignalStrengthMeter
                        value={summaryPrediction.confidence}
                      />
                      <ConfidenceBand
                        lower={formatCurrency(
                          summaryPrediction.confidenceInterval.lower,
                        )}
                        upper={formatCurrency(
                          summaryPrediction.confidenceInterval.upper,
                        )}
                      />
                    </div>
                  </div>

                  <RecommendationCard
                    recommendation={summaryPrediction.recommendation}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {summaryPrediction ? (
            <div className="grid gap-4">
              <ForecastChart
                symbol={summaryPrediction.symbol}
                historicalSeries={summaryPrediction.historicalSeries}
                forecastSeries={summaryPrediction.forecastSeries}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <PredictionExplanationCard
                  text={`AI forecast generated ${formatDateTime(summaryPrediction.createdAt)}. Current market conditions indicate a ${summaryPrediction.direction.toLowerCase()} trajectory with ${formatPercent(summaryPrediction.confidence, 0)} confidence.`}
                />
                <div className="rounded-xl border border-border/60 bg-background p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      Signal
                    </p>
                    <RecommendationBreakdown
                      signal={summaryPrediction.recommendation.signal}
                    />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Recommendation update
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {summaryPrediction.recommendation.reason}
                  </p>
                  <div className="mt-3">
                    <RiskIndicator
                      level={summaryPrediction.recommendation.riskLevel}
                    />
                  </div>
                </div>
              </div>

              <Suspense fallback={<Skeleton className="h-[280px] w-full" />}>
                <MultiModelChart
                  modelComparisons={summaryPrediction.modelComparisons}
                />
              </Suspense>
            </div>
          ) : (
            <Card>
              <CardContent className="py-10">
                <EmptyState
                  title="Awaiting forecasts"
                  description="Forecast charts will render as soon as a prediction completes."
                  icon={<AlertCircle className="h-5 w-5" />}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </motion.section>

      <motion.section
        className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]"
        {...sectionMotion}
        transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
      >
        <div className="space-y-6">
          <div className="rounded-xl border border-border/60 bg-background p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Explainability
                </p>
                <p className="text-xs text-muted-foreground">
                  Feature contribution and AI reasoning details.
                </p>
              </div>
              <ForecastLegend />
            </div>
            {summaryPrediction ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <ShapFeatureChart features={summaryPrediction.shap} />
                <div className="space-y-2">
                  {summaryPrediction.shap.slice(0, 6).map((feature) => (
                    <FeatureImportanceBar
                      key={feature.feature}
                      feature={feature}
                    />
                  ))}
                </div>
                <AIReasoningPanel
                  reasons={[
                    "Momentum signals align with the forecast direction.",
                    "Sentiment indicators support the selected horizon.",
                    "Volume profile suggests stable liquidity.",
                  ]}
                />
              </div>
            ) : (
              <EmptyState
                title="Explainability pending"
                description="Run a prediction to unlock SHAP and reasoning panels."
                icon={<Brain className="h-5 w-5" />}
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Realtime activity</CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <PredictionTimeline items={history} />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Model accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Overall</p>
                  <p className="text-2xl font-semibold text-foreground">
                    {accuracySummary
                      ? formatPercent(accuracySummary.overallAccuracy, 0)
                      : "--"}
                  </p>
                </div>
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {accuracySummary
                  ? `${accuracySummary.successfulPredictions} of ${accuracySummary.totalPredictions} predictions hit target`
                  : "Accuracy updates with every prediction."}
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      <motion.section
        className="grid gap-6 lg:grid-cols-3"
        {...sectionMotion}
        transition={{ duration: 0.45, delay: 0.15 }}
      >
        {modelAnalytics.map((snapshot) => (
          <div
            key={snapshot.model}
            className="rounded-xl border border-border/60 bg-background p-4"
          >
            <p className="text-xs text-muted-foreground">{snapshot.model}</p>
            <p className="text-lg font-semibold text-foreground">
              {formatPercent(snapshot.successRate, 0)} success
            </p>
            <p className="text-xs text-muted-foreground">
              Directional {formatPercent(snapshot.directionalAccuracy, 0)}
            </p>
          </div>
        ))}
      </motion.section>
    </FeaturePageShell>
  );
}
