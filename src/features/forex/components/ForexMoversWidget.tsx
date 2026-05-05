import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ForexPairCard } from "./ForexPairCard";
import type { ForexMover } from "../types/forex.types";

function moverListTitle(title: string) {
  return <CardTitle className="text-base">{title}</CardTitle>;
}

export function ForexMoversWidget({
  gainers,
  losers,
  volatilePairs,
  onSelect,
}: {
  gainers: ForexMover[];
  losers: ForexMover[];
  volatilePairs: ForexMover[];
  onSelect?: (pair: string) => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader>{moverListTitle("Top gainers")}</CardHeader>
        <CardContent className="space-y-3">
          {gainers.map((quote) => (
            <ForexPairCard
              key={quote.symbol}
              quote={quote}
              onClick={() => onSelect?.(quote.symbol)}
            />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>{moverListTitle("Top losers")}</CardHeader>
        <CardContent className="space-y-3">
          {losers.map((quote) => (
            <ForexPairCard
              key={quote.symbol}
              quote={quote}
              onClick={() => onSelect?.(quote.symbol)}
            />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>{moverListTitle("Most volatile")}</CardHeader>
        <CardContent className="space-y-3">
          {volatilePairs.map((quote) => (
            <ForexPairCard
              key={quote.symbol}
              quote={quote}
              onClick={() => onSelect?.(quote.symbol)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
