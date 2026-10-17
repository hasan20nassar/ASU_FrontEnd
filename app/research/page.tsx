"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Microscope,
  FlaskConical,
  BookOpen,
  Lightbulb,
  Target,
  ExternalLink,
  FileText,
  Download,
  Eye,
  Search,
  Building2,
  Award,
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Layers,
  Loader2,
  X,
  Share2,
  Check,
} from "lucide-react";
import {
  useResearchCenters,
  useResearchAreas,
  useResearchPublications,
  useResearchStats,
  useRecordPublicationView,
  useRecordPublicationDownload,
} from "@/hooks/use-research";
import { ResearchPublication } from "@/lib/api";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Microscope,
  FlaskConical,
  BookOpen,
  Lightbulb,
  Building2,
  Layers,
  Award,
  Target,
};

function getCenterIcon(iconName?: string) {
  if (iconName && ICON_MAP[iconName]) {
    return ICON_MAP[iconName];
  }
  return Microscope;
}

function getPdfUrl(pdfPath?: string) {
  if (!pdfPath) return "";
  if (pdfPath.startsWith("http://") || pdfPath.startsWith("https://")) {
    return pdfPath;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return `${baseUrl}${pdfPath.startsWith("/") ? "" : "/"}${pdfPath}`;
}

export default function ResearchPage() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState<number | "all">("all");
  const [selectedPub, setSelectedPub] = useState<ResearchPublication | null>(null);
  const [isCopiedDoi, setIsCopiedDoi] = useState(false);

  // Live Backend Data
  const { data: stats, isLoading: isStatsLoading } = useResearchStats();
  const { data: centers = [], isLoading: isCentersLoading } = useResearchCenters();
  const { data: areas = [], isLoading: isAreasLoading } = useResearchAreas();
  const { data: publications = [], isLoading: isPubsLoading } = useResearchPublications();

  const recordViewMutation = useRecordPublicationView();
  const recordDownloadMutation = useRecordPublicationDownload();

  // Filtered publications
  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      // Area filter
      if (selectedAreaId !== "all" && pub.researchArea !== selectedAreaId) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitleAr = pub.titleAr?.toLowerCase().includes(query);
        const matchesTitleEn = pub.titleEn?.toLowerCase().includes(query);
        const matchesAuthorAr = pub.authorsAr?.toLowerCase().includes(query);
        const matchesAuthorEn = pub.authorsEn?.toLowerCase().includes(query);
        const matchesJournalAr = pub.journalAr?.toLowerCase().includes(query);
        const matchesJournalEn = pub.journalEn?.toLowerCase().includes(query);
        if (
          !matchesTitleAr &&
          !matchesTitleEn &&
          !matchesAuthorAr &&
          !matchesAuthorEn &&
          !matchesJournalAr &&
          !matchesJournalEn
        ) {
          return false;
        }
      }
      return true;
    });
  }, [publications, selectedAreaId, searchQuery]);

  // Handle open publication modal
  const handleOpenPubModal = (pub: ResearchPublication) => {
    setSelectedPub(pub);
    if (pub.id) {
      recordViewMutation.mutate(pub.id);
    }
  };

  // Handle download PDF
  const handleDownloadPdf = (pub: ResearchPublication, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!pub.pdfFile) return;
    if (pub.id) {
      recordDownloadMutation.mutate(pub.id);
    }
    const url = getPdfUrl(pub.pdfFile);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyDoi = (doi: string) => {
    const fullDoi = doi.startsWith("http") ? doi : `https://doi.org/${doi}`;
    navigator.clipboard.writeText(fullDoi);
    setIsCopiedDoi(true);
    setTimeout(() => setIsCopiedDoi(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* ========================================================
            1. Hero Section
           ======================================================== */}
        <section className="relative h-[42vh] min-h-[340px] w-full overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-zinc-950 flex items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />
          <div className="relative section-container w-full py-8">
            <div className="text-start max-w-3xl">
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl leading-tight">
                {isArabic ? "البحث العلمي والابتكار الأكاديمي" : "Scientific Research & Innovation"}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl">
                {isArabic
                  ? "نسعى لتعزيز بيئة البحث العلمي ودعم الباحثين والمبتكرين، وتحويل النتاج المعرفي إلى حلول تطبيقية تخدم التنمية المستدامة والمجتمع."
                  : "We strive to foster a vibrant scientific research ecosystem, empowering researchers and innovators to turn knowledge into impactful solutions."}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. Live Stats & Metrics Section
           ======================================================== */}
        <section className="py-10 bg-muted/20 border-b border-border/50">
          <div className="section-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Stat 1: Total Publications */}
              <Card className="text-center shadow-xs border-border/70 hover:border-primary/40 transition-all">
                <CardContent className="pt-6 pb-5 px-3">
                  <div className="flex justify-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-primary">
                    {isStatsLoading ? (
                      <Loader2 className="h-7 w-7 animate-spin mx-auto text-primary" />
                    ) : (
                      stats?.totalPublications ?? publications.length
                    )}
                  </div>
                  <div className="mt-1.5 text-xs sm:text-sm font-semibold text-muted-foreground">
                    {isArabic ? "بحث وورقة منشورة" : "Published Papers"}
                  </div>
                </CardContent>
              </Card>

              {/* Stat 2: Research Centers */}
              <Card className="text-center shadow-xs border-border/70 hover:border-primary/40 transition-all">
                <CardContent className="pt-6 pb-5 px-3">
                  <div className="flex justify-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Microscope className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {isStatsLoading ? (
                      <Loader2 className="h-7 w-7 animate-spin mx-auto text-indigo-600" />
                    ) : (
                      stats?.totalCenters ?? centers.length
                    )}
                  </div>
                  <div className="mt-1.5 text-xs sm:text-sm font-semibold text-muted-foreground">
                    {isArabic ? "مراكز بحثية متخصصة" : "Specialized Centers"}
                  </div>
                </CardContent>
              </Card>

              {/* Stat 3: Research Areas */}
              <Card className="text-center shadow-xs border-border/70 hover:border-primary/40 transition-all">
                <CardContent className="pt-6 pb-5 px-3">
                  <div className="flex justify-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Target className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-amber-600 dark:text-amber-400">
                    {isStatsLoading ? (
                      <Loader2 className="h-7 w-7 animate-spin mx-auto text-amber-600" />
                    ) : (
                      stats?.totalAreas ?? areas.length
                    )}
                  </div>
                  <div className="mt-1.5 text-xs sm:text-sm font-semibold text-muted-foreground">
                    {isArabic ? "مجالات بحثية رائدة" : "Research Disciplines"}
                  </div>
                </CardContent>
              </Card>

              {/* Stat 4: Academic Downloads & Views */}
              <Card className="text-center shadow-xs border-border/70 hover:border-primary/40 transition-all">
                <CardContent className="pt-6 pb-5 px-3">
                  <div className="flex justify-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Download className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {isStatsLoading ? (
                      <Loader2 className="h-7 w-7 animate-spin mx-auto text-emerald-600" />
                    ) : (
                      (stats?.totalDownloads ?? 0) + (stats?.totalViews ?? 0)
                    )}
                  </div>
                  <div className="mt-1.5 text-xs sm:text-sm font-semibold text-muted-foreground">
                    {isArabic ? "اقتباس وقراءة بحثية" : "Citations & Views"}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. Research Centers Section
           ======================================================== */}
        <section id="centers-section" className="py-14 sm:py-20 bg-background">
          <div className="section-container">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="outline" className="mb-2 text-primary border-primary/30">
                {isArabic ? "بيئة علمية متكاملة" : "Integrated Scientific Infrastructure"}
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isArabic ? "مراكز البحث العلمي بالجامعة" : "University Research Centers"}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                {isArabic
                  ? "تحتضن الجامعة نخبة من المراكز المتخصصة المزودة بأحدث الأجهزة لخدمة الفرق البحثية والمشاريع النوعية."
                  : "The university houses specialized centers equipped with state-of-the-art facilities supporting research teams."}
              </p>
            </div>

            {isCentersLoading ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {isArabic ? "جاري تحميل المراكز البحثية..." : "Loading research centers..."}
                </p>
              </div>
            ) : centers.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                <Microscope className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
                <p className="text-sm font-bold text-muted-foreground">
                  {isArabic ? "لا توجد مراكز بحثية متاحة حالياً" : "No research centers available currently"}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {centers.map((center) => {
                  const IconComp = getCenterIcon(center.icon);
                  return (
                    <Card
                      key={center.id}
                      className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/80 flex flex-col justify-between"
                    >
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <IconComp className="h-6 w-6" />
                          </div>
                          {(center.publicationsCount ?? 0) > 0 && (
                            <Badge variant="secondary" className="text-xs font-semibold">
                              {center.publicationsCount}{" "}
                              {isArabic ? "أبحاث" : "Papers"}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug mb-2">
                          {isArabic ? center.titleAr : center.titleEn || center.titleAr}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                          {isArabic ? center.descriptionAr : center.descriptionEn || center.descriptionAr}
                        </p>
                        {center.directorNameAr && (
                          <div className="mt-4 pt-3 border-t border-border/60 text-[11px] text-muted-foreground flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="font-medium truncate">
                              {isArabic
                                ? `إشراف: ${center.directorNameAr}`
                                : `Director: ${center.directorNameEn || center.directorNameAr}`}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================
            4. Research Areas & Strategic Objectives
           ======================================================== */}
        <section className="py-14 sm:py-20 bg-muted/30 border-y border-border/50">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge variant="outline" className="mb-2 text-amber-600 border-amber-500/30">
                  {isArabic ? "محاور العمل" : "Key Disciplines"}
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
                  {isArabic ? "مجالات البحث ذات الأولوية" : "Strategic Research Areas"}
                </h2>
                <p className="mb-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "تركز الخطة الاستراتيجية للجامعة على أولويات بحثية تواكب التطورات العلمية وتسهم في إيجاد حلول ملموسة للتحديات الوطنية والعالمية. انقر على أي مجال لتصفية الأبحاث المرتبطة به:"
                    : "Our strategic plan aligns with global advances and tackles pressing societal challenges. Click on any area to filter publications:"}
                </p>

                {isAreasLoading ? (
                  <div className="py-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>{isArabic ? "جاري تحميل المجالات..." : "Loading areas..."}</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => {
                        setSelectedAreaId("all");
                        const el = document.getElementById("publications-section");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedAreaId === "all"
                          ? "bg-primary text-white shadow-xs"
                          : "bg-background border border-border text-foreground hover:bg-muted"
                        }`}
                    >
                      {isArabic ? "جميع المجالات" : "All Areas"}
                    </button>
                    {areas.map((area) => {
                      const isSelected = selectedAreaId === area.id;
                      return (
                        <button
                          key={area.id}
                          onClick={() => {
                            setSelectedAreaId(area.id || "all");
                            const el = document.getElementById("publications-section");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${isSelected
                              ? "bg-primary text-white shadow-xs"
                              : "bg-background border border-border text-foreground hover:bg-muted"
                            }`}
                        >
                          {isArabic ? area.nameAr : area.nameEn || area.nameAr}
                          {(area.publicationsCount ?? 0) > 0 && (
                            <span className="mr-1.5 rtl:mr-0 rtl:ml-1.5 text-[10px] opacity-80">
                              ({area.publicationsCount})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Research Goals Card */}
              <Card className="border-border/80 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2.5 text-lg sm:text-xl font-bold">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Target className="h-5 w-5" />
                    </div>
                    <span>{isArabic ? "أهدافنا البحثية الاستراتيجية" : "Our Strategic Research Goals"}</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {isArabic
                      ? "المحاور الرئيسية التي تسترشد بها الفرق البحثية بالجامعة"
                      : "Core pillars guiding our university research teams"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3.5">
                    {[
                      {
                        ar: "تعزيز البحث العلمي التطبيقي المرتبط باحتياجات التنمية وسوق العمل",
                        en: "Enhance applied research tied to societal development and industry needs",
                      },
                      {
                        ar: "بناء شراكات واتفاقيات تعاون مع جامعات ومراكز بحثية دولية رائدة",
                        en: "Establish partnerships with leading international institutions",
                      },
                      {
                        ar: "نشر الأبحاث في مجلات علمية عالمية محكمة ذات معامل تأثير مرموق",
                        en: "Publish in high-impact international peer-reviewed journals",
                      },
                      {
                        ar: "تحويل براءات الاختراع والنتاج المعرفي إلى حلول ومنتجات ريادية عملية",
                        en: "Transform patents and discoveries into practical entrepreneurial products",
                      },
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                          {isArabic ? item.ar : item.en}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ========================================================
            5. Dynamic Publications Section
           ======================================================== */}
        <section id="publications-section" className="py-14 sm:py-20 bg-background">
          <div className="section-container">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <Badge variant="outline" className="mb-2 text-primary border-primary/30">
                {isArabic ? "النتاج المعرفي" : "Scientific Output"}
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isArabic ? "الإنتاج العلمي والأوراق البحثية" : "Scientific Publications & Papers"}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                {isArabic
                  ? "قاعدة بيانات متكاملة للأبحاث المنشورة لأعضاء هيئة التدريس والباحثين مع إمكانية قراءة وتنزيل ملفات الـ PDF."
                  : "A repository of published peer-reviewed research by our faculty and scholars with full PDF downloads."}
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
              <div className="relative flex-1 w-full">
                <Search className="absolute right-3.5 rtl:right-3.5 rtl:left-auto left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isArabic
                      ? "ابحث بعنوان البحث، اسم الباحث، أو المجلة العلمية..."
                      : "Search by title, author, or journal..."
                  }
                  className="pr-10 rtl:pr-10 rtl:pl-4 pl-10 text-xs sm:text-sm h-11 bg-card rounded-xl border-border"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute left-3 rtl:left-3 rtl:right-auto right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Area Quick Filter */}
              <div className="w-full sm:w-auto flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
                  {isArabic ? "التصفية:" : "Filter:"}
                </span>
                <select
                  aria-label={isArabic ? "تصفية حسب المجال البحثي" : "Filter by research area"}
                  value={selectedAreaId}
                  onChange={(e) =>
                    setSelectedAreaId(e.target.value === "all" ? "all" : Number(e.target.value))
                  }
                  className="h-11 px-3 rounded-xl border border-border bg-card text-xs sm:text-sm font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
                >
                  <option value="all">{isArabic ? "كافة المجالات البحثية" : "All Research Areas"}</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {isArabic ? a.nameAr : a.nameEn || a.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Publications Grid */}
            {isPubsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {isArabic ? "جاري تحميل الأبحاث والمنشورات..." : "Loading publications..."}
                </p>
              </div>
            ) : filteredPublications.length === 0 ? (
              <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border space-y-3">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
                <h3 className="font-bold text-sm sm:text-base text-foreground">
                  {isArabic ? "لم يتم العثور على أبحاث مطابقة" : "No matching publications found"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                  {isArabic
                    ? "جرّب تغيير كلمات البحث أو اختيار مجال بحثي آخر."
                    : "Try adjusting search terms or choosing another research area."}
                </p>
                {(searchQuery || selectedAreaId !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedAreaId("all");
                    }}
                    className="text-xs mt-2"
                  >
                    {isArabic ? "إعادة ضبط التصفية" : "Reset Filters"}
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPublications.map((pub) => (
                  <Card
                    key={pub.id}
                    className="flex flex-col justify-between hover:shadow-md transition-all duration-200 border-border/80 group hover:border-primary/40"
                  >
                    <CardContent className="p-5 flex flex-col h-full">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant="outline" className="text-xs font-semibold bg-muted/50">
                            {pub.publicationYear || "2024"}
                          </Badge>
                          {pub.isFeatured && (
                            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] px-1.5 py-0 h-5">
                              {isArabic ? "بحث متميز" : "Featured"}
                            </Badge>
                          )}
                          {pub.pdfFile && (
                            <Badge
                              variant="outline"
                              className="text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px] px-1.5 py-0 h-5 flex items-center gap-0.5"
                            >
                              <FileText className="h-3 w-3" />
                              <span>PDF</span>
                            </Badge>
                          )}
                        </div>

                        {/* Research Area Tag */}
                        {pub.researchAreaNameAr && (
                          <span className="text-[11px] font-semibold text-primary truncate max-w-[120px]">
                            {isArabic ? pub.researchAreaNameAr : pub.researchAreaNameEn || pub.researchAreaNameAr}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => handleOpenPubModal(pub)}
                        className="font-bold text-sm sm:text-base text-foreground leading-snug line-clamp-2 cursor-pointer group-hover:text-primary transition-colors mb-2"
                      >
                        {isArabic ? pub.titleAr : pub.titleEn || pub.titleAr}
                      </h3>

                      {/* Authors */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate font-medium">
                          {isArabic ? pub.authorsAr : pub.authorsEn || pub.authorsAr}
                        </span>
                      </div>

                      {/* Journal */}
                      <div className="text-xs text-primary/90 font-medium mb-3 truncate">
                        {isArabic ? pub.journalAr : pub.journalEn || pub.journalAr}
                      </div>

                      {/* Abstract preview */}
                      {(pub.abstractAr || pub.abstractEn) && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
                          {isArabic
                            ? pub.abstractAr || pub.abstractEn
                            : pub.abstractEn || pub.abstractAr}
                        </p>
                      )}

                      {/* Footer Actions & Metrics */}
                      <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 mt-auto">
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1" title={isArabic ? "المشاهدات" : "Views"}>
                            <Eye className="h-3.5 w-3.5" />
                            <span>{pub.viewsCount || 0}</span>
                          </span>
                          <span className="flex items-center gap-1" title={isArabic ? "التنزيلات" : "Downloads"}>
                            <Download className="h-3.5 w-3.5" />
                            <span>{pub.downloadsCount || 0}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {pub.pdfFile && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => handleDownloadPdf(pub, e)}
                              className="h-8 px-2.5 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/5"
                              title={isArabic ? "تحميل PDF" : "Download PDF"}
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">PDF</span>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleOpenPubModal(pub)}
                            className="h-8 px-3 text-xs gap-1 font-semibold"
                          >
                            <span>{isArabic ? "تفاصيل" : "Details"}</span>
                            <Arrow className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================
            6. Publication Details Dialog
           ======================================================== */}
        <Dialog open={!!selectedPub} onOpenChange={(open) => !open && setSelectedPub(null)}>
          <DialogContent className="sm:max-w-3xl md:max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            {selectedPub && (
              <>
                <DialogHeader className="text-start space-y-3 pb-3 border-b border-border">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="font-semibold text-xs">
                      {selectedPub.publicationYear || "2024"}
                    </Badge>
                    {selectedPub.researchAreaNameAr && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                        {isArabic
                          ? selectedPub.researchAreaNameAr
                          : selectedPub.researchAreaNameEn || selectedPub.researchAreaNameAr}
                      </Badge>
                    )}
                    {selectedPub.centerTitleAr && (
                      <Badge variant="secondary" className="text-xs">
                        {isArabic
                          ? selectedPub.centerTitleAr
                          : selectedPub.centerTitleEn || selectedPub.centerTitleAr}
                      </Badge>
                    )}
                    {selectedPub.isFeatured && (
                      <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs">
                        {isArabic ? "بحث مميز" : "Featured"}
                      </Badge>
                    )}
                  </div>

                  <DialogTitle className="text-lg sm:text-xl font-extrabold text-foreground leading-snug">
                    {isArabic ? selectedPub.titleAr : selectedPub.titleEn || selectedPub.titleAr}
                  </DialogTitle>
                  {selectedPub.titleEn && selectedPub.titleAr !== selectedPub.titleEn && (
                    <p className="text-xs sm:text-sm text-muted-foreground italic font-sans" dir="ltr">
                      {selectedPub.titleEn}
                    </p>
                  )}
                </DialogHeader>

                <div className="space-y-4 py-4 text-xs sm:text-sm">
                  {/* Authors & Journal meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/30 p-3.5 rounded-xl border border-border/70">
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground block">
                        {isArabic ? "الباحثون / المؤلفون:" : "Authors:"}
                      </span>
                      <p className="font-bold text-foreground mt-0.5">
                        {isArabic
                          ? selectedPub.authorsAr
                          : selectedPub.authorsEn || selectedPub.authorsAr}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground block">
                        {isArabic ? "المجلة أو المؤتمر العلمي:" : "Journal / Conference:"}
                      </span>
                      <p className="font-bold text-primary mt-0.5">
                        {isArabic
                          ? selectedPub.journalAr
                          : selectedPub.journalEn || selectedPub.journalAr}
                      </p>
                    </div>
                  </div>

                  {/* DOI if available */}
                  {selectedPub.doiUrl && (
                    <div className="flex items-center justify-between gap-2 p-3 bg-muted/40 rounded-xl border border-border text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <ExternalLink className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-bold text-muted-foreground">DOI:</span>
                        <a
                          href={
                            selectedPub.doiUrl.startsWith("http")
                              ? selectedPub.doiUrl
                              : `https://doi.org/${selectedPub.doiUrl}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          {selectedPub.doiUrl}
                        </a>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyDoi(selectedPub.doiUrl!)}
                        className="h-7 px-2 text-[11px] shrink-0 gap-1"
                      >
                        {isCopiedDoi ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span className="text-emerald-600">{isArabic ? "تم النسخ" : "Copied"}</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="h-3 w-3" />
                            <span>{isArabic ? "نسخ الرابط" : "Copy"}</span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Abstract Section */}
                  <div>
                    <h4 className="font-bold text-foreground text-sm mb-2 flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>{isArabic ? "المستخلص العلمي (Abstract)" : "Abstract"}</span>
                    </h4>
                    <div className="p-4 bg-card rounded-xl border border-border leading-relaxed text-muted-foreground space-y-3">
                      {selectedPub.abstractAr && (
                        <p className="leading-relaxed">
                          {selectedPub.abstractAr}
                        </p>
                      )}
                      {selectedPub.abstractEn && (
                        <p className="text-xs leading-relaxed italic text-muted-foreground/90 font-sans" dir="ltr">
                          {selectedPub.abstractEn}
                        </p>
                      )}
                      {!selectedPub.abstractAr && !selectedPub.abstractEn && (
                        <p className="italic text-muted-foreground text-xs">
                          {isArabic ? "لا يتوفر مستخلص لهذا البحث حالياً." : "No abstract available for this publication."}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4 text-primary" />
                        <span>
                          {selectedPub.viewsCount || 0} {isArabic ? "مشاهدة" : "views"}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Download className="h-4 w-4 text-emerald-600" />
                        <span>
                          {selectedPub.downloadsCount || 0} {isArabic ? "تحميل" : "downloads"}
                        </span>
                      </span>
                    </div>

                    {selectedPub.pdfFileSizeFormatted && (
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {isArabic ? `حجم الملف: ${selectedPub.pdfFileSizeFormatted}` : `Size: ${selectedPub.pdfFileSizeFormatted}`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dialog Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPub(null)}
                    className="w-full sm:w-auto text-xs"
                  >
                    {isArabic ? "إغلاق" : "Close"}
                  </Button>
                  {selectedPub.pdfFile && (
                    <Button
                      onClick={() => handleDownloadPdf(selectedPub)}
                      className="w-full sm:w-auto gap-2 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                    >
                      <Download className="h-4 w-4" />
                      <span>{isArabic ? "تحميل وقراءة البحث الكامل (PDF)" : "Download & Read Full Paper (PDF)"}</span>
                    </Button>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
