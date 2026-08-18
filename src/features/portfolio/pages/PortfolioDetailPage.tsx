import { useParams } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";

export function PortfolioDetailPage() {
  const { portfolioId } = useParams();

  return (
    <FeaturePageShell
      title={portfolioId ?? "Portfolio"}
      description="Holdings, value history, and benchmark comparison."
    >
      <EmptyState
        title="Portfolio detail not connected yet"
        description="Holdings and performance data will appear here."
        icon={<Briefcase className="h-5 w-5" />}
      />
    </FeaturePageShell>
  );
}
