import { create } from "zustand";
import type { AlertRule } from "../types/alerts.types";

interface AlertsState {
  rules: AlertRule[];
  setRules: (r: AlertRule[]) => void;
  addRule: (r: AlertRule) => void;
  removeRule: (id: string) => void;
  toggleRule: (id: string) => void;
}

export const useAlertsStore = create<AlertsState>((set) => ({
  rules: [],
  setRules: (r) => set({ rules: r }),
  addRule: (r) => set((s) => ({ rules: [r, ...s.rules] })),
  removeRule: (id) =>
    set((s) => ({ rules: s.rules.filter((x) => x.id !== id) })),
  toggleRule: (id) =>
    set((s) => ({
      rules: s.rules.map((x) =>
        x.id === id ? { ...x, enabled: !x.enabled } : x,
      ),
    })),
}));
