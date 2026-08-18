import { Navigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { useAuthStore } from "@/features/auth/store/authStore";

export function AdminPage() {
  const role = useAuthStore((state) => state.user?.role ?? "Viewer");

  if (role !== "Administrator") {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <FeaturePageShell
      title="Admin"
      description="Manage users, roles, and registered models."
    >
      <EmptyState
        title="Admin console not connected yet"
        description="User management and model registry will appear here."
        icon={<ShieldCheck className="h-5 w-5" />}
      />
    </FeaturePageShell>
  );
}
