import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventsService, Event, PatchedEvent } from "@/lib/api";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
};

/**
 * Hook to retrieve all events.
 */
export function useEvents() {
  return useQuery({
    queryKey: eventKeys.lists(),
    queryFn: () => EventsService.eventsList(),
  });
}

/**
 * Hook to create an event.
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Event) => EventsService.eventsCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

/**
 * Hook to update an event.
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedEvent }) =>
      EventsService.eventsPartialUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

/**
 * Hook to delete an event.
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => EventsService.eventsDestroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}
