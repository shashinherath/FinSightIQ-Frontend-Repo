import { Wallet } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";

export function PortfolioListPage() {
  return (
    <FeaturePageShell
      title="Portfolios"
      description="Track holdings, allocation, and risk exposure in real time."
      action={<Button>New portfolio</Button>}
    >
      <EmptyState
        title="No portfolios yet"
        description="Create a portfolio to start monitoring performance."
        icon={<Wallet className="h-5 w-5" />}
      />
    </FeaturePageShell>
  );
}
