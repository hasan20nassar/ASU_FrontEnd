import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OpenAPI } from "@/lib/api/core/OpenAPI";
import { request as __request } from "@/lib/api/core/request";

export interface JobApplicationItem {
  id: number;
  job: number;
  applicantName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: "pending" | "under_review" | "accepted" | "rejected";
  createdAt: string;
}

export interface JobOfferItem {
  id: number;
  titleAr: string;
  titleEn: string;
  departmentAr: string;
  departmentEn: string;
  type: "full_time" | "part_time" | "contract";
  locationAr: string;
  locationEn: string;
  deadline: string;
  requirementsAr: string;
  requirementsEn: string;
  isActive: boolean;
  createdAt: string;
  applications?: JobApplicationItem[];
}

export const jobsKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobsKeys.all, "list"] as const,
};

export function useJobs(search?: string) {
  return useQuery({
    queryKey: [...jobsKeys.lists(), search || ""],
    queryFn: () =>
      __request(OpenAPI, {
        method: "GET",
        url: "/api/jobs/",
        query: { search },
      }) as Promise<JobOfferItem[]>,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JobOfferItem>) =>
      __request(OpenAPI, {
        method: "POST",
        url: "/api/jobs/",
        body: data,
        mediaType: "application/json",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.all });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<JobOfferItem> }) =>
      __request(OpenAPI, {
        method: "PATCH",
        url: `/api/jobs/${id}/`,
        body: data,
        mediaType: "application/json",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.all });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      __request(OpenAPI, {
        method: "DELETE",
        url: `/api/jobs/${id}/`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.all });
    },
  });
}

export function useApplyJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JobApplicationItem>) =>
      __request(OpenAPI, {
        method: "POST",
        url: "/api/job-applications/",
        body: data,
        mediaType: "application/json",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.all });
    },
  });
}
