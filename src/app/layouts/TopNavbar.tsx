import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PanelLeftClose,
  PanelLeft,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { useLayoutStore } from "@/app/store/layoutStore";
import { MobileDrawer } from "./MobileDrawer";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { GlobalSearchDialog } from "@/shared/components/GlobalSearchDialog";
import { useAuthStore } from "@/features/auth/store/authStore";
import type { UserRole } from "@/features/auth/types/auth";

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "NVDA above $180.00",
    body: "Triggered at $182.44 · rule “NVDA breakout”",
    when: "12 minutes ago",
    tone: "text-up",
    route: "/app/alerts",
  },
  {
    id: "n2",
    title: "Core growth drawdown 4.1%",
    body: "Below the 4.0% threshold you set on 3 August.",
    when: "1 hour ago",
    tone: "text-down",
    route: "/app/portfolio",
  },
  {
    id: "n3",
    title: "ENSEMBLE forecast refreshed",
    body: "7-day horizon rebuilt for 6 tracked symbols.",
    when: "3 hours ago",
    tone: "text-foreground",
    route: "/app/predictions",
  },
];

export function TopNavbar() {
  const { isSidebarCollapsed, toggleSidebar } = useLayoutStore();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const setRole = useAuthStore((state) => state.setRole);
  const logout = useAuthStore((state) => state.logout);

  const currentRole = user?.role ?? "Analyst";
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName || "";
      if (
        e.key === "/" &&
        tag !== "INPUT" &&
        tag !== "TEXTAREA" &&
        tag !== "SELECT" &&
        !(e.target as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextRole = e.target.value as UserRole;
    setRole(nextRole);
    if (nextRole === "Viewer") {
      const blocked = [
        "/app/portfolio",
        "/app/predictions",
        "/app/alerts",
        "/app/admin",
      ];
      if (blocked.some((p) => location.pathname.startsWith(p))) {
        navigate("/app/dashboard");
      }
    } else if (
      nextRole === "Analyst" &&
      location.pathname.startsWith("/app/admin")
    ) {
      navigate("/app/dashboard");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between gap-4 border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <MobileDrawer />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden text-muted-foreground hover:bg-accent hover:text-foreground md:flex"
        >
          {isSidebarCollapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Search symbols, portfolios and pages"
          className="flex h-10 max-w-[280px] flex-1 items-center gap-2 rounded-md border border-border bg-muted/30 px-3 text-left font-body text-muted-foreground transition-colors hover:border-foreground hover:text-foreground cursor-pointer"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate text-sm">Search symbols</span>
          <span className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[11px]">
            /
          </span>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <ThemeToggle />

        <label className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="whitespace-nowrap">Role</span>
          <select
            value={currentRole}
            onChange={handleRoleChange}
            aria-label="Select role"
            className="h-9 rounded-md border border-border bg-card px-2 font-body text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="Viewer">Viewer</option>
            <option value="Analyst">Analyst</option>
            <option value="Administrator">Administrator</option>
          </select>
        </label>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-live opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-live" />
          </span>
          <span className="whitespace-nowrap">Live</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full border border-card bg-down" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[340px] border border-border bg-card p-0 shadow-xl overflow-hidden"
          >
            <div className="flex items-baseline justify-between gap-2 border-b border-border px-4 py-3">
              <span className="font-display text-sm font-semibold">
                Notifications
              </span>
              <span className="text-xs text-muted-foreground">3 unread</span>
            </div>
            <div className="flex flex-col">
              {NOTIFICATIONS.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => navigate(n.route)}
                  className="flex flex-col gap-1 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/30"
                >
                  <span className={`text-[13px] font-semibold ${n.tone}`}>
                    {n.title}
                  </span>
                  <span className="text-xs leading-snug text-muted-foreground">
                    {n.body}
                  </span>
                  <span className="text-[11px] tabular-nums text-muted-foreground">
                    {n.when}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => navigate("/app/alerts")}
              className="w-full px-4 py-3 text-center text-xs font-medium text-primary transition-colors hover:bg-muted/30 border-t border-border"
            >
              View all alerts
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="User menu"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-60 border border-border bg-card shadow-xl overflow-hidden"
            align="end"
            forceMount
          >
            <div className="flex flex-col gap-0.5 border-b border-border p-4">
              <span className="text-sm font-semibold">
                {user?.name ?? "Rachel Osei"}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.email ?? "rachel.osei@firm.com"}
              </span>
              <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {currentRole}
              </span>
            </div>
            <div className="p-1">
              <DropdownMenuItem
                onClick={() => navigate("/app/settings")}
                className="cursor-pointer py-2 text-sm"
              >
                <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                Account settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/app/settings")}
                className="cursor-pointer py-2 text-sm"
              >
                <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />
                Notification preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer py-2 text-sm text-destructive focus:text-destructive"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <LogOut className="mr-2.5 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <GlobalSearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  );
}
