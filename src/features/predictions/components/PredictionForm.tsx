import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ModelSelector } from "@/features/predictions/components/ModelSelector";
import { ForecastHorizonSelector } from "@/features/predictions/components/ForecastHorizonSelector";
import { PredictionSubmitButton } from "@/features/predictions/components/PredictionSubmitButton";
import type {
  ConfidencePreference,
  ForecastHorizon,
  PredictionModel,
} from "@/features/predictions/types/prediction.types";

const schema = z.object({
  symbol: z.string().min(1).max(10),
  model: z.enum(["PROPHET", "ARIMA", "LSTM", "ENSEMBLE"]),
  horizon: z.enum(["1D", "7D", "14D", "30D", "90D"]),
  confidencePreference: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export type PredictionFormValues = z.infer<typeof schema>;

interface PredictionFormProps {
  defaultValues?: PredictionFormValues;
  onSubmit: (values: PredictionFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function PredictionForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: PredictionFormProps) {
  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(schema),
    defaultValues:
      defaultValues ??
      ({
        symbol: "AAPL",
        model: "ENSEMBLE",
        horizon: "14D",
        confidencePreference: "MEDIUM",
      } as PredictionFormValues),
  });

  const watchedModel = form.getValues("model");
  const watchedHorizon = form.getValues("horizon");
  const watchedConfidencePreference = form.getValues("confidencePreference");

  return (
    <form
      className="grid gap-4 rounded-xl border border-border/60 bg-card p-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="grid gap-2">
        <Label htmlFor="symbol">Symbol</Label>
        <Input id="symbol" {...form.register("symbol")} placeholder="AAPL" />
      </div>

      <ModelSelector
        value={watchedModel}
        onChange={(value) => form.setValue("model", value as PredictionModel)}
      />

      <ForecastHorizonSelector
        value={watchedHorizon}
        onChange={(value) => form.setValue("horizon", value as ForecastHorizon)}
      />

      <div className="grid gap-2">
        <Label>Confidence Preference</Label>
        <div className="flex gap-2">
          {(["LOW", "MEDIUM", "HIGH"] as ConfidencePreference[]).map(
            (level) => (
              <Button
                key={level}
                type="button"
                variant={
                  watchedConfidencePreference === level ? "default" : "outline"
                }
                onClick={() => form.setValue("confidencePreference", level)}
              >
                {level}
              </Button>
            ),
          )}
        </div>
      </div>

      <PredictionSubmitButton loading={isSubmitting} />
    </form>
  );
}
