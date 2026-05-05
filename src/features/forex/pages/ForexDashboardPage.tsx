import { useNavigate } from "react-router-dom";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { ForexSearchInput } from "../components/ForexSearchInput";
import { ForexMarketTable } from "../components/ForexMarketTable";
import { ForexMoversWidget } from "../components/ForexMoversWidget";
import { useForexDashboard } from "../query/forex.query";
import { useForexSignalR } from "../services/useForexSignalR";

export function ForexDashboardPage() {
  const navigate = useNavigate();
  useForexSignalR(true);
  const { data } = useForexDashboard();

  return (
    <FeaturePageShell
      title="Forex"
      description="Monitor major currency pairs, spreads, and real-time momentum across the FX market."
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
        <ForexMarketTable
          quotes={data?.majorPairs ?? []}
          onSelect={(pair) =>
            navigate(`/app/forex/pair/${pair.replace("/", "")}`)
          }
        />
        <ForexMoversWidget
          gainers={data?.gainers ?? []}
          losers={data?.losers ?? []}
          volatilePairs={data?.volatilePairs ?? []}
          onSelect={(pair) =>
            navigate(`/app/forex/pair/${pair.replace("/", "")}`)
          }
        />
      </div>
    </FeaturePageShell>
  );
}
