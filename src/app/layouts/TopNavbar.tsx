import { useNavigate } from "react-router-dom";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { useAuthStore } from "@/features/auth/store/authStore";

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "NVDA prediction resolved",
    body: "7-day forecast landed within the confidence band.",
    when: "12m ago",
    tone: "text-up",
  },
  {
    id: "n2",
    title: "Alert triggered: AAPL",
    body: "Price crossed above your $232.00 threshold.",
    when: "1h ago",
    tone: "text-hold",
  },
  {
    id: "n3",
    title: "Model retrained",
    body: "Ensemble model v4.2 is now live for all symbols.",
    when: "3h ago",
    tone: "text-foreground",
  },
];

export function TopNavbar() {
  const { isSidebarCollapsed, toggleSidebar } = useLayoutStore();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const initials = (user?.name ?? "Guest User")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex w-full shrink-0 items-center justify-between gap-4 border-b bg-background/95 px-4 h-16 backdrop-blur md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <MobileDrawer />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden text-muted-foreground hover:text-foreground md:flex"
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
          onClick={() => navigate("/app/market/search")}
          aria-label="Search symbols"
          className="flex h-10 max-w-[280px] flex-1 items-center gap-2 rounded-md border bg-muted/30 px-3 text-left text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate text-sm">Search symbols</span>
          <span className="hidden shrink-0 rounded border px-1.5 py-0.5 font-mono text-[11px] sm:inline">
            /
          </span>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />

        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
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
              className="relative text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-card bg-down" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[340px] border border-border bg-card p-0 shadow-xl ring-1 ring-border/60 backdrop-blur-none"
          >
            <div className="flex items-baseline justify-between gap-2 border-b px-4 py-3">
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
                  onClick={() => navigate("/app/alerts")}
                  className="flex flex-col gap-0.5 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/30"
                >
                  <span className={`text-sm font-semibold ${n.tone}`}>
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
              className="w-full px-4 py-3 text-left text-sm font-medium text-primary transition-colors hover:bg-muted/30"
            >
              View all alerts
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.name ?? "User"} />
                <AvatarFallback>
                  {user ? initials : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 border border-border bg-card shadow-xl ring-1 ring-border/60 backdrop-blur-none"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name ?? "Guest"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email ?? "signed out"}
                </p>
                <p className="pt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {user?.role ?? "Viewer"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/app/settings")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/app/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
