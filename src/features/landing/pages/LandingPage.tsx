import { Link } from "react-router-dom";
import { Brain, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

const features = [
  {
    title: "Realtime market pulse",
    body: "Aggregate price action, sentiment, and risk with second-by-second refreshes.",
    icon: LineChart,
  },
  {
    title: "AI signal orchestration",
    body: "Blend prediction models and explainability layers into a single signal bus.",
    icon: Brain,
  },
  {
    title: "Portfolio guardrails",
    body: "Apply exposure limits, scenario analysis, and risk alerts in one view.",
    icon: ShieldCheck,
  },
];

const stats = [
  { value: "2.1M", label: "Predictions streamed" },
  { value: "120ms", label: "Latency" },
  { value: "98.7%", label: "Signals scored" },
];

export function LandingPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-muted/20 font-body text-foreground">
      <div className="relative flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,_hsl(var(--muted))_0%,_transparent_50%)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-[8%] h-[420px] w-[420px] animate-float-soft rounded-full bg-primary/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[4%] top-[180px] h-[360px] w-[360px] rounded-full bg-chart-2/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-80px] left-[38%] h-[300px] w-[300px] rounded-full bg-chart-4/25 blur-3xl"
        />

        <header className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 pt-6">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary"
            >
              <Sparkles className="h-[18px] w-[18px] text-primary-foreground" />
            </span>
            <span className="font-display text-[19px] font-bold tracking-tight">
              FinSight<span className="text-muted-foreground">IQ</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="ghost" className="h-10">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild className="h-10">
              <Link to="/register">Start your workspace</Link>
            </Button>
          </div>
        </header>

        <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pt-20 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            An AI-first market operating system
          </span>
          <h1 className="max-w-[20ch] text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[56px]">
            Forecasts that show their range, their drivers, and their age.
          </h1>
          <p className="max-w-[62ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-[17px]">
            Aggregate price action, sentiment, and risk with second-by-second
            refreshes. Every forecast arrives with its confidence interval, the
            features that moved it, and the timestamp of the data behind it.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild size="lg" className="h-11">
              <Link to="/register">Start your workspace</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Built for institutional teams. New accounts start with Viewer
            access.
          </p>
        </section>

        <section className="relative mx-auto max-w-6xl px-6 pt-20">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-3 rounded-[28px] border border-border/60 bg-card/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-3xl bg-muted/60 text-foreground"
                >
                  <feature.icon className="h-6 w-6" />
                </span>
                <h2 className="font-display text-lg font-semibold tracking-tight">
                  {feature.title}
                </h2>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-6 pt-20">
          <div className="grid gap-4 rounded-[32px] border border-border/60 bg-card/70 px-6 py-8 shadow-sm md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <span className="font-display text-[34px] font-bold tabular-nums tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[13px] text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <footer className="relative mx-auto mt-20 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-border px-6 pb-12 pt-20">
          <span className="max-w-[64ch] text-xs leading-relaxed text-muted-foreground">
            Model output only. Not financial advice. Past accuracy does not
            guarantee future results. FinSightIQ does not execute trades.
          </span>
        </footer>
      </div>
    </div>
  );
}
