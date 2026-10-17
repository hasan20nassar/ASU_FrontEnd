import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OpenAPI } from "@/lib/api/core/OpenAPI";
import { request as __request } from "@/lib/api/core/request";

export interface UserProfileItem {
  id: number;
  user?: number;
  nameAr: string;
  nameEn?: string;
  email: string;
  password?: string;
  birthDate?: string;
  bio?: string;
  role: "admin" | "faculty" | "alumni" | "student" | "content_manager";
  assignedFaculty?: number | null;
  assignedFacultyName?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt?: string;
}

export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  detail: (id: number) => [...usersKeys.all, "detail", id] as const,
};

/**
 * Hook to retrieve all users from backend API.
 */
export function useUsers(search?: string) {
  return useQuery({
    queryKey: [...usersKeys.lists(), search || ""],
    queryFn: () =>
      __request(OpenAPI, {
        method: "GET",
        url: "/api/users/",
        query: {
          search: search,
        },
      }) as Promise<UserProfileItem[]>,
  });
}

/**
 * Hook to create a new user account with role.
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<UserProfileItem>) =>
      __request(OpenAPI, {
        method: "POST",
        url: "/api/users/",
        body: userData,
        mediaType: "application/json",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
      queryClient.invalidateQueries({ queryKey: ["faculty-members"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });
}

/**
 * Hook to update a user account.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<UserProfileItem>;
    }) =>
      __request(OpenAPI, {
        method: "PATCH",
        url: `/api/users/${id}/`,
        body: data,
        mediaType: "application/json",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
      queryClient.invalidateQueries({ queryKey: ["faculty-members"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });
}

/**
 * Hook to delete a user account.
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      __request(OpenAPI, {
        method: "DELETE",
        url: `/api/users/${id}/`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
      queryClient.invalidateQueries({ queryKey: ["faculty-members"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });
}
