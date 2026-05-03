import { Bell } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";

export function AlertsPage() {
  return (
    <FeaturePageShell
      title="Alerts"
      description="Automate price, sentiment, and prediction triggers."
      action={<Button>Create alert</Button>}
    >
      <EmptyState
        title="No alerts configured"
        description="Create alert rules to get notified instantly."
        icon={<Bell className="h-5 w-5" />}
      />
    </FeaturePageShell>
  );
}
