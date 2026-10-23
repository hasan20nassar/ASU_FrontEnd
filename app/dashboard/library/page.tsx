"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import {
  useLibraryBooks,
  useLibraryStats,
  useCreateBook,
  useUpdateBook,
  useDeleteBook,
  useBookReservations,
  useUpdateReservationStatus,
} from "@/hooks/use-library";
import { useFaculties } from "@/hooks/use-faculties";
import { Book, BookReservation, LibraryService } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookMarked,
  BookOpen,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  LayoutGrid,
  List,
  Filter,
  Download,
  ExternalLink,
  Loader2,
  Layers,
  Hash,
  User,
  ShieldCheck,
  RotateCcw,
  BookOpenCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORY_CHOICES = [
  { id: "engineering", nameAr: "الهندسة", nameEn: "Engineering", color: "from-blue-600 to-indigo-950" },
  { id: "pharmacy", nameAr: "الصيدلة", nameEn: "Pharmacy", color: "from-emerald-600 to-teal-900" },
  { id: "dentistry", nameAr: "طب الأسنان", nameEn: "Dentistry", color: "from-purple-600 to-indigo-950" },
  { id: "business", nameAr: "إدارة الأعمال", nameEn: "Business Administration", color: "from-amber-600 to-orange-900" },
  { id: "law", nameAr: "الحقوق", nameEn: "Law", color: "from-rose-600 to-red-950" },
  { id: "arts", nameAr: "الآداب واللغات", nameEn: "Arts & Languages", color: "from-violet-650 to-indigo-950" },
  { id: "sciences", nameAr: "العلوم الأساسية", nameEn: "Basic Sciences", color: "from-sky-600 to-blue-950" },
  { id: "general", nameAr: "المعارف والمراجع العامة", nameEn: "General References", color: "from-slate-700 to-slate-950" },
];

const getGradientPresets = (isArabic: boolean) => [
  { label: isArabic ? "أزرق نيلي" : "Blue & Indigo", value: "from-blue-600 to-indigo-950" },
  { label: isArabic ? "زمردي وتيلي" : "Emerald & Teal", value: "from-emerald-600 to-teal-900" },
  { label: isArabic ? "بنفسجي ملكي" : "Purple & Indigo", value: "from-purple-600 to-indigo-950" },
  { label: isArabic ? "كهرماني وبرتقالي" : "Amber & Orange", value: "from-amber-600 to-orange-900" },
  { label: isArabic ? "عنابي ملكي" : "Rose & Red", value: "from-rose-600 to-red-950" },
  { label: isArabic ? "سماوي وأزرق" : "Sky & Blue", value: "from-sky-600 to-blue-950" },
  { label: isArabic ? "فوشيا وبنفسجي" : "Fuchsia & Purple", value: "from-fuchsia-600 to-purple-900" },
  { label: isArabic ? "رمادي وفحمي" : "Slate & Dark", value: "from-slate-700 to-slate-950" },
];

export default function LibraryManagementPage() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";
  const gradientPresets = getGradientPresets(isArabic);

  // Data fetching
  const { data: facultiesList } = useFaculties();
  const faculties = facultiesList || [];

  const { data: stats, isLoading: isStatsLoading } = useLibraryStats();
  const { data: booksList, isLoading: isBooksLoading } = useLibraryBooks();
  const books = booksList || [];

  const { data: reservationsList, isLoading: isReservationsLoading } = useBookReservations();
  const reservations = reservationsList || [];

  // Mutations
  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();
  const deleteBookMutation = useDeleteBook();
  const updateReservationMutation = useUpdateReservationStatus();

  // Filters & View State
  const [activeTab, setActiveTab] = useState<"catalog" | "reservations">("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState("all");
  const [selectedAvailabilityFilter, setSelectedAvailabilityFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Reservation filter
  const [reservationStatusFilter, setReservationStatusFilter] = useState("all");

  // Add / Edit Modal State
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalTab, setModalTab] = useState<"general" | "cover" | "pdf" | "inventory" | "summary">("general");
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form Fields
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [authorAr, setAuthorAr] = useState("");
  const [authorEn, setAuthorEn] = useState("");
  const [isbn, setIsbn] = useState("");
  const [facultyId, setFacultyId] = useState<string>("none");
  const [category, setCategory] = useState("engineering");
  const [year, setYear] = useState<number>(2024);
  const [edition, setEdition] = useState("");
  const [pages, setPages] = useState<number>(0);
  const [bookLanguage, setBookLanguage] = useState("العربية");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverColor, setCoverColor] = useState("from-blue-600 to-indigo-950");
  const [pdfFile, setPdfFile] = useState("");
  const [pdfFileSize, setPdfFileSize] = useState<number>(0);
  const [pdfFileSizeFormatted, setPdfFileSizeFormatted] = useState("");
  const [allowDownload, setAllowDownload] = useState(true);
  const [totalCopies, setTotalCopies] = useState<number>(1);
  const [availableCopies, setAvailableCopies] = useState<number>(1);
  const [shelfLocation, setShelfLocation] = useState("");
  const [available, setAvailable] = useState(true);

  // Upload loading states
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  // Delete Modal
  const [deleteBookId, setDeleteBookId] = useState<number | null>(null);

  // Reset / Populate Modal
  const handleOpenModal = (bookToEdit: Book | null = null) => {
    setEditingBook(bookToEdit);
    setModalTab("general");

    if (bookToEdit) {
      setTitleAr(bookToEdit.titleAr || "");
      setTitleEn(bookToEdit.titleEn || "");
      setAuthorAr(bookToEdit.authorAr || "");
      setAuthorEn(bookToEdit.authorEn || "");
      setIsbn(bookToEdit.isbn || "");
      setFacultyId(bookToEdit.faculty ? String(bookToEdit.faculty) : "none");
      setCategory(bookToEdit.category || "engineering");
      setYear(bookToEdit.year || 2024);
      setEdition(bookToEdit.edition || "");
      setPages(bookToEdit.pages || 0);
      setBookLanguage(bookToEdit.language || "العربية");
      setDescriptionAr(bookToEdit.descriptionAr || "");
      setDescriptionEn(bookToEdit.descriptionEn || "");
      setCoverImage(bookToEdit.coverImage || "");
      setCoverColor(bookToEdit.coverColor || "from-blue-600 to-indigo-950");
      setPdfFile(bookToEdit.pdfFile || "");
      setPdfFileSize(bookToEdit.pdfFileSize || 0);
      setPdfFileSizeFormatted(bookToEdit.pdfFileSizeFormatted || "");
      setAllowDownload(bookToEdit.allowDownload ?? true);
      setTotalCopies(bookToEdit.totalCopies ?? 1);
      setAvailableCopies(bookToEdit.availableCopies ?? 1);
      setShelfLocation(bookToEdit.shelfLocation || "");
      setAvailable(bookToEdit.available ?? true);
    } else {
      setTitleAr("");
      setTitleEn("");
      setAuthorAr("");
      setAuthorEn("");
      setIsbn("");
      setFacultyId("none");
      setCategory("engineering");
      setYear(new Date().getFullYear());
      setEdition("الطبعة الأولى");
      setPages(0);
      setBookLanguage("العربية");
      setDescriptionAr("");
      setDescriptionEn("");
      setCoverImage("");
      setCoverColor("from-blue-600 to-indigo-950");
      setPdfFile("");
      setPdfFileSize(0);
      setPdfFileSizeFormatted("");
      setAllowDownload(true);
      setTotalCopies(1);
      setAvailableCopies(1);
      setShelfLocation("");
      setAvailable(true);
    }

    setIsOpenModal(true);
  };

  // Upload Cover Image Handler (strictly images, validated on server)
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side extension validation
    const validExts = ["image/jpeg", "image/png", "image/webp"];
    if (!validExts.includes(file.type)) {
      toast.error(isArabic ? "يُسمح فقط برفع صور من نوع JPG أو PNG أو WEBP" : "Only JPG, PNG, and WEBP images are allowed");
      return;
    }

    try {
      setIsUploadingCover(true);
      const res = await LibraryService.uploadCover(file);
      setCoverImage(res.url);
      toast.success(isArabic ? "تم رفع غلاف الكتاب بنجاح!" : "Cover uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل رفع صورة الغلاف" : "Failed to upload cover"));
    } finally {
      setIsUploadingCover(false);
      e.target.value = "";
    }
  };

  // Upload PDF Handler (STRICTLY PDF ONLY)
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict client-side check
    const isPdfExt = file.name.toLowerCase().endsWith(".pdf");
    const isPdfMime = file.type === "application/pdf" || file.type === "";
    if (!isPdfExt) {
      toast.error(
        isArabic
          ? "تنبيه أمني: يُسمح فقط وحصراً برفع ملفات PDF (.pdf)!"
          : "Security Alert: Only PDF files (.pdf) are strictly allowed!"
      );
      e.target.value = "";
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error(
        isArabic
          ? "حجم الملف يتجاوز الحد الأقصى المسموح به (100 ميغابايت)"
          : "File size exceeds 100MB limit"
      );
      return;
    }

    try {
      setIsUploadingPdf(true);
      const res = await LibraryService.uploadPdf(file);
      setPdfFile(res.url);
      setPdfFileSize(res.size);
      setPdfFileSizeFormatted(res.sizeFormatted);
      toast.success(isArabic ? "تم التحقق من ملف الـ PDF ورفعه بنجاح!" : "PDF verified and uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل رفع ملف الـ PDF. تحقق من ترويسة وصحة الملف." : "Failed to upload PDF."));
    } finally {
      setIsUploadingPdf(false);
      e.target.value = "";
    }
  };

  // Save Book
  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleAr.trim()) {
      toast.error(isArabic ? "يرجى إدخال عنوان الكتاب باللغة العربية" : "Please enter the book title in Arabic");
      setModalTab("general");
      return;
    }

    if (!titleEn.trim()) {
      toast.error(isArabic ? "يرجى إدخال عنوان الكتاب باللغة الإنجليزية" : "Please enter the book title in English");
      setModalTab("general");
      return;
    }

    if (!authorAr.trim()) {
      toast.error(isArabic ? "يرجى إدخال اسم المؤلف باللغة العربية" : "Please enter the author name in Arabic");
      setModalTab("general");
      return;
    }

    if (!authorEn.trim()) {
      toast.error(isArabic ? "يرجى إدخال اسم المؤلف باللغة الإنجليزية" : "Please enter the author name in English");
      setModalTab("general");
      return;
    }

    if (!category) {
      toast.error(isArabic ? "يرجى تحديد التخصص الأكاديمي للكتاب" : "Please select the academic discipline");
      setModalTab("general");
      return;
    }

    const numYear = Number(year);
    if (isNaN(numYear) || numYear < 1900 || numYear > 2099) {
      toast.error(isArabic ? "يرجى إدخال سنة نشر صحيحة بين 1900 و 2099" : "Please enter a valid publication year between 1900 and 2099");
      setModalTab("general");
      return;
    }

    const numTotalCopies = Number(totalCopies);
    if (isNaN(numTotalCopies) || numTotalCopies < 1) {
      toast.error(isArabic ? "يرجى إدخال إجمالي عدد النسخ المطبوعة (1 على الأقل)" : "Total copies must be at least 1");
      setModalTab("inventory");
      return;
    }

    const numAvailableCopies = Number(availableCopies);
    if (isNaN(numAvailableCopies) || numAvailableCopies < 0) {
      toast.error(isArabic ? "يرجى إدخال عدد صحيح للنسخ المتاحة" : "Available copies must be 0 or more");
      setModalTab("inventory");
      return;
    }

    if (numAvailableCopies > numTotalCopies) {
      toast.error(isArabic ? "النسخ المتاحة لا يمكن أن تتجاوز إجمالي عدد النسخ" : "Available copies cannot exceed total copies");
      setModalTab("inventory");
      return;
    }

    const matchedCat = CATEGORY_CHOICES.find((c) => c.id === category);

    const payload: Book = {
      titleAr: titleAr.trim(),
      titleEn: titleEn.trim() || titleAr.trim(),
      authorAr: authorAr.trim(),
      authorEn: authorEn.trim() || authorAr.trim(),
      isbn: isbn.trim(),
      faculty: facultyId !== "none" ? Number(facultyId) : null,
      category,
      categoryNameAr: matchedCat ? matchedCat.nameAr : "",
      categoryNameEn: matchedCat ? matchedCat.nameEn : "",
      year: numYear,
      edition: edition.trim(),
      pages: Number(pages) || 0,
      language: bookLanguage,
      descriptionAr: descriptionAr.trim(),
      descriptionEn: descriptionEn.trim() || descriptionAr.trim(),
      coverImage,
      coverColor,
      pdfFile,
      pdfFileSize,
      pdfFileSizeFormatted,
      allowDownload,
      totalCopies: numTotalCopies,
      availableCopies: numAvailableCopies,
      shelfLocation: shelfLocation.trim(),
      available,
    };

    try {
      if (editingBook && editingBook.id) {
        await updateBookMutation.mutateAsync({ id: editingBook.id, data: payload });
        toast.success(isArabic ? "تم تحديث بيانات الكتاب بنجاح!" : "Book updated successfully!");
      } else {
        await createBookMutation.mutateAsync(payload);
        toast.success(isArabic ? "تم إضافة الكتاب إلى المكتبة بنجاح!" : "Book added to library successfully!");
      }
      setIsOpenModal(false);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "حدث خطأ أثناء حفظ الكتاب" : "Failed to save book"));
    }
  };

  // Delete Book
  const handleDeleteBook = async () => {
    if (!deleteBookId) return;
    try {
      await deleteBookMutation.mutateAsync(deleteBookId);
      toast.success(isArabic ? "تم حذف الكتاب من الفهرس بنجاح!" : "Book deleted successfully!");
      setDeleteBookId(null);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل حذف الكتاب" : "Failed to delete book"));
    }
  };

  // Update Reservation Status
  const handleUpdateStatus = async (resId: number, newStatus: string) => {
    try {
      await updateReservationMutation.mutateAsync({ id: resId, status: newStatus });
      toast.success(isArabic ? "تم تحديث حالة طلب الاستعارة!" : "Reservation status updated!");
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل تحديث الحالة" : "Failed to update status"));
    }
  };

  // Filter books list
  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      b.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.authorAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.authorEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.isbn && b.isbn.includes(searchQuery));

    const matchesCategory =
      selectedCategoryFilter === "all" || b.category === selectedCategoryFilter;

    const matchesFaculty =
      selectedFacultyFilter === "all" || String(b.faculty) === selectedFacultyFilter;

    const matchesAvailability =
      selectedAvailabilityFilter === "all" ||
      (selectedAvailabilityFilter === "available" && b.available) ||
      (selectedAvailabilityFilter === "reserved" && !b.available);

    return matchesSearch && matchesCategory && matchesFaculty && matchesAvailability;
  });

  // Filter reservations list
  const filteredReservations = reservations.filter((r) => {
    if (reservationStatusFilter === "all") return true;
    return r.status === reservationStatusFilter;
  });

  return (
    <div className="space-y-8" dir={dir}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground mb-1.5 font-medium">
            <span>{isArabic ? "لوحة التحكم" : "Dashboard"}</span>
            <span>/</span>
            <span className="text-primary font-semibold">{isArabic ? "المكتبة والكتب" : "Library"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <BookMarked className="h-7 w-7 text-primary" />
            {isArabic ? "إدارة المكتبة المركزية والكتب" : "Central Library & Books Management"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            {isArabic
              ? "إدارة المراجع الأكاديمية والكتب، رفع ملفات الـ PDF حصراً، إدارة النسخ الورقية ومتابعة حجوزات الطلاب."
              : "Manage academic references and textbooks, strictly upload verified PDFs, manage print copies, and track reservations."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            className="bg-primary hover:bg-primary/95 text-white font-bold gap-2 shadow-lg shadow-primary/20 h-10 px-5 rounded-xl"
            onClick={() => handleOpenModal(null)}
          >
            <Plus className="h-4 w-4" />
            <span>{isArabic ? "إضافة كتاب جديد" : "Add New Book"}</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards - Compact Sleek Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* 1. Total Books */}
        <Card className="bg-card border-border/80 shadow-xs relative overflow-hidden rounded-xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-primary" />
          <CardHeader className="px-3.5 pt-3 pb-1">
            <CardDescription className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {isArabic ? "إجمالي الكتب" : "Total Books"}
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-black mt-1 text-foreground">
              {isStatsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.total ?? books.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3.5 pb-3 pt-0">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{isArabic ? "مراجع ومقررات مسجلة" : "Registered Titles"}</span>
            </p>
          </CardContent>
        </Card>

        {/* 2. Available Books */}
        <Card className="bg-card border-border/80 shadow-xs relative overflow-hidden rounded-xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
          <CardHeader className="px-3.5 pt-3 pb-1">
            <CardDescription className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {isArabic ? "الكتب المتاحة" : "Available"}
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-black mt-1 text-emerald-600 dark:text-emerald-400">
              {isStatsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.available ?? books.filter((b) => b.available).length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3.5 pb-3 pt-0">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{isArabic ? "جاهزة للإعارة الفورية" : "Ready to Borrow"}</span>
            </p>
          </CardContent>
        </Card>

        {/* 3. Borrowed */}
        <Card className="bg-card border-border/80 shadow-xs relative overflow-hidden rounded-xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-rose-500" />
          <CardHeader className="px-3.5 pt-3 pb-1">
            <CardDescription className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {isArabic ? "المستعارة حالياً" : "Borrowed / Reserved"}
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-black mt-1 text-rose-600 dark:text-rose-400">
              {isStatsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.reserved ?? books.filter((b) => !b.available).length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3.5 pb-3 pt-0">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span className="truncate">{isArabic ? "نسخ معارة للطلاب" : "Currently On Loan"}</span>
            </p>
          </CardContent>
        </Card>

        {/* 4. Digital PDF Editions */}
        <Card className="bg-card border-border/80 shadow-xs relative overflow-hidden rounded-xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500" />
          <CardHeader className="px-3.5 pt-3 pb-1">
            <CardDescription className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {isArabic ? "نسخ PDF رقمية" : "Digital PDFs"}
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-black mt-1 text-indigo-600 dark:text-indigo-400">
              {isStatsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.withPdf ?? books.filter((b) => !!b.pdfFile).length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3.5 pb-3 pt-0">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">{isArabic ? "ملفات مرفوعة ومحققة" : "Secure Digital Files"}</span>
            </p>
          </CardContent>
        </Card>

        {/* 5. Pending Reservations */}
        <Card className="bg-card border-border/80 shadow-xs relative overflow-hidden rounded-xl col-span-2 sm:col-span-1">
          <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />
          <CardHeader className="px-3.5 pt-3 pb-1">
            <CardDescription className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {isArabic ? "طلبات حجز معلقة" : "Pending Requests"}
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-black mt-1 text-amber-600 dark:text-amber-400">
              {isStatsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.pendingReservations ?? reservations.filter((r) => r.status === "pending").length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3.5 pb-3 pt-0">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{isArabic ? "بانتظار موافقة المكتبة" : "Pending Approval"}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs - Balanced Proportional Full-Width */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
        <div className="w-full pt-1 pb-1">
          <TabsList className="w-full grid grid-cols-2 h-11 sm:h-12 p-1 bg-muted/60 border border-border/60 rounded-xl shadow-xs">
            <TabsTrigger
              value="catalog"
              className="rounded-lg h-full gap-2 font-medium text-xs sm:text-sm data-[state=active]:font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <BookOpen className="h-4 w-4 text-primary shrink-0" />
              <span>{isArabic ? "فهرس الكتب والمراجع" : "Books Catalog"}</span>
              <Badge variant="secondary" className="mr-1.5 rtl:mr-0 rtl:ml-1.5 text-[11px] font-semibold px-2 py-0.5 min-w-[20px] h-4.5 justify-center">
                {books.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="reservations"
              className="rounded-lg h-full gap-2 font-medium text-xs sm:text-sm data-[state=active]:font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <BookOpenCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{isArabic ? "طلبات الحجز والاستعارة" : "Borrowing Requests"}</span>
              {reservations.filter((r) => r.status === "pending").length > 0 ? (
                <Badge className="mr-1.5 rtl:mr-0 rtl:ml-1.5 text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white px-2 py-0.5 min-w-[20px] h-4.5 justify-center">
                  {reservations.filter((r) => r.status === "pending").length}
                </Badge>
              ) : (
                <Badge variant="secondary" className="mr-1.5 rtl:mr-0 rtl:ml-1.5 text-[11px] font-semibold px-2 py-0.5 min-w-[20px] h-4.5 justify-center">
                  {reservations.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Books Catalog */}
        <TabsContent value="catalog" className="space-y-6 mt-6">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute top-1/2 left-3 rtl:right-3 rtl:left-auto -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={isArabic ? "ابحث بعنوان الكتاب، اسم الكاتب، أو الـ ISBN..." : "Search by title, author, or ISBN..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 rtl:pr-9 rtl:pl-4 bg-background"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                <SelectTrigger className="w-[150px] text-xs h-9 bg-background">
                  <SelectValue placeholder={isArabic ? "التخصص" : "Category"} />
                </SelectTrigger>
                <SelectContent dir={dir}>
                  <SelectItem value="all">{isArabic ? "جميع التخصصات" : "All Disciplines"}</SelectItem>
                  {CATEGORY_CHOICES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {isArabic ? cat.nameAr : cat.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Faculty Filter */}
              <Select value={selectedFacultyFilter} onValueChange={setSelectedFacultyFilter}>
                <SelectTrigger className="w-[150px] text-xs h-9 bg-background">
                  <SelectValue placeholder={isArabic ? "الكلية" : "Faculty"} />
                </SelectTrigger>
                <SelectContent dir={dir}>
                  <SelectItem value="all">{isArabic ? "جميع الكليات" : "All Faculties"}</SelectItem>
                  {faculties.map((fac) => (
                    <SelectItem key={fac.id} value={String(fac.id)}>
                      {isArabic ? fac.nameAr : fac.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Availability Filter */}
              <Select value={selectedAvailabilityFilter} onValueChange={setSelectedAvailabilityFilter}>
                <SelectTrigger className="w-[130px] text-xs h-9 bg-background">
                  <SelectValue placeholder={isArabic ? "الحالة" : "Status"} />
                </SelectTrigger>
                <SelectContent dir={dir}>
                  <SelectItem value="all">{isArabic ? "كل الحالات" : "All Status"}</SelectItem>
                  <SelectItem value="available">{isArabic ? "متاح فقط" : "Available Only"}</SelectItem>
                  <SelectItem value="reserved">{isArabic ? "مستعار فقط" : "Borrowed Only"}</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset */}
              {(searchQuery || selectedCategoryFilter !== "all" || selectedFacultyFilter !== "all" || selectedAvailabilityFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs gap-1 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategoryFilter("all");
                    setSelectedFacultyFilter("all");
                    setSelectedAvailabilityFilter("all");
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isArabic ? "إعادة ضبط" : "Reset"}</span>
                </Button>
              )}

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  title={isArabic ? "عرض جدول" : "Table View"}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  title={isArabic ? "عرض كروت" : "Grid View"}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Books List Content */}
          {isBooksLoading ? (
            <div className="flex flex-col items-center justify-center p-16 bg-card rounded-2xl border border-border">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">{isArabic ? "جاري تحميل سجلات المكتبة..." : "Loading library catalog..."}</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-card rounded-2xl border border-dashed border-border text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="font-bold text-base text-foreground">
                {isArabic ? "لم نجد أي كتب مطابقة لخيارات التصفية" : "No Books Found Matching Filters"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                {isArabic ? "يرجى تجربة كلمات بحث أخرى أو إضافة كتاب جديد إلى المكتبة." : "Try adjusting your search criteria or add a new book to the catalog."}
              </p>
              <Button
                className="mt-4 bg-primary text-white text-xs font-bold gap-2"
                onClick={() => handleOpenModal(null)}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isArabic ? "إضافة كتاب جديد الآن" : "Add Book Now"}</span>
              </Button>
            </div>
          ) : viewMode === "table" ? (
            /* Table View */
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-16 text-center">{isArabic ? "الغلاف" : "Cover"}</TableHead>
                    <TableHead>{isArabic ? "عنوان الكتاب والمؤلف" : "Title & Author"}</TableHead>
                    <TableHead>{isArabic ? "التخصص / الكلية" : "Discipline / Faculty"}</TableHead>
                    <TableHead>{isArabic ? "معلومات النشر" : "Publication & ISBN"}</TableHead>
                    <TableHead className="text-center">{isArabic ? "النسخ" : "Copies"}</TableHead>
                    <TableHead className="text-center">{isArabic ? "الملف الرقمي" : "Digital PDF"}</TableHead>
                    <TableHead className="text-center">{isArabic ? "الحالة" : "Status"}</TableHead>
                    <TableHead className="w-16 text-center">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((book) => {
                    const cat = CATEGORY_CHOICES.find((c) => c.id === book.category);
                    return (
                      <TableRow key={book.id} className="hover:bg-muted/30 transition-colors">
                        {/* Cover Thumbnail */}
                        <TableCell className="p-3 text-center">
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={book.titleAr}
                              className="h-14 w-10 object-cover rounded shadow border border-border mx-auto"
                            />
                          ) : (
                            <div
                              className={`h-14 w-10 rounded shadow bg-gradient-to-br ${book.coverColor || "from-blue-600 to-indigo-950"
                                } border border-white/20 mx-auto flex flex-col justify-between p-1 select-none text-[6px] text-white`}
                            >
                              <span className="font-mono text-[5px] text-white/60">ASU</span>
                              <span className="line-clamp-2 font-bold leading-tight">
                                {isArabic ? book.titleAr : book.titleEn}
                              </span>
                            </div>
                          )}
                        </TableCell>

                        {/* Title & Author */}
                        <TableCell>
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-foreground hover:text-primary transition-colors">
                              {isArabic ? book.titleAr : book.titleEn}
                            </h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <User className="h-3 w-3 text-slate-400" />
                              <span>{isArabic ? book.authorAr : book.authorEn}</span>
                            </p>
                            {book.shelfLocation && (
                              <p className="text-[11px] text-primary/80 font-mono">
                                📍 {book.shelfLocation}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        {/* Category & Faculty */}
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-[11px] font-semibold">
                              {isArabic ? cat?.nameAr || book.category : cat?.nameEn || book.category}
                            </Badge>
                            {book.facultyNameAr && (
                              <p className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                                {isArabic ? book.facultyNameAr : book.facultyNameEn}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        {/* Publication & ISBN */}
                        <TableCell>
                          <div className="space-y-1 text-xs">
                            <p className="font-mono text-muted-foreground">
                              ISBN: {book.isbn || "N/A"}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span>{book.year || "N/A"}</span>
                              {book.pages ? <span>• {book.pages} {isArabic ? "صفحة" : "pages"}</span> : null}
                            </div>
                          </div>
                        </TableCell>

                        {/* Copies */}
                        <TableCell className="text-center font-mono text-xs">
                          <span className="font-bold text-foreground">{book.availableCopies}</span>
                          <span className="text-muted-foreground"> / {book.totalCopies}</span>
                        </TableCell>

                        {/* Digital PDF Status */}
                        <TableCell className="text-center">
                          {book.pdfFile ? (
                            <div className="inline-flex flex-col items-center gap-1">
                              <a
                                href={book.pdfFile}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold transition-colors"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                <span>PDF</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                              {book.pdfFileSizeFormatted && (
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  {book.pdfFileSizeFormatted}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground/60">—</span>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="text-center">
                          {book.available ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                              {isArabic ? "متاح" : "Available"}
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              {isArabic ? "مستعار" : "Borrowed"}
                            </Badge>
                          )}
                        </TableCell>

                        {/* Actions Dropdown */}
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenModal(book)}>
                                <Edit className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary" />
                                <span>{isArabic ? "تعديل الكتاب" : "Edit Book"}</span>
                              </DropdownMenuItem>
                              {book.pdfFile && (
                                <DropdownMenuItem asChild>
                                  <a href={book.pdfFile} target="_blank" rel="noreferrer">
                                    <FileText className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-indigo-500" />
                                    <span>{isArabic ? "عرض ملف PDF" : "View PDF File"}</span>
                                  </a>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteBookId(book.id!)}
                              >
                                <Trash2 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                <span>{isArabic ? "حذف الكتاب" : "Delete Book"}</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* Card Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => {
                const cat = CATEGORY_CHOICES.find((c) => c.id === book.category);
                return (
                  <Card
                    key={book.id}
                    className="group relative flex flex-col justify-between overflow-hidden border-border hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-lg min-w-0 w-full"
                  >
                    <CardHeader className="p-4 pb-2 space-y-3 min-w-0">
                      {/* Cover presentation */}
                      <div className="relative aspect-[3/4.2] w-[130px] mx-auto rounded-lg shadow-md overflow-hidden border border-border group-hover:scale-105 transition-transform duration-300 shrink-0">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.titleAr}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-br ${book.coverColor || "from-blue-600 to-indigo-950"
                              } p-3 flex flex-col justify-between text-white select-none`}
                          >
                            <span className="text-[8px] font-mono tracking-widest text-white/50 bg-black/20 w-fit px-1.5 py-0.5 rounded">
                              ASU LIB
                            </span>
                            <h4 className="text-xs font-bold leading-tight drop-shadow line-clamp-3">
                              {isArabic ? book.titleAr : book.titleEn}
                            </h4>
                            <p className="text-[9px] text-white/80 font-semibold truncate border-t border-white/20 pt-1.5">
                              {isArabic ? book.authorAr : book.authorEn}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="space-y-1.5 text-start pt-2 min-w-0">
                        <div className="flex items-center justify-between min-w-0 gap-2">
                          <Badge variant="outline" className="text-[10px] font-bold truncate max-w-[70%]">
                            <span className="truncate">{isArabic ? cat?.nameAr : cat?.nameEn}</span>
                          </Badge>
                          <span className="text-[10px] font-mono text-muted-foreground shrink-0">{book.year}</span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {isArabic ? book.titleAr : book.titleEn}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {isArabic ? book.authorAr : book.authorEn}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground truncate">
                          ISBN: {book.isbn || "—"}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 pt-2 border-t border-border mt-auto min-w-0">
                      <div className="flex items-center justify-between text-xs mb-3 min-w-0">
                        <span className="text-muted-foreground truncate">
                          {isArabic ? "النسخ المتاحة:" : "Available:"}
                        </span>
                        <span className="font-mono font-bold shrink-0">
                          {book.availableCopies} / {book.totalCopies}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 min-w-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs font-semibold gap-1.5 min-w-0"
                          onClick={() => handleOpenModal(book)}
                        >
                          <Edit className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate">{isArabic ? "تعديل" : "Edit"}</span>
                        </Button>
                        {book.pdfFile && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs gap-1 shrink-0"
                            asChild
                          >
                            <a href={book.pdfFile} target="_blank" rel="noreferrer">
                              <FileText className="h-3.5 w-3.5 text-indigo-500" />
                              <span>PDF</span>
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteBookId(book.id!)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Reservations Management */}
        <TabsContent value="reservations" className="space-y-6 mt-6">
          {/* Reservation Filters */}
          <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">
                {isArabic ? "تصفية حسب الحالة:" : "Filter by Status:"}
              </span>
              <Select value={reservationStatusFilter} onValueChange={setReservationStatusFilter}>
                <SelectTrigger className="w-[180px] text-xs h-9 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir={dir}>
                  <SelectItem value="all">{isArabic ? "جميع الطلبات" : "All Requests"}</SelectItem>
                  <SelectItem value="pending">{isArabic ? "قيد الانتظار" : "Pending"}</SelectItem>
                  <SelectItem value="approved">{isArabic ? "تمت الموافقة" : "Approved"}</SelectItem>
                  <SelectItem value="borrowed">{isArabic ? "مستعار حالياً" : "Borrowed"}</SelectItem>
                  <SelectItem value="returned">{isArabic ? "تمت الإعادة" : "Returned"}</SelectItem>
                  <SelectItem value="cancelled">{isArabic ? "ملغى" : "Cancelled"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <span className="text-xs text-muted-foreground font-mono">
              {isArabic ? `إجمالي الطلبات: ${filteredReservations.length}` : `Total Requests: ${filteredReservations.length}`}
            </span>
          </div>

          {/* Reservations Table */}
          {isReservationsLoading ? (
            <div className="flex flex-col items-center justify-center p-16 bg-card rounded-2xl border border-border">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">{isArabic ? "جاري تحميل طلبات الحجز..." : "Loading reservations..."}</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-card rounded-2xl border border-dashed border-border text-center">
              <BookOpenCheck className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="font-bold text-base text-foreground">
                {isArabic ? "لا توجد طلبات حجز حالياً" : "No Reservation Requests Found"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                {isArabic ? "عندما يقوم الطلاب بحجز الكتب من الفهرس العام، ستظهر الطلبات هنا للإدارة والاعتماد." : "Student borrow requests from the catalog will show up here for review and approval."}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>{isArabic ? "الطالب المستعير" : "Student"}</TableHead>
                    <TableHead>{isArabic ? "الكتاب المطلوب" : "Book Requested"}</TableHead>
                    <TableHead>{isArabic ? "تاريخ الحجز والمهلة" : "Reservation Timeline"}</TableHead>
                    <TableHead className="text-center">{isArabic ? "الحالة" : "Status"}</TableHead>
                    <TableHead className="text-center">{isArabic ? "إجراءات الاعتماد" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((res) => {
                    return (
                      <TableRow key={res.id} className="hover:bg-muted/30 transition-colors">
                        {/* Student */}
                        <TableCell>
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-foreground">{res.studentName}</h4>
                            <p className="text-xs text-muted-foreground font-mono">
                              ID: {res.studentId} {res.studentMajor ? `• ${res.studentMajor}` : ""}
                            </p>
                            {(res.studentPhone || res.studentEmail) && (
                              <p className="text-[11px] text-slate-500">
                                📞 {res.studentPhone} {res.studentEmail ? `• ${res.studentEmail}` : ""}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        {/* Book */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {res.bookCoverImage ? (
                              <img src={res.bookCoverImage} alt="" className="h-10 w-8 object-cover rounded shadow border border-border shrink-0" />
                            ) : (
                              <div className="h-10 w-8 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                📖
                              </div>
                            )}
                            <div>
                              <h5 className="font-bold text-xs text-foreground line-clamp-1">{res.bookTitleAr}</h5>
                              <p className="text-[11px] text-muted-foreground line-clamp-1">{res.bookTitleEn}</p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Timeline */}
                        <TableCell>
                          <div className="space-y-0.5 text-xs">
                            <p className="text-muted-foreground">
                              {isArabic ? "طلب بتاريخ:" : "Requested:"}{" "}
                              {res.reservedAt ? new Date(res.reservedAt).toLocaleDateString("ar-SY") : "—"}
                            </p>
                            {res.expiresAt && (
                              <p className="text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                                {isArabic ? "مهلة الاستلام حتى:" : "Expires:"}{" "}
                                {new Date(res.expiresAt).toLocaleDateString("ar-SY")}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="text-center">
                          {res.status === "pending" && (
                            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs">
                              {isArabic ? "قيد الانتظار" : "Pending"}
                            </Badge>
                          )}
                          {res.status === "approved" && (
                            <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-xs">
                              {isArabic ? "تمت الموافقة" : "Approved"}
                            </Badge>
                          )}
                          {res.status === "borrowed" && (
                            <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-xs">
                              {isArabic ? "مستعار حالياً" : "Borrowed"}
                            </Badge>
                          )}
                          {res.status === "returned" && (
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                              {isArabic ? "تمت الإعادة" : "Returned"}
                            </Badge>
                          )}
                          {res.status === "cancelled" && (
                            <Badge variant="destructive" className="text-xs">
                              {isArabic ? "ملغى" : "Cancelled"}
                            </Badge>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {res.status === "pending" && (
                              <Button
                                size="sm"
                                className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                                onClick={() => handleUpdateStatus(res.id!, "approved")}
                              >
                                {isArabic ? "موافقة" : "Approve"}
                              </Button>
                            )}
                            {res.status === "approved" && (
                              <Button
                                size="sm"
                                className="h-8 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                                onClick={() => handleUpdateStatus(res.id!, "borrowed")}
                              >
                                {isArabic ? "تسليم الكتاب" : "Hand Over"}
                              </Button>
                            )}
                            {res.status === "borrowed" && (
                              <Button
                                size="sm"
                                className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                                onClick={() => handleUpdateStatus(res.id!, "returned")}
                              >
                                {isArabic ? "استلام الإعادة" : "Return Book"}
                              </Button>
                            )}
                            {(res.status === "pending" || res.status === "approved") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-destructive hover:bg-destructive/10 text-xs"
                                onClick={() => handleUpdateStatus(res.id!, "cancelled")}
                              >
                                {isArabic ? "إلغاء" : "Cancel"}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add / Edit Book Modal Dialog */}
      <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
        <DialogContent className="sm:max-w-3xl md:max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden w-[95vw]" dir={dir}>
          <DialogHeader className="p-5 sm:p-6 pb-4 border-b border-border bg-muted/20 shrink-0">
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5">
              <BookMarked className="h-6 w-6 text-primary" />
              <span>
                {editingBook
                  ? isArabic
                    ? "تعديل بيانات الكتاب الأكاديمي"
                    : "Edit Academic Book"
                  : isArabic
                    ? "إضافة كتاب ومصدر أكاديمي جديد"
                    : "Add New Academic Book"}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              {isArabic
                ? "أدخل بيانات الكتاب بدقة، وقم برفع الغلاف وملف الـ PDF."
                : "Fill in book details, upload cover image and digital PDF file."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveBook} className="flex flex-col flex-1 overflow-hidden min-h-0">
            {/* Modal Tabs Bar */}
            <div className="px-5 sm:px-6 pt-3 pb-2 bg-muted/20 border-b border-border shrink-0">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-muted/60 border border-border/60 rounded-xl">
                <button
                  type="button"
                  onClick={() => setModalTab("general")}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-2.5 rounded-lg text-xs font-bold transition-all duration-200",
                    modalTab === "general"
                      ? "bg-background text-foreground shadow-xs font-black text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span className="truncate">{isArabic ? "المعلومات العامة" : "General"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("cover")}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-2.5 rounded-lg text-xs font-bold transition-all duration-200",
                    modalTab === "cover"
                      ? "bg-background text-foreground shadow-xs font-black text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <ImageIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{isArabic ? "غلاف الكتاب" : "Cover"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("pdf")}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-2.5 rounded-lg text-xs font-bold transition-all duration-200",
                    modalTab === "pdf"
                      ? "bg-background text-foreground shadow-xs font-black text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="truncate">{isArabic ? "ملف الـ PDF" : "PDF File"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("inventory")}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-2.5 rounded-lg text-xs font-bold transition-all duration-200",
                    modalTab === "inventory"
                      ? "bg-background text-foreground shadow-xs font-black text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <Layers className="h-4 w-4 shrink-0" />
                  <span className="truncate">{isArabic ? "النسخ والرفوف" : "Copies"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("summary")}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-2.5 rounded-lg text-xs font-bold transition-all duration-200 col-span-2 sm:col-span-1",
                    modalTab === "summary"
                      ? "bg-background text-foreground shadow-xs font-black text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <Hash className="h-4 w-4 shrink-0" />
                  <span className="truncate">{isArabic ? "الوصف والملخص" : "Summary"}</span>
                </button>
              </div>
            </div>

            <DialogBody className="p-5 sm:p-6 overflow-y-auto overflow-x-hidden space-y-6 flex-1 min-h-0">

              {/* Tab 1: General Info */}
              {modalTab === "general" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        {isArabic ? "عنوان الكتاب بالعربية" : "Book Title in Arabic"}
                      </Label>
                      <Input
                        value={titleAr}
                        onChange={(e) => setTitleAr(e.target.value)}
                        placeholder={isArabic ? "مثال: مبادئ الهندسة المدنية والإنشائية" : "e.g. Principles of Civil Engineering"}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        {isArabic ? "عنوان الكتاب بالإنجليزية" : "Book Title in English"}
                      </Label>
                      <Input
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        placeholder="e.g. Principles of Civil Engineering"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        {isArabic ? "اسم المؤلف بالعربية" : "Author Name in Arabic"}
                      </Label>
                      <Input
                        value={authorAr}
                        onChange={(e) => setAuthorAr(e.target.value)}
                        placeholder={isArabic ? "مثال: د. أحمد خليل" : "e.g. Dr. Ahmed Khalil"}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        {isArabic ? "اسم المؤلف بالإنجليزية" : "Author Name in English"}
                      </Label>
                      <Input
                        value={authorEn}
                        onChange={(e) => setAuthorEn(e.target.value)}
                        placeholder="e.g. Dr. Ahmed Khalil"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        {isArabic ? "التخصص الأكاديمي" : "Academic Discipline"}
                      </Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent dir={dir}>
                          {CATEGORY_CHOICES.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {isArabic ? cat.nameAr : cat.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        {isArabic ? "الكلية التابع لها الكتاب" : "Faculty"}
                      </Label>
                      <Select value={facultyId} onValueChange={setFacultyId}>
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder={isArabic ? "اختر الكلية..." : "Select Faculty..."} />
                        </SelectTrigger>
                        <SelectContent dir={dir}>
                          <SelectItem value="none">{isArabic ? "عام، دون تخصيص كلية" : "General - All Faculties"}</SelectItem>
                          {faculties.map((fac) => (
                            <SelectItem key={fac.id} value={String(fac.id)}>
                              {isArabic ? fac.nameAr : fac.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        {isArabic ? "الرقم الدولي ISBN" : "ISBN Number"}
                      </Label>
                      <Input
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        placeholder="978-3-16-148410-0"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        {isArabic ? "سنة النشر" : "Publication Year"}
                      </Label>
                      <Input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        min={1950}
                        max={2030}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        {isArabic ? "رقم الطبعة" : "Edition"}
                      </Label>
                      <Input
                        value={edition}
                        onChange={(e) => setEdition(e.target.value)}
                        placeholder={isArabic ? "مثال: الطبعة الثالثة" : "e.g. 3rd Edition"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        {isArabic ? "عدد الصفحات" : "Pages Count"}
                      </Label>
                      <Input
                        type="number"
                        value={pages}
                        onChange={(e) => setPages(Number(e.target.value))}
                        min={0}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        {isArabic ? "لغة الكتاب" : "Language"}
                      </Label>
                      <Select value={bookLanguage} onValueChange={setBookLanguage}>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent dir={dir}>
                          <SelectItem value="العربية">{isArabic ? "العربية" : "Arabic"}</SelectItem>
                          <SelectItem value="الإنجليزية">{isArabic ? "الإنجليزية" : "English"}</SelectItem>
                          <SelectItem value="الفرنسية">{isArabic ? "الفرنسية" : "French"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Book Cover */}
              {modalTab === "cover" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-muted/30 border border-border">
                    {/* Live Preview */}
                    <div className="relative aspect-[3/4.2] w-[130px] shrink-0 rounded-lg shadow-lg overflow-hidden border border-border">
                      {coverImage ? (
                        <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${coverColor} p-3 flex flex-col justify-between text-white select-none`}
                        >
                          <span className="text-[8px] font-mono tracking-widest text-white/50 bg-black/20 w-fit px-1.5 py-0.5 rounded">
                            ASU LIB
                          </span>
                          <h4 className="text-xs font-bold leading-tight drop-shadow line-clamp-3">
                            {titleAr || (isArabic ? "عنوان الكتاب" : "Book Title")}
                          </h4>
                          <p className="text-[9px] text-white/80 font-semibold truncate border-t border-white/20 pt-1.5">
                            {authorAr || (isArabic ? "اسم المؤلف" : "Author Name")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="space-y-4 flex-1">
                      <div>
                        <h4 className="font-bold text-sm text-foreground">
                          {isArabic ? "صورة الغلاف" : "Cover Image"}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isArabic
                            ? "الامتدادات المدعومة: JPG و PNG و WebP. الحد الأقصى 5 ميغابايت."
                            : "Supported formats: JPG, PNG, WebP. Maximum size: 5 MB."}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer">
                          <Button
                            type="button"
                            variant="outline"
                            className="gap-2 text-xs font-bold"
                            disabled={isUploadingCover}
                            asChild
                          >
                            <span>
                              {isUploadingCover ? (
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              ) : (
                                <UploadCloud className="h-4 w-4 text-primary" />
                              )}
                              <span>{isArabic ? "اختيار صورة الغلاف..." : "Browse Image..."}</span>
                            </span>
                          </Button>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleCoverUpload}
                            disabled={isUploadingCover}
                          />
                        </label>

                        {coverImage && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => setCoverImage("")}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1 rtl:ml-1 rtl:mr-0" />
                            <span>{isArabic ? "إزالة الغلاف" : "Remove"}</span>
                          </Button>
                        )}
                      </div>

                      {/* Fallback Gradient Picker */}
                      <div className="space-y-2 pt-2 border-t border-border">
                        <Label className="text-xs font-bold">
                          {isArabic ? "التدرج اللوني البديل للغلاف" : "Fallback Cover Gradient"}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isArabic ? "يُستخدم كخلفية افتراضية في حال عدم رفع صورة مخصصة للغلاف" : "Used as the default backdrop when no custom cover image is provided"}
                        </p>
                        <Select value={coverColor} onValueChange={setCoverColor}>
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent dir={dir}>
                            {gradientPresets.map((grad) => (
                              <SelectItem key={grad.value} value={grad.value}>
                                {grad.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Digital PDF */}
              {modalTab === "pdf" && (
                <div className="space-y-6">
                  {/* Upload State Box */}
                  <div className="p-6 rounded-2xl border-2 border-dashed border-border bg-card text-center space-y-4">
                    {pdfFile ? (
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">
                            {isArabic ? "تم رفع ملف الـ PDF بنجاح!" : "PDF File Uploaded Successfully!"}
                          </h4>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">
                            {pdfFileSizeFormatted ? `${isArabic ? "الحجم:" : "Size:"} ${pdfFileSizeFormatted}` : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-2 text-xs"
                            asChild
                          >
                            <a href={pdfFile} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>{isArabic ? "فتح ومعاينة الـ PDF" : "Preview PDF"}</span>
                            </a>
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setPdfFile("");
                              setPdfFileSize(0);
                              setPdfFileSizeFormatted("");
                            }}
                          >
                            <X className="h-3.5 w-3.5 mr-1 rtl:ml-1 rtl:mr-0" />
                            <span>{isArabic ? "حذف الملف" : "Delete File"}</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">
                            {isArabic ? "الكتاب الإلكتروني بصيغة PDF" : "Digital PDF Edition"}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {isArabic
                              ? "يقبل ملفات PDF فقط بحجم أقصى يصل إلى 100 ميغابايت"
                              : "Accepts PDF documents only, up to 100 MB"}
                          </p>
                        </div>

                        <label className="cursor-pointer inline-block">
                          <Button
                            type="button"
                            className="bg-primary hover:bg-primary/95 text-white text-xs font-bold gap-2"
                            disabled={isUploadingPdf}
                            asChild
                          >
                            <span>
                              {isUploadingPdf ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UploadCloud className="h-4 w-4" />
                              )}
                              <span>{isArabic ? "اختيار ملف PDF ورفعه..." : "Browse and Upload PDF..."}</span>
                            </span>
                          </Button>
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            onChange={handlePdfUpload}
                            disabled={isUploadingPdf}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* PDF Download Permission Switch */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-bold text-foreground">
                        {isArabic ? "السماح للطلاب بالتحميل المباشر للـ PDF" : "Allow Direct PDF Download"}
                      </Label>
                      <p className="text-[11px] text-muted-foreground">
                        {isArabic
                          ? "عند التفعيل، يمكن للطلاب تحميل الكتاب مباشرة من الفهرس العام؛ عند الإلغاء، يتاح فقط الحجز والقراءة المرجعية."
                          : "Enable direct student downloads from the public catalog."}
                      </p>
                    </div>
                    <Switch
                      checked={allowDownload}
                      onCheckedChange={setAllowDownload}
                    />
                  </div>
                </div>
              )}

              {/* Tab 4: Inventory & Location */}
              {modalTab === "inventory" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        {isArabic ? "إجمالي النسخ المطبوعة" : "Total Physical Copies"}
                      </Label>
                      <Input
                        type="number"
                        value={totalCopies}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTotalCopies(val);
                          if (availableCopies > val) setAvailableCopies(val);
                        }}
                        min={1}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        {isArabic ? "النسخ المتاحة للإعارة" : "Available Copies"}
                      </Label>
                      <Input
                        type="number"
                        value={availableCopies}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setAvailableCopies(val);
                          setAvailable(val > 0);
                        }}
                        min={0}
                        max={totalCopies}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">
                      {isArabic ? "موقع الرف في المكتبة" : "Shelf Location"}
                    </Label>
                    <Input
                      value={shelfLocation}
                      onChange={(e) => setShelfLocation(e.target.value)}
                      placeholder={isArabic ? "مثال: جناح الهندسة - قاعة A2 - رف 4" : "e.g. Engineering Wing - Room A2 - Shelf 4"}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border mt-4">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-bold text-foreground">
                        {isArabic ? "حالة توفر الكتاب للإعارة" : "Is Available for Borrowing"}
                      </Label>
                      <p className="text-[11px] text-muted-foreground">
                        {isArabic
                          ? "إذا تم تعطيل الخيار، سيظهر الكتاب بحالة 'مستعار حالياً' للطلاب."
                          : "If turned off, book displays as Currently Borrowed."}
                      </p>
                    </div>
                    <Switch
                      checked={available}
                      onCheckedChange={setAvailable}
                    />
                  </div>
                </div>
              )}

              {/* Tab 5: Summary */}
              {modalTab === "summary" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">
                      {isArabic ? "نبذة ووصف الكتاب بالعربية" : "Book Description in Arabic"}
                    </Label>
                    <Textarea
                      rows={4}
                      value={descriptionAr}
                      onChange={(e) => setDescriptionAr(e.target.value)}
                      placeholder={isArabic ? "اكتب ملخصاً أو نبذة تعريفية عن محتوى الكتاب وموضوعاته الأكاديمية..." : "Write a summary or abstract about the book and its academic topics..."}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">
                      {isArabic ? "نبذة ووصف الكتاب بالإنجليزية" : "Book Description in English"}
                    </Label>
                    <Textarea
                      rows={4}
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      placeholder="Write abstract and academic subjects covered by the book..."
                      dir="ltr"
                    />
                  </div>
                </div>
              )}
            </DialogBody>

            <DialogFooter className="p-4 px-6 border-t border-border bg-muted/20 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                className="text-xs"
                onClick={() => setIsOpenModal(false)}
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>

              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-white font-bold text-xs gap-2"
                disabled={createBookMutation.isPending || updateBookMutation.isPending}
              >
                {(createBookMutation.isPending || updateBookMutation.isPending) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>
                  {editingBook
                    ? isArabic
                      ? "حفظ التعديلات"
                      : "Save Changes"
                    : isArabic
                      ? "إضافة الكتاب للمكتبة"
                      : "Add Book"}
                </span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteBookId !== null} onOpenChange={(open) => { if (!open) setDeleteBookId(null); }}>
        <DialogContent className="max-w-md" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{isArabic ? "تأكيد حذف الكتاب" : "Confirm Book Deletion"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2">
              {isArabic
                ? "هل أنت متأكد من رغبتك في حذف هذا الكتاب من فهرس المكتبة نهائياً؟ لن يتمكن الطلاب من الوصول إليه مجدداً."
                : "Are you sure you want to permanently delete this book from the library catalog?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteBookId(null)}>
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteBook}
              disabled={deleteBookMutation.isPending}
            >
              {deleteBookMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1 rtl:ml-1 rtl:mr-0" />
              ) : null}
              <span>{isArabic ? "تأكيد الحذف" : "Confirm Delete"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
