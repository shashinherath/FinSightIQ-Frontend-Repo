import { Wallet } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";

export function PortfolioPage() {
  return (
    <FeaturePageShell
      title="Portfolio"
      description="Track holdings, allocation, and risk exposure in real time."
      action={<Button>Add holding</Button>}
    >
      <EmptyState
        title="Your portfolio is empty"
        description="Add holdings to start monitoring performance."
        icon={<Wallet className="h-5 w-5" />}
      />
    </FeaturePageShell>
  );
}
