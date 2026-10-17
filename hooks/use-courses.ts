import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OpenAPI } from "@/lib/api/core/OpenAPI";
import { request as __request } from "@/lib/api/core/request";
import { Course } from "@/lib/api";

export const coursesKeys = {
  all: ["courses"] as const,
  lists: () => [...coursesKeys.all, "list"] as const,
  byProgram: (programId?: number | string) => [...coursesKeys.all, "byProgram", programId] as const,
  detail: (id: number) => [...coursesKeys.all, "detail", id] as const,
};

/**
 * Hook to retrieve courses with optional search or program filter.
 */
export function useCourses(programId?: number | string, search?: string) {
  return useQuery({
    queryKey: [...coursesKeys.byProgram(programId), search || ""],
    queryFn: async () => {
      const allCourses = await __request(OpenAPI, {
        method: "GET",
        url: "/api/courses/",
        query: { search },
      }) as Course[];

      if (programId !== undefined && programId !== null && programId !== "") {
        return allCourses.filter(
          (c) => c.program?.toString() === programId.toString()
        );
      }
      return allCourses;
    },
  });
}

/**
 * Hook to create a new academic course.
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Course>) =>
      __request(OpenAPI, {
        method: "POST",
        url: "/api/courses/",
        body: data,
        mediaType: "application/json",
      }) as Promise<Course>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesKeys.all });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });
}

/**
 * Hook to update an existing course.
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Course> }) =>
      __request(OpenAPI, {
        method: "PATCH",
        url: `/api/courses/${id}/`,
        body: data,
        mediaType: "application/json",
      }) as Promise<Course>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesKeys.all });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });
}

/**
 * Hook to delete a course.
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      __request(OpenAPI, {
        method: "DELETE",
        url: `/api/courses/${id}/`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesKeys.all });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });
}
