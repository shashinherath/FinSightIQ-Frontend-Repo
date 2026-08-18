import { useParams } from "react-router-dom";
import { Receipt } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";

export function HoldingDetailPage() {
  const { symbol } = useParams();

  return (
    <FeaturePageShell
      title={symbol ?? "Holding"}
      description="Transaction ledger for this holding."
    >
      <EmptyState
        title="No transactions yet"
        description="Buy and sell activity for this holding will appear here."
        icon={<Receipt className="h-5 w-5" />}
      />
    </FeaturePageShell>
  );
}
