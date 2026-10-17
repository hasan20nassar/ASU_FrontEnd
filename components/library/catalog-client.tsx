"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Search,
  BookOpen,
  Filter,
  Clock,
  User,
  Hash,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  BookMarked,
  ChevronRight,
  BookOpenCheck,
  CalendarDays,
  BookmarkCheck,
  LayoutGrid,
  List,
  FileText,
  ExternalLink,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useLibraryBooks, useReserveBook } from "@/hooks/use-library";

// Books data interface
interface Book {
  id: string | number;
  titleAr: string;
  titleEn: string;
  authorAr: string;
  authorEn: string;
  year?: number;
  isbn?: string;
  category?: string;
  coverColor?: string;
  coverImage?: string;
  pdfFile?: string;
  allowDownload?: boolean;
  available?: boolean;
  reservedBy?: string;
}


const INITIAL_BOOKS: Book[] = [
  {
    id: "1",
    titleAr: "مبادئ الهندسة المدنية والإنشائية",
    titleEn: "Principles of Civil and Structural Engineering",
    authorAr: "د. أحمد خليل",
    authorEn: "Dr. Ahmed Khalil",
    year: 2022,
    isbn: "978-3-16-148410-0",
    category: "engineering",
    coverColor: "from-blue-600 to-indigo-950",
    available: true,
  },
  {
    id: "2",
    titleAr: "الذكاء الاصطناعي وتعلم الآلة للمهندسين",
    titleEn: "Artificial Intelligence and Machine Learning for Engineers",
    authorAr: "د. سامر عبيد",
    authorEn: "Dr. Samer Obeid",
    year: 2023,
    isbn: "978-1-49-195035-7",
    category: "engineering",
    coverColor: "from-cyan-600 to-blue-900",
    available: true,
  },
  {
    id: "3",
    titleAr: "علم الأدوية السريري والصيدلانيات",
    titleEn: "Clinical Pharmacology and Pharmaceutics",
    authorAr: "د. رانيا الحسن",
    authorEn: "Dr. Rania Al-Hassan",
    year: 2021,
    isbn: "978-0-12-385095-9",
    category: "pharmacy",
    coverColor: "from-emerald-600 to-teal-900",
    available: true,
  },
  {
    id: "4",
    titleAr: "الكيمياء الدوائية وتصميم الدواء",
    titleEn: "Medicinal Chemistry and Drug Design",
    authorAr: "د. علي سليمان",
    authorEn: "Dr. Ali Suleiman",
    year: 2023,
    isbn: "978-0-08-100613-9",
    category: "pharmacy",
    coverColor: "from-green-600 to-emerald-950",
    available: false,
  },
  {
    id: "5",
    titleAr: "مقدمة في تشريح ورسم الأسنان",
    titleEn: "Introduction to Dental Anatomy and Orthodontics",
    authorAr: "د. مها معروف",
    authorEn: "Dr. Maha Maarouf",
    year: 2020,
    isbn: "978-0-323-40030-5",
    category: "dentistry",
    coverColor: "from-purple-600 to-indigo-950",
    available: true,
  },
  {
    id: "6",
    titleAr: "جراحة الفم والوجه والفكين المعاصرة",
    titleEn: "Contemporary Oral and Maxillofacial Surgery",
    authorAr: "د. باسل الحسين",
    authorEn: "Dr. Basel Al-Hussein",
    year: 2022,
    isbn: "978-0-323-09177-0",
    category: "dentistry",
    coverColor: "from-fuchsia-600 to-purple-900",
    available: true,
  },
  {
    id: "7",
    titleAr: "إدارة الأعمال الدولية والتسويق الرقمي",
    titleEn: "International Business and Digital Marketing",
    authorAr: "د. خالد منصور",
    authorEn: "Dr. Khaled Mansour",
    year: 2022,
    isbn: "978-0-13-425810-2",
    category: "business",
    coverColor: "from-amber-600 to-orange-900",
    available: true,
  },
  {
    id: "8",
    titleAr: "السلوك التنظيمي وإدارة الموارد البشرية",
    titleEn: "Organizational Behavior and HR Management",
    authorAr: "د. منى اليازجي",
    authorEn: "Dr. Mona Al-Yaziji",
    year: 2021,
    isbn: "978-1-119-32085-2",
    category: "business",
    coverColor: "from-yellow-600 to-amber-950",
    available: false,
  },
  {
    id: "9",
    titleAr: "أصول القانون الدستوري والأنظمة القانونية",
    titleEn: "Principles of Constitutional Law and Legal Systems",
    authorAr: "د. يوسف حرب",
    authorEn: "Dr. Yousef Harb",
    year: 2020,
    isbn: "978-0-19-967980-5",
    category: "law",
    coverColor: "from-rose-600 to-red-950",
    available: true,
  },
  {
    id: "10",
    titleAr: "القانون التجاري الدولي والتحكيم",
    titleEn: "International Commercial Law and Arbitration",
    authorAr: "د. هالة سلامة",
    authorEn: "Dr. Hala Salameh",
    year: 2023,
    isbn: "978-1-84946-455-0",
    category: "law",
    coverColor: "from-red-600 to-rose-900",
    available: true,
  },
  {
    id: "11",
    titleAr: "قواعد اللغة الإنجليزية الأكاديمية والترجمة",
    titleEn: "Academic English Grammar and Translation",
    authorAr: "د. نسرين الجابي",
    authorEn: "Dr. Nisreen Al-Jabi",
    year: 2021,
    isbn: "978-0-521-18751-0",
    category: "arts",
    coverColor: "from-violet-650 to-indigo-950",
    available: true,
  },
  {
    id: "12",
    titleAr: "تاريخ الأدب العربي المقارن",
    titleEn: "History of Comparative Arabic Literature",
    authorAr: "د. زياد القوتلي",
    authorEn: "Dr. Ziad Al-Quwatli",
    year: 2019,
    isbn: "978-9-953-04980-4",
    category: "arts",
    coverColor: "from-purple-750 to-pink-950",
    available: true,
  },
  {
    id: "13",
    titleAr: "الفيزياء الجامعية العامة والميكانيك",
    titleEn: "General University Physics and Mechanics",
    authorAr: "د. طارق العيسمي",
    authorEn: "Dr. Tariq Al-Aissami",
    year: 2023,
    isbn: "978-0-13-398214-5",
    category: "sciences",
    coverColor: "from-sky-600 to-blue-950",
    available: true,
  },
  {
    id: "14",
    titleAr: "الكيمياء العامة والعضوية الحيوية",
    titleEn: "General and Bio-Organic Chemistry",
    authorAr: "د. ريم الخوري",
    authorEn: "Dr. Reem Al-Khoury",
    year: 2022,
    isbn: "978-0-13-407210-4",
    category: "sciences",
    coverColor: "from-cyan-600 to-teal-950",
    available: false,
  },
];

const CATEGORIES = [
  { id: "all", nameEn: "All Categories", nameAr: "جميع الأقسام" },
  { id: "engineering", nameEn: "Engineering", nameAr: "الهندسة", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { id: "pharmacy", nameEn: "Pharmacy", nameAr: "الصيدلة", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { id: "dentistry", nameEn: "Dentistry", nameAr: "طب الأسنان", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { id: "business", nameEn: "Business Administration", nameAr: "إدارة الأعمال", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { id: "law", nameEn: "Law", nameAr: "الحقوق", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  { id: "arts", nameEn: "Arts & Languages", nameAr: "الآداب واللغات", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  { id: "sciences", nameEn: "Basic Sciences", nameAr: "العلوم الأساسية", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
];

const AVAILABILITY_FILTERS = [
  { id: "all", nameEn: "All Books", nameAr: "كل الكتب" },
  { id: "available", nameEn: "Available Only", nameAr: "المتاحة فقط" },
  { id: "reserved", nameEn: "Borrowed / Reserved", nameAr: "المستعارة / المحجوزة" },
];

export default function CatalogClient() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameter setup
  const queryParam = searchParams.get("q") || "";

  // Backend queries & mutations
  const { data: backendBooks, isLoading: isBackendLoading } = useLibraryBooks();
  const reserveMutation = useReserveBook();

  // States
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");

  // Sync books with backend data
  useEffect(() => {
    if (backendBooks && backendBooks.length > 0) {
      setBooks(
        backendBooks.map((b) => ({
          id: b.id!,
          titleAr: b.titleAr,
          titleEn: b.titleEn,
          authorAr: b.authorAr,
          authorEn: b.authorEn,
          year: b.year ?? 2024,
          isbn: b.isbn ?? "",
          category: b.category ?? "engineering",
          coverColor: b.coverColor ?? "from-blue-600 to-indigo-950",
          coverImage: b.coverImage,
          pdfFile: b.pdfFile,
          allowDownload: b.allowDownload ?? true,
          available: b.available ?? true,
        }))
      );
    }
  }, [backendBooks]);

  // Selected book for reservation
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Reservation form states
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentMajor, setStudentMajor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sync state if query parameter changes
  useEffect(() => {
    Promise.resolve().then(() => {
      setSearchTerm(queryParam);
    });
  }, [queryParam]);

  // Handle URL updates when search text changes
  const triggerSearch = (text: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (text.trim()) {
      params.set("q", text.trim());
    } else {
      params.delete("q");
    }
    router.replace(`/library?${params.toString()}`);
  };

  // Filtered books array
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      book.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authorEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authorAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.isbn && book.isbn.includes(searchTerm));

    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;

    const matchesAvailability =
      selectedAvailability === "all" ||
      (selectedAvailability === "available" && book.available) ||
      (selectedAvailability === "reserved" && !book.available);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Calculate live stats
  const totalBooksCount = books.length;
  const availableBooksCount = books.filter((b) => b.available).length;
  const reservedBooksCount = totalBooksCount - availableBooksCount;

  // Handle Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedAvailability("all");
    router.replace("/library");
  };

  // Reserve submit action
  const handleReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;
    if (!studentId.trim() || !studentName.trim() || !studentMajor.trim()) {
      toast.error(isArabic ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill out all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedBook.id) {
        await reserveMutation.mutateAsync({
          id: Number(selectedBook.id),
          data: {
            studentName: studentName.trim(),
            studentId: studentId.trim(),
            studentMajor: studentMajor.trim(),
          },
        });
      }

      setBooks((prevBooks) =>
        prevBooks.map((b) =>
          b.id === selectedBook.id
            ? { ...b, available: false, reservedBy: studentName }
            : b
        )
      );

      toast.success(
        isArabic ? "تم حجز الكتاب بنجاح!" : "Book Reserved Successfully!",
        {
          description: isArabic
            ? `كتاب "${selectedBook.titleAr}" محجوز باسم ${studentName}. يرجى استلامه من المكتبة المركزية خلال 48 ساعة.`
            : `"${selectedBook.titleEn}" is reserved for ${studentName}. Please collect it from the central library within 48 hours.`,
        }
      );

      // Reset states
      setSelectedBook(null);
      setStudentId("");
      setStudentName("");
      setStudentMajor("");
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل تقديم طلب الحجز" : "Failed to submit reservation"));
    } finally {
      setIsSubmitting(false);
    }
  };


  // Waitlist/Notify action
  const handleNotifyMe = (book: Book) => {
    toast.success(
      isArabic ? "تم تفعيل التنبيه بنجاح!" : "Notification Alert Activated!",
      {
        description: isArabic
          ? `سنرسل إليك إشعاراً بريدياً فور إتاحة كتاب "${book.titleAr}".`
          : `We will email you once "${book.titleEn}" becomes available.`,
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Background visual decorations */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/10 blur-[150px]" />
      </div>

      <main className="flex-1 relative z-10 py-10 section-container">

        {/* Page title and breadcrumbs */}
        <div className="mb-8 text-start flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Link href="/" className="hover:text-primary transition-colors">
                <span>{isArabic ? "الرئيسية" : "Home"}</span>
              </Link>
              <ChevronRight className="h-3 w-3 rtl:rotate-180" />
              <span className="text-primary font-medium">{isArabic ? "مكتبة الجامعة وفهرس الكتب" : "University Library & Catalog"}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <BookMarked className="h-8 w-8 text-primary" />
              {isArabic ? "فهرس المراجع والكتب الجامعية" : "Academic Books & References Catalog"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              {isArabic
                ? "ابحث في المجموعات الأكاديمية والمراجع العلمية المحدثة في جامعة أنطاكية السورية. يمكنك الحجز المباشر للكتب المتاحة."
                : "Search through Antioch Syrian University's updated academic collections and scientific references. Reserve available books instantly."}
            </p>
          </div>

          {/* Search stats cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-muted/30 dark:bg-slate-900/40 p-2.5 rounded-2xl border border-border dark:border-white/5 backdrop-blur-md max-w-sm w-full font-mono text-[11px] sm:text-xs">
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-card dark:bg-slate-950/50 border border-border dark:border-white/5">
              <span className="text-muted-foreground">{isArabic ? "الإجمالي" : "Total"}</span>
              <span className="text-lg font-bold text-foreground mt-0.5">{totalBooksCount}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 dark:border-emerald-500/10">
              <span className="text-emerald-600 dark:text-emerald-400/80">{isArabic ? "متاح" : "Available"}</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{availableBooksCount}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-rose-500/5 border border-rose-500/20 dark:border-rose-500/10">
              <span className="text-rose-600 dark:text-rose-400/80">{isArabic ? "محجوز" : "Reserved"}</span>
              <span className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">{reservedBooksCount}</span>
            </div>
          </div>
        </div>

        {/* Catalog container grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* 1. Sidebar Controls (Desktop) */}
          <aside className={`lg:block ${showFiltersMobile ? "block" : "hidden"} space-y-6 lg:sticky lg:top-24 bg-card dark:bg-slate-950/40 p-6 rounded-2xl border border-border dark:border-white/5 backdrop-blur-md z-30 lg:z-10`}>

            <div className="flex items-center justify-between border-b border-border dark:border-white/5 pb-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                {isArabic ? "تصفية الفهرس" : "Filter Catalog"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground hover:text-foreground dark:hover:text-white"
                onClick={resetFilters}
              >
                <RotateCcw className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
                {isArabic ? "إعادة ضبط" : "Reset"}
              </Button>
            </div>

            {/* A. Search Bar */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400 block text-start">
                {isArabic ? "البحث بالاسم أو الرقم" : "Search Name or ISBN"}
              </label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 rtl:right-3 rtl:left-auto -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={isArabic ? "اسم الكتاب، الكاتب..." : "Book title, author..."}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    triggerSearch(e.target.value);
                  }}
                  className="pl-9 pr-4 rtl:pr-9 rtl:pl-4 bg-background dark:bg-slate-950/60 border-input dark:border-white/10"
                />
              </div>
            </div>

            {/* B. Academic Faculties Categories */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400 block text-start">
                {isArabic ? "حسب التخصص الأكاديمي" : "By Academic Major"}
              </label>
              <div className="flex flex-col gap-1.5 text-start">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left rtl:text-right px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${isActive
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                        : "bg-muted/40 dark:bg-slate-900/30 border-border dark:border-white/5 text-foreground dark:text-slate-300 hover:bg-muted/70 hover:text-foreground dark:hover:bg-slate-900/60 dark:hover:text-white dark:hover:border-white/10"
                        }`}
                    >
                      <span>{isArabic ? cat.nameAr : cat.nameEn}</span>
                      {isActive && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* C. Availability Status */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-muted-foreground dark:text-slate-400 block text-start">
                {isArabic ? "حالة التوافر" : "Availability Status"}
              </label>
              <div className="flex flex-col gap-1.5 text-start">
                {AVAILABILITY_FILTERS.map((av) => {
                  const isActive = selectedAvailability === av.id;
                  return (
                    <button
                      key={av.id}
                      onClick={() => setSelectedAvailability(av.id)}
                      className={`w-full text-left rtl:text-right px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${isActive
                        ? "bg-accent/10 dark:bg-slate-800 border-accent/20 dark:border-slate-700 text-foreground dark:text-white"
                        : "bg-muted/40 dark:bg-slate-900/30 border-border dark:border-white/5 text-muted-foreground dark:text-slate-400 hover:bg-muted/70 hover:text-foreground dark:hover:bg-slate-900/60 dark:hover:text-white"
                        }`}
                    >
                      <span>{isArabic ? av.nameAr : av.nameEn}</span>
                      {isActive && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile close filters btn */}
            <Button
              className="w-full lg:hidden bg-primary text-primary-foreground mt-4 border border-primary/20"
              onClick={() => setShowFiltersMobile(false)}
            >
              {isArabic ? "تطبيق التصفية" : "Apply Filters"}
            </Button>
          </aside>

          {/* Mobile Filter Trigger Button */}
          <div className="lg:hidden flex justify-between items-center bg-card dark:bg-slate-900/30 p-4 rounded-xl border border-border dark:border-white/5 mb-2 w-full">
            <span className="text-xs font-semibold text-muted-foreground dark:text-slate-300">
              {isArabic
                ? `عرض ${filteredBooks.length} من أصل ${totalBooksCount} كتاب`
                : `Showing ${filteredBooks.length} of ${totalBooksCount} books`}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="border-border dark:border-white/10 gap-2"
              onClick={() => setShowFiltersMobile(true)}
            >
              <Filter className="h-4 w-4" />
              {isArabic ? "خيارات التصفية" : "Filter Options"}
            </Button>
          </div>

          {/* 2. Main Books Grid section */}
          <div className="lg:col-span-3 space-y-6">

            {/* Header info */}
            <div className="hidden lg:flex justify-between items-center text-sm text-muted-foreground border-b border-border dark:border-white/5 pb-3 text-start">
              <span>
                {isArabic
                  ? `وجدنا ${filteredBooks.length} كتاباً يطابق خيارات التصفية`
                  : `Found ${filteredBooks.length} books matching your filters`}
              </span>
              <div className="flex items-center gap-4">
                <span>
                  {isArabic ? "ترتيب: الأحدث" : "Sort: Newest"}
                </span>
                <div className="h-4 w-[1px] bg-border dark:bg-white/10" />
                <div className="flex items-center gap-1 bg-muted/50 dark:bg-slate-950/40 p-1 rounded-lg border border-border dark:border-white/5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === "grid"
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                    title={isArabic ? "عرض كروت" : "Grid View"}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === "list"
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                    title={isArabic ? "عرض قائمة" : "List View"}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-dashed border-border dark:border-white/10 bg-muted/20 dark:bg-slate-950/20 text-center min-h-[400px]">
                <BookOpen className="h-12 w-12 text-slate-600 mb-4 animate-bounce" />
                <h3 className="text-lg font-bold text-foreground">
                  {isArabic ? "لم نجد أي نتائج مطابقة" : "No Matching Books Found"}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                  {isArabic
                    ? "يرجى تعديل خيارات البحث والتصفية أو إعادة الضبط لعرض كل كتب الفهرس."
                    : "Please try adjusting your search term or select another category filter to explore more."}
                </p>
                <Button variant="outline" className="mt-6 border-border dark:border-white/10" onClick={resetFilters}>
                  {isArabic ? "إعادة عرض كل الكتب" : "View All Books"}
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => {
                  // Get category styling
                  const catStyle = CATEGORIES.find((c) => c.id === book.category);

                  return (
                    <div
                      key={book.id}
                      className="group relative flex flex-col justify-between bg-card dark:bg-slate-950/50 hover:bg-card dark:hover:bg-slate-950 border border-border dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/20 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 overflow-hidden"
                    >
                      {/* Interactive glowing cover indicator */}
                      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-all duration-500" />

                      {/* Top elements */}
                      <div className="space-y-4">

                        {/* 3D-Like Book Cover Art */}
                        <div className="relative aspect-[3/4.2] w-full max-w-[140px] mx-auto rounded-md shadow-md group-hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between select-none bg-gradient-to-br border border-white/10">
                          {/* Inner dynamic background gradient or uploaded image */}
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={book.titleAr}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className={`absolute inset-0 bg-gradient-to-br ${book.coverColor || "from-blue-600 to-indigo-950"} opacity-95 group-hover:scale-105 transition-transform duration-500`} />
                          )}

                          {/* Book spine simulation overlay */}
                          <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-gradient-to-r from-black/40 via-black/10 to-transparent border-r border-white/5 rtl:right-0 rtl:left-auto rtl:bg-gradient-to-l rtl:border-l rtl:border-r-0 z-10" />
                          <div className="absolute top-0 left-2.5 bottom-0 w-[1px] bg-white/10 rtl:right-2.5 rtl:left-auto z-10" />

                          {/* Fallback Text Cover content */}
                          {!book.coverImage && (
                            <div className="relative z-10 text-start flex flex-col h-full justify-between p-3.5">
                              <span className="text-[8px] uppercase tracking-widest font-mono text-white/50 bg-black/30 w-fit px-1.5 py-0.5 rounded-full">
                                ASU LIBRARY
                              </span>

                              <h3 className="text-xs font-black text-white leading-relaxed line-clamp-3 text-start mt-2 shadow-sm drop-shadow">
                                {isArabic ? book.titleAr : book.titleEn}
                              </h3>

                              <div className="border-t border-white/15 pt-2 mt-auto">
                                <p className="text-[9px] text-white/80 font-bold truncate">
                                  {isArabic ? book.authorAr : book.authorEn}
                                </p>
                                <p className="text-[7px] text-white/40 font-mono mt-0.5">
                                  ISBN: {book.isbn ? book.isbn.substring(0, 7) : "ASU"}...
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Text Detail Section */}
                        <div className="space-y-2 text-start mt-2">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            {catStyle && (
                              <Badge className={`text-[10px] uppercase font-bold py-0.5 px-2 rounded-full border ${catStyle.color} bg-transparent`}>
                                {isArabic ? catStyle.nameAr : catStyle.nameEn}
                              </Badge>
                            )}
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {book.year}
                            </span>
                          </div>

                          <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                            {isArabic ? book.titleAr : book.titleEn}
                          </h3>

                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                            <span className="truncate">{isArabic ? book.authorAr : book.authorEn}</span>
                          </p>

                          <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                            <Hash className="h-3 w-3 shrink-0" />
                            <span>ISBN: {book.isbn}</span>
                          </p>
                        </div>
                      </div>

                      {/* Lower Actions Section */}
                      <div className="mt-5 pt-3.5 border-t border-border dark:border-white/5 flex flex-col gap-2">

                        {/* Status Label */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{isArabic ? "الحالة:" : "Status:"}</span>
                          {book.available ? (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {isArabic ? "متاح للاستعارة" : "Available to Borrow"}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                              <AlertCircle className="h-3.5 w-3.5" />
                              {isArabic
                                ? (book.reservedBy ? `محجوز لـ ${book.reservedBy}` : "مستعار حالياً")
                                : (book.reservedBy ? `Reserved for ${book.reservedBy}` : "Currently Borrowed")}
                            </span>
                          )}
                        </div>

                        {/* Digital PDF Direct View / Download button if available */}
                        {book.pdfFile && (
                          <a
                            href={book.pdfFile}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs h-8 rounded-xl border border-indigo-500/20 transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>{isArabic ? "قراءة ملف PDF" : "Read Digital PDF"}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}

                        {/* CTA button */}
                        {book.available ? (
                          <Button
                            className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs h-9 rounded-xl mt-1"
                            onClick={() => setSelectedBook(book)}
                          >
                            <BookOpenCheck className="h-3.5 w-3.5 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                            {isArabic ? "حجز هذا الكتاب" : "Reserve Book"}
                          </Button>
                        ) : (
                          <div className="flex gap-1.5 mt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-border dark:border-white/10 hover:bg-muted dark:hover:bg-slate-900 text-[11px] h-9 rounded-xl"
                              onClick={() => handleNotifyMe(book)}
                            >
                              <Clock className="h-3 w-3 mr-1.5 rtl:ml-1.5 rtl:mr-0 text-amber-500" />
                              {isArabic ? "تنبيه التوفر" : "Notify Availability"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredBooks.map((book) => {
                  // Get category styling
                  const catStyle = CATEGORIES.find((c) => c.id === book.category);

                  return (
                    <div
                      key={book.id}
                      className="group relative flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card dark:bg-slate-950/50 hover:bg-card dark:hover:bg-slate-950 border border-border dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/20 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden gap-5"
                    >
                      {/* Interactive glowing cover indicator */}
                      <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-all duration-500 rtl:left-0 rtl:right-auto" />

                      <div className="flex flex-row items-start gap-4 flex-1 min-w-0">
                        {/* 3D-Like Book Cover Art */}
                        <div className="relative aspect-[3/4.2] w-[90px] shrink-0 rounded-md shadow-md group-hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between select-none bg-gradient-to-br border border-white/10">
                          {/* Inner dynamic background gradient or uploaded image */}
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={book.titleAr}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className={`absolute inset-0 bg-gradient-to-br ${book.coverColor || "from-blue-600 to-indigo-950"} opacity-95 group-hover:scale-105 transition-transform duration-500`} />
                          )}

                          {/* Book spine simulation overlay */}
                          <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-r from-black/40 via-black/10 to-transparent border-r border-white/5 rtl:right-0 rtl:left-auto rtl:bg-gradient-to-l rtl:border-l rtl:border-r-0 z-10" />
                          <div className="absolute top-0 left-2 bottom-0 w-[1px] bg-white/10 rtl:right-2 rtl:left-auto z-10" />

                          {/* Cover content (if no image) */}
                          {!book.coverImage && (
                            <div className="relative z-10 text-start flex flex-col h-full justify-between p-2">
                              <span className="text-[6px] uppercase tracking-widest font-mono text-white/50 bg-black/30 w-fit px-1 py-0.5 rounded-full">
                                ASU LIB
                              </span>

                              <h3 className="text-[10px] font-black text-white leading-tight line-clamp-2 text-start mt-1 shadow-sm drop-shadow">
                                {isArabic ? book.titleAr : book.titleEn}
                              </h3>

                              <div className="border-t border-white/15 pt-1.5 mt-auto">
                                <p className="text-[8px] text-white/80 font-bold truncate">
                                  {isArabic ? book.authorAr : book.authorEn}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Text Detail Section */}
                        <div className="space-y-1 text-start flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {catStyle && (
                              <Badge className={`text-[9px] uppercase font-bold py-0 px-2 rounded-full border ${catStyle.color} bg-transparent`}>
                                {isArabic ? catStyle.nameAr : catStyle.nameEn}
                              </Badge>
                            )}
                            <span className="text-[9px] text-muted-foreground font-mono">
                              {book.year}
                            </span>
                          </div>

                          <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {isArabic ? book.titleAr : book.titleEn}
                          </h3>

                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                            <span className="truncate">{isArabic ? book.authorAr : book.authorEn}</span>
                          </p>

                          <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                            <Hash className="h-3 w-3 shrink-0" />
                            <span>ISBN: {book.isbn}</span>
                          </p>

                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pt-1 hidden sm:block">
                            {isArabic
                              ? `المرجع العلمي المعتمد لـ ${isArabic ? catStyle?.nameAr : catStyle?.nameEn} بجامعة أنطاكية السورية، طبعة حديثة تغطي المفردات الدراسية للكلية.`
                              : `Official textbook reference for ${isArabic ? catStyle?.nameAr : catStyle?.nameEn} at ASU, covering current curriculum topics.`}
                          </p>
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="w-full sm:w-48 shrink-0 flex flex-col justify-between gap-3 border-t sm:border-t-0 sm:border-l rtl:sm:border-r rtl:sm:border-l-0 border-border dark:border-white/5 pt-4 sm:pt-0 sm:pl-5 rtl:sm:pr-5 rtl:sm:pl-0 text-start sm:text-end h-full min-h-[90px]">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-muted-foreground">{isArabic ? "الحالة:" : "Status:"}</span>
                          {book.available ? (
                            <span className="flex items-center sm:justify-end gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {isArabic ? "متاح للاستعارة" : "Available to Borrow"}
                            </span>
                          ) : (
                            <span className="flex items-center sm:justify-end gap-1 text-rose-600 dark:text-rose-400 font-medium text-xs">
                              <AlertCircle className="h-3.5 w-3.5" />
                              <span className="truncate max-w-[140px]">
                                {isArabic
                                  ? (book.reservedBy ? `محجوز لـ ${book.reservedBy}` : "مستعار")
                                  : (book.reservedBy ? `Reserved` : "Borrowed")}
                              </span>
                            </span>
                          )}
                        </div>

                        {book.pdfFile && (
                          <a
                            href={book.pdfFile}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs h-8 rounded-xl border border-indigo-500/20 transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>{isArabic ? "قراءة ملف PDF" : "Read PDF"}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}

                        {book.available ? (
                          <Button
                            className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs h-9 rounded-xl"
                            onClick={() => setSelectedBook(book)}
                          >
                            <BookOpenCheck className="h-3.5 w-3.5 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                            {isArabic ? "حجز هذا الكتاب" : "Reserve Book"}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-border dark:border-white/10 hover:bg-muted dark:hover:bg-slate-900 text-[11px] h-9 rounded-xl"
                            onClick={() => handleNotifyMe(book)}
                          >
                            <Clock className="h-3 w-3 mr-1.5 rtl:ml-1.5 rtl:mr-0 text-amber-500" />
                            {isArabic ? "تنبيه التوفر" : "Notify Availability"}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Reservation Dialog Modal */}
      <Dialog open={selectedBook !== null} onOpenChange={(open) => { if (!open) setSelectedBook(null); }}>
        <DialogContent className="sm:max-w-md" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              {isArabic ? "طلب حجز كتاب جامعي" : "Reserve Academic Book"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              {isArabic
                ? "يرجى ملء النموذج أدناه لتأكيد حجز الكتاب. بعد الحجز، سيتم حفظ المرجع لك في المكتبة المركزية."
                : "Please fill out the form below to confirm your reservation. Reserved books are held at the central desk."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReserveSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <DialogBody className="space-y-4 text-start">
              {selectedBook && (
                <div className="bg-muted/40 p-4 rounded-xl border border-border flex gap-4 items-center">
                  <div className={`w-14 aspect-[3/4.2] rounded-md relative shadow-md shrink-0 border border-border overflow-hidden`}>
                    {selectedBook.coverImage ? (
                      <img src={selectedBook.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${selectedBook.coverColor} relative`}>
                        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-black/35 rtl:right-0 rtl:left-auto" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 text-start overflow-hidden">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                      {selectedBook.isbn}
                    </span>
                    <h4 className="font-bold text-sm text-foreground truncate">
                      {isArabic ? selectedBook.titleAr : selectedBook.titleEn}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {isArabic ? selectedBook.authorAr : selectedBook.authorEn}
                    </p>
                  </div>
                </div>
              )}


              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {isArabic ? "الاسم الكامل للطالب" : "Student Full Name"} <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder={isArabic ? "أدخل اسمك كما هو مسجل في الجامعة" : "Enter your official student name"}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {isArabic ? "الرقم الجامعي" : "Student ID"} <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 191036"
                    className="h-10 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {isArabic ? "التخصص / الكلية" : "College Major"} <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    type="text"
                    value={studentMajor}
                    onChange={(e) => setStudentMajor(e.target.value)}
                    placeholder={isArabic ? "مثال: هندسة برمجيات" : "e.g. Software Engineering"}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 flex gap-2.5 text-xs text-primary leading-relaxed mt-2.5">
                <CalendarDays className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  {isArabic
                    ? "ملاحظة: تنتهي صلاحية الحجز تلقائياً بعد مرور 48 ساعة من الطلب إذا لم يتم استلام الكتاب."
                    : "Note: Reservations expire automatically after 48 hours if the book is not collected."}
                </p>
              </div>
            </DialogBody>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-border hover:bg-muted h-10 px-5 rounded-xl text-xs font-medium"
                onClick={() => setSelectedBook(null)}
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white font-bold h-10 px-6 rounded-xl text-xs flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {isArabic ? "جاري الحجز..." : "Reserving..."}
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    {isArabic ? "تأكيد الحجز" : "Confirm Reservation"}
                  </>
                )
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
