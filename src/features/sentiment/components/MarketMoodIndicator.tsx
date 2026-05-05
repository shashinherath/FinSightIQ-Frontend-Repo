export function MarketMoodIndicator({ mood }: { mood: number }) {
  const cls =
    mood > 0
      ? "text-emerald-500"
      : mood < 0
        ? "text-destructive"
        : "text-amber-400";
  return (
    <div className="flex items-center gap-3">
      <div className={`text-2xl font-bold ${cls}`}>
        {mood > 0 ? "Bullish" : mood < 0 ? "Bearish" : "Neutral"}
      </div>
      <div className="text-xs text-muted-foreground">
        Mood: {mood.toFixed(2)}
      </div>
    </div>
  );
}
