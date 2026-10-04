import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Briefcase,
  LayoutDashboard,
  LineChart,
  Brain,
  MessageSquare,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

interface SearchItem {
  id: string;
  name: string;
  meta: string;
  icon: LucideIcon;
  value?: string;
  tone?: string;
  route: string;
}

interface SearchGroup {
  label: string;
  items: SearchItem[];
}

interface GlobalSearchDialogProps {
  open: boolean;
  onClose: () => void;
}

const RAW_SYMBOLS = [
  { sym: "NVDA", name: "NVIDIA Corp", price: "182.44", chg: 1.59 },
  { sym: "AAPL", name: "Apple Inc.", price: "231.18", chg: 1.04 },
  { sym: "MSFT", name: "Microsoft Corp", price: "517.60", chg: -0.62 },
  { sym: "AMZN", name: "Amazon.com Inc.", price: "228.75", chg: 0.41 },
  { sym: "JPM", name: "JPMorgan Chase", price: "296.12", chg: -0.18 },
  { sym: "TSLA", name: "Tesla Inc.", price: "341.20", chg: 0 },
];

const RAW_PORTFOLIOS = [
  {
    name: "Core growth",
    meta: "USD · 4 holdings · opened 3 Feb 2026",
    value: "$81,446.40",
    route: "/app/portfolio",
  },
  {
    name: "Income sleeve",
    meta: "USD · 3 holdings · opened 21 Apr 2026",
    value: "$22,472.25",
    route: "/app/portfolio",
  },
];

const RAW_PAGES = [
  {
    name: "Dashboard",
    meta: "Your tracked symbols and open alerts",
    icon: LayoutDashboard,
    route: "/app/dashboard",
  },
  {
    name: "Markets",
    meta: "Live prices across global exchanges",
    icon: LineChart,
    route: "/app/market",
  },
  {
    name: "Predictions",
    meta: "Model forecasts and accuracy",
    icon: Brain,
    route: "/app/predictions",
  },
  {
    name: "Portfolios",
    meta: "Holdings, value and profit and loss",
    icon: Briefcase,
    route: "/app/portfolio",
  },
  {
    name: "Sentiment",
    meta: "News and social mood by symbol",
    icon: MessageSquare,
    route: "/app/market",
  },
  {
    name: "Alerts",
    meta: "Rules and trigger history",
    icon: Bell,
    route: "/app/alerts",
  },
  {
    name: "Settings",
    meta: "Profile, password and notifications",
    icon: Settings,
    route: "/app/settings",
  },
];

export function GlobalSearchDialog({ open, onClose }: GlobalSearchDialogProps) {
  if (!open || typeof document === "undefined") return null;

  return <GlobalSearchModalContent onClose={onClose} />;
}

function GlobalSearchModalContent({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.user?.role ?? "Analyst");

  useEffect(() => {
    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const searchGroups: SearchGroup[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const hit = (name: string, meta: string) =>
      !q || (name + " " + meta).toLowerCase().includes(q);

    // Symbols
    const symbols: SearchItem[] = RAW_SYMBOLS.map((s) => ({
      id: `sym-${s.sym}`,
      name: s.sym,
      meta: s.name,
      icon: s.chg >= 0 ? TrendingUp : TrendingDown,
      value: "$" + s.price,
      tone: s.chg >= 0 ? "text-[#10b981]" : "text-[hsl(var(--destructive))]",
      route: `/app/market/stock/${s.sym}`,
    })).filter((item) => hit(item.name, item.meta));

    // Portfolios (hidden for Viewer)
    const portfolios: SearchItem[] =
      role === "Viewer"
        ? []
        : RAW_PORTFOLIOS.map((p) => ({
            id: `port-${p.name}`,
            name: p.name,
            meta: p.meta,
            icon: Briefcase,
            value: p.value,
            tone: "text-foreground",
            route: p.route,
          })).filter((item) => hit(item.name, item.meta));

    // Pages
    const pages: SearchItem[] = RAW_PAGES.filter(
      (p) =>
        role !== "Viewer" ||
        ["/app/dashboard", "/app/market", "/app/settings"].includes(p.route),
    )
      .map((p) => ({
        id: `page-${p.name}`,
        name: p.name,
        meta: p.meta,
        icon: p.icon,
        route: p.route,
      }))
      .filter((item) => hit(item.name, item.meta));

    const groups: SearchGroup[] = [];
    if (symbols.length > 0) groups.push({ label: "Symbols", items: symbols });
    if (portfolios.length > 0)
      groups.push({ label: "Portfolios", items: portfolios });
    if (pages.length > 0) groups.push({ label: "Pages", items: pages });

    return groups;
  }, [query, role]);

  if (typeof document === "undefined") return null;

  const handleSelect = (route: string) => {
    onClose();
    navigate(route);
  };

  const isEmpty = searchGroups.length === 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex justify-center p-6 pt-24"
      role="presentation"
    >
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/80 transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search symbols, portfolios and pages"
        className="relative flex max-h-[calc(100vh-140px)] w-full max-w-[560px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top search input row */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border px-4 text-muted-foreground">
          <Search className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbols, portfolios and pages"
            className="flex-1 min-w-0 border-none bg-transparent font-body text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 rounded border border-border bg-transparent px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted/50 cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto p-2">
          {searchGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5 py-1.5">
              <span className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.route)}
                    className="flex min-h-[44px] w-full items-center gap-3 rounded-lg border-0 bg-transparent p-2.5 text-left font-body transition-colors hover:bg-muted/40 cursor-pointer"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-sm font-medium text-foreground">
                        {item.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {item.meta}
                      </span>
                    </span>
                    {item.value && (
                      <span
                        className={`shrink-0 font-display text-[13px] font-medium tabular-nums ${item.tone ?? ""}`}
                      >
                        {item.value}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {isEmpty && (
            <div className="flex flex-col items-center gap-1.5 px-4 py-10 text-center">
              <span className="text-sm font-semibold text-foreground">
                No matches for &ldquo;{query}&rdquo;
              </span>
              <span className="text-[13px] text-muted-foreground">
                Try a ticker such as NVDA, or a page name.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
