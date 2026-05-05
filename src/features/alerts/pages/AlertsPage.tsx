import { Bell } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { useNotifications } from "../query/alerts.query";
import { useAlertsStore } from "../store/alertsStore";
import type { AlertRule } from "../types/alerts.types";

export function AlertsPage() {
  const { data: notifications } = useNotifications();
  const { rules, addRule, removeRule } = useAlertsStore();

  return (
    <FeaturePageShell
      title="Alerts"
      description="Automate price, sentiment, and prediction triggers."
      action={<Button>Create alert</Button>}
    >
      <div className="space-y-6">
        <div>
          <div className="mt-3 space-y-2">
            {rules.length === 0 && (
              <EmptyState
                title="No alerts configured"
                description="Create alert rules to get notified instantly."
                icon={<Bell className="h-5 w-5" />}
              />
            )}

            {rules.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.type} {r.threshold ? `• ${r.threshold}` : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn" onClick={() => removeRule(r.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div>
              <button
                className="btn"
                onClick={() =>
                  addRule({
                    id: Date.now().toString(),
                    name: "New Rule",
                    type: "PRICE_TARGET",
                    enabled: true,
                    createdAt: Date.now(),
                  } as AlertRule)
                }
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium">Notifications</h3>
          <div className="mt-3 space-y-2">
            {(notifications || []).map((n) => (
              <div key={n.id} className="rounded-md border p-2">
                <div className="text-sm font-medium">{n.title}</div>
                <div className="text-xs text-muted-foreground">{n.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FeaturePageShell>
  );
}

export default AlertsPage;
