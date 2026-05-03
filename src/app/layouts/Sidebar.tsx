import { NavLink } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import { useLayoutStore } from "@/app/store/layoutStore";
import { NAVIGATION_ITEMS } from "@/app/config/navigation";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Activity } from "lucide-react";

export function Sidebar() {
  const { isSidebarCollapsed } = useLayoutStore();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-card transition-all duration-300",
        isSidebarCollapsed ? "w-[80px]" : "w-64",
      )}
    >
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <Activity className="h-6 w-6 shrink-0 text-primary" />
        {!isSidebarCollapsed && (
          <span className="ml-3 overflow-hidden whitespace-nowrap text-lg font-bold tracking-tight transition-all">
            FinSight<span className="text-primary">IQ</span>
          </span>
        )}
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-3">
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                  isSidebarCollapsed && "justify-center px-0",
                )
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
