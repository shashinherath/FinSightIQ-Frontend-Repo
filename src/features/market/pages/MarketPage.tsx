import { Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";

export function MarketPage() {
  return (
    <FeaturePageShell
      title="Market"
      description="Search and explore live market data across global exchanges."
      action={<Button>Search symbols</Button>}
    >
      <EmptyState
        title="Market data is ready"
        description="Connect the market data feed to unlock real-time pricing."
        icon={<Search className="h-5 w-5" />}
      />
    </FeaturePageShell>
  );
}
