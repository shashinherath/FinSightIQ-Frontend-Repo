export function SentimentHeatmap({
  data,
}: {
  data: Array<{ symbol: string; value: number }>;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {data.map((d) => (
        <div key={d.symbol} className="rounded-md border p-2 text-center">
          <div className="text-sm font-semibold">{d.symbol}</div>
          <div className="text-xs text-muted-foreground">
            {d.value.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
