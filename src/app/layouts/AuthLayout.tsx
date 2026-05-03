import { Outlet } from "react-router-dom";
import { Activity, TrendingUp } from "lucide-react";
import { Badge } from "@/shared/ui/badge";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--muted))_0%,_transparent_45%)] text-foreground transition-colors duration-300">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
        <div className="hidden flex-col justify-between border-r border-border/60 bg-muted/20 px-12 py-10 lg:flex">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold tracking-tight">
              FinSight<span className="text-primary">IQ</span>
            </span>
          </div>

          <div className="space-y-6">
            <Badge variant="secondary" className="w-fit">
              AI stock intelligence
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight">
              Make faster, smarter trading decisions with live AI insights.
            </h1>
            <p className="text-base text-muted-foreground">
              Monitor real-time markets, forecast price movements, and optimize
              your portfolio with confidence.
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              Live predictions updated every minute.
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Trusted by quantitative teams and fintech innovators.
          </p>
        </div>

        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
