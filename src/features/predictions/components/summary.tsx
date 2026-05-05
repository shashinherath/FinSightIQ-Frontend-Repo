import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/utils/cn";
import type {
  RecommendationDetails,
  RecommendationSignal,
  TrendDirection,
} from "@/features/predictions/types/prediction.types";
import { formatPercent } from "@/features/predictions/utils/format";

export function ConfidenceRing({ value }: { value: number }) {
  const stroke = 2 * Math.PI * 22;
  const offset = stroke - (value / 100) * stroke;
  return (
    <div className="relative flex items-center justify-center">
      <svg className="h-16 w-16 -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="22"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted"
          fill="none"
        />
        <circle
          cx="32"
          cy="32"
          r="22"
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray={stroke}
          strokeDashoffset={offset}
          className="text-emerald-400"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-semibold text-foreground">
        {formatPercent(value, 0)}
      </span>
    </div>
  );
}

export function TrendDirectionIndicator({
  direction,
}: {
  direction: TrendDirection;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          direction === "UP" && "bg-emerald-500/15 text-emerald-400",
          direction === "DOWN" && "bg-destructive/15 text-destructive",
          direction === "SIDEWAYS" && "bg-amber-500/15 text-amber-400",
        )}
      >
        <motion.div
          animate={{ y: direction === "DOWN" ? 2 : -2 }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "mirror" }}
        >
          {direction === "DOWN" ? (
            <ArrowDownRight className="h-4 w-4" />
          ) : (
            <ArrowUpRight className="h-4 w-4" />
          )}
        </motion.div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Trend</p>
        <p className="text-sm font-semibold text-foreground">{direction}</p>
      </div>
    </div>
  );
}

export function ProbabilityBreakdown({ confidence }: { confidence: number }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Probability breakdown</p>
      <div className="space-y-2">
        <div className="h-2 rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-emerald-500"
            style={{ width: `${confidence}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>Confidence</span>
          <span>{formatPercent(confidence, 0)}</span>
        </div>
      </div>
    </div>
  );
}

export function RecommendationCard({
  recommendation,
}: {
  recommendation: RecommendationDetails;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Recommendation</p>
        <RecommendationBreakdown signal={recommendation.signal} />
      </div>
      <p className="mt-2 text-sm font-semibold text-foreground">
        {recommendation.reason}
      </p>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Confidence {formatPercent(recommendation.confidence, 0)}</span>
        <RiskIndicator level={recommendation.riskLevel} />
      </div>
      {recommendation.supportingIndicators.length > 0 && (
        <div className="mt-3 space-y-2 text-xs text-muted-foreground">
          {recommendation.supportingIndicators.slice(0, 4).map((indicator) => (
            <div
              key={indicator.name}
              className="flex items-center justify-between"
            >
              <span>{indicator.name}</span>
              <span className="text-foreground">
                {indicator.contribution.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RiskIndicator({
  level,
}: {
  level: RecommendationDetails["riskLevel"];
}) {
  const tone =
    level === "LOW"
      ? "bg-emerald-500/20 text-emerald-400"
      : level === "MEDIUM"
        ? "bg-amber-500/20 text-amber-400"
        : "bg-destructive/20 text-destructive";
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px]", tone)}>
      {level} Risk
    </span>
  );
}

export function SignalStrengthMeter({ value }: { value: number }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Signal strength</p>
      <div className="flex gap-1">
        {Array.from({ length: 10 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-2 flex-1 rounded-sm",
              index < Math.round(value / 10) ? "bg-emerald-400" : "bg-muted",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function RecommendationBreakdown({
  signal,
}: {
  signal: RecommendationSignal;
}) {
  const variant =
    signal === "BUY"
      ? "default"
      : signal === "HOLD"
        ? "secondary"
        : "destructive";
  return <Badge variant={variant}>{signal}</Badge>;
}
