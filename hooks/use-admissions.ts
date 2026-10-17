import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OpenAPI } from "@/lib/api/core/OpenAPI";
import { request as __request } from "@/lib/api/core/request";

export interface AdmissionApplicationItem {
  id: number;
  fullNameAr: string;
  fullNameEn: string;
  email: string;
  phone: string;
  highSchoolBranch: string;
  highSchoolScore: number;
  desiredFaculty?: number | null;
  desiredProgram?: number | null;
  status: "pending" | "under_review" | "accepted" | "rejected";
  createdAt: string;
}

export const admissionsKeys = {
  all: ["admission-applications"] as const,
  lists: () => [...admissionsKeys.all, "list"] as const,
};

export function useAdmissionApplications(search?: string) {
  return useQuery({
    queryKey: [...admissionsKeys.lists(), search || ""],
    queryFn: () =>
      __request(OpenAPI, {
        method: "GET",
        url: "/api/admission-applications/",
        query: { search },
      }) as Promise<AdmissionApplicationItem[]>,
  });
}

export function useCreateAdmissionApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AdmissionApplicationItem>) =>
      __request(OpenAPI, {
        method: "POST",
        url: "/api/admission-applications/",
        body: data,
        mediaType: "application/json",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: admissionsKeys.all });
    },
  });
}
