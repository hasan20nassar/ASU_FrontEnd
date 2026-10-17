import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OpenAPI } from "@/lib/api/core/OpenAPI";
import { request as __request } from "@/lib/api/core/request";
import { Program } from "@/lib/api";

export interface ExtendedProgram extends Program {
  head?: number | null;
  headDetail?: {
    id: number;
    nameAr: string;
    nameEn: string;
    email: string;
  } | null;
}

export const programsKeys = {
  all: ["programs"] as const,
  lists: () => [...programsKeys.all, "list"] as const,
  detail: (id: number) => [...programsKeys.all, "detail", id] as const,
};

/**
 * Hook to retrieve all academic programs / departments.
 */
export function usePrograms(search?: string) {
  return useQuery({
    queryKey: [...programsKeys.lists(), search || ""],
    queryFn: () =>
      __request(OpenAPI, {
        method: "GET",
        url: "/api/programs/",
        query: { search },
      }) as Promise<ExtendedProgram[]>,
  });
}

/**
 * Hook to create a new program / department.
 */
export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ExtendedProgram>) =>
      __request(OpenAPI, {
        method: "POST",
        url: "/api/programs/",
        body: data,
        mediaType: "application/json",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programsKeys.all });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * Hook to update a program / department.
 */
export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<ExtendedProgram>;
    }) =>
      __request(OpenAPI, {
        method: "PATCH",
        url: `/api/programs/${id}/`,
        body: data,
        mediaType: "application/json",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programsKeys.all });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * Hook to delete a program / department.
 */
export function useDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      __request(OpenAPI, {
        method: "DELETE",
        url: `/api/programs/${id}/`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programsKeys.all });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      queryClient.invalidateQueries({ queryKey: ["faculty-members"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
