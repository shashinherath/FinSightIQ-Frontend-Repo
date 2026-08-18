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
const ForgotPasswordPage = withSuspense(
  lazy(() =>
    import("@/features/auth/pages/ForgotPasswordPage").then((module) => ({
      default: module.ForgotPasswordPage,
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
const MarketOverviewPage = withSuspense(
  lazy(() =>
    import("@/features/market/pages").then((module) => ({
      default: module.MarketOverviewPage,
    })),
  ),
);
const StockDetailsPage = withSuspense(
  lazy(() =>
    import("@/features/market/pages").then((module) => ({
      default: module.StockDetailsPage,
    })),
  ),
);
const MarketSearchPage = withSuspense(
  lazy(() =>
    import("@/features/market/pages").then((module) => ({
      default: module.MarketSearchPage,
    })),
  ),
);
const PredictionsDashboardPage = withSuspense(
  lazy(() =>
    import("@/features/predictions/pages").then((module) => ({
      default: module.PredictionsDashboardPage,
    })),
  ),
);
const PredictionHistoryPage = withSuspense(
  lazy(() =>
    import("@/features/predictions/pages").then((module) => ({
      default: module.PredictionHistoryPage,
    })),
  ),
);
const ModelAnalyticsPage = withSuspense(
  lazy(() =>
    import("@/features/predictions/pages").then((module) => ({
      default: module.ModelAnalyticsPage,
    })),
  ),
);
const PredictionDetailsPage = withSuspense(
  lazy(() =>
    import("@/features/predictions/pages").then((module) => ({
      default: module.PredictionDetailsPage,
    })),
  ),
);
const PortfolioListPage = withSuspense(
  lazy(() =>
    import("@/features/portfolio/pages").then((module) => ({
      default: module.PortfolioListPage,
    })),
  ),
);
const PortfolioDetailPage = withSuspense(
  lazy(() =>
    import("@/features/portfolio/pages").then((module) => ({
      default: module.PortfolioDetailPage,
    })),
  ),
);
const HoldingDetailPage = withSuspense(
  lazy(() =>
    import("@/features/portfolio/pages").then((module) => ({
      default: module.HoldingDetailPage,
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
const AdminPage = withSuspense(
  lazy(() =>
    import("@/features/admin/pages/AdminPage").then((module) => ({
      default: module.AdminPage,
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
        children: [
          {
            index: true,
            element: <MarketOverviewPage />,
          },
          {
            path: "search",
            element: <MarketSearchPage />,
          },
          {
            path: "stock/:symbol",
            element: <StockDetailsPage />,
          },
        ],
      },
      {
        path: "predictions",
        children: [
          {
            index: true,
            element: <PredictionsDashboardPage />,
          },
          {
            path: "history",
            element: <PredictionHistoryPage />,
          },
          {
            path: "models",
            element: <ModelAnalyticsPage />,
          },
          {
            path: ":predictionId",
            element: <PredictionDetailsPage />,
          },
        ],
      },
      {
        path: "portfolio",
        children: [
          {
            index: true,
            element: <PortfolioListPage />,
          },
          {
            path: ":portfolioId",
            element: <PortfolioDetailPage />,
          },
          {
            path: ":portfolioId/holdings/:symbol",
            element: <HoldingDetailPage />,
          },
        ],
      },
      {
        path: "alerts",
        element: <AlertsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
