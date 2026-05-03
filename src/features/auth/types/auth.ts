export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export type AuthStatus = "idle" | "loading" | "error";
