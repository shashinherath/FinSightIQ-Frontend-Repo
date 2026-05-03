import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import { AppLayout } from "@/app/layouts/AppLayout";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { withSuspense } from "@/app/router/Loadable";

const LoginPage = withSuspense(
  lazy(() =>
    import("@/features/auth/pages/LoginPage").then((module) => ({
      default: module.LoginPage,
    })),
  ),
);
const LandingPage = withSuspense(
  lazy(() =>
    import("@/features/landing/pages/LandingPage").then((module) => ({
      default: module.LandingPage,
    })),
  ),
);
const RegisterPage = withSuspense(
  lazy(() =>
    import("@/features/auth/pages/RegisterPage").then((module) => ({
      default: module.RegisterPage,
    })),
  ),
);
const DashboardPage = withSuspense(
  lazy(() =>
    import("@/features/dashboard/pages/DashboardPage").then((module) => ({
      default: module.DashboardPage,
    })),
  ),
);
const MarketPage = withSuspense(
  lazy(() =>
    import("@/features/market/pages/MarketPage").then((module) => ({
      default: module.MarketPage,
    })),
  ),
);
const PredictionsPage = withSuspense(
  lazy(() =>
    import("@/features/predictions/pages/PredictionsPage").then((module) => ({
      default: module.PredictionsPage,
    })),
  ),
);
const PortfolioPage = withSuspense(
  lazy(() =>
    import("@/features/portfolio/pages/PortfolioPage").then((module) => ({
      default: module.PortfolioPage,
    })),
  ),
);
const SentimentPage = withSuspense(
  lazy(() =>
    import("@/features/sentiment/pages/SentimentPage").then((module) => ({
      default: module.SentimentPage,
    })),
  ),
);
const AlertsPage = withSuspense(
  lazy(() =>
    import("@/features/alerts/pages/AlertsPage").then((module) => ({
      default: module.AlertsPage,
    })),
  ),
);
const SettingsPage = withSuspense(
  lazy(() =>
    import("@/features/settings/pages/SettingsPage").then((module) => ({
      default: module.SettingsPage,
    })),
  ),
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "market",
        element: <MarketPage />,
      },
      {
        path: "predictions",
        element: <PredictionsPage />,
      },
      {
        path: "portfolio",
        element: <PortfolioPage />,
      },
      {
        path: "sentiment",
        element: <SentimentPage />,
      },
      {
        path: "alerts",
        element: <AlertsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
