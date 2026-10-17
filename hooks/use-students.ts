import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentsService, Student, PatchedStudent } from "@/lib/api";

export const studentKeys = {
  all: ["students"] as const,
  lists: (search?: string) => [...studentKeys.all, "list", { search }] as const,
  detail: (id: number) => [...studentKeys.all, "detail", id] as const,
};

/**
 * Hook to retrieve all students.
 */
export function useStudents(search?: string) {
  return useQuery({
    queryKey: studentKeys.lists(search),
    queryFn: () => StudentsService.studentsList(search),
  });
}

/**
 * Hook to retrieve a student's detail by ID.
 */
export function useStudentDetail(id: number) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => StudentsService.studentsRetrieve(id),
  });
}

/**
 * Hook to create a student profile.
 */
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Student) => StudentsService.studentsCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });
}

/**
 * Hook to update an existing student profile.
 */
export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedStudent }) =>
      StudentsService.studentsPartialUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });
}

/**
 * Hook to delete a student.
 */
export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => StudentsService.studentsDestroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });
}

/**
 * Hook to bulk transfer students.
 */
export function useBulkTransferStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { student_ids: number[]; target_program_id: number }) =>
      StudentsService.studentsBulkTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });
}
