export type AdminUserRole = "Viewer" | "Analyst" | "Administrator";
export type AdminUserStatus = "Active" | "Pending invite" | "Deactivated";
export type AdminTone = "ok" | "warn" | "off";

export interface AdminUser {
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  seen: string;
  tone: AdminTone;
  action: string;
}

export type AdminModelStatus = "ACTIVE" | "REVIEW" | "RETIRED";

export interface AdminModel {
  family: string;
  version: string;
  trained: string;
  mape: string;
  n: string;
  status: AdminModelStatus;
  tone: AdminTone;
  action: string;
}

export const ADMIN_USERS: AdminUser[] = [
  {
    name: "Rachel Osei",
    email: "rachel.osei@firm.com",
    role: "Analyst",
    status: "Active",
    seen: "2 minutes ago",
    tone: "ok",
    action: "Deactivate",
  },
  {
    name: "Tom Whitfield",
    email: "tom.whitfield@firm.com",
    role: "Administrator",
    status: "Active",
    seen: "1 hour ago",
    tone: "ok",
    action: "Deactivate",
  },
  {
    name: "Priya Raman",
    email: "priya.raman@firm.com",
    role: "Analyst",
    status: "Active",
    seen: "yesterday",
    tone: "ok",
    action: "Deactivate",
  },
  {
    name: "Daniel Cho",
    email: "daniel.cho@firm.com",
    role: "Viewer",
    status: "Pending invite",
    seen: "never",
    tone: "warn",
    action: "Resend",
  },
  {
    name: "Marta Ilves",
    email: "marta.ilves@firm.com",
    role: "Viewer",
    status: "Deactivated",
    seen: "14 Jun 2026",
    tone: "off",
    action: "Restore",
  },
];

export const ADMIN_MODELS: AdminModel[] = [
  {
    family: "ENSEMBLE",
    version: "v2026-08-11",
    trained: "11 Aug 02:14 UTC",
    mape: "3.62%",
    n: "90",
    status: "ACTIVE",
    tone: "ok",
    action: "Retire",
  },
  {
    family: "LSTM",
    version: "v2026-08-11",
    trained: "11 Aug 02:31 UTC",
    mape: "3.98%",
    n: "90",
    status: "ACTIVE",
    tone: "ok",
    action: "Retire",
  },
  {
    family: "PROPHET",
    version: "v2026-08-04",
    trained: "4 Aug 02:22 UTC",
    mape: "4.71%",
    n: "90",
    status: "ACTIVE",
    tone: "ok",
    action: "Retire",
  },
  {
    family: "ARIMA",
    version: "v2026-08-04",
    trained: "4 Aug 02:09 UTC",
    mape: "5.04%",
    n: "90",
    status: "REVIEW",
    tone: "warn",
    action: "Retire",
  },
  {
    family: "ENSEMBLE",
    version: "v2026-06-30",
    trained: "30 Jun 02:11 UTC",
    mape: "4.10%",
    n: "90",
    status: "RETIRED",
    tone: "off",
    action: "Inspect",
  },
];
