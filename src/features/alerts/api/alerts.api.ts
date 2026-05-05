import type { AlertRule, NotificationItem } from "../types/alerts.types";

const now = () => Date.now();

export async function createAlert(
  rule: Partial<AlertRule>,
): Promise<AlertRule> {
  return new Promise((res) =>
    setTimeout(
      () =>
        res({
          id: `alert-${now()}`,
          name: rule.name || "New alert",
          type: rule.type ?? "PRICE_TARGET",
          enabled: rule.enabled ?? true,
          threshold: rule.threshold ?? 0,
          symbol: rule.symbol ?? undefined,
          createdAt: now(),
        }),
      180,
    ),
  );
}

export async function updateAlert(
  id: string,
  patch: Partial<AlertRule>,
): Promise<AlertRule> {
  return new Promise((res) =>
    setTimeout(
      () =>
        res({
          id,
          name: patch.name ?? "Updated",
          type: patch.type ?? "PRICE_TARGET",
          enabled: patch.enabled ?? true,
          threshold: patch.threshold,
          symbol: patch.symbol,
          createdAt: now(),
        }),
      160,
    ),
  );
}

export async function deleteAlert(id: string): Promise<void> {
  void id;
  return new Promise((res) => setTimeout(() => res(), 120));
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  return new Promise((res) =>
    setTimeout(
      () =>
        res(
          Array.from({ length: 8 }).map((_, i) => ({
            id: `notif-${now()}-${i}`,
            title: i % 3 === 0 ? "Price target hit" : "News impact alert",
            body: "AI found a significant event affecting your watchlist",
            category: i % 2 === 0 ? "alerts" : "news",
            priority: i % 4 === 0 ? "high" : "medium",
            read: false,
            createdAt: now() - i * 60000,
          })),
        ),
      220,
    ),
  );
}

export async function markNotificationRead(id: string): Promise<void> {
  void id;
  return new Promise((res) => setTimeout(() => res(), 80));
}
