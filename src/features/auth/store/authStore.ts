import { create } from "zustand";
import type {
  AuthStatus,
  AuthUser,
  UserRole,
} from "@/features/auth/types/auth";
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
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "usr_rachel_osei",
    name: "Rachel Osei",
    email: "rachel.osei@firm.com",
    role: "Analyst",
  },
  isAuthenticated: true,
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
        role: "Analyst",
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
        role: "Viewer",
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
  setRole: (role) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, role }
        : {
            id: "usr_rachel_osei",
            name: "Rachel Osei",
            email: "rachel.osei@firm.com",
            role,
          },
    })),
}));
