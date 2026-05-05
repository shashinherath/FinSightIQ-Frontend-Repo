import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Signal } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { ForecastLegend } from "@/features/predictions/components/charts";
import { PredictionForm } from "@/features/predictions/components/PredictionForm";
import { useGeneratePrediction } from "@/features/predictions/query/prediction.query";
import type { PredictionResult } from "@/features/predictions/types/prediction.types";
import { normalizeForexPair, pairFromDisplay } from "../utils/forex.mapper";
import { useForexHistoricalRates, useForexQuote } from "../query/forex.query";
import { useForexStore } from "../store/forexStore";
import { useForexSignalR } from "../services/useForexSignalR";
import { ForexChart } from "../components/ForexChart";
import { ForexMetricsPanel } from "../components/ForexMetricsPanel";
import { ForexPredictionCard } from "../components/ForexPredictionCard";
import { ForexForecastChart } from "../components/ForexForecastChart";
import { PipChangeIndicator } from "../components/PipChangeIndicator";

export function ForexPairDetailsPage() {
  const navigate = useNavigate();
  const params = useParams<{ pair: string }>();
  const defaultPair = normalizeForexPair(params.pair || "EURUSD");
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "1H" | "4H" | "1D" | "1W" | "1M"
  >("1D");
  const [chartType, setChartType] = useState<"line" | "candlestick">("line");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const generatePrediction = useGeneratePrediction();
  const setSelectedPair = useForexStore((state) => state.setSelectedPair);
  const addRecentPair = useForexStore((state) => state.addRecentPair);
  const setStoreTimeframe = useForexStore(
    (state) => state.setSelectedTimeframe,
  );

  const pairInfo = useMemo(() => pairFromDisplay(defaultPair), [defaultPair]);

  useForexSignalR(true);

  const { data: quote, isLoading: quoteLoading } = useForexQuote(
    pairInfo.symbol,
    {
      enabled: !!pairInfo.symbol,
    },
  );
  const { data: historical, isLoading: historicalLoading } =
    useForexHistoricalRates(pairInfo.symbol, selectedTimeframe, {
      enabled: !!pairInfo.symbol,
    });

  useEffect(() => {
    setSelectedPair(pairInfo.symbol);
    addRecentPair(pairInfo.symbol);
  }, [addRecentPair, pairInfo.symbol, setSelectedPair]);

  useEffect(() => {
    setStoreTimeframe(selectedTimeframe);
  }, [selectedTimeframe, setStoreTimeframe]);

  if (!params.pair) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <p className="text-muted-foreground">Forex pair not found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/app/forex")}
          >
            Back to Forex
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FeaturePageShell
      title={pairInfo.symbol}
      description={`${pairInfo.baseCurrency} base currency vs ${pairInfo.quoteCurrency} quote currency · 24/5 market`}
      action={
        <Button variant="outline" onClick={() => navigate("/app/forex")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forex
        </Button>
      }
    >
      <div className="space-y-6 pb-12">
        <section className="grid gap-4 rounded-xl border border-border/60 bg-background p-4 md:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-4xl font-semibold text-foreground">
                {quoteLoading
                  ? "Loading..."
                  : (quote?.price.toFixed(4) ?? "--")}
              </p>
              {quote ? (
                <PipChangeIndicator pipChange={quote.pipChange} />
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              Live rate, spread, and volatility for {pairInfo.symbol}
            </p>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="rounded-full border border-border/60 px-3 py-1">
                {pairInfo.baseCurrency}
              </span>
              <span className="rounded-full border border-border/60 px-3 py-1">
                {pairInfo.quoteCurrency}
              </span>
              <span className="rounded-full border border-border/60 px-3 py-1">
                24/5 market
              </span>
              <span className="rounded-full border border-border/60 px-3 py-1 inline-flex items-center gap-2">
                <Signal className="h-3.5 w-3.5" />
                {quote?.trend ?? "SIDEWAYS"}
              </span>
            </div>
          </div>
          {quote ? (
            <Card className="border-border/60 bg-muted/20">
              <CardHeader>
                <CardTitle className="text-base">Session snapshot</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Bid</p>
                  <p className="font-semibold text-foreground">
                    {quote.bid.toFixed(4)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ask</p>
                  <p className="font-semibold text-foreground">
                    {quote.ask.toFixed(4)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Spread</p>
                  <p className="font-semibold text-foreground">
                    {quote.spread.toFixed(5)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Volatility</p>
                  <p className="font-semibold text-foreground">
                    {quote.volatility.toFixed(2)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </section>

        {quote && historical && !historicalLoading ? (
          <>
            <ForexChart
              pair={pairInfo.symbol}
              chartType={chartType}
              historical={historical}
              onTimeframeChange={(timeframe) => {
                setSelectedTimeframe(timeframe);
              }}
              onChartTypeChange={setChartType}
            />

            <ForexMetricsPanel quote={quote} history={historical} />

            <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Forex prediction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PredictionForm
                    assetType="forex"
                    defaultValues={{
                      symbol: pairInfo.symbol,
                      model: "ENSEMBLE",
                      horizon: "14D",
                      confidencePreference: "MEDIUM",
                    }}
                    onSubmit={async (values) => {
                      const result = await generatePrediction.mutateAsync({
                        symbol: values.symbol,
                        model: values.model,
                        horizon: values.horizon,
                        confidencePreference: values.confidencePreference,
                      });
                      setPrediction(result);
                    }}
                    isSubmitting={generatePrediction.isPending}
                  />
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">
                        Forecast context
                      </p>
                      <ForecastLegend />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Generate a forex forecast to see the exchange-rate
                      direction, confidence, and long/short bias.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {prediction ? (
                  <>
                    <ForexPredictionCard prediction={prediction} />
                    <ForexForecastChart
                      pair={pairInfo.symbol}
                      prediction={prediction}
                    />
                  </>
                ) : (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <p className="text-sm text-muted-foreground">
                        Run a forecast to review long/short guidance and the
                        projected exchange rate path.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground/70" />
              <p className="text-muted-foreground">
                Historical forex data is loading.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/app/forex")}
              >
                Return to Forex Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </FeaturePageShell>
  );
}
