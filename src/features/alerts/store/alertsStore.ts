import { create } from "zustand";
import type { AlertRule } from "../types/alerts.types";

// Default seed data matching the prototype's populated state (S-14 Alerts)
const DEFAULT_RULES: AlertRule[] = [
  {
    id: "seed-1",
    name: "NVDA price above",
    type: "PRICE_TARGET",
    enabled: true,
    threshold: 195.0,
    symbol: "NVDA",
    createdAt: new Date("2026-08-02").getTime(),
    meta: "Email · created 2 August",
  },
  {
    id: "seed-2",
    name: "MSFT sentiment below",
    type: "SENTIMENT_SHIFT",
    enabled: true,
    threshold: -0.3,
    symbol: "MSFT",
    createdAt: new Date("2026-07-28").getTime(),
    meta: "Email · created 28 July",
  },
  {
    id: "seed-3",
    name: "Core growth drawdown above",
    type: "PERCENT_MOVE",
    enabled: false,
    threshold: 4.0,
    createdAt: new Date("2026-07-14").getTime(),
    meta: "Email · created 14 July",
  },
  {
    id: "seed-4",
    name: "AAPL forecast confidence below",
    type: "PREDICTION_HIGH_CONFIDENCE",
    enabled: true,
    threshold: 60,
    symbol: "AAPL",
    createdAt: new Date("2026-08-09").getTime(),
    meta: "Email · created 9 August",
  },
];

interface AlertsState {
  rules: AlertRule[];
  setRules: (r: AlertRule[]) => void;
  addRule: (r: AlertRule) => void;
  removeRule: (id: string) => void;
  toggleRule: (id: string) => void;
}

export const useAlertsStore = create<AlertsState>((set) => ({
  rules: DEFAULT_RULES,
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
