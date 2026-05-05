import { useNavigate } from "react-router-dom";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { ForexSearchInput } from "../components/ForexSearchInput";
import { useForexStore } from "../store/forexStore";

export function ForexSearchPage() {
  const navigate = useNavigate();
  const recentPairs = useForexStore((state) => state.recentPairs);

  return (
    <FeaturePageShell
      title="Search Forex"
      description="Find currency pairs with instant autocomplete and keyboard navigation."
      action={
        <div className="w-full max-w-xl">
          <ForexSearchInput
            onSelect={(pair) =>
              navigate(`/app/forex/pair/${pair.replace("/", "")}`)
            }
          />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-border/60 bg-background p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Popular pairs
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {recentPairs.map((pair) => (
              <button
                key={pair}
                type="button"
                className="rounded-full border border-border/60 px-3 py-1.5 text-sm text-foreground transition hover:border-primary/40 hover:bg-muted/30"
                onClick={() =>
                  navigate(`/app/forex/pair/${pair.replace("/", "")}`)
                }
              >
                {pair}
              </button>
            ))}
          </div>
        </div>
      </div>
    </FeaturePageShell>
  );
}
