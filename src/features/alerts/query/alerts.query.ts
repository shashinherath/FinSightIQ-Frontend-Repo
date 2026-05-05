import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAlert,
  deleteAlert,
  updateAlert,
  fetchNotifications,
  markNotificationRead,
} from "../api/alerts.api";
import type { AlertRule, NotificationItem } from "../types/alerts.types";

export const useCreateAlert = () =>
  useMutation({ mutationFn: (rule: Partial<AlertRule>) => createAlert(rule) });

export const useUpdateAlert = () =>
  useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<AlertRule> }) =>
      updateAlert(id, patch),
  });

export const useDeleteAlert = () =>
  useMutation({ mutationFn: (id: string) => deleteAlert(id) });

export const useNotifications = () =>
  useQuery<NotificationItem[]>({
    queryKey: ["alerts", "notifications"],
    queryFn: fetchNotifications,
    staleTime: 1000 * 10,
  });

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["alerts", "notifications"] }),
  });
};
