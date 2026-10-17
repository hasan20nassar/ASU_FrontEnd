import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ResearchService,
  ResearchCenter,
  PatchedResearchCenter,
  ResearchArea,
  PatchedResearchArea,
  ResearchPublication,
  PatchedResearchPublication,
  ResearchStats,
} from "@/lib/api";

export const researchKeys = {
  all: ["research"] as const,
  centers: (params?: { search?: string }) => [...researchKeys.all, "centers", params] as const,
  areas: (params?: { search?: string }) => [...researchKeys.all, "areas", params] as const,
  publications: (params?: {
    search?: string;
    area?: number | string;
    center?: number | string;
    faculty?: number;
    year?: number | string;
    featured?: boolean | string;
  }) => [...researchKeys.all, "publications", params] as const,
  publication: (id: number) => [...researchKeys.all, "publication", id] as const,
  stats: () => [...researchKeys.all, "stats"] as const,
};

// ==========================================
// Research Centers Hooks
// ==========================================
export function useResearchCenters(params?: { search?: string }) {
  return useQuery({
    queryKey: researchKeys.centers(params),
    queryFn: () => ResearchService.centersList(params),
  });
}

export function useCreateCenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ResearchCenter) => ResearchService.centersCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.all });
    },
  });
}

export function useUpdateCenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ResearchCenter | PatchedResearchCenter }) =>
      ResearchService.centersUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.all });
    },
  });
}

export function useDeleteCenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ResearchService.centersDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.all });
    },
  });
}

// ==========================================
// Research Areas Hooks
// ==========================================
export function useResearchAreas(params?: { search?: string }) {
  return useQuery({
    queryKey: researchKeys.areas(params),
    queryFn: () => ResearchService.areasList(params),
  });
}

export function useCreateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ResearchArea) => ResearchService.areasCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.all });
    },
  });
}

export function useUpdateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ResearchArea | PatchedResearchArea }) =>
      ResearchService.areasUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.all });
    },
  });
}

export function useDeleteArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ResearchService.areasDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.all });
    },
  });
}

// ==========================================
// Research Publications Hooks
// ==========================================
export function useResearchPublications(params?: {
  search?: string;
  area?: number | string;
  center?: number | string;
  faculty?: number;
  year?: number | string;
  featured?: boolean | string;
}) {
  return useQuery({
    queryKey: researchKeys.publications(params),
    queryFn: () => ResearchService.publicationsList(params),
  });
}

export function usePublicationDetail(id: number) {
  return useQuery({
    queryKey: researchKeys.publication(id),
    queryFn: () => ResearchService.publicationsRetrieve(id),
    enabled: !!id,
  });
}

export function useCreatePublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ResearchPublication) => ResearchService.publicationsCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.all });
    },
  });
}

export function useUpdatePublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: ResearchPublication | PatchedResearchPublication;
    }) => ResearchService.publicationsUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.all });
    },
  });
}

export function useDeletePublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ResearchService.publicationsDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.all });
    },
  });
}

export function useResearchStats() {
  return useQuery({
    queryKey: researchKeys.stats(),
    queryFn: () => ResearchService.statsGet(),
  });
}

export function useRecordPublicationView() {
  return useMutation({
    mutationFn: (id: number) => ResearchService.recordView(id),
  });
}

export function useRecordPublicationDownload() {
  return useMutation({
    mutationFn: (id: number) => ResearchService.recordDownload(id),
  });
}
