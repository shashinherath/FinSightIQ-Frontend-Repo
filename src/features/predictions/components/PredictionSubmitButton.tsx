import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function PredictionSubmitButton({ loading }: { loading?: boolean }) {
  return (
    <Button type="submit" disabled={loading} className="w-full">
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      {loading ? "Generating..." : "Generate Prediction"}
    </Button>
  );
}
