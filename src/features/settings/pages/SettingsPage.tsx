import { Settings } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";

export function SettingsPage() {
  return (
    <FeaturePageShell
      title="Settings"
      description="Update preferences, notifications, and security controls."
      action={<Button variant="outline">Edit profile</Button>}
    >
      <EmptyState
        title="No settings configured"
        description="Customize your experience when profile data is connected."
        icon={<Settings className="h-5 w-5" />}
      />
    </FeaturePageShell>
  );
}
