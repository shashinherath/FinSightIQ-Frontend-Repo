import { NavLink } from "react-router-dom";
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
  const role = useAuthStore((state) => state.user?.role ?? "Administrator");

  const footerItems = NAVIGATION_FOOTER_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role),
  );

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-card transition-all duration-300",
        isSidebarCollapsed ? "w-[80px]" : "w-64",
      )}
    >
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary">
          <span className="text-sm font-bold text-primary-foreground">FQ</span>
        </span>
        {!isSidebarCollapsed && (
          <span className="ml-3 overflow-hidden whitespace-nowrap font-display text-lg font-bold tracking-tight transition-all">
            FinSight<span className="text-muted-foreground">IQ</span>
          </span>
        )}
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav aria-label="Primary" className="flex flex-col gap-1 px-3">
          {NAVIGATION_ITEMS.map((item) => (
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
