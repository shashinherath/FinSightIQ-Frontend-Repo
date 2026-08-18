import {
  LayoutDashboard,
  LineChart,
  Brain,
  Briefcase,
  Bell,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  /** Only render this item for these roles. Omit to show for everyone. */
  roles?: Array<"Viewer" | "Analyst" | "Administrator">;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Markets",
    href: "/app/market",
    icon: LineChart,
  },
  {
    name: "Predictions",
    href: "/app/predictions",
    icon: Brain,
  },
  {
    name: "Portfolio",
    href: "/app/portfolio",
    icon: Briefcase,
  },
  {
    name: "Alerts",
    href: "/app/alerts",
    icon: Bell,
  },
];

export const NAVIGATION_FOOTER_ITEMS: NavItem[] = [
  {
    name: "Settings",
    href: "/app/settings",
    icon: Settings,
  },
  {
    name: "Admin",
    href: "/app/admin",
    icon: ShieldCheck,
    roles: ["Administrator"],
  },
];
