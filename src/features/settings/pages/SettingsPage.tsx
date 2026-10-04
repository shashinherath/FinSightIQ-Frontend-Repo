import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { PasswordStrength } from "@/features/auth/components/PasswordStrength";
import { useAuthStore } from "@/features/auth/store/authStore";
import { cn } from "@/shared/utils/cn";

type SettingsTab = "profile" | "security" | "notify";

interface SessionItem {
  id: string;
  device: string;
  meta: string;
  current: boolean;
}

const INITIAL_SESSIONS: SessionItem[] = [
  {
    id: "sess-1",
    device: "Chrome · macOS",
    meta: "London · signed in 17 Aug 08:12 UTC",
    current: true,
  },
  {
    id: "sess-2",
    device: "Safari · iPhone",
    meta: "London · last active 15 Aug 19:40 UTC",
    current: false,
  },
];

export function SettingsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuthStore();

  const tabParam = searchParams.get("tab");
  const activeTab: SettingsTab =
    tabParam === "security"
      ? "security"
      : tabParam === "notify" || tabParam === "notifications"
        ? "notify"
        : "profile";

  const setActiveTab = (tab: SettingsTab) => {
    setSearchParams({ tab });
  };

  // Profile tab state
  const [fullName, setFullName] = useState(user?.name ?? "Rachel Osei");
  const [timeZone, setTimeZone] = useState("UTC");

  // Security tab state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sessions, setSessions] = useState<SessionItem[]>(INITIAL_SESSIONS);

  // Notification tab state
  const [alertEmails, setAlertEmails] = useState(true);
  const [degradedNotices, setDegradedNotices] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [digestFreq, setDigestFreq] = useState("Weekly, Monday 08:00");
  const [quietHours, setQuietHours] = useState("22:00 – 07:00 local");

  const handleSaveProfile = () => {
    toast.success("Settings saved", {
      description: "Changes apply on your next request.",
    });
  };

  const handleDiscardProfile = () => {
    setFullName(user?.name ?? "Rachel Osei");
    setTimeZone("UTC");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    toast.success("Password updated", {
      description: "Use your new password on your next sign in.",
    });
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleRevokeSession = (session: SessionItem) => {
    setSessions((prev) => prev.filter((s) => s.id !== session.id));
    toast.success("Session revoked", {
      description: `${session.device} was signed out.`,
    });
  };

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const roleText = (user?.role ?? "Analyst").toUpperCase();

  return (
    <section className="flex flex-col gap-5 pb-14 font-body">
      {/* Title & subtitle matching prototype */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Your profile, sign-in security and notification preferences.
          </p>
        </div>
      </div>

      {/* Pill tabs matching prototype Image */}
      <div className="flex w-fit items-center gap-1 rounded-lg border border-border bg-card p-1">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={cn(
            "rounded-md px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
            activeTab === "profile"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
          )}
        >
          Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={cn(
            "rounded-md px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
            activeTab === "security"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
          )}
        >
          Security
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("notify")}
          className={cn(
            "rounded-md px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
            activeTab === "notify"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
          )}
        >
          Notifications
        </button>
      </div>

      {/* ======================= TAB: PROFILE ======================= */}
      {activeTab === "profile" && (
        <div className="flex max-w-[640px] flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <Label htmlFor="set-name">Full name</Label>
            <Input
              id="set-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="set-email">Email</Label>
            <Input
              id="set-email"
              value={user?.email ?? "rachel.osei@firm.com"}
              disabled
              className="h-10 opacity-75"
            />
            <span className="text-xs text-muted-foreground">
              Email changes go through an administrator so audit history stays
              intact.
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-1 min-w-[200px] flex-col gap-2">
              <Label htmlFor="set-tz">Time zone</Label>
              <select
                id="set-tz"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="UTC">UTC</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Singapore">Asia/Singapore</option>
              </select>
            </div>

            <div className="flex flex-1 min-w-[200px] flex-col gap-2">
              <span className="text-sm font-medium text-foreground">Role</span>
              <div className="flex h-10 items-center gap-2.5">
                <Badge
                  variant="outline"
                  className="font-semibold text-xs tracking-wider"
                >
                  {roleText}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  granted 14 March 2026
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              onClick={handleSaveProfile}
              className="cursor-pointer"
            >
              Save changes
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleDiscardProfile}
              className="cursor-pointer"
            >
              Discard
            </Button>
          </div>
        </div>
      )}

      {/* ======================= TAB: SECURITY ======================= */}
      {activeTab === "security" && (
        <div className="flex max-w-[640px] flex-col gap-4">
          {/* Change password card */}
          <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">
              Change password
            </h2>

            <form
              onSubmit={handleUpdatePassword}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="pw-current">Current password</Label>
                <PasswordInput
                  id="pw-current"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="pw-new">New password</Label>
                <PasswordInput
                  id="pw-new"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <PasswordStrength password={newPassword} />
              </div>

              <div className="pt-1">
                <Button type="submit" className="cursor-pointer">
                  Update password
                </Button>
              </div>
            </form>
          </div>

          {/* Active sessions card */}
          <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            <div className="border-b border-border bg-muted/30 px-4 py-3">
              <h2 className="text-base font-semibold text-foreground">
                Active sessions
              </h2>
              <p className="text-xs text-muted-foreground">
                Refresh tokens rotate every 15 minutes
              </p>
            </div>

            <div className="divide-y divide-border">
              {sessions.map((s) => {
                const isPhone = s.device.toLowerCase().includes("iphone");
                const Icon = isPhone ? Smartphone : Monitor;
                return (
                  <div
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-foreground">
                          {s.device}
                        </span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {s.meta}
                        </span>
                      </div>
                    </div>

                    {s.current ? (
                      <Badge variant="outline" className="text-xs">
                        This device
                      </Badge>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeSession(s)}
                        className="cursor-pointer"
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="border-t border-border p-4 text-xs leading-relaxed text-muted-foreground">
              If a refresh token is reused, every session is revoked and you are
              signed out with a security notice rather than a generic
              session-expired message.
            </p>
          </div>

          {/* Sign out card */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Sign out
              </h2>
              <p className="text-xs text-muted-foreground">
                Ends this session on this device only.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleSignOut}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      )}

      {/* ======================= TAB: NOTIFICATIONS ======================= */}
      {activeTab === "notify" && (
        <div className="flex max-w-[640px] flex-col gap-4">
          <div className="rounded-xl border border-border bg-card px-6 py-2 shadow-sm">
            <label className="flex cursor-pointer items-start justify-between gap-4 border-b border-border py-4">
              <span className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">
                  Alert emails
                </span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  One email per triggered rule, at most one per hour.
                </span>
              </span>
              <Checkbox
                checked={alertEmails}
                onCheckedChange={(checked) => setAlertEmails(Boolean(checked))}
                className="mt-1"
              />
            </label>

            <label className="flex cursor-pointer items-start justify-between gap-4 border-b border-border py-4">
              <span className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">
                  Degraded model notices
                </span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Tells you when a forecast ran on partial inputs.
                </span>
              </span>
              <Checkbox
                checked={degradedNotices}
                onCheckedChange={(checked) =>
                  setDegradedNotices(Boolean(checked))
                }
                className="mt-1"
              />
            </label>

            <label className="flex cursor-pointer items-start justify-between gap-4 border-b border-border py-4">
              <span className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">
                  Weekly portfolio digest
                </span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Holdings performance and allocation changes every Monday.
                </span>
              </span>
              <Checkbox
                checked={weeklyDigest}
                onCheckedChange={(checked) => setWeeklyDigest(Boolean(checked))}
                className="mt-1"
              />
            </label>

            <label className="flex cursor-pointer items-start justify-between gap-4 py-4">
              <span className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">
                  System maintenance alerts
                </span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Advance notice of scheduled downtime and data feed upgrades.
                </span>
              </span>
              <Checkbox
                checked={systemAlerts}
                onCheckedChange={(checked) => setSystemAlerts(Boolean(checked))}
                className="mt-1"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-1 min-w-[200px] flex-col gap-2">
              <Label htmlFor="digest">Digest frequency</Label>
              <select
                id="digest"
                value={digestFreq}
                onChange={(e) => setDigestFreq(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="Weekly, Monday 08:00">
                  Weekly, Monday 08:00
                </option>
                <option value="Daily, 07:00">Daily, 07:00</option>
                <option value="Off">Off</option>
              </select>
            </div>

            <div className="flex flex-1 min-w-[200px] flex-col gap-2">
              <Label htmlFor="quiet">Quiet hours</Label>
              <select
                id="quiet"
                value={quietHours}
                onChange={(e) => setQuietHours(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="22:00 – 07:00 local">22:00 – 07:00 local</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Alerts are email and in-session only. There are no push
            notifications and no marketing email.
          </p>
        </div>
      )}
    </section>
  );
}
