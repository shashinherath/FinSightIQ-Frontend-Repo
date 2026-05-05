import { useMarketSentiment } from "../query/sentiment.query";
import { SentimentScoreCard } from "../components/SentimentScoreCard";
import { SentimentTrendChart } from "../components/SentimentTrendChart";
import { NewsFeed } from "../components/NewsFeed";
import { SentimentHeatmap } from "../components/SentimentHeatmap";
import { MarketMoodIndicator } from "../components/MarketMoodIndicator";
import type { SectorSentiment } from "../types/sentiment.types";

export default function SentimentDashboardPage() {
  const { data } = useMarketSentiment();

  const heatmapData = (data?.sectors || []) as SectorSentiment[];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <SentimentScoreCard
          title="Global Sentiment"
          score={data?.overall ?? 0}
        />
        <div className="col-span-2">
          <MarketMoodIndicator mood={data?.overall ?? 0} />
          <SentimentTrendChart series={[]} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <h3 className="mb-3 text-sm font-medium">News</h3>
          <NewsFeed />
        </div>
        <div>
          <h3 className="mb-3 text-sm font-medium">Heatmap</h3>
          <SentimentHeatmap
            data={heatmapData.map((h) => ({
              symbol: h.sector,
              value: h.score,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
