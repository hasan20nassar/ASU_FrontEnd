export interface Book {
  id?: number;
  titleAr: string;
  titleEn: string;
  authorAr: string;
  authorEn: string;
  isbn?: string;
  faculty?: number | null;
  facultyNameAr?: string;
  facultyNameEn?: string;
  category?: string;
  categoryNameAr?: string;
  categoryNameEn?: string;
  year?: number;
  edition?: string;
  pages?: number;
  language?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  coverImage?: string;
  coverColor?: string;
  pdfFile?: string;
  pdfFileSize?: number;
  pdfFileSizeFormatted?: string;
  allowDownload?: boolean;
  totalCopies?: number;
  availableCopies?: number;
  shelfLocation?: string;
  available?: boolean;
  viewsCount?: number;
  downloadsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type PatchedBook = Partial<Book>;

export interface BookReservation {
  id?: number;
  book: number;
  bookTitleAr?: string;
  bookTitleEn?: string;
  bookCoverImage?: string;
  studentName: string;
  studentId: string;
  studentMajor?: string;
  studentEmail?: string;
  studentPhone?: string;
  status?: "pending" | "approved" | "borrowed" | "returned" | "cancelled" | "rejected";
  reservedAt?: string;
  expiresAt?: string | null;
  returnedAt?: string | null;
  notes?: string;
  adminNotes?: string;
}

export interface LibraryStats {
  total: number;
  available: number;
  reserved: number;
  withPdf: number;
  totalDownloads: number;
  totalViews: number;
  totalReservations: number;
  pendingReservations: number;
}

