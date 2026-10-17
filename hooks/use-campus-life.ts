import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CampusLifeService,
  HousingFeature,
  PatchedHousingFeature,
  StudentClub,
  PatchedStudentClub,
  SportActivity,
  PatchedSportActivity,
  CampusLifeOverview,
  PatchedCampusLifeOverview,
} from "@/lib/api";

export const campusLifeKeys = {
  all: ["campus-life"] as const,
  housing: (params?: { search?: string }) => [...campusLifeKeys.all, "housing", params] as const,
  clubs: (params?: { search?: string }) => [...campusLifeKeys.all, "clubs", params] as const,
  sports: (params?: { search?: string }) => [...campusLifeKeys.all, "sports", params] as const,
  overview: () => [...campusLifeKeys.all, "overview"] as const,
  stats: () => [...campusLifeKeys.all, "stats"] as const,
};

// ==========================================
// Housing Features Hooks
// ==========================================
export function useHousingFeatures(params?: { search?: string }) {
  return useQuery({
    queryKey: campusLifeKeys.housing(params),
    queryFn: () => CampusLifeService.housingList(params),
  });
}

export function useCreateHousingFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: HousingFeature) => CampusLifeService.housingCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campusLifeKeys.all });
    },
  });
}

export function useUpdateHousingFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: HousingFeature | PatchedHousingFeature }) =>
      CampusLifeService.housingUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campusLifeKeys.all });
    },
  });
}

export function useDeleteHousingFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => CampusLifeService.housingDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campusLifeKeys.all });
    },
  });
}

// ==========================================
// Student Clubs Hooks
// ==========================================
export function useStudentClubs(params?: { search?: string }) {
  return useQuery({
    queryKey: campusLifeKeys.clubs(params),
    queryFn: () => CampusLifeService.clubsList(params),
  });
}

export function useCreateStudentClub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StudentClub) => CampusLifeService.clubsCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campusLifeKeys.all });
    },
  });
}

export function useUpdateStudentClub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: StudentClub | PatchedStudentClub }) =>
      CampusLifeService.clubsUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campusLifeKeys.all });
    },
  });
}

export function useDeleteStudentClub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => CampusLifeService.clubsDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campusLifeKeys.all });
    },
  });
}

// ==========================================
// Sport Activities Hooks
// ==========================================
export function useSportActivities(params?: { search?: string }) {
  return useQuery({
    queryKey: campusLifeKeys.sports(params),
    queryFn: () => CampusLifeService.sportsList(params),
  });
}

export function useCreateSportActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SportActivity) => CampusLifeService.sportsCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campusLifeKeys.all });
    },
  });
}

export function useUpdateSportActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SportActivity | PatchedSportActivity }) =>
      CampusLifeService.sportsUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campusLifeKeys.all });
    },
  });
}

export function useDeleteSportActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => CampusLifeService.sportsDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campusLifeKeys.all });
    },
  });
}

// ==========================================
// Overview & Stats Hooks
// ==========================================
export function useCampusLifeOverview() {
  return useQuery({
    queryKey: campusLifeKeys.overview(),
    queryFn: () => CampusLifeService.overviewGet(),
  });
}

export function useUpdateCampusLifeOverview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CampusLifeOverview | PatchedCampusLifeOverview }) =>
      CampusLifeService.overviewUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campusLifeKeys.all });
    },
  });
}

export function useCampusLifeStats() {
  return useQuery({
    queryKey: campusLifeKeys.stats(),
    queryFn: () => CampusLifeService.statsGet(),
  });
}
