import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import type { ForecastHorizon } from "@/features/predictions/types/prediction.types";

const HORIZONS: ForecastHorizon[] = ["1D", "7D", "14D", "30D", "90D"];

export function ForecastHorizonSelector({
  value,
  onChange,
}: {
  value: ForecastHorizon;
  onChange: (value: ForecastHorizon) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label>Forecast Horizon</Label>
      <div className="flex flex-wrap gap-2">
        {HORIZONS.map((horizon) => (
          <Button
            key={horizon}
            type="button"
            size="sm"
            variant={value === horizon ? "default" : "outline"}
            onClick={() => onChange(horizon)}
          >
            {horizon}
          </Button>
        ))}
      </div>
    </div>
  );
}
