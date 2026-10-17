import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NewsArticlesService, NewsArticle, PatchedNewsArticle } from "@/lib/api";

export const newsKeys = {
  all: ["news"] as const,
  lists: (search?: string) => [...newsKeys.all, "list", { search }] as const,
  detail: (idOrSlug: string | number) => [...newsKeys.all, "detail", idOrSlug] as const,
};

/**
 * Hook to retrieve all news articles from the backend.
 */
export function useNews(search?: string) {
  return useQuery({
    queryKey: newsKeys.lists(search),
    queryFn: () => NewsArticlesService.newsArticlesList(search),
  });
}

/**
 * Hook to retrieve a single news article by its ID.
 */
export function useNewsDetail(id: number) {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: () => NewsArticlesService.newsArticlesRetrieve(id),
  });
}

/**
 * Hook to create a new news article.
 */
export function useCreateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewsArticle) => NewsArticlesService.newsArticlesCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all });
    },
  });
}

/**
 * Hook to update a news article.
 */
export function useUpdateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedNewsArticle }) =>
      NewsArticlesService.newsArticlesPartialUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all });
    },
  });
}

/**
 * Hook to delete a news article.
 */
export function useDeleteNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => NewsArticlesService.newsArticlesDestroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all });
    },
  });
}
