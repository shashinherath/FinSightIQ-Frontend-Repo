import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export function SentimentScoreCard({
  title,
  score,
}: {
  title?: string;
  score: number;
}) {
  const tone =
    score > 20
      ? "text-emerald-400"
      : score < -20
        ? "text-destructive"
        : "text-amber-400";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title ?? "Sentiment"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-4">
          <div className={`text-3xl font-semibold ${tone}`}>{score}</div>
          <div className="text-xs text-muted-foreground">
            Score (-100 to 100)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
