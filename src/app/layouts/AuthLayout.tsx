import { Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-start justify-center overflow-y-auto bg-[radial-gradient(circle_at_top,_hsl(var(--muted))_0%,_transparent_48%)] px-4 py-12 text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[90px] left-[14%] h-80 w-80 rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[70px] right-[10%] h-72 w-72 rounded-full bg-chart-4/25 blur-3xl"
      />

      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="relative flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col items-center gap-3.5">
          <span
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary"
          >
            <Sparkles className="h-[30px] w-[30px] text-primary-foreground" />
          </span>
          <span className="font-display text-[22px] font-bold tracking-tight">
            FinSight<span className="text-muted-foreground">IQ</span>
          </span>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
