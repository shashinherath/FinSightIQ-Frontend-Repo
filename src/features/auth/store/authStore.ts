import { create } from "zustand";
import type { AuthStatus, AuthUser } from "@/features/auth/types/auth";
import type {
  LoginFormValues,
  RegisterFormValues,
} from "@/features/auth/validation/authSchemas";

const createUserId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `user_${Date.now()}`;
};

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: string | null;
  login: (values: LoginFormValues) => Promise<void>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
  login: async (values) => {
    set({ status: "loading", error: null });
    await Promise.resolve();

    set({
      status: "idle",
      isAuthenticated: true,
      user: {
        id: createUserId(),
        name: values.email.split("@")[0] ?? "User",
        email: values.email,
      },
    });
  },
  register: async (values) => {
    set({ status: "loading", error: null });
    await Promise.resolve();

    set({
      status: "idle",
      isAuthenticated: true,
      user: {
        id: createUserId(),
        name: values.fullName,
        email: values.email,
      },
    });
  },
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      status: "idle",
      error: null,
    }),
  clearError: () => set({ error: null }),
}));
