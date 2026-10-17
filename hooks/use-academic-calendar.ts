import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AcademicCalendarService,
  AcademicCalendarEvent,
  PatchedAcademicCalendarEvent,
} from "@/lib/api";

export const academicCalendarKeys = {
  all: ["academic-calendar"] as const,
  lists: () => [...academicCalendarKeys.all, "list"] as const,
};

/**
 * Hook to retrieve all academic calendar events.
 */
export function useAcademicCalendar() {
  return useQuery({
    queryKey: academicCalendarKeys.lists(),
    queryFn: () => AcademicCalendarService.academicCalendarList(),
  });
}

/**
 * Hook to create an academic calendar event.
 */
export function useCreateAcademicCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<AcademicCalendarEvent, "id">) =>
      AcademicCalendarService.academicCalendarCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicCalendarKeys.all });
    },
  });
}

/**
 * Hook to update an academic calendar event.
 */
export function useUpdateAcademicCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedAcademicCalendarEvent }) =>
      AcademicCalendarService.academicCalendarPartialUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicCalendarKeys.all });
    },
  });
}

/**
 * Hook to delete an academic calendar event.
 */
export function useDeleteAcademicCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => AcademicCalendarService.academicCalendarDestroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicCalendarKeys.all });
    },
  });
}
