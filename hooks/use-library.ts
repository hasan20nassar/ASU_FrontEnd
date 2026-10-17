import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LibraryService,
  Book,
  PatchedBook,
  BookReservation,
  LibraryStats,
} from "@/lib/api";

export const libraryKeys = {
  all: ["library"] as const,
  books: (params?: { search?: string; category?: string; faculty?: number; available?: string }) =>
    [...libraryKeys.all, "books", params] as const,
  book: (id: number) => [...libraryKeys.all, "book", id] as const,
  stats: () => [...libraryKeys.all, "stats"] as const,
  reservations: (params?: { status?: string; book?: number; search?: string }) =>
    [...libraryKeys.all, "reservations", params] as const,
};

/**
 * Retrieve all books with optional filters.
 */
export function useLibraryBooks(params?: {
  search?: string;
  category?: string;
  faculty?: number;
  available?: string;
}) {
  return useQuery({
    queryKey: libraryKeys.books(params),
    queryFn: () => LibraryService.booksList(params),
  });
}

/**
 * Retrieve single book by ID.
 */
export function useBookDetail(id: number) {
  return useQuery({
    queryKey: libraryKeys.book(id),
    queryFn: () => LibraryService.booksRetrieve(id),
    enabled: !!id,
  });
}

/**
 * Retrieve library aggregated statistics.
 */
export function useLibraryStats() {
  return useQuery({
    queryKey: libraryKeys.stats(),
    queryFn: () => LibraryService.booksStats(),
  });
}

/**
 * Create a new academic book.
 */
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Book) => LibraryService.booksCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.all });
    },
  });
}

/**
 * Update a book.
 */
export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedBook }) =>
      LibraryService.booksPartialUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.all });
    },
  });
}

/**
 * Delete a book.
 */
export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => LibraryService.booksDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.all });
    },
  });
}

/**
 * Reserve a book.
 */
export function useReserveBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        studentName: string;
        studentId: string;
        studentMajor?: string;
        studentEmail?: string;
        studentPhone?: string;
        notes?: string;
      };
    }) => LibraryService.booksReserve(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.all });
    },
  });
}

/**
 * Retrieve all reservations for admin dashboard.
 */
export function useBookReservations(params?: {
  status?: string;
  book?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: libraryKeys.reservations(params),
    queryFn: () => LibraryService.reservationsList(params),
  });
}

/**
 * Update reservation status (approve, return, cancel, reject).
 */
export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      adminNotes,
    }: {
      id: number;
      status: string;
      adminNotes?: string;
    }) => LibraryService.reservationsUpdateStatus(id, status, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.all });
    },
  });
}

