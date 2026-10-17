import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FacultyMembersService, FacultyMember } from "@/lib/api";
import { OpenAPI } from "@/lib/api/core/OpenAPI";
import { request as __request } from "@/lib/api/core/request";

export const facultyMemberKeys = {
  all: ["faculty-members"] as const,
  lists: () => [...facultyMemberKeys.all, "list"] as const,
  detail: (id: string | number) =>
    [...facultyMemberKeys.all, "detail", id] as const,
};

/**
 * Hook to retrieve all faculty members.
 */
export function useFacultyMembers(search?: string) {
  return useQuery({
    queryKey: [...facultyMemberKeys.lists(), search || ""],
    queryFn: () => FacultyMembersService.facultyMembersList(search),
  });
}

/**
 * Hook to retrieve a single faculty member by ID or email matching.
 */
export function useFacultyMember(idOrSlug: string | number) {
  return useQuery({
    queryKey: facultyMemberKeys.detail(idOrSlug),
    queryFn: async () => {
      const allMembers = await FacultyMembersService.facultyMembersList();
      const match = allMembers.find(
        (m) =>
          m.id.toString() === idOrSlug.toString() ||
          m.email === idOrSlug.toString(),
      );
      if (match) return match;
      if (typeof idOrSlug === "number" || !isNaN(Number(idOrSlug))) {
        return await FacultyMembersService.facultyMembersRetrieve(
          Number(idOrSlug),
        );
      }
      return undefined;
    },
    enabled: !!idOrSlug,
  });
}

/**
 * Hook to create a new faculty member.
 */
export function useCreateFacultyMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<FacultyMember>) =>
      FacultyMembersService.facultyMembersCreate(data as FacultyMember),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facultyMemberKeys.all });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });
}

/**
 * Hook to update a faculty member.
 */
export function useUpdateFacultyMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<FacultyMember> }) =>
      FacultyMembersService.facultyMembersPartialUpdate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: facultyMemberKeys.all });
      queryClient.invalidateQueries({
        queryKey: facultyMemberKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });
}

/**
 * Hook to delete a faculty member.
 */
export function useDeleteFacultyMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => FacultyMembersService.facultyMembersDestroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facultyMemberKeys.all });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });
}

/**
 * Hook to book an appointment with a faculty member.
 */
export function useBookAppointment() {
  return useMutation({
    mutationFn: (appointmentData: {
      facultyMember: number;
      studentName: string;
      studentEmail: string;
      studentId?: string;
      dayAr: string;
      dayEn: string;
      timeSlot: string;
      reason?: string;
    }) =>
      __request(OpenAPI, {
        method: "POST",
        url: "/api/faculty-appointments/",
        body: appointmentData,
        mediaType: "application/json",
      }),
  });
}

/**
 * Hook to retrieve booked appointments for faculty members.
 */
export function useFacultyAppointments() {
  return useQuery({
    queryKey: ["faculty-appointments"],
    queryFn: () =>
      __request(OpenAPI, {
        method: "GET",
        url: "/api/faculty-appointments/",
      }) as Promise<
        Array<{
          id: number;
          facultyMember: number;
          studentName: string;
          studentEmail: string;
          studentId?: string;
          dayAr: string;
          dayEn: string;
          timeSlot: string;
          reason?: string;
          status: string;
          createdAt?: string;
        }>
      >,
  });
}
