import { useQuery } from "@tanstack/react-query";
import { AlumniStoriesService } from "@/lib/api";

export const alumniKeys = {
  all: ["alumni-stories"] as const,
  lists: () => [...alumniKeys.all, "list"] as const,
};

/**
 * Hook to retrieve all alumni stories.
 */
export function useAlumniStories() {
  return useQuery({
    queryKey: alumniKeys.lists(),
    queryFn: () => AlumniStoriesService.alumniStoriesList(),
  });
}
