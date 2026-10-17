import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OpenAPI } from "@/lib/api/core/OpenAPI";
import { request as __request } from "@/lib/api/core/request";

export interface NotificationItem {
  id: number;
  user?: number | null;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  type: "message" | "result" | "info" | "warning" | "urgent";
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  id?: number;
  user?: number;
  muteMessages: boolean;
  muteResults: boolean;
  muteInfo: boolean;
  muteWarning: boolean;
  muteUrgent: boolean;
}

export const notificationsKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationsKeys.all, "list"] as const,
  preferences: (userId?: number) => [...notificationsKeys.all, "preferences", userId || 0] as const,
};

export function useNotifications(userId?: number) {
  return useQuery({
    queryKey: [...notificationsKeys.lists(), userId || 0],
    queryFn: () =>
      __request(OpenAPI, {
        method: "GET",
        url: "/api/notifications/",
        query: userId ? { user: userId } : undefined,
      }) as Promise<NotificationItem[]>,
  });
}

export function useMarkNotificationRead(userId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      __request(OpenAPI, {
        method: "PATCH",
        url: `/api/notifications/${id}/`,
        query: userId ? { user: userId } : undefined,
        body: { is_read: true },
        mediaType: "application/json",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId?: number) =>
      __request(OpenAPI, {
        method: "POST",
        url: "/api/notifications/mark_all_read/",
        query: userId ? { user: userId } : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}

export function useNotificationPreferences(userId?: number) {
  return useQuery({
    queryKey: notificationsKeys.preferences(userId),
    queryFn: () =>
      __request(OpenAPI, {
        method: "GET",
        url: "/api/notifications/preferences/",
        query: userId ? { user: userId } : undefined,
      }) as Promise<NotificationPreferences>,
    enabled: Boolean(userId),
  });
}

export function useUpdateNotificationPreferences(userId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prefs: Partial<NotificationPreferences>) =>
      __request(OpenAPI, {
        method: "PATCH",
        url: "/api/notifications/preferences/",
        query: userId ? { user: userId } : undefined,
        body: prefs,
        mediaType: "application/json",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}
