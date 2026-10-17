"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/language-context";
import {
  useHousingFeatures,
  useCreateHousingFeature,
  useUpdateHousingFeature,
  useDeleteHousingFeature,
  useStudentClubs,
  useCreateStudentClub,
  useUpdateStudentClub,
  useDeleteStudentClub,
  useSportActivities,
  useCreateSportActivity,
  useUpdateSportActivity,
  useDeleteSportActivity,
  useCampusLifeOverview,
  useUpdateCampusLifeOverview,
  useCampusLifeStats,
} from "@/hooks/use-campus-life";
import {
  HousingFeature,
  StudentClub,
  SportActivity,
  CampusLifeOverview,
} from "@/lib/api";
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
  Home,
  Users,
  Dumbbell,
  Bed,
  Utensils,
  Wifi,
  Bus,
  Music,
  Palette,
  BookOpen,
  Globe,
  Trophy,
  Heart,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Sparkles,
  Settings,
  Shield,
  Coffee,
  Code,
  Camera,
  Activity,
  Target,
  Flame,
  CheckCircle2,
  AlertCircle,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

// Common Icon mapping for Housing
const HOUSING_ICONS = [
  { label: "سرير (Bed)", value: "Bed", icon: Bed },
  { label: "مطعم ووجبات (Utensils)", value: "Utensils", icon: Utensils },
  { label: "واي فاي (Wifi)", value: "Wifi", icon: Wifi },
  { label: "حافلة ومواصلات (Bus)", value: "Bus", icon: Bus },
  { label: "أمان وحراسة (Shield)", value: "Shield", icon: Shield },
  { label: "مبنى سكني (Building)", value: "Building2", icon: Building2 },
  { label: "مقهى واستراحة (Coffee)", value: "Coffee", icon: Coffee },
];

// Common Icon mapping for Clubs
const CLUB_ICONS = [
  { label: "موسيقى (Music)", value: "Music", icon: Music },
  { label: "فنون وتشكيل (Palette)", value: "Palette", icon: Palette },
  { label: "قراءة وأدب (BookOpen)", value: "BookOpen", icon: BookOpen },
  { label: "لغات وترجمة (Globe)", value: "Globe", icon: Globe },
  { label: "ريادة أعمال (Trophy)", value: "Trophy", icon: Trophy },
  { label: "عمل تطوعي (Heart)", value: "Heart", icon: Heart },
  { label: "برمجة وتقنية (Code)", value: "Code", icon: Code },
  { label: "تصوير وإعلام (Camera)", value: "Camera", icon: Camera },
  { label: "أنشطة عامة (Users)", value: "Users", icon: Users },
];

// Common Icon mapping for Sports
const SPORT_ICONS = [
  { label: "أثقال ورياضة (Dumbbell)", value: "Dumbbell", icon: Dumbbell },
  { label: "بطولات وكأس (Trophy)", value: "Trophy", icon: Trophy },
  { label: "نشاط وحركة (Activity)", value: "Activity", icon: Activity },
  { label: "تصويب وألعاب (Target)", value: "Target", icon: Target },
  { label: "حماسة وطاقة (Flame)", value: "Flame", icon: Flame },
];

export default function DashboardCampusLifePage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  // Data Queries
  const { data: housingFeatures = [], isLoading: isHousingLoading } = useHousingFeatures();
  const { data: clubs = [], isLoading: isClubsLoading } = useStudentClubs();
  const { data: sports = [], isLoading: isSportsLoading } = useSportActivities();
  const { data: overview, isLoading: isOverviewLoading } = useCampusLifeOverview();
  const { data: stats, isLoading: isStatsLoading } = useCampusLifeStats();

  // Mutations
  const createHousingMutation = useCreateHousingFeature();
  const updateHousingMutation = useUpdateHousingFeature();
  const deleteHousingMutation = useDeleteHousingFeature();

  const createClubMutation = useCreateStudentClub();
  const updateClubMutation = useUpdateStudentClub();
  const deleteClubMutation = useDeleteStudentClub();

  const createSportMutation = useCreateSportActivity();
  const updateSportMutation = useUpdateSportActivity();
  const deleteSportMutation = useDeleteSportActivity();

  const updateOverviewMutation = useUpdateCampusLifeOverview();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"housing" | "clubs" | "sports">("housing");

  // Search states
  const [housingSearch, setHousingSearch] = useState("");
  const [clubSearch, setClubSearch] = useState("");
  const [sportSearch, setSportSearch] = useState("");

  // Modals state: Housing
  const [isHousingModalOpen, setIsHousingModalOpen] = useState(false);
  const [editingHousing, setEditingHousing] = useState<HousingFeature | null>(null);
  const [housingTitleAr, setHousingTitleAr] = useState("");
  const [housingTitleEn, setHousingTitleEn] = useState("");
  const [housingDescAr, setHousingDescAr] = useState("");
  const [housingDescEn, setHousingDescEn] = useState("");
  const [housingIcon, setHousingIcon] = useState("Bed");
  const [housingOrder, setHousingOrder] = useState(0);
  const [housingIsActive, setHousingIsActive] = useState(true);
  const [deletingHousing, setDeletingHousing] = useState<HousingFeature | null>(null);

  // Modals state: Club
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<StudentClub | null>(null);
  const [clubNameAr, setClubNameAr] = useState("");
  const [clubNameEn, setClubNameEn] = useState("");
  const [clubDescAr, setClubDescAr] = useState("");
  const [clubDescEn, setClubDescEn] = useState("");
  const [clubIcon, setClubIcon] = useState("Users");
  const [clubCategory, setClubCategory] = useState("عام");
  const [clubSupervisor, setClubSupervisor] = useState("");
  const [clubOrder, setClubOrder] = useState(0);
  const [clubIsActive, setClubIsActive] = useState(true);
  const [deletingClub, setDeletingClub] = useState<StudentClub | null>(null);

  // Modals state: Sport
  const [isSportModalOpen, setIsSportModalOpen] = useState(false);
  const [editingSport, setEditingSport] = useState<SportActivity | null>(null);
  const [sportNameAr, setSportNameAr] = useState("");
  const [sportNameEn, setSportNameEn] = useState("");
  const [sportDescAr, setSportDescAr] = useState("");
  const [sportDescEn, setSportDescEn] = useState("");
  const [sportIcon, setSportIcon] = useState("Dumbbell");
  const [sportOrder, setSportOrder] = useState(0);
  const [sportIsActive, setSportIsActive] = useState(true);
  const [deletingSport, setDeletingSport] = useState<SportActivity | null>(null);

  // Modals state: Overview / Settings
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [ovHousingTitleAr, setOvHousingTitleAr] = useState("");
  const [ovHousingTitleEn, setOvHousingTitleEn] = useState("");
  const [ovHousingDescAr, setOvHousingDescAr] = useState("");
  const [ovHousingDescEn, setOvHousingDescEn] = useState("");
  const [ovHousingImage, setOvHousingImage] = useState("");
  const [ovHousingContactNoteAr, setOvHousingContactNoteAr] = useState("");
  const [ovHousingContactNoteEn, setOvHousingContactNoteEn] = useState("");
  const [ovSportsTitleAr, setOvSportsTitleAr] = useState("");
  const [ovSportsTitleEn, setOvSportsTitleEn] = useState("");
  const [ovSportsDescAr, setOvSportsDescAr] = useState("");
  const [ovSportsDescEn, setOvSportsDescEn] = useState("");
  const [ovSportsImage, setOvSportsImage] = useState("");
  const [ovChampionshipsTitleAr, setOvChampionshipsTitleAr] = useState("");
  const [ovChampionshipsTitleEn, setOvChampionshipsTitleEn] = useState("");
  const [ovChampionshipsDescAr, setOvChampionshipsDescAr] = useState("");
  const [ovChampionshipsDescEn, setOvChampionshipsDescEn] = useState("");

  // Filtered lists
  const filteredHousing = useMemo(() => {
    return housingFeatures.filter((f) => {
      if (!housingSearch.trim()) return true;
      const q = housingSearch.toLowerCase();
      return (
        f.titleAr.toLowerCase().includes(q) ||
        f.titleEn.toLowerCase().includes(q) ||
        f.descriptionAr.toLowerCase().includes(q)
      );
    });
  }, [housingFeatures, housingSearch]);

  const filteredClubs = useMemo(() => {
    return clubs.filter((c) => {
      if (!clubSearch.trim()) return true;
      const q = clubSearch.toLowerCase();
      return (
        c.nameAr.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.descriptionAr.toLowerCase().includes(q) ||
        (c.supervisor && c.supervisor.toLowerCase().includes(q))
      );
    });
  }, [clubs, clubSearch]);

  const filteredSports = useMemo(() => {
    return sports.filter((s) => {
      if (!sportSearch.trim()) return true;
      const q = sportSearch.toLowerCase();
      return (
        s.nameAr.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        (s.descriptionAr && s.descriptionAr.toLowerCase().includes(q))
      );
    });
  }, [sports, sportSearch]);

  // Handlers: Housing
  const handleOpenHousingModal = (feature: HousingFeature | null) => {
    setEditingHousing(feature);
    if (feature) {
      setHousingTitleAr(feature.titleAr);
      setHousingTitleEn(feature.titleEn || "");
      setHousingDescAr(feature.descriptionAr);
      setHousingDescEn(feature.descriptionEn || "");
      setHousingIcon(feature.icon || "Bed");
      setHousingOrder(feature.order ?? 0);
      setHousingIsActive(feature.isActive ?? true);
    } else {
      setHousingTitleAr("");
      setHousingTitleEn("");
      setHousingDescAr("");
      setHousingDescEn("");
      setHousingIcon("Bed");
      setHousingOrder(housingFeatures.length + 1);
      setHousingIsActive(true);
    }
    setIsHousingModalOpen(true);
  };

  const handleSaveHousing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!housingTitleAr.trim() || !housingDescAr.trim()) {
      toast.error(isArabic ? "يرجى إدخال عنوان ووصف الميزة" : "Please fill in title and description");
      return;
    }

    const payload: HousingFeature = {
      titleAr: housingTitleAr.trim(),
      titleEn: housingTitleEn.trim() || housingTitleAr.trim(),
      descriptionAr: housingDescAr.trim(),
      descriptionEn: housingDescEn.trim() || housingDescAr.trim(),
      icon: housingIcon,
      order: Number(housingOrder) || 0,
      isActive: housingIsActive,
    };

    try {
      if (editingHousing && editingHousing.id) {
        await updateHousingMutation.mutateAsync({ id: editingHousing.id, data: payload });
        toast.success(isArabic ? "تم تحديث ميزة السكن بنجاح!" : "Housing amenity updated successfully!");
      } else {
        await createHousingMutation.mutateAsync(payload);
        toast.success(isArabic ? "تمت إضافة ميزة السكن بنجاح!" : "Housing amenity created successfully!");
      }
      setIsHousingModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل حفظ ميزة السكن" : "Failed to save amenity"));
    }
  };

  const handleDeleteHousing = async () => {
    if (!deletingHousing || !deletingHousing.id) return;
    try {
      await deleteHousingMutation.mutateAsync(deletingHousing.id);
      toast.success(isArabic ? "تم حذف ميزة السكن بنجاح" : "Housing amenity deleted");
      setDeletingHousing(null);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل الحذف" : "Delete failed"));
    }
  };

  // Handlers: Clubs
  const handleOpenClubModal = (club: StudentClub | null) => {
    setEditingClub(club);
    if (club) {
      setClubNameAr(club.nameAr);
      setClubNameEn(club.nameEn || "");
      setClubDescAr(club.descriptionAr);
      setClubDescEn(club.descriptionEn || "");
      setClubIcon(club.icon || "Users");
      setClubCategory(club.category || "عام");
      setClubSupervisor(club.supervisor || "");
      setClubOrder(club.order ?? 0);
      setClubIsActive(club.isActive ?? true);
    } else {
      setClubNameAr("");
      setClubNameEn("");
      setClubDescAr("");
      setClubDescEn("");
      setClubIcon("Users");
      setClubCategory("عام");
      setClubSupervisor("");
      setClubOrder(clubs.length + 1);
      setClubIsActive(true);
    }
    setIsClubModalOpen(true);
  };

  const handleSaveClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubNameAr.trim() || !clubDescAr.trim()) {
      toast.error(isArabic ? "يرجى إدخال اسم ووصف النادي" : "Please fill in club name and description");
      return;
    }

    const payload: StudentClub = {
      nameAr: clubNameAr.trim(),
      nameEn: clubNameEn.trim() || clubNameAr.trim(),
      descriptionAr: clubDescAr.trim(),
      descriptionEn: clubDescEn.trim() || clubDescAr.trim(),
      icon: clubIcon,
      category: clubCategory.trim(),
      supervisor: clubSupervisor.trim(),
      order: Number(clubOrder) || 0,
      isActive: clubIsActive,
    };

    try {
      if (editingClub && editingClub.id) {
        await updateClubMutation.mutateAsync({ id: editingClub.id, data: payload });
        toast.success(isArabic ? "تم تحديث النادي بنجاح!" : "Club updated successfully!");
      } else {
        await createClubMutation.mutateAsync(payload);
        toast.success(isArabic ? "تمت إضافة النادي بنجاح!" : "Club created successfully!");
      }
      setIsClubModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل حفظ النادي" : "Failed to save club"));
    }
  };

  const handleDeleteClub = async () => {
    if (!deletingClub || !deletingClub.id) return;
    try {
      await deleteClubMutation.mutateAsync(deletingClub.id);
      toast.success(isArabic ? "تم حذف النادي بنجاح" : "Club deleted");
      setDeletingClub(null);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل الحذف" : "Delete failed"));
    }
  };

  // Handlers: Sports
  const handleOpenSportModal = (sport: SportActivity | null) => {
    setEditingSport(sport);
    if (sport) {
      setSportNameAr(sport.nameAr);
      setSportNameEn(sport.nameEn || "");
      setSportDescAr(sport.descriptionAr || "");
      setSportDescEn(sport.descriptionEn || "");
      setSportIcon(sport.icon || "Dumbbell");
      setSportOrder(sport.order ?? 0);
      setSportIsActive(sport.isActive ?? true);
    } else {
      setSportNameAr("");
      setSportNameEn("");
      setSportDescAr("");
      setSportDescEn("");
      setSportIcon("Dumbbell");
      setSportOrder(sports.length + 1);
      setSportIsActive(true);
    }
    setIsSportModalOpen(true);
  };

  const handleSaveSport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sportNameAr.trim()) {
      toast.error(isArabic ? "يرجى إدخال اسم النشاط الرياضي" : "Please fill in sport name");
      return;
    }

    const payload: SportActivity = {
      nameAr: sportNameAr.trim(),
      nameEn: sportNameEn.trim() || sportNameAr.trim(),
      descriptionAr: sportDescAr.trim(),
      descriptionEn: sportDescEn.trim(),
      icon: sportIcon,
      order: Number(sportOrder) || 0,
      isActive: sportIsActive,
    };

    try {
      if (editingSport && editingSport.id) {
        await updateSportMutation.mutateAsync({ id: editingSport.id, data: payload });
        toast.success(isArabic ? "تم تحديث النشاط الرياضي بنجاح!" : "Sport activity updated successfully!");
      } else {
        await createSportMutation.mutateAsync(payload);
        toast.success(isArabic ? "تمت إضافة النشاط الرياضي بنجاح!" : "Sport activity created successfully!");
      }
      setIsSportModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل حفظ النشاط" : "Failed to save sport"));
    }
  };

  const handleDeleteSport = async () => {
    if (!deletingSport || !deletingSport.id) return;
    try {
      await deleteSportMutation.mutateAsync(deletingSport.id);
      toast.success(isArabic ? "تم حذف النشاط الرياضي بنجاح" : "Sport activity deleted");
      setDeletingSport(null);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل الحذف" : "Delete failed"));
    }
  };

  // Handlers: Overview
  const handleOpenOverviewModal = () => {
    if (overview) {
      setOvHousingTitleAr(overview.housingTitleAr || "السكن الجامعي");
      setOvHousingTitleEn(overview.housingTitleEn || "Student Housing");
      setOvHousingDescAr(overview.housingDescAr || "");
      setOvHousingDescEn(overview.housingDescEn || "");
      setOvHousingImage(overview.housingImage || "/images/pages/campus-life.png");
      setOvHousingContactNoteAr(overview.housingContactNoteAr || "");
      setOvHousingContactNoteEn(overview.housingContactNoteEn || "");

      setOvSportsTitleAr(overview.sportsTitleAr || "الأنشطة الرياضية");
      setOvSportsTitleEn(overview.sportsTitleEn || "Sports Activities");
      setOvSportsDescAr(overview.sportsDescAr || "");
      setOvSportsDescEn(overview.sportsDescEn || "");
      setOvSportsImage(overview.sportsImage || "/images/pages/campus-life.png");
      setOvChampionshipsTitleAr(overview.championshipsTitleAr || "البطولات السنوية");
      setOvChampionshipsTitleEn(overview.championshipsTitleEn || "Annual Championships");
      setOvChampionshipsDescAr(overview.championshipsDescAr || "");
      setOvChampionshipsDescEn(overview.championshipsDescEn || "");
    }
    setIsOverviewModalOpen(true);
  };

  const handleSaveOverview = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CampusLifeOverview = {
      housingTitleAr: ovHousingTitleAr.trim(),
      housingTitleEn: ovHousingTitleEn.trim(),
      housingDescAr: ovHousingDescAr.trim(),
      housingDescEn: ovHousingDescEn.trim(),
      housingImage: ovHousingImage.trim() || "/images/pages/campus-life.png",
      housingContactNoteAr: ovHousingContactNoteAr.trim(),
      housingContactNoteEn: ovHousingContactNoteEn.trim(),

      sportsTitleAr: ovSportsTitleAr.trim(),
      sportsTitleEn: ovSportsTitleEn.trim(),
      sportsDescAr: ovSportsDescAr.trim(),
      sportsDescEn: ovSportsDescEn.trim(),
      sportsImage: ovSportsImage.trim() || "/images/pages/campus-life.png",
      championshipsTitleAr: ovChampionshipsTitleAr.trim(),
      championshipsTitleEn: ovChampionshipsTitleEn.trim(),
      championshipsDescAr: ovChampionshipsDescAr.trim(),
      championshipsDescEn: ovChampionshipsDescEn.trim(),
    };

    try {
      const targetId = overview?.id || 1;
      await updateOverviewMutation.mutateAsync({ id: targetId, data: payload });
      toast.success(isArabic ? "تم تحديث نصوص وإعدادات الحياة الجامعية بنجاح!" : "Overview updated successfully!");
      setIsOverviewModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل حفظ الإعدادات" : "Failed to update overview"));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-start">
      {/* Header & Primary Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Sparkles className="h-7 w-7 text-primary" />
            <span>{isArabic ? "إدارة الحياة الجامعية" : "Campus Life Management"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isArabic
              ? "إدارة السكن الجامعي ومرافقه، النوادي الطلابية، والأنشطة الرياضية لجامعة أنطاكية السورية."
              : "Manage student housing amenities, clubs, and sports activities."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={handleOpenOverviewModal}
            className="gap-2 text-xs font-semibold h-9"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>{isArabic ? "نصوص وبنرات الأقسام" : "Section Banners & Texts"}</span>
          </Button>

          {activeTab === "housing" && (
            <Button
              onClick={() => handleOpenHousingModal(null)}
              className="gap-2 text-xs font-bold shadow-xs h-9"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? "إضافة ميزة سكن" : "Add Housing Amenity"}</span>
            </Button>
          )}

          {activeTab === "clubs" && (
            <Button
              onClick={() => handleOpenClubModal(null)}
              className="gap-2 text-xs font-bold shadow-xs h-9"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? "إضافة نادٍ طلابي" : "Add Student Club"}</span>
            </Button>
          )}

          {activeTab === "sports" && (
            <Button
              onClick={() => handleOpenSportModal(null)}
              className="gap-2 text-xs font-bold shadow-xs h-9"
            >
              <Plus className="h-4 w-4" />
              <span>{isArabic ? "إضافة نشاط رياضي" : "Add Sport Activity"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Card 1: Clubs */}
        <Card className="border-border/80 shadow-xs hover:border-primary/40 transition-all">
          <CardHeader className="px-3.5 pt-3 pb-1">
            <CardDescription className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {isArabic ? "النوادي الطلابية" : "Student Clubs"}
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-black mt-1 text-primary">
              {isStatsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.totalClubs ?? clubs.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3.5 pb-3 pt-0">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{isArabic ? "نوادي نشطة ومعتمدة" : "Active Student Clubs"}</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Housing */}
        <Card className="border-border/80 shadow-xs hover:border-indigo-500/40 transition-all">
          <CardHeader className="px-3.5 pt-3 pb-1">
            <CardDescription className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {isArabic ? "ميزات السكن الجامعي" : "Housing Amenities"}
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-black mt-1 text-indigo-600 dark:text-indigo-400">
              {isStatsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.totalHousingFeatures ?? housingFeatures.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3.5 pb-3 pt-0">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">{isArabic ? "مرافق وخدمات متوفرة" : "Available Facilities"}</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Sports */}
        <Card className="border-border/80 shadow-xs hover:border-amber-500/40 transition-all">
          <CardHeader className="px-3.5 pt-3 pb-1">
            <CardDescription className="text-xs sm:text-sm font-semibold text-muted-foreground">
              {isArabic ? "الأنشطة والرياضات" : "Sports & Activities"}
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-black mt-1 text-amber-600 dark:text-amber-400">
              {isStatsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.totalSports ?? sports.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3.5 pb-3 pt-0">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Dumbbell className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{isArabic ? "ألعاب ورياضات جامعية" : "Athletic Disciplines"}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
        <div className="w-full pt-1 pb-1">
          <TabsList className="w-full grid grid-cols-3 h-11 sm:h-12 p-1 bg-muted/60 border border-border/60 rounded-xl shadow-xs">
            <TabsTrigger
              value="housing"
              className="rounded-lg h-full gap-2 font-medium text-xs sm:text-sm data-[state=active]:font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Home className="h-4 w-4 text-primary shrink-0" />
              <span>{isArabic ? "السكن ومرافقه" : "Housing Amenities"}</span>
              <Badge variant="secondary" className="mr-1.5 rtl:mr-0 rtl:ml-1.5 text-[11px] font-semibold px-2 py-0.5 min-w-[20px] h-4.5 justify-center">
                {housingFeatures.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="clubs"
              className="rounded-lg h-full gap-2 font-medium text-xs sm:text-sm data-[state=active]:font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>{isArabic ? "النوادي الطلابية" : "Student Clubs"}</span>
              <Badge variant="secondary" className="mr-1.5 rtl:mr-0 rtl:ml-1.5 text-[11px] font-semibold px-2 py-0.5 min-w-[20px] h-4.5 justify-center">
                {clubs.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="sports"
              className="rounded-lg h-full gap-2 font-medium text-xs sm:text-sm data-[state=active]:font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Dumbbell className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{isArabic ? "الأنشطة والرياضات" : "Sports Activities"}</span>
              <Badge variant="secondary" className="mr-1.5 rtl:mr-0 rtl:ml-1.5 text-[11px] font-semibold px-2 py-0.5 min-w-[20px] h-4.5 justify-center">
                {sports.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ========================================================
            Tab 1: Housing Management
           ======================================================== */}
        <TabsContent value="housing" className="space-y-4 mt-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 sm:p-4 rounded-xl border border-border">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute top-1/2 left-3 rtl:right-3 rtl:left-auto -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isArabic ? "ابحث في ميزات وخدمات السكن..." : "Search housing amenities..."}
                value={housingSearch}
                onChange={(e) => setHousingSearch(e.target.value)}
                className="pl-9 pr-4 rtl:pr-9 rtl:pl-4 bg-background text-xs sm:text-sm h-9"
              />
            </div>
          </div>

          {/* Table */}
          {isHousingLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">{isArabic ? "جاري تحميل ميزات السكن..." : "Loading..."}</p>
            </div>
          ) : filteredHousing.length === 0 ? (
            <div className="py-16 text-center bg-card rounded-2xl border border-dashed border-border space-y-3">
              <Home className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
              <h3 className="font-bold text-sm text-foreground">{isArabic ? "لم يتم العثور على ميزات" : "No amenities found"}</h3>
              <Button size="sm" onClick={() => handleOpenHousingModal(null)} className="gap-2 text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>{isArabic ? "إضافة ميزة سكن" : "Add Amenity"}</span>
              </Button>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-xs">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-[10%] text-center text-xs font-bold">{isArabic ? "الأيقونة" : "Icon"}</TableHead>
                    <TableHead className="w-[30%] text-xs font-bold">{isArabic ? "عنوان الميزة" : "Title"}</TableHead>
                    <TableHead className="w-[40%] text-xs font-bold">{isArabic ? "الوصف" : "Description"}</TableHead>
                    <TableHead className="w-[30%] text-center text-xs font-bold">{isArabic ? "عنوان الميزة" : "Title"}</TableHead>
                    <TableHead className="w-[40%] text-center text-xs font-bold">{isArabic ? "الوصف" : "Description"}</TableHead>
                    <TableHead className="w-[10%] text-center text-xs font-bold">{isArabic ? "الحالة" : "Status"}</TableHead>
                    <TableHead className="w-[10%] text-end text-xs font-bold">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                    <TableHead className="w-[10%] text-center text-xs font-bold">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHousing.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="align-top py-3 text-center w-[10%]">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto">
                          <Home className="h-4 w-4" />
                        </div>
                      </TableCell>

                      <TableCell className="align-top py-3 w-[30%] overflow-hidden">
                        <p className="font-bold text-xs sm:text-sm text-foreground">{item.titleAr}</p>
                        {item.titleEn && <p className="text-[11px] text-muted-foreground">{item.titleEn}</p>}
                      </TableCell>

                      <TableCell className="align-top py-3 w-[40%] overflow-hidden">
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.descriptionAr}</p>
                      </TableCell>

                      <TableCell className="align-top py-3 text-center w-[10%]">
                        <Badge variant={item.isActive ? "secondary" : "outline"} className="text-[10px]">
                          {item.isActive ? (isArabic ? "نشط" : "Active") : (isArabic ? "معطل" : "Inactive")}
                        </Badge>
                      </TableCell>

                      <TableCell className="align-top py-3 text-end w-[10%]">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                            onClick={() => handleOpenHousingModal(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => setDeletingHousing(item)}
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
            Tab 2: Clubs Management
           ======================================================== */}
        <TabsContent value="clubs" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 sm:p-4 rounded-xl border border-border">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute top-1/2 left-3 rtl:right-3 rtl:left-auto -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isArabic ? "ابحث في النوادي الطلابية..." : "Search student clubs..."}
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
                className="pl-9 pr-4 rtl:pr-9 rtl:pl-4 bg-background text-xs sm:text-sm h-9"
              />
            </div>
          </div>

          {isClubsLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">{isArabic ? "جاري تحميل النوادي..." : "Loading clubs..."}</p>
            </div>
          ) : filteredClubs.length === 0 ? (
            <div className="py-16 text-center bg-card rounded-2xl border border-dashed border-border space-y-3">
              <Users className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
              <h3 className="font-bold text-sm text-foreground">{isArabic ? "لم يتم العثور على نوادٍ" : "No clubs found"}</h3>
              <Button size="sm" onClick={() => handleOpenClubModal(null)} className="gap-2 text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>{isArabic ? "إضافة نادٍ طلابي" : "Add Club"}</span>
              </Button>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-xs">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-[10%] text-center text-xs font-bold">{isArabic ? "الأيقونة" : "Icon"}</TableHead>
                    <TableHead className="w-[28%] text-xs font-bold">{isArabic ? "اسم النادي" : "Club Name"}</TableHead>
                    <TableHead className="w-[34%] text-xs font-bold">{isArabic ? "الوصف" : "Description"}</TableHead>
                    <TableHead className="w-[18%] text-xs font-bold">{isArabic ? "المشرف والتصنيف" : "Supervisor & Category"}</TableHead>
                    <TableHead className="w-[10%] text-end text-xs font-bold">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                    <TableHead className="w-[28%] text-center text-xs font-bold">{isArabic ? "اسم النادي" : "Club Name"}</TableHead>
                    <TableHead className="w-[34%] text-center text-xs font-bold">{isArabic ? "الوصف" : "Description"}</TableHead>
                    <TableHead className="w-[18%] text-center text-xs font-bold">{isArabic ? "المشرف والتصنيف" : "Supervisor & Category"}</TableHead>
                    <TableHead className="w-[10%] text-center text-xs font-bold">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClubs.map((club) => (
                    <TableRow key={club.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="align-top py-3 text-center w-[10%]">
                        <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                          <Users className="h-4 w-4" />
                        </div>
                      </TableCell>

                      <TableCell className="align-top py-3 w-[28%] overflow-hidden">
                        <p className="font-bold text-xs sm:text-sm text-foreground">{club.nameAr}</p>
                        {club.nameEn && <p className="text-[11px] text-muted-foreground">{club.nameEn}</p>}
                      </TableCell>

                      <TableCell className="align-top py-3 w-[34%] overflow-hidden">
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{club.descriptionAr}</p>
                      </TableCell>

                      <TableCell className="align-top py-3 w-[18%] overflow-hidden">
                        {club.supervisor && (
                          <p className="text-xs font-medium text-foreground truncate">{club.supervisor}</p>
                        )}
                        {club.category && (
                          <Badge variant="secondary" className="text-[10px] mt-1">
                            {club.category}
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="align-top py-3 text-end w-[10%]">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                            onClick={() => handleOpenClubModal(club)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => setDeletingClub(club)}
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
            Tab 3: Sports Management
           ======================================================== */}
        <TabsContent value="sports" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 sm:p-4 rounded-xl border border-border">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute top-1/2 left-3 rtl:right-3 rtl:left-auto -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isArabic ? "ابحث في الأنشطة الرياضية..." : "Search sport activities..."}
                value={sportSearch}
                onChange={(e) => setSportSearch(e.target.value)}
                className="pl-9 pr-4 rtl:pr-9 rtl:pl-4 bg-background text-xs sm:text-sm h-9"
              />
            </div>
          </div>

          {isSportsLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">{isArabic ? "جاري تحميل الرياضات..." : "Loading sports..."}</p>
            </div>
          ) : filteredSports.length === 0 ? (
            <div className="py-16 text-center bg-card rounded-2xl border border-dashed border-border space-y-3">
              <Dumbbell className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
              <h3 className="font-bold text-sm text-foreground">{isArabic ? "لم يتم العثور على رياضات" : "No sports found"}</h3>
              <Button size="sm" onClick={() => handleOpenSportModal(null)} className="gap-2 text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>{isArabic ? "إضافة نشاط رياضي" : "Add Sport"}</span>
              </Button>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-xs">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-[10%] text-center text-xs font-bold">{isArabic ? "الأيقونة" : "Icon"}</TableHead>
                    <TableHead className="w-[35%] text-xs font-bold">{isArabic ? "اسم اللعبة / الرياضة" : "Sport Name"}</TableHead>
                    <TableHead className="w-[35%] text-xs font-bold">{isArabic ? "الوصف" : "Description"}</TableHead>
                    <TableHead className="w-[35%] text-center text-xs font-bold">{isArabic ? "اسم اللعبة / الرياضة" : "Sport Name"}</TableHead>
                    <TableHead className="w-[35%] text-center text-xs font-bold">{isArabic ? "الوصف" : "Description"}</TableHead>
                    <TableHead className="w-[10%] text-center text-xs font-bold">{isArabic ? "الحالة" : "Status"}</TableHead>
                    <TableHead className="w-[10%] text-end text-xs font-bold">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                    <TableHead className="w-[10%] text-center text-xs font-bold">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSports.map((sport) => (
                    <TableRow key={sport.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="align-top py-3 text-center w-[10%]">
                        <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                          <Dumbbell className="h-4 w-4" />
                        </div>
                      </TableCell>

                      <TableCell className="align-top py-3 w-[35%] overflow-hidden">
                        <p className="font-bold text-xs sm:text-sm text-foreground">{sport.nameAr}</p>
                        {sport.nameEn && <p className="text-[11px] text-muted-foreground">{sport.nameEn}</p>}
                      </TableCell>

                      <TableCell className="align-top py-3 w-[35%] overflow-hidden">
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {sport.descriptionAr || (isArabic ? "نشاط وبطولات دورية" : "Regular tournaments")}
                        </p>
                      </TableCell>

                      <TableCell className="align-top py-3 text-center w-[10%]">
                        <Badge variant={sport.isActive ? "secondary" : "outline"} className="text-[10px]">
                          {sport.isActive ? (isArabic ? "نشط" : "Active") : (isArabic ? "معطل" : "Inactive")}
                        </Badge>
                      </TableCell>

                      <TableCell className="align-top py-3 text-end w-[10%]">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                            onClick={() => handleOpenSportModal(sport)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => setDeletingSport(sport)}
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
      </Tabs>

      {/* ========================================================
          Modal: Housing Feature (Add / Edit)
         ======================================================== */}
      <Dialog open={isHousingModalOpen} onOpenChange={setIsHousingModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSaveHousing}>
            <DialogHeader className="text-start">
              <DialogTitle className="text-lg font-bold">
                {editingHousing
                  ? (isArabic ? "تعديل ميزة السكن" : "Edit Housing Amenity")
                  : (isArabic ? "إضافة ميزة سكن جديدة" : "Add Housing Amenity")}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {isArabic ? "أدخل تفاصيل الخدمة أو المرفق المتاح في السكن الجامعي." : "Enter amenity details."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">{isArabic ? "العنوان بالعربية *" : "Title (AR) *"}</Label>
                  <Input
                    required
                    value={housingTitleAr}
                    onChange={(e) => setHousingTitleAr(e.target.value)}
                    placeholder={isArabic ? "مثال: غرف مريحة" : "e.g. Comfortable Rooms"}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{isArabic ? "العنوان بالإنجليزية" : "Title (EN)"}</Label>
                  <Input
                    value={housingTitleEn}
                    onChange={(e) => setHousingTitleEn(e.target.value)}
                    placeholder="e.g. Comfortable Rooms"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">{isArabic ? "الوصف بالعربية *" : "Description (AR) *"}</Label>
                <Textarea
                  required
                  rows={2}
                  value={housingDescAr}
                  onChange={(e) => setHousingDescAr(e.target.value)}
                  placeholder={isArabic ? "نبذة عن الميزة والخدمات المقدمة..." : "Amenity description..."}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">{isArabic ? "الوصف بالإنجليزية" : "Description (EN)"}</Label>
                <Textarea
                  rows={2}
                  value={housingDescEn}
                  onChange={(e) => setHousingDescEn(e.target.value)}
                  placeholder="Amenity description in English..."
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="space-y-1.5">
                  <Label className="text-xs">{isArabic ? "الأيقونة" : "Icon"}</Label>
                  <Select value={housingIcon} onValueChange={setHousingIcon}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HOUSING_ICONS.map((ic) => (
                        <SelectItem key={ic.value} value={ic.value}>
                          {ic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">{isArabic ? "ترتيب الظهور" : "Order"}</Label>
                  <Input
                    type="number"
                    value={housingOrder}
                    onChange={(e) => setHousingOrder(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label className="text-xs">{isArabic ? "تفعيل الظهور في الموقع" : "Active"}</Label>
                <Switch checked={housingIsActive} onCheckedChange={setHousingIsActive} />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsHousingModalOpen(false)}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" size="sm" disabled={createHousingMutation.isPending || updateHousingMutation.isPending}>
                {isArabic ? "حفظ الميزة" : "Save Amenity"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          Modal: Student Club (Add / Edit)
         ======================================================== */}
      <Dialog open={isClubModalOpen} onOpenChange={setIsClubModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSaveClub}>
            <DialogHeader className="text-start">
              <DialogTitle className="text-lg font-bold">
                {editingClub
                  ? (isArabic ? "تعديل النادي الطلابي" : "Edit Student Club")
                  : (isArabic ? "إضافة نادٍ طلابي جديد" : "Add Student Club")}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {isArabic ? "بيانات النادي الطلابي وأنشطته ومشرفه الأكاديمي." : "Club details and supervisor."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">{isArabic ? "اسم النادي بالعربية *" : "Club Name (AR) *"}</Label>
                  <Input
                    required
                    value={clubNameAr}
                    onChange={(e) => setClubNameAr(e.target.value)}
                    placeholder={isArabic ? "مثال: نادي الفنون" : "e.g. Arts Club"}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{isArabic ? "اسم النادي بالإنجليزية" : "Club Name (EN)"}</Label>
                  <Input
                    value={clubNameEn}
                    onChange={(e) => setClubNameEn(e.target.value)}
                    placeholder="e.g. Arts Club"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">{isArabic ? "الوصف بالعربية *" : "Description (AR) *"}</Label>
                <Textarea
                  required
                  rows={2}
                  value={clubDescAr}
                  onChange={(e) => setClubDescAr(e.target.value)}
                  placeholder={isArabic ? "أهداف وأنشطة النادي..." : "Club goals and activities..."}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">{isArabic ? "الوصف بالإنجليزية" : "Description (EN)"}</Label>
                <Textarea
                  rows={2}
                  value={clubDescEn}
                  onChange={(e) => setClubDescEn(e.target.value)}
                  placeholder="Club description in English..."
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">{isArabic ? "المشرف / قائد النادي" : "Supervisor / Leader"}</Label>
                  <Input
                    value={clubSupervisor}
                    onChange={(e) => setClubSupervisor(e.target.value)}
                    placeholder={isArabic ? "د. أحمد علي" : "Dr. Ahmad Ali"}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{isArabic ? "التصنيف" : "Category"}</Label>
                  <Input
                    value={clubCategory}
                    onChange={(e) => setClubCategory(e.target.value)}
                    placeholder={isArabic ? "فنون، ثقافة، ريادة..." : "Arts, Culture..."}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="space-y-1.5">
                  <Label className="text-xs">{isArabic ? "الأيقونة" : "Icon"}</Label>
                  <Select value={clubIcon} onValueChange={setClubIcon}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CLUB_ICONS.map((ic) => (
                        <SelectItem key={ic.value} value={ic.value}>
                          {ic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">{isArabic ? "الترتيب" : "Order"}</Label>
                  <Input
                    type="number"
                    value={clubOrder}
                    onChange={(e) => setClubOrder(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label className="text-xs">{isArabic ? "تفعيل النادي" : "Active"}</Label>
                <Switch checked={clubIsActive} onCheckedChange={setClubIsActive} />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsClubModalOpen(false)}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" size="sm" disabled={createClubMutation.isPending || updateClubMutation.isPending}>
                {isArabic ? "حفظ النادي" : "Save Club"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          Modal: Sport Activity (Add / Edit)
         ======================================================== */}
      <Dialog open={isSportModalOpen} onOpenChange={setIsSportModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSaveSport}>
            <DialogHeader className="text-start">
              <DialogTitle className="text-lg font-bold">
                {editingSport
                  ? (isArabic ? "تعديل النشاط الرياضي" : "Edit Sport Activity")
                  : (isArabic ? "إضافة نشاط رياضي جديد" : "Add Sport Activity")}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {isArabic ? "تفاصيل الرياضة والأنشطة المرتبطة بها." : "Sport activity details."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">{isArabic ? "اسم اللعبة / الرياضة بالعربية *" : "Sport Name (AR) *"}</Label>
                  <Input
                    required
                    value={sportNameAr}
                    onChange={(e) => setSportNameAr(e.target.value)}
                    placeholder={isArabic ? "مثال: كرة السلة" : "e.g. Basketball"}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{isArabic ? "اسم اللعبة بالإنجليزية" : "Sport Name (EN)"}</Label>
                  <Input
                    value={sportNameEn}
                    onChange={(e) => setSportNameEn(e.target.value)}
                    placeholder="e.g. Basketball"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">{isArabic ? "الوصف بالعربية" : "Description (AR)"}</Label>
                <Textarea
                  rows={2}
                  value={sportDescAr}
                  onChange={(e) => setSportDescAr(e.target.value)}
                  placeholder={isArabic ? "ملاعب مخصصة وبطولات دورية..." : "Sport description..."}
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="space-y-1.5">
                  <Label className="text-xs">{isArabic ? "الأيقونة" : "Icon"}</Label>
                  <Select value={sportIcon} onValueChange={setSportIcon}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SPORT_ICONS.map((ic) => (
                        <SelectItem key={ic.value} value={ic.value}>
                          {ic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">{isArabic ? "الترتيب" : "Order"}</Label>
                  <Input
                    type="number"
                    value={sportOrder}
                    onChange={(e) => setSportOrder(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label className="text-xs">{isArabic ? "تفعيل النشاط" : "Active"}</Label>
                <Switch checked={sportIsActive} onCheckedChange={setSportIsActive} />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsSportModalOpen(false)}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" size="sm" disabled={createSportMutation.isPending || updateSportMutation.isPending}>
                {isArabic ? "حفظ النشاط" : "Save Sport"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          Modal: Overview / Section Banners & Texts
         ======================================================== */}
      <Dialog open={isOverviewModalOpen} onOpenChange={setIsOverviewModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSaveOverview}>
            <DialogHeader className="text-start">
              <DialogTitle className="text-lg font-bold">
                {isArabic ? "تعديل نصوص وبنرات أقسام الحياة الجامعية" : "Edit Section Texts & Banners"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {isArabic
                  ? "تعديل النصوص التمهيدية لقسم السكن، بطاقة التقديم، وقسم البطولات الرياضية."
                  : "Edit introductory descriptions and contact notes."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs sm:text-sm">
              {/* Section 1: Housing Overview */}
              <div className="p-3.5 bg-muted/30 rounded-xl border border-border space-y-3">
                <h4 className="font-bold text-xs text-primary flex items-center gap-1.5">
                  <Home className="h-4 w-4" />
                  <span>{isArabic ? "إعدادات قسم السكن الجامعي" : "Housing Section Settings"}</span>
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px]">{isArabic ? "عنوان السكن (عربي)" : "Title (AR)"}</Label>
                    <Input
                      value={ovHousingTitleAr}
                      onChange={(e) => setOvHousingTitleAr(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">{isArabic ? "عنوان السكن (إنجليزي)" : "Title (EN)"}</Label>
                    <Input
                      value={ovHousingTitleEn}
                      onChange={(e) => setOvHousingTitleEn(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px]">{isArabic ? "الوصف التمهيدي للسكن (عربي)" : "Description (AR)"}</Label>
                  <Textarea
                    rows={2}
                    value={ovHousingDescAr}
                    onChange={(e) => setOvHousingDescAr(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px]">{isArabic ? "ملاحظة التقديم على السكن (عربي)" : "Contact / Application Note (AR)"}</Label>
                  <Input
                    value={ovHousingContactNoteAr}
                    onChange={(e) => setOvHousingContactNoteAr(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              {/* Section 2: Sports Overview */}
              <div className="p-3.5 bg-muted/30 rounded-xl border border-border space-y-3">
                <h4 className="font-bold text-xs text-amber-600 flex items-center gap-1.5">
                  <Dumbbell className="h-4 w-4" />
                  <span>{isArabic ? "إعدادات قسم الرياضة والبطولات" : "Sports & Championships Settings"}</span>
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px]">{isArabic ? "عنوان قسم الرياضة (عربي)" : "Sports Title (AR)"}</Label>
                    <Input
                      value={ovSportsTitleAr}
                      onChange={(e) => setOvSportsTitleAr(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">{isArabic ? "عنوان البطولات السنوية (عربي)" : "Championships Title (AR)"}</Label>
                    <Input
                      value={ovChampionshipsTitleAr}
                      onChange={(e) => setOvChampionshipsTitleAr(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px]">{isArabic ? "وصف البطولات السنوية (عربي)" : "Championships Description (AR)"}</Label>
                  <Textarea
                    rows={2}
                    value={ovChampionshipsDescAr}
                    onChange={(e) => setOvChampionshipsDescAr(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsOverviewModalOpen(false)}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" size="sm" disabled={updateOverviewMutation.isPending}>
                {isArabic ? "حفظ التغييرات" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog: Housing */}
      <Dialog open={!!deletingHousing} onOpenChange={(open) => !open && setDeletingHousing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-start">
            <DialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{isArabic ? "تأكيد حذف ميزة السكن" : "Confirm Delete"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isArabic
                ? `هل أنت متأكد من حذف الميزة "${deletingHousing?.titleAr}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : "Are you sure you want to delete this amenity?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingHousing(null)}>
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteHousing}>
              {isArabic ? "حذف نهائي" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog: Club */}
      <Dialog open={!!deletingClub} onOpenChange={(open) => !open && setDeletingClub(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-start">
            <DialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{isArabic ? "تأكيد حذف النادي الطلابي" : "Confirm Delete"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isArabic
                ? `هل أنت متأكد من حذف النادي "${deletingClub?.nameAr}"؟`
                : "Are you sure you want to delete this club?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingClub(null)}>
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteClub}>
              {isArabic ? "حذف نهائي" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog: Sport */}
      <Dialog open={!!deletingSport} onOpenChange={(open) => !open && setDeletingSport(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-start">
            <DialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{isArabic ? "تأكيد حذف النشاط الرياضي" : "Confirm Delete"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isArabic
                ? `هل أنت متأكد من حذف الرياضة "${deletingSport?.nameAr}"؟`
                : "Are you sure you want to delete this sport?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingSport(null)}>
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteSport}>
              {isArabic ? "حذف نهائي" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
