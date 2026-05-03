import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Brain,
  LineChart,
  Radar,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

const highlights = [
  { label: "Predictions streamed", value: "2.1M" },
  { label: "Latency", value: "120ms" },
  { label: "Signals scored", value: "98.7%" },
  { label: "Coverage", value: "4,800+ tickers" },
];

const features = [
  {
    title: "Realtime market pulse",
    description:
      "Aggregate price action, sentiment, and risk with second-by-second refreshes.",
    icon: Radar,
  },
  {
    title: "AI signal orchestration",
    description:
      "Blend prediction models and explainability layers into a single signal bus.",
    icon: Brain,
  },
  {
    title: "Portfolio guardrails",
    description:
      "Apply exposure limits, scenario analysis, and risk alerts in one view.",
    icon: ShieldCheck,
  },
  {
    title: "Smart alert routing",
    description:
      "Automate signal routing into Slack, email, and execution workflows.",
    icon: Zap,
  },
  {
    title: "Institutional-grade dashboards",
    description:
      "Build custom views with live overlays for strategy, sector, and factor data.",
    icon: LineChart,
  },
  {
    title: "Explainability studio",
    description:
      "Unpack why a model signaled BUY or HOLD with transparent driver scores.",
    icon: Sparkles,
  },
];

const steps = [
  {
    title: "Connect your universe",
    description:
      "Sync watchlists, portfolios, and market data feeds in minutes.",
  },
  {
    title: "Activate AI models",
    description:
      "Deploy FinSightIQ prediction stacks with calibrated confidence scoring.",
  },
  {
    title: "Operate with intent",
    description:
      "Monitor outcomes, automate alerts, and adapt to volatility faster.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--muted))_0%,_transparent_50%)] text-foreground">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_hsl(var(--primary)/0.25)_0%,_transparent_60%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-10%] top-24 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,_hsl(var(--chart-2)/0.25)_0%,_transparent_60%)] blur-3xl animate-float-soft" />
        <div className="pointer-events-none absolute bottom-[-140px] left-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_hsl(var(--chart-4)/0.25)_0%,_transparent_60%)] blur-3xl animate-float-soft" />

        <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="text-lg font-semibold tracking-tight font-[var(--font-display)]">
                FinSightIQ
              </p>
              <p className="text-xs text-muted-foreground">
                AI Stock Intelligence
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">
              Capabilities
            </a>
            <a href="#workflow" className="hover:text-foreground">
              Workflow
            </a>
            <a href="#insights" className="hover:text-foreground">
              Insights
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">
                Request access
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <main className="relative z-10 px-6 pb-20 pt-8 md:px-10">
          <section className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit animate-fade-in">
                  AI-first market operating system
                </Badge>
                <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl font-[var(--font-display)] animate-fade-up">
                  Trade faster with a realtime intelligence layer for every
                  portfolio decision.
                </h1>
                <p
                  className="text-base text-muted-foreground sm:text-lg animate-fade-up"
                  style={{ animationDelay: "120ms" }}
                >
                  FinSightIQ merges predictions, sentiment, and risk into a
                  command center that helps teams spot momentum, avoid downside,
                  and stay aligned when volatility spikes.
                </p>
                <div
                  className="flex flex-wrap items-center gap-3 animate-fade-up"
                  style={{ animationDelay: "200ms" }}
                >
                  <Button asChild size="lg">
                    <Link to="/app/dashboard">
                      View live dashboard
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/register">Book a demo</Link>
                  </Button>
                </div>
                <div className="grid gap-4 pt-4 sm:grid-cols-2">
                  {highlights.map((item, index) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm animate-fade-up"
                      style={{ animationDelay: `${280 + index * 90}ms` }}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="text-2xl font-semibold font-[var(--font-display)]">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-primary/10 via-transparent to-chart-3/20 blur-2xl" />
                <Card className="relative rounded-[32px] border-border/60 bg-card/80 shadow-xl shadow-primary/10">
                  <CardContent className="space-y-6 p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Live signal desk
                        </p>
                        <p className="text-2xl font-semibold font-[var(--font-display)]">
                          Momentum flare
                        </p>
                      </div>
                      <Badge className="bg-emerald-500 text-white">+3.4%</Badge>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-muted/30 p-5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Today</span>
                        <span>AI confidence 94%</span>
                      </div>
                      <div className="mt-4 h-32 w-full rounded-xl bg-[linear-gradient(120deg,_hsl(var(--primary)/0.4),_transparent_60%)]" />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                        <p className="text-xs text-muted-foreground">
                          Risk overlay
                        </p>
                        <p className="text-lg font-semibold">Balanced</p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                        <p className="text-xs text-muted-foreground">
                          Alert velocity
                        </p>
                        <p className="text-lg font-semibold">12/min</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section id="features" className="mx-auto mt-20 max-w-6xl space-y-10">
            <div className="flex flex-col gap-3">
              <Badge variant="secondary" className="w-fit">
                Platform capabilities
              </Badge>
              <h2 className="text-3xl font-semibold font-[var(--font-display)]">
                Everything analysts need to operate in one secure layer.
              </h2>
              <p className="text-muted-foreground">
                Replace fragmented dashboards and manual spreadsheets with a
                unified AI signal stack that keeps your teams aligned.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden border-border/60 bg-card/70 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-4/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <CardContent className="relative space-y-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background shadow-sm">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Optimized for institutional teams
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section
            id="workflow"
            className="mx-auto mt-20 grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                Operating workflow
              </Badge>
              <h2 className="text-3xl font-semibold font-[var(--font-display)]">
                A disciplined workflow from market intake to action.
              </h2>
              <p className="text-muted-foreground">
                Build repeatable decision routines across research, trading, and
                risk. Every insight stays contextual, traceable, and ready to
                act on.
              </p>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-2xl border border-border/60 bg-card/70 p-5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      0{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-border/60 bg-gradient-to-br from-background via-muted/30 to-background p-6 shadow-xl">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Strategy cockpit</p>
                  <Badge variant="secondary">Live</Badge>
                </div>
                <div className="space-y-3">
                  {[
                    "Macro sentiment +0.48",
                    "Earnings drift detected",
                    "Risk heatmap recalibrated",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-sm"
                    >
                      <span>{item}</span>
                      <span className="text-xs text-muted-foreground">
                        Just now
                      </span>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                  <p className="text-xs text-muted-foreground">Focus list</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["NVDA", "MSFT", "AMZN", "TSLA", "PLTR"].map((symbol) => (
                      <Badge key={symbol} variant="outline">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="insights" className="mx-auto mt-20 max-w-6xl">
            <div className="rounded-[32px] border border-border/60 bg-gradient-to-r from-primary/10 via-transparent to-chart-2/20 p-8 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit">
                    Institutional signal vault
                  </Badge>
                  <h3 className="text-3xl font-semibold font-[var(--font-display)]">
                    Keep every signal contextual, explainable, and auditable.
                  </h3>
                  <p className="text-muted-foreground">
                    Move beyond black-box predictions with full traceability,
                    scenario overlays, and model lineage built in.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/register">Explore the platform</Link>
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    "Explainability layers",
                    "Model lineage tracking",
                    "Scenario stress tests",
                    "Regulatory-ready logs",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border/60 bg-background/80 p-4 text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto mt-20 max-w-6xl">
            <div className="flex flex-col items-center gap-5 rounded-[32px] border border-border/60 bg-card/70 px-8 py-12 text-center">
              <Badge variant="secondary">Ready to operate smarter?</Badge>
              <h3 className="text-3xl font-semibold font-[var(--font-display)]">
                Build your AI-powered trading command center.
              </h3>
              <p className="max-w-2xl text-muted-foreground">
                FinSightIQ pairs realtime analytics with governance-ready
                controls so every team can act with confidence.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link to="/register">Start your workspace</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">Talk to sales</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <footer className="border-t border-border/60 bg-background/80 px-6 py-10 text-sm text-muted-foreground md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-base font-semibold text-foreground">
              FinSightIQ
            </p>
            <p>AI Stock Prediction Platform</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link to="/login" className="hover:text-foreground">
              Sign in
            </Link>
            <Link to="/register" className="hover:text-foreground">
              Request access
            </Link>
            <Link to="/app/dashboard" className="hover:text-foreground">
              Live dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
