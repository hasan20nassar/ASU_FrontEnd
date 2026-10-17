import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FacultiesService, Faculty, PatchedFaculty } from "@/lib/api";

// Key for React Query caching
export const facultiesKeys = {
  all: ["faculties"] as const,
  lists: () => [...facultiesKeys.all, "list"] as const,
  detail: (idOrSlug: string | number) => [...facultiesKeys.all, "detail", idOrSlug] as const,
};

/**
 * Hook to retrieve all faculties from the backend database.
 */
export function useFaculties() {
  return useQuery({
    queryKey: facultiesKeys.lists(),
    queryFn: () => FacultiesService.facultiesList(),
  });
}

/**
 * Hook to retrieve a single faculty detail by its ID.
 */
export function useFacultyDetail(id: number) {
  return useQuery({
    queryKey: facultiesKeys.detail(id),
    queryFn: () => FacultiesService.facultiesRetrieve(id),
  });
}

/**
 * Hook to create a new Faculty.
 */
export function useCreateFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Faculty) => FacultiesService.facultiesCreate(data),
    onSuccess: () => {
      // Invalidate the cache to reload faculties automatically
      queryClient.invalidateQueries({ queryKey: facultiesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * Hook to update an existing Faculty.
 */
export function useUpdateFaculty(defaultId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatchedFaculty & { id?: number }) => {
      const targetId = data.id || defaultId;
      if (!targetId) throw new Error("Faculty ID is required");
      const { id: _, ...payload } = data;
      return FacultiesService.facultiesPartialUpdate(targetId, payload);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: facultiesKeys.lists() });
      const targetId = variables.id || defaultId;
      if (targetId) {
        queryClient.invalidateQueries({ queryKey: facultiesKeys.detail(targetId) });
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * Hook to delete a Faculty.
 */
export function useDeleteFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => FacultiesService.facultiesDestroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facultiesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
