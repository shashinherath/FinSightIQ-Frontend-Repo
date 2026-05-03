import { MessageSquareText } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";

export function SentimentPage() {
  return (
    <FeaturePageShell
      title="Sentiment"
      description="Monitor AI-scored news sentiment across your watchlist."
      action={<Button variant="outline">Configure feeds</Button>}
    >
      <EmptyState
        title="No sentiment feeds yet"
        description="Connect news sources to see sentiment trends."
        icon={<MessageSquareText className="h-5 w-5" />}
      />
    </FeaturePageShell>
  );
}
