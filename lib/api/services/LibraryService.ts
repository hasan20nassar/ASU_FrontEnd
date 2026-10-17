import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import type { Book, PatchedBook, BookReservation, LibraryStats } from "../models/Book";
import type { UploadResult } from "./MediaUploadService";

export class LibraryService {
  /**
   * List all library books with optional search, category, faculty, and availability filters.
   */
  public static booksList(query?: {
    search?: string;
    category?: string;
    faculty?: number;
    available?: string;
  }): CancelablePromise<Array<Book>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/books/",
      query: {
        search: query?.search,
        category: query?.category,
        faculty: query?.faculty,
        available: query?.available,
      },
    });
  }

  /**
   * Retrieve a single book by ID.
   */
  public static booksRetrieve(id: number): CancelablePromise<Book> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/books/{id}/",
      path: { id },
    });
  }

  /**
   * Create a new library book record.
   */
  public static booksCreate(requestBody: Book): CancelablePromise<Book> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/books/",
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * Full update of a book record.
   */
  public static booksUpdate(id: number, requestBody: Book): CancelablePromise<Book> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/books/{id}/",
      path: { id },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * Partial update of a book record.
   */
  public static booksPartialUpdate(id: number, requestBody: PatchedBook): CancelablePromise<Book> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/books/{id}/",
      path: { id },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * Delete a book record.
   */
  public static booksDelete(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/books/{id}/",
      path: { id },
    });
  }

  /**
   * Retrieve aggregated library statistics.
   */
  public static booksStats(): CancelablePromise<LibraryStats> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/books/stats/",
    });
  }

  /**
   * Submit student reservation for a book.
   */
  public static booksReserve(
    id: number,
    data: {
      studentName: string;
      studentId: string;
      studentMajor?: string;
      studentEmail?: string;
      studentPhone?: string;
      notes?: string;
    }
  ): CancelablePromise<{ success: boolean; message: string; reservationId: number; expiresAt: string }> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/books/{id}/reserve/",
      path: { id },
      body: data,
      mediaType: "application/json",
    });
  }

  /**
   * Increment book views count.
   */
  public static recordView(id: number): CancelablePromise<{ status: string; viewsCount: number }> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/books/{id}/record_view/",
      path: { id },
    });
  }

  /**
   * Increment book downloads count.
   */
  public static recordDownload(id: number): CancelablePromise<{ status: string; downloadsCount: number }> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/books/{id}/record_download/",
      path: { id },
    });
  }

  /**
   * Strictly upload PDF file for a book.
   * Backend validates extension, MIME, and magic bytes (%PDF-).
   */
  public static async uploadPdf(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append("file", file);

    return __request(OpenAPI, {
      method: "POST",
      url: "/api/books/upload-pdf/",
      body: formData,
    });
  }

  /**
   * Strictly upload Cover image for a book.
   * Backend validates image formats and verifies structure via Pillow.
   */
  public static async uploadCover(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append("file", file);

    return __request(OpenAPI, {
      method: "POST",
      url: "/api/books/upload-cover/",
      body: formData,
    });
  }

  /**
   * List all book reservations for admin dashboard.
   */
  public static reservationsList(query?: {
    status?: string;
    book?: number;
    search?: string;
  }): CancelablePromise<Array<BookReservation>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/book-reservations/",
      query: {
        status: query?.status,
        book: query?.book,
        search: query?.search,
      },
    });
  }

  /**
   * Update reservation status (approve, return, cancel, reject).
   */
  public static reservationsUpdateStatus(
    id: number,
    newStatus: string,
    adminNotes?: string
  ): CancelablePromise<{ success: boolean; status: string; id: number }> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/book-reservations/{id}/update_status/",
      path: { id },
      body: { status: newStatus, adminNotes },
      mediaType: "application/json",
    });
  }
}

