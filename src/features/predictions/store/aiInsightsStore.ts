import { create } from "zustand";

export type WidgetSize = "sm" | "md" | "lg";

export interface AIWidgetLayoutItem {
  id: string;
  title: string;
  size: WidgetSize;
  collapsed: boolean;
}

export interface GridLayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

const STORAGE_KEY = "finsightiq-prediction-widgets";
const GRID_STORAGE_KEY = "finsightiq-prediction-grid";

const defaultLayout: AIWidgetLayoutItem[] = [
  { id: "feed", title: "AI Prediction Feed", size: "lg", collapsed: false },
  {
    id: "signals",
    title: "High Confidence Signals",
    size: "md",
    collapsed: false,
  },
  {
    id: "trending",
    title: "Trending Predictions",
    size: "md",
    collapsed: false,
  },
  {
    id: "accuracy",
    title: "Model Accuracy Snapshot",
    size: "sm",
    collapsed: false,
  },
  {
    id: "summary",
    title: "Market Forecast Summary",
    size: "sm",
    collapsed: false,
  },
  { id: "risk", title: "Risk Alert Widget", size: "md", collapsed: false },
];

const defaultGrid: GridLayoutItem[] = [
  { i: "feed", x: 0, y: 0, w: 7, h: 7, minW: 5, minH: 5 },
  { i: "signals", x: 7, y: 0, w: 5, h: 4, minW: 4, minH: 3 },
  { i: "trending", x: 7, y: 4, w: 5, h: 4, minW: 4, minH: 3 },
  { i: "accuracy", x: 0, y: 7, w: 4, h: 3, minW: 3, minH: 2 },
  { i: "summary", x: 4, y: 7, w: 4, h: 3, minW: 3, minH: 2 },
  { i: "risk", x: 8, y: 8, w: 4, h: 3, minW: 3, minH: 2 },
];

const readLayout = (): AIWidgetLayoutItem[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AIWidgetLayoutItem[]) : defaultLayout;
  } catch {
    return defaultLayout;
  }
};

const readGridLayout = (): GridLayoutItem[] => {
  try {
    const raw = window.localStorage.getItem(GRID_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GridLayoutItem[]) : defaultGrid;
  } catch {
    return defaultGrid;
  }
};

interface AIInsightsState {
  widgetLayout: AIWidgetLayoutItem[];
  widgetGrid: GridLayoutItem[];
  dismissAlertIds: string[];
  setWidgetLayout: (layout: AIWidgetLayoutItem[]) => void;
  setWidgetGrid: (layout: GridLayoutItem[]) => void;
  moveWidget: (fromIndex: number, toIndex: number) => void;
  toggleWidgetCollapse: (id: string) => void;
  setWidgetSize: (id: string, size: WidgetSize) => void;
  dismissAlert: (id: string) => void;
}

export const useAIInsightsStore = create<AIInsightsState>((set, get) => ({
  widgetLayout: typeof window === "undefined" ? defaultLayout : readLayout(),
  widgetGrid: typeof window === "undefined" ? defaultGrid : readGridLayout(),
  dismissAlertIds: [],
  setWidgetLayout: (widgetLayout) => {
    set({ widgetLayout });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(widgetLayout));
  },
  setWidgetGrid: (widgetGrid) => {
    set({ widgetGrid });
    window.localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify(widgetGrid));
  },
  moveWidget: (fromIndex, toIndex) => {
    const next = [...get().widgetLayout];
    const [item] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, item);
    get().setWidgetLayout(next);
  },
  toggleWidgetCollapse: (id) => {
    const next = get().widgetLayout.map((item) =>
      item.id === id ? { ...item, collapsed: !item.collapsed } : item,
    );
    get().setWidgetLayout(next);
  },
  setWidgetSize: (id, size) => {
    const next = get().widgetLayout.map((item) =>
      item.id === id ? { ...item, size } : item,
    );
    get().setWidgetLayout(next);
  },
  dismissAlert: (id) =>
    set((state) => ({ dismissAlertIds: [...state.dismissAlertIds, id] })),
}));
