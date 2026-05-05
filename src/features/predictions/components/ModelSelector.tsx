import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import type { PredictionModel } from "@/features/predictions/types/prediction.types";

const MODELS: PredictionModel[] = ["PROPHET", "ARIMA", "LSTM", "ENSEMBLE"];

export function ModelSelector({
  value,
  onChange,
}: {
  value: PredictionModel;
  onChange: (value: PredictionModel) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label>Prediction Model</Label>
      <div className="grid grid-cols-2 gap-2">
        {MODELS.map((model) => (
          <Button
            key={model}
            type="button"
            variant={value === model ? "default" : "outline"}
            onClick={() => onChange(model)}
          >
            {model}
          </Button>
        ))}
      </div>
    </div>
  );
}
