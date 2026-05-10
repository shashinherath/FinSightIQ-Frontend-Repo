import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";
import { useAssetType } from "@/app/hooks/useAssetType";

const STOCK_ROUTE = "/app/market";
const FOREX_ROUTE = "/app/forex";
const selectedToggleClass =
  "bg-foreground text-background shadow-sm ring-1 ring-border/20 hover:bg-foreground/90 hover:text-background";

export function AssetToggle({ className }: { className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { assetType, setAssetType } = useAssetType();

  const handleToggle = (nextAssetType: "stock" | "forex") => {
    setAssetType(nextAssetType);

    const isMarketContext =
      location.pathname.startsWith("/app/market") ||
      location.pathname.startsWith("/app/forex");

    if (isMarketContext) {
      navigate(nextAssetType === "stock" ? STOCK_ROUTE : FOREX_ROUTE, {
        replace: true,
      });
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border/60 bg-muted/30 p-1",
        className,
      )}
      role="tablist"
      aria-label="Asset type toggle"
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 rounded-full px-3 text-xs font-semibold",
          assetType === "stock" && selectedToggleClass,
        )}
        aria-pressed={assetType === "stock"}
        onClick={() => handleToggle("stock")}
      >
        Stocks
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 rounded-full px-3 text-xs font-semibold",
          assetType === "forex" && selectedToggleClass,
        )}
        aria-pressed={assetType === "forex"}
        onClick={() => handleToggle("forex")}
      >
        Forex
      </Button>
    </div>
  );
}
