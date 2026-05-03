import {
  LayoutDashboard,
  LineChart,
  TrendingUp,
  Briefcase,
  MessageSquare,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Market",
    href: "/app/market",
    icon: LineChart,
  },
  {
    name: "Predictions",
    href: "/app/predictions",
    icon: TrendingUp,
  },
  {
    name: "Portfolio",
    href: "/app/portfolio",
    icon: Briefcase,
  },
  {
    name: "Sentiment",
    href: "/app/sentiment",
    icon: MessageSquare,
  },
  {
    name: "Alerts",
    href: "/app/alerts",
    icon: Bell,
  },
  {
    name: "Settings",
    href: "/app/settings",
    icon: Settings,
  },
];
