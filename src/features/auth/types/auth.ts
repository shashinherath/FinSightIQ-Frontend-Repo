export type UserRole = "Viewer" | "Analyst" | "Administrator";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
}

export type AuthStatus = "idle" | "loading" | "error";
