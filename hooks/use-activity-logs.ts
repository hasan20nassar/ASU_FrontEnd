import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OpenAPI } from "@/lib/api/core/OpenAPI";
import { request as __request } from "@/lib/api/core/request";

export interface ActivityLogItem {
  id: number;
  userName: string;
  userNameEn?: string;
  actionAr: string;
  actionEn: string;
  status: "update" | "success" | "warning" | "info";
  createdAt: string;
}

export const activityLogsKeys = {
  all: ["activity-logs"] as const,
  lists: () => [...activityLogsKeys.all, "list"] as const,
};

export function useActivityLogs(search?: string) {
  return useQuery({
    queryKey: [...activityLogsKeys.lists(), search || ""],
    queryFn: () =>
      __request(OpenAPI, {
        method: "GET",
        url: "/api/activity-logs/",
        query: search ? { search } : undefined,
      }) as Promise<ActivityLogItem[]>,
  });
}

export function useCreateActivityLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ActivityLogItem>) =>
      __request(OpenAPI, {
        method: "POST",
        url: "/api/activity-logs/",
        body: data,
        mediaType: "application/json",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityLogsKeys.all });
    },
  });
}
