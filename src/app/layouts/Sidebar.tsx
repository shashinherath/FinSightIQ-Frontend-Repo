import { NavLink } from "react-router-dom";
import { Activity } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useLayoutStore } from "@/app/store/layoutStore";
import {
  NAVIGATION_ITEMS,
  NAVIGATION_FOOTER_ITEMS,
} from "@/app/config/navigation";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useAuthStore } from "@/features/auth/store/authStore";

const navLinkClass = (isActive: boolean, collapsed: boolean) =>
  cn(
    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
    collapsed && "justify-center px-0",
  );

export function Sidebar() {
  const { isSidebarCollapsed } = useLayoutStore();
  const role = useAuthStore((state) => state.user?.role ?? "Analyst");

  const mainItems = NAVIGATION_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role),
  );

  const footerItems = NAVIGATION_FOOTER_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role),
  );

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-card transition-all duration-300",
        isSidebarCollapsed ? "w-[80px]" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border",
          isSidebarCollapsed ? "justify-center px-0" : "px-6 gap-3",
        )}
      >
        <Activity className="h-6 w-6 shrink-0 text-primary" />
        {!isSidebarCollapsed && (
          <span className="whitespace-nowrap font-display text-lg font-bold tracking-tight">
            FinSight<span className="text-muted-foreground">IQ</span>
          </span>
        )}
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav aria-label="Primary" className="flex flex-col gap-1 px-3">
          {mainItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                navLinkClass(isActive, isSidebarCollapsed)
              }
              title={isSidebarCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isSidebarCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </NavLink>
          ))}

          <div className="mx-1 my-3 h-px bg-border" />

          {footerItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                navLinkClass(isActive, isSidebarCollapsed)
              }
              title={isSidebarCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isSidebarCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
