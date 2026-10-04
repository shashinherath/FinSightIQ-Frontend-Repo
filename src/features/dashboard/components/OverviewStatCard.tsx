import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { cn } from "@/shared/utils/cn";

interface OverviewStatCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
  note?: string;
  icon?: ReactNode;
}

export function OverviewStatCard({
  label,
  value,
  change,
  trend,
  note = "vs. yesterday",
  icon,
}: OverviewStatCardProps) {
  const isPositive = trend === "up";
  const isNegative = trend === "down";

  return (
    <Card className="border-border/60 bg-background/80">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{label}</span>
          {icon}
        </div>
        <div className="font-display text-2xl font-semibold tracking-tight">
          {value}
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1 border border-border/60",
              isPositive && "text-up-strong",
              isNegative && "text-down",
              !isPositive && !isNegative && "text-foreground",
            )}
          >
            {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
            {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
            {change}
          </Badge>
          <span className="text-xs text-muted-foreground">{note}</span>
        </div>
      </CardContent>
    </Card>
  );
}
