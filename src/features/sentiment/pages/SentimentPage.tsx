import SentimentDashboardPage from "./SentimentDashboardPage";
import { Button } from "@/shared/ui/button";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";

export function SentimentPage() {
  return (
    <FeaturePageShell
      title="Sentiment"
      description="Monitor AI-scored news sentiment across your watchlist."
      action={<Button variant="outline">Configure feeds</Button>}
    >
      <SentimentDashboardPage />
    </FeaturePageShell>
  );
}

export default SentimentPage;
