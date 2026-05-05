import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { motion } from "framer-motion";
import { EmptyState } from "@/shared/components/EmptyState";
import {
  ModelPerformanceCard,
  AccuracyTrendChart,
  ModelComparisonTable,
  PerformanceRadarChart,
  PerformanceHeatmap,
} from "@/features/predictions/components/analytics";
import {
  useModelAnalytics,
  usePredictionAccuracy,
} from "@/features/predictions/query/prediction.query";
import { formatPercent } from "@/features/predictions/utils/format";

export function ModelAnalyticsPage() {
  const { data: analytics = [], isLoading } = useModelAnalytics();
  const { data: accuracySummary } = usePredictionAccuracy();

  if (isLoading) {
    return (
      <FeaturePageShell
        title="Model Analytics"
        description="Model accuracy trends and comparisons."
      >
        <div className="rounded-xl border border-border/60 bg-background p-6">
          Loading analytics...
        </div>
      </FeaturePageShell>
    );
  }

  if (analytics.length === 0) {
    return (
      <FeaturePageShell
        title="Model Analytics"
        description="Model accuracy trends and comparisons."
      >
        <EmptyState
          title="No analytics data"
          description="Generate predictions to populate model metrics."
        />
      </FeaturePageShell>
    );
  }

  return (
    <FeaturePageShell
      title="Model Analytics"
      description="Model performance, confidence, and accuracy benchmarking."
    >
      <motion.section
        className="grid gap-4 md:grid-cols-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {analytics.map((snapshot) => (
          <ModelPerformanceCard key={snapshot.model} snapshot={snapshot} />
        ))}
      </motion.section>

      <motion.section
        className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
      >
        <div className="grid gap-6">
          {analytics.slice(0, 2).map((snapshot) => (
            <AccuracyTrendChart key={snapshot.model} snapshot={snapshot} />
          ))}
          <ModelComparisonTable snapshots={analytics} />
        </div>
        <div className="grid gap-6">
          <PerformanceRadarChart snapshots={analytics} />
          <PerformanceHeatmap snapshots={analytics} />
          <div className="rounded-xl border border-border/60 bg-background p-4">
            <p className="text-xs text-muted-foreground">Overall accuracy</p>
            <p className="text-2xl font-semibold text-foreground">
              {accuracySummary
                ? formatPercent(accuracySummary.overallAccuracy, 0)
                : "--"}
            </p>
            <p className="text-xs text-muted-foreground">
              Directional{" "}
              {accuracySummary
                ? formatPercent(accuracySummary.directionalAccuracy, 0)
                : "--"}
            </p>
          </div>
        </div>
      </motion.section>
    </FeaturePageShell>
  );
}
