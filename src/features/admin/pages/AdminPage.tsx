import { useState } from "react";
import { Navigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { cn } from "@/shared/utils/cn";
import {
  ADMIN_MODELS,
  ADMIN_USERS,
  type AdminModel,
  type AdminTone,
  type AdminUser,
  type AdminUserRole,
} from "@/features/admin/mocks";

const ROLE_OPTIONS: AdminUserRole[] = ["Viewer", "Analyst", "Administrator"];

const toneClasses: Record<AdminTone, string> = {
  ok: "border-transparent bg-up/10 text-up-strong",
  warn: "border-transparent bg-hold/10 text-hold-strong",
  off: "border-transparent bg-muted text-muted-foreground",
};

function StatusBadge({
  tone,
  children,
}: {
  tone: AdminTone;
  children: string;
}) {
  return (
    <Badge variant="outline" className={cn("font-medium", toneClasses[tone])}>
      {children}
    </Badge>
  );
}

function nextUserAction(user: AdminUser): {
  status: AdminUser["status"];
  tone: AdminTone;
  action: string;
} {
  if (user.status === "Deactivated") {
    return { status: "Active", tone: "ok", action: "Deactivate" };
  }
  if (user.status === "Pending invite") {
    // Resending an invite doesn't change status.
    return { status: user.status, tone: user.tone, action: user.action };
  }
  return { status: "Deactivated", tone: "off", action: "Restore" };
}

function nextModelAction(model: AdminModel): {
  status: AdminModel["status"];
  tone: AdminTone;
  action: string;
} {
  if (model.status === "RETIRED") {
    // Inspecting a retired model is a no-op for this prototype.
    return { status: model.status, tone: model.tone, action: model.action };
  }
  return { status: "RETIRED", tone: "off", action: "Inspect" };
}

export function AdminPage() {
  const role = useAuthStore((state) => state.user?.role ?? "Viewer");
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS);
  const [models, setModels] = useState<AdminModel[]>(ADMIN_MODELS);

  if (role !== "Administrator") {
    return <Navigate to="/app/dashboard" replace />;
  }

  const pendingCount = users.filter(
    (u) => u.status === "Pending invite",
  ).length;

  function handleRoleChange(email: string, nextRole: AdminUserRole) {
    setUsers((prev) =>
      prev.map((u) => (u.email === email ? { ...u, role: nextRole } : u)),
    );
  }

  function handleUserAction(email: string) {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.email !== email) return u;
        const { status, tone, action } = nextUserAction(u);
        return { ...u, status, tone, action };
      }),
    );
  }

  function handleModelAction(family: string, version: string) {
    setModels((prev) =>
      prev.map((m) => {
        if (m.family !== family || m.version !== version) return m;
        const { status, tone, action } = nextModelAction(m);
        return { ...m, status, tone, action };
      }),
    );
  }

  return (
    <FeaturePageShell
      title="Admin"
      description="Accounts and registered model versions."
      action={
        <Badge variant="outline" className="gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          ADMINISTRATOR
        </Badge>
      }
    >
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="models">Registered models</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-3">
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3">
              <div>
                <h2 className="text-base font-semibold">Users</h2>
                <p className="text-xs text-muted-foreground">
                  Role changes take effect on the user&apos;s next request
                </p>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {users.length} accounts · {pendingCount} pending
              </span>
            </div>
            <div className="overflow-x-auto">
              <Table className="min-w-[880px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last seen</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.email}>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">{u.name}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {u.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <select
                          aria-label={`Role for ${u.name}`}
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(
                              u.email,
                              e.target.value as AdminUserRole,
                            )
                          }
                          className="h-9 w-full rounded-md border border-input bg-background px-2 text-xs"
                        >
                          {ROLE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={u.tone}>{u.status}</StatusBadge>
                      </TableCell>
                      <TableCell className="text-sm tabular-nums text-muted-foreground">
                        {u.seen}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUserAction(u.email)}
                        >
                          {u.action}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Accounts are deactivated, never deleted — portfolios and prediction
            history stay attached to their owner for audit.
          </p>
        </TabsContent>

        <TabsContent value="models" className="space-y-3">
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3">
              <div>
                <h2 className="text-base font-semibold">Registered models</h2>
                <p className="text-xs text-muted-foreground">
                  One version is active per model family
                </p>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                retraining nightly at 02:00 UTC
              </span>
            </div>
            <div className="overflow-x-auto">
              <Table className="min-w-[920px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Family</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Trained</TableHead>
                    <TableHead className="text-right">MAPE</TableHead>
                    <TableHead className="text-right">Sample</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((m) => (
                    <TableRow key={`${m.family}-${m.version}`}>
                      <TableCell className="font-mono text-sm font-semibold">
                        {m.family}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {m.version}
                      </TableCell>
                      <TableCell className="text-sm tabular-nums text-muted-foreground">
                        {m.trained}
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums">
                        {m.mape}
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                        {m.n}
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={m.tone}>{m.status}</StatusBadge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleModelAction(m.family, m.version)}
                        >
                          {m.action}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Retired versions stay queryable: every stored forecast names the
            version that produced it, so old predictions remain explainable.
          </p>
        </TabsContent>
      </Tabs>
    </FeaturePageShell>
  );
}
