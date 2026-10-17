"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/language-context";
import {
  useResearchCenters,
  useCreateCenter,
  useUpdateCenter,
  useDeleteCenter,
  useResearchAreas,
  useCreateArea,
  useUpdateArea,
  useDeleteArea,
  useResearchPublications,
  useCreatePublication,
  useUpdatePublication,
  useDeletePublication,
  useResearchStats,
} from "@/hooks/use-research";
import { useFaculties } from "@/hooks/use-faculties";
import {
  ResearchCenter,
  ResearchArea,
  ResearchPublication,
} from "@/lib/api";
import { ResearchService } from "@/lib/api/services/ResearchService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Microscope,
  FlaskConical,
  BookOpen,
  Lightbulb,
  FileText,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  Star,
  Layers,
  X,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CENTER_ICONS = [
  { label: "مجهر (Microscope)", value: "Microscope", icon: Microscope },
  { label: "مخبر كيميائي (Flask)", value: "FlaskConical", icon: FlaskConical },
  { label: "كتاب وأبحاث (Book)", value: "BookOpen", icon: BookOpen },
  { label: "ابتكار وفكرة (Lightbulb)", value: "Lightbulb", icon: Lightbulb },
];

export default function DashboardResearchPage() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  // Data queries
  const { data: centers = [], isLoading: isCentersLoading } = useResearchCenters();
  const { data: areas = [], isLoading: isAreasLoading } = useResearchAreas();
  const { data: publications = [], isLoading: isPubsLoading } = useResearchPublications();
  const { data: stats, isLoading: isStatsLoading } = useResearchStats();
  const { data: faculties = [] } = useFaculties();

  // Mutations
  const createPubMutation = useCreatePublication();
  const updatePubMutation = useUpdatePublication();
  const deletePubMutation = useDeletePublication();

  const createCenterMutation = useCreateCenter();
  const updateCenterMutation = useUpdateCenter();
  const deleteCenterMutation = useDeleteCenter();

  const createAreaMutation = useCreateArea();
  const updateAreaMutation = useUpdateArea();
  const deleteAreaMutation = useDeleteArea();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"publications" | "centers" | "areas">("publications");

  // Filters for Publications
  const [pubSearch, setPubSearch] = useState("");
  const [pubAreaFilter, setPubAreaFilter] = useState("all");
  const [pubYearFilter, setPubYearFilter] = useState("all");

  // ========================================================
  // Publication Modal States
  // ========================================================
  const [isPubModalOpen, setIsPubModalOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<ResearchPublication | null>(null);

  const [pubTitleAr, setPubTitleAr] = useState("");
  const [pubTitleEn, setPubTitleEn] = useState("");
  const [pubAuthorsAr, setPubAuthorsAr] = useState("");
  const [pubAuthorsEn, setPubAuthorsEn] = useState("");
  const [pubJournalAr, setPubJournalAr] = useState("");
  const [pubJournalEn, setPubJournalEn] = useState("");
  const [pubYear, setPubYear] = useState(new Date().getFullYear());
  const [pubAreaId, setPubAreaId] = useState<string>("none");
  const [pubCenterId, setPubCenterId] = useState<string>("none");
  const [pubFacultyId, setPubFacultyId] = useState<string>("none");
  const [pubAbstractAr, setPubAbstractAr] = useState("");
  const [pubAbstractEn, setPubAbstractEn] = useState("");
  const [pubDoiUrl, setPubDoiUrl] = useState("");
  const [pubPdfFile, setPubPdfFile] = useState("");
  const [pubPdfFileSize, setPubPdfFileSize] = useState(0);
  const [pubPdfFileSizeFormatted, setPubPdfFileSizeFormatted] = useState("");
  const [pubIsFeatured, setPubIsFeatured] = useState(false);
  const [pubIsActive, setPubIsActive] = useState(true);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  // Delete Publication Confirmation Modal
  const [deletingPub, setDeletingPub] = useState<ResearchPublication | null>(null);

  // ========================================================
  // Center Modal States
  // ========================================================
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<ResearchCenter | null>(null);
  const [centerTitleAr, setCenterTitleAr] = useState("");
  const [centerTitleEn, setCenterTitleEn] = useState("");
  const [centerDescAr, setCenterDescAr] = useState("");
  const [centerDescEn, setCenterDescEn] = useState("");
  const [centerIcon, setCenterIcon] = useState("Microscope");
  const [centerFacultyId, setCenterFacultyId] = useState<string>("none");
  const [centerDirectorAr, setCenterDirectorAr] = useState("");
  const [centerDirectorEn, setCenterDirectorEn] = useState("");
  const [centerLocation, setCenterLocation] = useState("");
  const [centerEmail, setCenterEmail] = useState("");
  const [centerIsActive, setCenterIsActive] = useState(true);
  const [deletingCenter, setDeletingCenter] = useState<ResearchCenter | null>(null);

  // ========================================================
  // Area Modal States
  // ========================================================
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<ResearchArea | null>(null);
  const [areaNameAr, setAreaNameAr] = useState("");
  const [areaNameEn, setAreaNameEn] = useState("");
  const [areaDescAr, setAreaDescAr] = useState("");
  const [areaDescEn, setAreaDescEn] = useState("");
  const [areaIsActive, setAreaIsActive] = useState(true);
  const [deletingArea, setDeletingArea] = useState<ResearchArea | null>(null);

  // Filtered Publications list
  const filteredPubs = useMemo(() => {
    return publications.filter((p) => {
      const q = pubSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.titleAr.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q) ||
        p.authorsAr.toLowerCase().includes(q) ||
        p.authorsEn.toLowerCase().includes(q) ||
        p.journalAr.toLowerCase().includes(q);

      const matchArea =
        pubAreaFilter === "all" || String(p.researchArea) === pubAreaFilter;

      const matchYear =
        pubYearFilter === "all" || String(p.publicationYear) === pubYearFilter;

      return matchSearch && matchArea && matchYear;
    });
  }, [publications, pubSearch, pubAreaFilter, pubYearFilter]);

  // Unique publication years for filter
  const publicationYears = useMemo(() => {
    const set = new Set<number>();
    publications.forEach((p) => {
      if (p.publicationYear) set.add(p.publicationYear);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [publications]);

  // ========================================================
  // Handlers: Publications
  // ========================================================
  const handleOpenPubModal = (pub: ResearchPublication | null = null) => {
    setEditingPub(pub);
    if (pub) {
      setPubTitleAr(pub.titleAr);
      setPubTitleEn(pub.titleEn);
      setPubAuthorsAr(pub.authorsAr);
      setPubAuthorsEn(pub.authorsEn);
      setPubJournalAr(pub.journalAr);
      setPubJournalEn(pub.journalEn);
      setPubYear(pub.publicationYear || new Date().getFullYear());
      setPubAreaId(pub.researchArea ? String(pub.researchArea) : "none");
      setPubCenterId(pub.center ? String(pub.center) : "none");
      setPubFacultyId(pub.faculty ? String(pub.faculty) : "none");
      setPubAbstractAr(pub.abstractAr || "");
      setPubAbstractEn(pub.abstractEn || "");
      setPubDoiUrl(pub.doiUrl || "");
      setPubPdfFile(pub.pdfFile || "");
      setPubPdfFileSize(pub.pdfFileSize || 0);
      setPubPdfFileSizeFormatted(pub.pdfFileSizeFormatted || "");
      setPubIsFeatured(pub.isFeatured ?? false);
      setPubIsActive(pub.isActive ?? true);
    } else {
      setPubTitleAr("");
      setPubTitleEn("");
      setPubAuthorsAr("");
      setPubAuthorsEn("");
      setPubJournalAr("");
      setPubJournalEn("");
      setPubYear(new Date().getFullYear());
      setPubAreaId("none");
      setPubCenterId("none");
      setPubFacultyId("none");
      setPubAbstractAr("");
      setPubAbstractEn("");
      setPubDoiUrl("");
      setPubPdfFile("");
      setPubPdfFileSize(0);
      setPubPdfFileSizeFormatted("");
      setPubIsFeatured(false);
      setPubIsActive(true);
    }
    setIsPubModalOpen(true);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error(isArabic ? "يُسمح فقط بملفات PDF (.pdf)" : "Only PDF files are allowed");
      return;
    }

    try {
      setIsUploadingPdf(true);
      const res = await ResearchService.uploadPaperPdf(file);
      setPubPdfFile(res.url);
      setPubPdfFileSize(res.size);
      setPubPdfFileSizeFormatted(res.sizeFormatted);
      toast.success(isArabic ? "تم رفع ملف البحث بصيغة PDF بنجاح!" : "Research paper PDF uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل رفع ملف البحث" : "Upload failed"));
    } finally {
      setIsUploadingPdf(false);
      e.target.value = "";
    }
  };

  const handleSavePublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitleAr.trim() || !pubAuthorsAr.trim() || !pubJournalAr.trim()) {
      toast.error(isArabic ? "يرجى تعبئة الحقول الأساسية المطلوبة" : "Please fill out required fields");
      return;
    }

    const payload: ResearchPublication = {
      titleAr: pubTitleAr.trim(),
      titleEn: pubTitleEn.trim() || pubTitleAr.trim(),
      authorsAr: pubAuthorsAr.trim(),
      authorsEn: pubAuthorsEn.trim() || pubAuthorsAr.trim(),
      journalAr: pubJournalAr.trim(),
      journalEn: pubJournalEn.trim() || pubJournalAr.trim(),
      publicationYear: Number(pubYear) || new Date().getFullYear(),
      researchArea: pubAreaId !== "none" ? Number(pubAreaId) : null,
      center: pubCenterId !== "none" ? Number(pubCenterId) : null,
      faculty: pubFacultyId !== "none" ? Number(pubFacultyId) : null,
      abstractAr: pubAbstractAr.trim(),
      abstractEn: pubAbstractEn.trim(),
      doiUrl: pubDoiUrl.trim(),
      pdfFile: pubPdfFile,
      pdfFileSize: pubPdfFileSize,
      pdfFileSizeFormatted: pubPdfFileSizeFormatted,
      isFeatured: pubIsFeatured,
      isActive: pubIsActive,
    };

    try {
      if (editingPub && editingPub.id) {
        await updatePubMutation.mutateAsync({ id: editingPub.id, data: payload });
        toast.success(isArabic ? "تم تحديث الورقة البحثية بنجاح!" : "Publication updated successfully!");
      } else {
        await createPubMutation.mutateAsync(payload);
        toast.success(isArabic ? "تمت إضافة الورقة البحثية بنجاح!" : "Publication added successfully!");
      }
      setIsPubModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "حدث خطأ أثناء حفظ الورقة البحثية" : "Save failed"));
    }
  };

  const handleDeletePublication = async () => {
    if (!deletingPub || !deletingPub.id) return;
    try {
      await deletePubMutation.mutateAsync(deletingPub.id);
      toast.success(isArabic ? "تم حذف الورقة البحثية بنجاح" : "Publication deleted successfully");
      setDeletingPub(null);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل حذف الورقة البحثية" : "Delete failed"));
    }
  };

  // ========================================================
  // Handlers: Centers
  // ========================================================
  const handleOpenCenterModal = (center: ResearchCenter | null = null) => {
    setEditingCenter(center);
    if (center) {
      setCenterTitleAr(center.titleAr);
      setCenterTitleEn(center.titleEn);
      setCenterDescAr(center.descriptionAr);
      setCenterDescEn(center.descriptionEn);
      setCenterIcon(center.icon || "Microscope");
      setCenterFacultyId(center.faculty ? String(center.faculty) : "none");
      setCenterDirectorAr(center.directorNameAr || "");
      setCenterDirectorEn(center.directorNameEn || "");
      setCenterLocation(center.location || "");
      setCenterEmail(center.contactEmail || "");
      setCenterIsActive(center.isActive ?? true);
    } else {
      setCenterTitleAr("");
      setCenterTitleEn("");
      setCenterDescAr("");
      setCenterDescEn("");
      setCenterIcon("Microscope");
      setCenterFacultyId("none");
      setCenterDirectorAr("");
      setCenterDirectorEn("");
      setCenterLocation("");
      setCenterEmail("");
      setCenterIsActive(true);
    }
    setIsCenterModalOpen(true);
  };

  const handleSaveCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!centerTitleAr.trim() || !centerDescAr.trim()) {
      toast.error(isArabic ? "يرجى تعبئة اسم ووصف المركز" : "Please fill out center title and description");
      return;
    }

    const payload: ResearchCenter = {
      titleAr: centerTitleAr.trim(),
      titleEn: centerTitleEn.trim() || centerTitleAr.trim(),
      descriptionAr: centerDescAr.trim(),
      descriptionEn: centerDescEn.trim() || centerDescAr.trim(),
      icon: centerIcon,
      faculty: centerFacultyId !== "none" ? Number(centerFacultyId) : null,
      directorNameAr: centerDirectorAr.trim(),
      directorNameEn: centerDirectorEn.trim(),
      location: centerLocation.trim(),
      contactEmail: centerEmail.trim(),
      isActive: centerIsActive,
    };

    try {
      if (editingCenter && editingCenter.id) {
        await updateCenterMutation.mutateAsync({ id: editingCenter.id, data: payload });
        toast.success(isArabic ? "تم تحديث المركز البحثي بنجاح!" : "Center updated successfully!");
      } else {
        await createCenterMutation.mutateAsync(payload);
        toast.success(isArabic ? "تمت إضافة المركز البحثي بنجاح!" : "Center created successfully!");
      }
      setIsCenterModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل حفظ المركز" : "Failed to save center"));
    }
  };

  const handleDeleteCenter = async () => {
    if (!deletingCenter || !deletingCenter.id) return;
    try {
      await deleteCenterMutation.mutateAsync(deletingCenter.id);
      toast.success(isArabic ? "تم حذف المركز بنجاح" : "Center deleted");
      setDeletingCenter(null);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل حذف المركز" : "Delete failed"));
    }
  };

  // ========================================================
  // Handlers: Areas
  // ========================================================
  const handleOpenAreaModal = (area: ResearchArea | null = null) => {
    setEditingArea(area);
    if (area) {
      setAreaNameAr(area.nameAr);
      setAreaNameEn(area.nameEn);
      setAreaDescAr(area.descriptionAr || "");
      setAreaDescEn(area.descriptionEn || "");
      setAreaIsActive(area.isActive ?? true);
    } else {
      setAreaNameAr("");
      setAreaNameEn("");
      setAreaDescAr("");
      setAreaDescEn("");
      setAreaIsActive(true);
    }
    setIsAreaModalOpen(true);
  };

  const handleSaveArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaNameAr.trim()) {
      toast.error(isArabic ? "يرجى إدخال اسم المجال البحثي" : "Please enter research area name");
      return;
    }

    const payload: ResearchArea = {
      nameAr: areaNameAr.trim(),
      nameEn: areaNameEn.trim() || areaNameAr.trim(),
      descriptionAr: areaDescAr.trim(),
      descriptionEn: areaDescEn.trim(),
      isActive: areaIsActive,
    };

    try {
      if (editingArea && editingArea.id) {
        await updateAreaMutation.mutateAsync({ id: editingArea.id, data: payload });
        toast.success(isArabic ? "تم تحديث المجال البحثي!" : "Area updated!");
      } else {
        await createAreaMutation.mutateAsync(payload);
        toast.success(isArabic ? "تمت إضافة المجال بنجاح!" : "Area created!");
      }
      setIsAreaModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل حفظ المجال" : "Save failed"));
    }
  };

  const handleDeleteArea = async () => {
    if (!deletingArea || !deletingArea.id) return;
    try {
      await deleteAreaMutation.mutateAsync(deletingArea.id);
      toast.success(isArabic ? "تم حذف المجال بنجاح" : "Area deleted");
      setDeletingArea(null);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل حذف المجال" : "Delete failed"));
    }
  };

  // Helper to render center icon
  const getCenterIcon = (iconName?: string) => {
    switch (iconName) {
      case "FlaskConical":
        return <FlaskConical className="h-5 w-5 text-primary" />;
      case "BookOpen":
        return <BookOpen className="h-5 w-5 text-primary" />;
      case "Lightbulb":
        return <Lightbulb className="h-5 w-5 text-primary" />;
      default:
        return <Microscope className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" dir={dir}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Microscope className="h-7 w-7 text-primary shrink-0" />
            <span>{isArabic ? "إدارة البحث العلمي والابتكار" : "Research & Innovation Management"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isArabic
              ? "إدارة الأوراق والمنشورات العلمية، مراكز البحث المعتمدة، والمحاور البحثية لجامعة أنطاكية السورية."
              : "Manage academic publications, research centers, and priority disciplines for ASU."}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === "publications" && (
            <Button
              className="bg-primary hover:bg-primary/95 text-white font-bold gap-2 shadow-sm rounded-xl"
              onClick={() => handleOpenPubModal(null)}
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? "إضافة ورقة بحثية" : "Add Publication"}</span>
            </Button>
          )}

          {activeTab === "centers" && (
            <Button
              className="bg-primary hover:bg-primary/95 text-white font-bold gap-2 shadow-sm rounded-xl"
              onClick={() => handleOpenCenterModal(null)}
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? "إضافة مركز بحثي" : "Add Center"}</span>
            </Button>
          )}

          {activeTab === "areas" && (
            <Button
              className="bg-primary hover:bg-primary/95 text-white font-bold gap-2 shadow-sm rounded-xl"
              onClick={() => handleOpenAreaModal(null)}
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? "إضافة مجال بحثي" : "Add Area"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards - Compact Sleek Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Publications */}
        <Card className="bg-card border-border/80 shadow-xs relative overflow-hidden rounded-xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-primary" />
          <CardHeader className="px-3.5 pt-3 pb-1">
            <CardDescription className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {isArabic ? "إجمالي المنشورات" : "Total Publications"}
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-black mt-1 text-foreground">
              {isStatsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.totalPublications ?? publications.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3.5 pb-3 pt-0">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{isArabic ? "أوراق ومقالات محكمة" : "Peer-reviewed papers"}</span>
            </p>
          </CardContent>
        </Card>

        {/* Current Year Publications */}
        <Card className="bg-card border-border/80 shadow-xs relative overflow-hidden rounded-xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
          <CardHeader className="px-3.5 pt-3 pb-1">
            <CardDescription className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {isArabic ? "أبحاث العام الحالي" : "Current Year"}
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-black mt-1 text-emerald-600 dark:text-emerald-400">
              {isStatsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.currentYearPublications ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3.5 pb-3 pt-0">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{isArabic ? `خلال عام ${new Date().getFullYear()}` : `During ${new Date().getFullYear()}`}</span>
            </p>
          </CardContent>
        </Card>

        {/* Research Centers */}
        <Card className="bg-card border-border/80 shadow-xs relative overflow-hidden rounded-xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500" />
          <CardHeader className="px-3.5 pt-3 pb-1">
            <CardDescription className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {isArabic ? "مراكز البحث العلمي" : "Research Centers"}
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-black mt-1 text-indigo-600 dark:text-indigo-400">
              {isStatsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.totalCenters ?? centers.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3.5 pb-3 pt-0">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Microscope className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">{isArabic ? "مخابر ومراكز معتمدة" : "Active Centers"}</span>
            </p>
          </CardContent>
        </Card>

        {/* Research Areas */}
        <Card className="bg-card border-border/80 shadow-xs relative overflow-hidden rounded-xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />
          <CardHeader className="px-3.5 pt-3 pb-1">
            <CardDescription className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {isArabic ? "المحاور والمجالات" : "Research Areas"}
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-black mt-1 text-amber-600 dark:text-amber-400">
              {isStatsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.totalAreas ?? areas.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3.5 pb-3 pt-0">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{isArabic ? "تخصصات ومحاور نشطة" : "Active Disciplines"}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs - Full-width & Balanced */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
        <div className="w-full pt-1 pb-1">
          <TabsList className="w-full grid grid-cols-3 h-11 sm:h-12 p-1 bg-muted/60 border border-border/60 rounded-xl shadow-xs">
            <TabsTrigger
              value="publications"
              className="rounded-lg h-full gap-2 font-medium text-xs sm:text-sm data-[state=active]:font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <span>{isArabic ? "الأوراق والمنشورات البحثية" : "Publications"}</span>
              <Badge variant="secondary" className="mr-1.5 rtl:mr-0 rtl:ml-1.5 text-[11px] font-semibold px-2 py-0.5 min-w-[20px] h-4.5 justify-center">
                {publications.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="centers"
              className="rounded-lg h-full gap-2 font-medium text-xs sm:text-sm data-[state=active]:font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Microscope className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>{isArabic ? "مراكز البحث العلمي" : "Research Centers"}</span>
              <Badge variant="secondary" className="mr-1.5 rtl:mr-0 rtl:ml-1.5 text-[11px] font-semibold px-2 py-0.5 min-w-[20px] h-4.5 justify-center">
                {centers.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="areas"
              className="rounded-lg h-full gap-2 font-medium text-xs sm:text-sm data-[state=active]:font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Target className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{isArabic ? "المحاور والمجالات البحثية" : "Research Areas"}</span>
              <Badge variant="secondary" className="mr-1.5 rtl:mr-0 rtl:ml-1.5 text-[11px] font-semibold px-2 py-0.5 min-w-[20px] h-4.5 justify-center">
                {areas.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ========================================================
            Tab 1: Publications Table & Management
           ======================================================== */}
        <TabsContent value="publications" className="space-y-4 mt-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 sm:p-4 rounded-xl border border-border">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute top-1/2 left-3 rtl:right-3 rtl:left-auto -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isArabic ? "ابحث بعنوان الورقة، الباحث، أو المجلة..." : "Search by title, author, or journal..."}
                value={pubSearch}
                onChange={(e) => setPubSearch(e.target.value)}
                className="pl-9 pr-4 rtl:pr-9 rtl:pl-4 bg-background text-xs sm:text-sm h-9"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Select value={pubAreaFilter} onValueChange={setPubAreaFilter}>
                <SelectTrigger className="w-[140px] text-xs h-9 bg-background">
                  <SelectValue placeholder={isArabic ? "المجال" : "Area"} />
                </SelectTrigger>
                <SelectContent dir={dir}>
                  <SelectItem value="all">{isArabic ? "جميع المجالات" : "All Areas"}</SelectItem>
                  {areas.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {isArabic ? a.nameAr : a.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={pubYearFilter} onValueChange={setPubYearFilter}>
                <SelectTrigger className="w-[110px] text-xs h-9 bg-background">
                  <SelectValue placeholder={isArabic ? "السنة" : "Year"} />
                </SelectTrigger>
                <SelectContent dir={dir}>
                  <SelectItem value="all">{isArabic ? "جميع السنوات" : "All Years"}</SelectItem>
                  {publicationYears.map((yr) => (
                    <SelectItem key={yr} value={String(yr)}>
                      {yr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Publications Table */}
          {isPubsLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">{isArabic ? "جاري تحميل الأوراق البحثية..." : "Loading publications..."}</p>
            </div>
          ) : filteredPubs.length === 0 ? (
            <div className="py-16 text-center bg-card rounded-2xl border border-dashed border-border space-y-3">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
              <h3 className="font-bold text-sm text-foreground">{isArabic ? "لم يتم العثور على أوراق بحثية" : "No publications found"}</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {isArabic ? "جرّب تغيير كلمات البحث أو أضف ورقة بحثية جديدة للمكتبة العلمية." : "Try adjusting filters or add a new publication."}
              </p>
              <Button size="sm" onClick={() => handleOpenPubModal(null)} className="gap-2 text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>{isArabic ? "إضافة ورقة بحثية" : "Add Publication"}</span>
              </Button>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-xs">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-[38%] text-xs font-bold">{isArabic ? "عنوان الورقة العلمية" : "Paper Title"}</TableHead>
                    <TableHead className="w-[20%] text-xs font-bold">{isArabic ? "الباحثين" : "Authors"}</TableHead>
                    <TableHead className="w-[16%] text-xs font-bold">{isArabic ? "المجلة والسنة" : "Journal & Year"}</TableHead>
                    <TableHead className="w-[14%] text-xs font-bold">{isArabic ? "المجال / المركز" : "Area / Center"}</TableHead>
                    <TableHead className="w-[12%] text-end text-xs font-bold">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                    <TableHead className="w-[38%] text-center text-xs font-bold">{isArabic ? "عنوان الورقة العلمية" : "Paper Title"}</TableHead>
                    <TableHead className="w-[20%] text-center text-xs font-bold">{isArabic ? "الباحثين" : "Authors"}</TableHead>
                    <TableHead className="w-[16%] text-center text-xs font-bold">{isArabic ? "المجلة والسنة" : "Journal & Year"}</TableHead>
                    <TableHead className="w-[14%] text-center text-xs font-bold">{isArabic ? "المجال / المركز" : "Area / Center"}</TableHead>
                    <TableHead className="w-[12%] text-center text-xs font-bold">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPubs.map((pub) => (
                    <TableRow key={pub.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="align-top py-3 w-[38%] overflow-hidden">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {pub.isFeatured && (
                              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] px-1.5 py-0 h-4 gap-0.5">
                                <Star className="h-2.5 w-2.5 fill-current" />
                                <span>{isArabic ? "مميز" : "Featured"}</span>
                              </Badge>
                            )}
                            {pub.pdfFile ? (
                              <Badge variant="outline" className="text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px] px-1.5 py-0 h-4 gap-1">
                                <FileText className="h-2.5 w-2.5" />
                                <span>PDF</span>
                              </Badge>
                            ) : null}
                            {!pub.isActive && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                {isArabic ? "مسودة" : "Draft"}
                              </Badge>
                            )}
                          </div>
                          <p className="font-bold text-xs sm:text-sm text-foreground leading-snug line-clamp-2">
                            {isArabic ? pub.titleAr : pub.titleEn}
                          </p>
                          {pub.doiUrl && (
                            <a
                              href={pub.doiUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                            >
                              <span>DOI</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="align-top py-3 w-[20%] overflow-hidden">
                        <p className="text-xs text-muted-foreground font-medium line-clamp-2">
                          {isArabic ? pub.authorsAr : pub.authorsEn}
                        </p>
                      </TableCell>

                      <TableCell className="align-top py-3 w-[16%] overflow-hidden">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {isArabic ? pub.journalAr : pub.journalEn}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {pub.publicationYear}
                        </p>
                      </TableCell>

                      <TableCell className="align-top py-3 w-[14%] overflow-hidden">
                        {pub.researchAreaNameAr ? (
                          <Badge variant="secondary" className="text-[11px] font-normal truncate max-w-full block">
                            {isArabic ? pub.researchAreaNameAr : pub.researchAreaNameEn}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>

                      <TableCell className="align-top py-3 text-end w-[12%]">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                            onClick={() => handleOpenPubModal(pub)}
                            title={isArabic ? "تعديل" : "Edit"}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => setDeletingPub(pub)}
                            title={isArabic ? "حذف" : "Delete"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ========================================================
            Tab 2: Centers Management
           ======================================================== */}
        <TabsContent value="centers" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {centers.map((center) => (
              <Card key={center.id} className="relative overflow-hidden border border-border/80 shadow-xs hover:shadow-md transition-all">
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      {getCenterIcon(center.icon)}
                    </div>
                    <div>
                      <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                        {isArabic ? center.titleAr : center.titleEn}
                      </CardTitle>
                      {center.directorNameAr && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isArabic ? `المشرف: ${center.directorNameAr}` : `Director: ${center.directorNameEn || center.directorNameAr}`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:bg-primary/10"
                      onClick={() => handleOpenCenterModal(center)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => setDeletingCenter(center)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-2.5">
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {isArabic ? center.descriptionAr : center.descriptionEn}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-border text-[11px] text-muted-foreground">
                    <span>{center.location || (isArabic ? "الحرم الجامعي المركزي" : "Main Campus")}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {center.publicationsCount || 0} {isArabic ? "أبحاث مسجلة" : "papers"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ========================================================
            Tab 3: Areas Management
           ======================================================== */}
        <TabsContent value="areas" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {areas.map((area) => (
              <Card key={area.id} className="border border-border/80 shadow-xs p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-foreground">
                      {isArabic ? area.nameAr : area.nameEn}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {area.publicationsCount || 0} {isArabic ? "أوراق بحثية" : "publications"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-primary hover:bg-primary/10"
                    onClick={() => handleOpenAreaModal(area)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => setDeletingArea(area)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ========================================================
          Modal: Add / Edit Publication
         ======================================================== */}
      <Dialog open={isPubModalOpen} onOpenChange={setIsPubModalOpen}>
        <DialogContent className="sm:max-w-3xl md:max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden w-[95vw]" dir={dir}>
          <DialogHeader className="p-5 sm:p-6 pb-4 border-b border-border bg-muted/20 shrink-0">
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5">
              <FileText className="h-6 w-6 text-primary" />
              <span>
                {editingPub
                  ? isArabic
                    ? "تعديل بيانات الورقة البحثية"
                    : "Edit Research Publication"
                  : isArabic
                    ? "إضافة ورقة ومنشور بحثي جديد"
                    : "Add New Research Publication"}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              {isArabic
                ? "أدخل بيانات البحث والمجلة العلمية، وارفع ملف الـ PDF ورابط النشر الرقمي (DOI)."
                : "Fill in publication details, authors, journal, and upload PDF file."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePublication} className="flex flex-col flex-1 overflow-hidden min-h-0">
            <DialogBody className="p-5 sm:p-6 overflow-y-auto overflow-x-hidden space-y-5 flex-1 min-h-0">
              {/* Title Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{isArabic ? "عنوان البحث (بالعربية) *" : "Paper Title (Arabic) *"}</Label>
                  <Input
                    value={pubTitleAr}
                    onChange={(e) => setPubTitleAr(e.target.value)}
                    placeholder="مثال: تطبيق الذكاء الاصطناعي في الفحص السريري"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{isArabic ? "عنوان البحث (بالإنجليزية)" : "Paper Title (English)"}</Label>
                  <Input
                    value={pubTitleEn}
                    onChange={(e) => setPubTitleEn(e.target.value)}
                    placeholder="e.g. AI Applications in Clinical Examination"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Authors Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{isArabic ? "أسماء الباحثين (بالعربية) *" : "Authors (Arabic) *"}</Label>
                  <Input
                    value={pubAuthorsAr}
                    onChange={(e) => setPubAuthorsAr(e.target.value)}
                    placeholder="مثال: د. أحمد محمد، أ.د. سمير النجار"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{isArabic ? "أسماء الباحثين (بالإنجليزية)" : "Authors (English)"}</Label>
                  <Input
                    value={pubAuthorsEn}
                    onChange={(e) => setPubAuthorsEn(e.target.value)}
                    placeholder="e.g. Dr. Ahmad Mohammad, Prof. Samir Al-Najjar"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Journal & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold">{isArabic ? "اسم المجلة أو المؤتمر الناشر *" : "Journal / Conference *"}</Label>
                  <Input
                    value={pubJournalAr}
                    onChange={(e) => setPubJournalAr(e.target.value)}
                    placeholder="مثال: مجلة الهندسة والعلوم التطبيقية"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{isArabic ? "سنة النشر *" : "Publication Year *"}</Label>
                  <Input
                    type="number"
                    value={pubYear}
                    onChange={(e) => setPubYear(Number(e.target.value))}
                    min={1990}
                    max={2030}
                    required
                  />
                </div>
              </div>

              {/* Area & Center & Faculty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{isArabic ? "المجال البحثي" : "Research Area"}</Label>
                  <Select value={pubAreaId} onValueChange={setPubAreaId}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder={isArabic ? "اختر المجال..." : "Select Area..."} />
                    </SelectTrigger>
                    <SelectContent dir={dir}>
                      <SelectItem value="none">{isArabic ? "عام (دون تحديد)" : "General"}</SelectItem>
                      {areas.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {isArabic ? a.nameAr : a.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{isArabic ? "المركز البحثي التابع له" : "Research Center"}</Label>
                  <Select value={pubCenterId} onValueChange={setPubCenterId}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder={isArabic ? "اختر المركز..." : "Select Center..."} />
                    </SelectTrigger>
                    <SelectContent dir={dir}>
                      <SelectItem value="none">{isArabic ? "غير مخصص لمركز" : "None"}</SelectItem>
                      {centers.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {isArabic ? c.titleAr : c.titleEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{isArabic ? "الكلية" : "Faculty"}</Label>
                  <Select value={pubFacultyId} onValueChange={setPubFacultyId}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder={isArabic ? "اختر الكلية..." : "Select Faculty..."} />
                    </SelectTrigger>
                    <SelectContent dir={dir}>
                      <SelectItem value="none">{isArabic ? "عام" : "General"}</SelectItem>
                      {faculties.map((f) => (
                        <SelectItem key={f.id} value={String(f.id)}>
                          {isArabic ? f.nameAr : f.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* DOI URL */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isArabic ? "رابط المقال أو معرّف DOI" : "DOI or Article URL"}</Label>
                <Input
                  value={pubDoiUrl}
                  onChange={(e) => setPubDoiUrl(e.target.value)}
                  placeholder="https://doi.org/10.1016/..."
                  dir="ltr"
                />
              </div>

              {/* Abstract */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isArabic ? "ملخص البحث (Abstract)" : "Research Abstract"}</Label>
                <Textarea
                  rows={3}
                  value={pubAbstractAr}
                  onChange={(e) => setPubAbstractAr(e.target.value)}
                  placeholder="اكتب ملخص أهداف البحث وأهم النتائج التي توصل إليها..."
                />
              </div>

              {/* PDF File Upload Box */}
              <div className="p-4 rounded-xl border-2 border-dashed border-border bg-card text-center space-y-3">
                {pubPdfFile ? (
                  <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div className="text-start">
                        <p className="text-xs font-bold text-foreground">{isArabic ? "تم رفع ملف الـ PDF" : "PDF File Uploaded"}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{pubPdfFileSizeFormatted}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs gap-1" asChild>
                        <a href={pubPdfFile} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-3 w-3" />
                          <span>{isArabic ? "معاينة" : "Preview"}</span>
                        </a>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setPubPdfFile("");
                          setPubPdfFileSize(0);
                          setPubPdfFileSizeFormatted("");
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {isArabic ? "رفع الورقة البحثية بصيغة PDF (اختياري، حتى 100 ميغابايت)" : "Upload Paper PDF (Optional, max 100MB)"}
                    </p>
                    <label className="cursor-pointer inline-block">
                      <Button
                        type="button"
                        variant="outline"
                        className="text-xs font-bold gap-2 h-9"
                        disabled={isUploadingPdf}
                        asChild
                      >
                        <span>
                          {isUploadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4 text-primary" />}
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

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold">{isArabic ? "ورقة بحثية مميزة" : "Featured Paper"}</Label>
                    <p className="text-[10px] text-muted-foreground">{isArabic ? "تظهر في صدارة أحدث المنشورات" : "Display in hero list"}</p>
                  </div>
                  <Switch checked={pubIsFeatured} onCheckedChange={setPubIsFeatured} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold">{isArabic ? "حالة النشر" : "Publication Status"}</Label>
                    <p className="text-[10px] text-muted-foreground">{isArabic ? "مرئي للزوار في الموقع العام" : "Visible to public"}</p>
                  </div>
                  <Switch checked={pubIsActive} onCheckedChange={setPubIsActive} />
                </div>
              </div>
            </DialogBody>

            <DialogFooter className="p-4 px-6 border-t border-border bg-muted/20 flex flex-row items-center justify-between shrink-0">
              <Button type="button" variant="outline" className="text-xs font-bold" onClick={() => setIsPubModalOpen(false)}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-white text-xs font-bold gap-2"
                disabled={createPubMutation.isPending || updatePubMutation.isPending}
              >
                {(createPubMutation.isPending || updatePubMutation.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>
                  {editingPub
                    ? isArabic ? "حفظ التعديلات" : "Save Changes"
                    : isArabic ? "إضافة الورقة العلمية" : "Add Paper"}
                </span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          Modal: Add / Edit Center
         ======================================================== */}
      <Dialog open={isCenterModalOpen} onOpenChange={setIsCenterModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[92vh] flex flex-col p-0 overflow-hidden w-[95vw]" dir={dir}>
          <DialogHeader className="p-5 pb-3 border-b border-border bg-muted/20 shrink-0">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Microscope className="h-5 w-5 text-primary" />
              <span>{editingCenter ? (isArabic ? "تعديل المركز البحثي" : "Edit Center") : (isArabic ? "إضافة مركز بحثي جديد" : "Add Center")}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveCenter} className="flex flex-col flex-1 overflow-hidden min-h-0">
            <DialogBody className="p-5 overflow-y-auto space-y-4 flex-1 min-h-0">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isArabic ? "اسم المركز (بالعربية) *" : "Title (Arabic) *"}</Label>
                <Input value={centerTitleAr} onChange={(e) => setCenterTitleAr(e.target.value)} required />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isArabic ? "اسم المركز (بالإنجليزية)" : "Title (English)"}</Label>
                <Input value={centerTitleEn} onChange={(e) => setCenterTitleEn(e.target.value)} dir="ltr" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isArabic ? "وصف المركز واختصاصاته *" : "Description *"}</Label>
                <Textarea rows={3} value={centerDescAr} onChange={(e) => setCenterDescAr(e.target.value)} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{isArabic ? "أيقونة المركز" : "Center Icon"}</Label>
                  <Select value={centerIcon} onValueChange={setCenterIcon}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir={dir}>
                      {CENTER_ICONS.map((ic) => (
                        <SelectItem key={ic.value} value={ic.value}>
                          {ic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{isArabic ? "الكلية المرتبطة" : "Associated Faculty"}</Label>
                  <Select value={centerFacultyId} onValueChange={setCenterFacultyId}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder={isArabic ? "عام" : "General"} />
                    </SelectTrigger>
                    <SelectContent dir={dir}>
                      <SelectItem value="none">{isArabic ? "عام (كافة الكليات)" : "General"}</SelectItem>
                      {faculties.map((f) => (
                        <SelectItem key={f.id} value={String(f.id)}>
                          {isArabic ? f.nameAr : f.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{isArabic ? "اسم المشرف أو المدير" : "Director Name"}</Label>
                  <Input value={centerDirectorAr} onChange={(e) => setCenterDirectorAr(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{isArabic ? "الموقع في الحرم الجامعي" : "Campus Location"}</Label>
                  <Input value={centerLocation} onChange={(e) => setCenterLocation(e.target.value)} />
                </div>
              </div>
            </DialogBody>

            <DialogFooter className="p-4 px-5 border-t border-border bg-muted/20 flex flex-row items-center justify-between shrink-0">
              <Button type="button" variant="outline" className="text-xs" onClick={() => setIsCenterModalOpen(false)}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/95 text-white text-xs font-bold">
                {editingCenter ? (isArabic ? "حفظ التعديلات" : "Save") : (isArabic ? "إضافة المركز" : "Create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          Modal: Add / Edit Area
         ======================================================== */}
      <Dialog open={isAreaModalOpen} onOpenChange={setIsAreaModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden w-[95vw]" dir={dir}>
          <DialogHeader className="p-5 pb-3 border-b border-border bg-muted/20 shrink-0">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-500" />
              <span>{editingArea ? (isArabic ? "تعديل المجال البحثي" : "Edit Area") : (isArabic ? "إضافة مجال بحثي جديد" : "Add Area")}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveArea} className="flex flex-col flex-1 overflow-hidden min-h-0">
            <DialogBody className="p-5 overflow-y-auto space-y-4 flex-1 min-h-0">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isArabic ? "اسم المجال (بالعربية) *" : "Area Name (Arabic) *"}</Label>
                <Input value={areaNameAr} onChange={(e) => setAreaNameAr(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isArabic ? "اسم المجال (بالإنجليزية)" : "Area Name (English)"}</Label>
                <Input value={areaNameEn} onChange={(e) => setAreaNameEn(e.target.value)} dir="ltr" />
              </div>
            </DialogBody>

            <DialogFooter className="p-4 px-5 border-t border-border bg-muted/20 flex flex-row items-center justify-between shrink-0">
              <Button type="button" variant="outline" className="text-xs" onClick={() => setIsAreaModalOpen(false)}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/95 text-white text-xs font-bold">
                {editingArea ? (isArabic ? "حفظ التعديلات" : "Save") : (isArabic ? "إضافة المجال" : "Create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          Delete Publication Confirmation Dialog
         ======================================================== */}
      <Dialog open={!!deletingPub} onOpenChange={(open) => !open && setDeletingPub(null)}>
        <DialogContent className="sm:max-w-md" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{isArabic ? "تأكيد حذف الورقة البحثية" : "Confirm Deletion"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs mt-2">
              {isArabic
                ? `هل أنت متأكد من رغبتك بحذف "${deletingPub?.titleAr}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${deletingPub?.titleEn}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setDeletingPub(null)}>
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeletePublication} disabled={deletePubMutation.isPending}>
              {deletePubMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : isArabic ? "حذف نهائي" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Center Confirmation Dialog */}
      <Dialog open={!!deletingCenter} onOpenChange={(open) => !open && setDeletingCenter(null)}>
        <DialogContent className="sm:max-w-md" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{isArabic ? "تأكيد حذف المركز" : "Confirm Deletion"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs mt-2">
              {isArabic ? `هل تريد بالتأكيد حذف "${deletingCenter?.titleAr}"؟` : `Delete center "${deletingCenter?.titleEn}"?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setDeletingCenter(null)}>
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteCenter} disabled={deleteCenterMutation.isPending}>
              {deleteCenterMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : isArabic ? "حذف" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Area Confirmation Dialog */}
      <Dialog open={!!deletingArea} onOpenChange={(open) => !open && setDeletingArea(null)}>
        <DialogContent className="sm:max-w-md" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{isArabic ? "تأكيد حذف المجال" : "Confirm Deletion"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs mt-2">
              {isArabic ? `هل تريد حذف المجال البحثي "${deletingArea?.nameAr}"؟` : `Delete area "${deletingArea?.nameEn}"?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setDeletingArea(null)}>
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteArea} disabled={deleteAreaMutation.isPending}>
              {deleteAreaMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : isArabic ? "حذف" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
