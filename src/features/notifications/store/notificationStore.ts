import { create } from "zustand";
import type { NotificationItem } from "@/features/alerts/types/alerts.types";

interface NotificationState {
  items: NotificationItem[];
  setItems: (items: NotificationItem[]) => void;
  markRead: (id: string) => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  setItems: (items) => set({ items }),
  markRead: (id) =>
    set((s) => ({
      items: s.items.map((it) => (it.id === id ? { ...it, read: true } : it)),
    })),
  unreadCount: () => get().items.filter((i) => !i.read).length,
}));
