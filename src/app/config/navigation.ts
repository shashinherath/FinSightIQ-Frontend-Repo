import {
  LayoutDashboard,
  LineChart,
  Briefcase,
  TrendingUp,
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
    roles: ["Viewer", "Analyst", "Administrator"],
  },
  {
    name: "Markets",
    href: "/app/market",
    icon: LineChart,
    roles: ["Viewer", "Analyst", "Administrator"],
  },
  {
    name: "Portfolios",
    href: "/app/portfolio",
    icon: Briefcase,
    roles: ["Analyst", "Administrator"],
  },
  {
    name: "Predictions",
    href: "/app/predictions",
    icon: TrendingUp,
    roles: ["Analyst", "Administrator"],
  },
  {
    name: "Alerts",
    href: "/app/alerts",
    icon: Bell,
    roles: ["Analyst", "Administrator"],
  },
];

export const NAVIGATION_FOOTER_ITEMS: NavItem[] = [
  {
    name: "Settings",
    href: "/app/settings",
    icon: Settings,
    roles: ["Viewer", "Analyst", "Administrator"],
  },
  {
    name: "Admin",
    href: "/app/admin",
    icon: ShieldCheck,
    roles: ["Administrator"],
  },
];
