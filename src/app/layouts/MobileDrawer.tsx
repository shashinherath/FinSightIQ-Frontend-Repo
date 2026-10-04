import { NavLink } from "react-router-dom";
import { Menu, Activity } from "lucide-react";
import {
  NAVIGATION_ITEMS,
  NAVIGATION_FOOTER_ITEMS,
} from "@/app/config/navigation";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { useState } from "react";
import { cn } from "@/shared/utils/cn";
import { useAuthStore } from "@/features/auth/store/authStore";

export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const role = useAuthStore((state) => state.user?.role ?? "Analyst");
  const mainItems = NAVIGATION_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role),
  );
  const footerItems = NAVIGATION_FOOTER_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role),
  );

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
    );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-[280px] flex-col p-0">
        <SheetHeader className="flex h-16 flex-row items-center gap-3 space-y-0 border-b border-border px-6 text-left">
          <Activity className="h-6 w-6 shrink-0 text-primary" />
          <SheetTitle className="m-0 font-display text-lg font-bold">
            FinSight<span className="text-muted-foreground">IQ</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 overflow-y-auto p-4">
          {mainItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
          <div className="my-2 h-px bg-border" />
          {footerItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
