import { Brain } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";

export function PredictionsPage() {
  return (
    <FeaturePageShell
      title="Predictions"
      description="Run AI forecasts and monitor confidence bands."
      action={<Button>Request prediction</Button>}
    >
      <EmptyState
        title="No forecasts yet"
        description="Trigger a prediction to see AI insights here."
        icon={<Brain className="h-5 w-5" />}
      />
    </FeaturePageShell>
  );
}
