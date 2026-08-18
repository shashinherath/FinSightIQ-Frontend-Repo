import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { LoaderCircle, LogOut, Monitor, Smartphone } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { FeaturePageShell } from "@/shared/components/FeaturePageShell";
import { useAuthStore } from "@/features/auth/store/authStore";
import { cn } from "@/shared/utils/cn";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Enter your current password"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

interface SessionRow {
  id: string;
  device: string;
  meta: string;
  current: boolean;
  icon: typeof Monitor;
}

const INITIAL_SESSIONS: SessionRow[] = [
  {
    id: "session-1",
    device: "Chrome · macOS",
    meta: "London · signed in 17 Aug 08:12 UTC",
    current: true,
    icon: Monitor,
  },
  {
    id: "session-2",
    device: "Safari · iPhone",
    meta: "London · last active 15 Aug 19:40 UTC",
    current: false,
    icon: Smartphone,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sessions, setSessions] = useState<SessionRow[]>(INITIAL_SESSIONS);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async () => {
    setPasswordSuccess(false);
    await Promise.resolve();
    setPasswordSuccess(true);
    reset();
  };

  const handleRevoke = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
  };

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <FeaturePageShell
      title="Settings"
      description="Your profile, sign-in security and session controls."
    >
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4 pt-6">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-base font-medium">
                {user ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="text-base font-semibold">
                {user?.name ?? "Signed-out user"}
              </span>
              <span className="text-sm text-muted-foreground">
                {user?.email ?? "No email on record"}
              </span>
            </div>
            {user && (
              <Badge variant="outline" className="ml-auto uppercase">
                {user.role}
              </Badge>
            )}
          </CardContent>
        </Card>

        <div className="flex max-w-2xl flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Change password</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="pw-current">Current password</Label>
                  <PasswordInput
                    id="pw-current"
                    autoComplete="current-password"
                    hasError={Boolean(errors.currentPassword?.message)}
                    aria-invalid={Boolean(errors.currentPassword?.message)}
                    {...register("currentPassword")}
                  />
                  {errors.currentPassword?.message && (
                    <p className="text-xs text-destructive">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="pw-new">New password</Label>
                  <PasswordInput
                    id="pw-new"
                    autoComplete="new-password"
                    hasError={Boolean(errors.newPassword?.message)}
                    aria-invalid={Boolean(errors.newPassword?.message)}
                    {...register("newPassword")}
                  />
                  {errors.newPassword?.message && (
                    <p className="text-xs text-destructive">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {passwordSuccess && (
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Password updated.
                  </p>
                )}

                <div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="overflow-hidden py-0">
            <div className="border-b bg-muted/30 px-6 py-4">
              <h2 className="text-base font-semibold">Active sessions</h2>
              <p className="text-xs text-muted-foreground">
                Refresh tokens rotate every 15 minutes
              </p>
            </div>
            <div>
              {sessions.map((session) => {
                const Icon = session.icon;
                return (
                  <div
                    key={session.id}
                    className={cn(
                      "flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4 last:border-b-0",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">
                          {session.device}
                        </span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {session.meta}
                        </span>
                      </div>
                    </div>
                    {session.current ? (
                      <Badge variant="outline">This device</Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevoke(session.id)}
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="px-6 py-4 text-xs leading-relaxed text-muted-foreground">
              If a refresh token is reused, every session is revoked and you are
              signed out with a security notice rather than a generic
              session-expired message.
            </p>
          </Card>

          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div>
                <h2 className="text-base font-semibold">Sign out</h2>
                <CardDescription className="text-xs">
                  Ends this session on this device only.
                </CardDescription>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </FeaturePageShell>
  );
}
