import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

interface ProtectedRouteProps {
  redirectTo?: string;
}

export function ProtectedRoute({
  redirectTo = "/app/dashboard",
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
