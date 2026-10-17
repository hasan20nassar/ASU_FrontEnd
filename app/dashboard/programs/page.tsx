"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import {
  usePrograms,
  useCreateProgram,
  useUpdateProgram,
  useDeleteProgram,
  ExtendedProgram,
} from "@/hooks/use-programs";
import {
  useCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "@/hooks/use-courses";
import { useFaculties } from "@/hooks/use-faculties";
import { useFacultyMembers } from "@/hooks/use-faculty-members";
import { BranchEnum, Course } from "@/lib/api";
import { FacultyFacility, FacultySectionConfig } from "@/lib/api/models/Faculty";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Filter,
  GraduationCap,
  Loader2,
  Building2,
  Crown,
  Users,
  X,
  ExternalLink,
  Palette,
  Award,
  Sparkles,
  FlaskConical,
  FileText,
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Check,
  LayoutTemplate,
  Layers,
  Upload,
  Image as ImageIcon,
  Info,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Paintbrush,
  Briefcase,
  Sliders,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogBody,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CaptchaModal } from "@/components/ui/captcha-modal";

const COLOR_PALETTES = [
  { id: "academic_navy", nameAr: "الأكاديمي الكلاسيكي (نيلي وذهبي دافئ)", nameEn: "Classic Academic (Navy & Gold)", primary: "#1E3A8A", accent: "#F59E0B" },
  { id: "royal_burgundy", nameAr: "الملكي المتميز (عنابي وذهبي إمبراطوري)", nameEn: "Royal Burgundy (Wine & Gold)", primary: "#881337", accent: "#D97706" },
  { id: "emerald_teal", nameAr: "الحيوية والعلوم (أخضر زمردي وفيروزي)", nameEn: "Emerald Science (Green & Teal)", primary: "#047857", accent: "#0D9488" },
  { id: "modern_cyan", nameAr: "البحري الحديث (كحلي طبي وسماوي منعش)", nameEn: "Ocean Cyan (Deep Cyan & Sky)", primary: "#0E7490", accent: "#0284C7" },
  { id: "luxury_charcoal", nameAr: "الفخامة العصرية (فحمي وبرونزي تراكوتا)", nameEn: "Modern Luxury (Charcoal & Bronze)", primary: "#18181B", accent: "#EA580C" },
  { id: "slate_crimson", nameAr: "الوقار المؤسسي (رمادي أردوازي وياقوتي)", nameEn: "Corporate Slate (Slate & Crimson)", primary: "#334155", accent: "#DC2626" },
  { id: "imperial_purple", nameAr: "التميز الراقي (أرجواني عميق وذهبي)", nameEn: "Imperial Purple (Deep Violet & Gold)", primary: "#581C87", accent: "#FACC15" },
  { id: "electric_blue", nameAr: "النقاء التكنولوجي (أزرق كوبالت وسماوي كهربائي)", nameEn: "Tech Cobalt (Cobalt & Electric Blue)", primary: "#1E40AF", accent: "#38BDF8" },
  { id: "earth_olive", nameAr: "الطبيعة والأرض (زيتوني ترابي ورملي دافئ)", nameEn: "Earth Olive (Olive & Amber)", primary: "#365314", accent: "#D97706" },
];

export interface SectionMeta {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: any;
  defaultTitleAr: string;
  defaultTitleEn: string;
  defaultSubtitleAr: string;
  defaultSubtitleEn: string;
  supportedLayouts: { id: "grid" | "list" | "compact" | "split"; nameAr: string; nameEn: string }[];
  allowLimit?: boolean;
  defaultLimit?: number;
  allowCta?: boolean;
  defaultCtaTextAr?: string;
  defaultCtaTextEn?: string;
  defaultCtaLink?: string;
}

const DEFAULT_PROGRAM_SECTIONS_LIST: SectionMeta[] = [
  {
    id: "stats",
    labelAr: "شريط الإحصائيات والأرقام الأكاديمية",
    labelEn: "Key Statistics Bar",
    icon: Award,
    defaultTitleAr: "أرقام وإحصائيات القسم",
    defaultTitleEn: "Department by the Numbers",
    defaultSubtitleAr: "مؤشرات التميز الأكاديمي والطلابي والبحثي في القسم",
    defaultSubtitleEn: "Key academic and student performance indicators",
    supportedLayouts: [
      { id: "grid", nameAr: "بطاقات شبكية", nameEn: "Grid Cards" },
      { id: "compact", nameAr: "شريط مدمج", nameEn: "Compact Bar" },
    ],
    allowLimit: false,
    allowCta: false,
  },
  {
    id: "head",
    labelAr: "كلمة رئيس القسم والقيادة",
    labelEn: "Head of Dept Message",
    icon: Crown,
    defaultTitleAr: "كلمة رئيس القسم",
    defaultTitleEn: "Head of Department Message",
    defaultSubtitleAr: "الرؤية الأكاديمية والخطط المستقبلية لتطوير التخصص",
    defaultSubtitleEn: "Academic vision and roadmap for the department",
    supportedLayouts: [
      { id: "split", nameAr: "عصري مقسوم", nameEn: "Split View" },
      { id: "compact", nameAr: "موجز ومركّز", nameEn: "Compact Banner" },
    ],
    allowLimit: false,
    allowCta: true,
    defaultCtaTextAr: "تواصل مع رئاسة القسم",
    defaultCtaTextEn: "Contact Department Head",
    defaultCtaLink: "#contact",
  },
  {
    id: "curriculum",
    labelAr: "الخطة الدراسية وتوزيع المقررات",
    labelEn: "Curriculum & Syllabi",
    icon: BookOpen,
    defaultTitleAr: "الخطة الدراسية والمقررات",
    defaultTitleEn: "Curriculum & Study Plan",
    defaultSubtitleAr: "توزيع الساعات المعتمدة والمقررات الإجبارية والاختيارية على الفصول الدراسية",
    defaultSubtitleEn: "Credit hours distribution, syllabi and prerequisite paths across semesters",
    supportedLayouts: [
      { id: "grid", nameAr: "تبويبات السنوات", nameEn: "Year Tabs" },
      { id: "list", nameAr: "قائمة المقررات", nameEn: "Course List" },
      { id: "compact", nameAr: "ملخص مدمج", nameEn: "Compact Summary" },
    ],
    allowLimit: true,
    defaultLimit: 8,
    allowCta: true,
    defaultCtaTextAr: "تحميل الخطة الدراسية الكاملة PDF",
    defaultCtaTextEn: "Download Full Syllabus PDF",
    defaultCtaLink: "#curriculum",
  },
  {
    id: "career_paths",
    labelAr: "المسارات والآفاق المهنية للخريجين",
    labelEn: "Career Paths & Horizons",
    icon: Briefcase,
    defaultTitleAr: "الفرص والآفاق المهنية",
    defaultTitleEn: "Career Opportunities & Job Horizons",
    defaultSubtitleAr: "القطاعات والوظائف الحيوية التي تفتح أبوابها لخريجي هذا التخصص",
    defaultSubtitleEn: "Key industries, roles, and employment prospects for department graduates",
    supportedLayouts: [
      { id: "grid", nameAr: "بطاقات مجالات العمل", nameEn: "Career Cards Grid" },
      { id: "list", nameAr: "قائمة المسارات", nameEn: "Detailed Pathways List" },
      { id: "compact", nameAr: "شريط مدمج", nameEn: "Compact Chips" },
    ],
    allowLimit: false,
    allowCta: true,
    defaultCtaTextAr: "استكشف شراكات التوظيف",
    defaultCtaTextEn: "Explore Career Partnerships",
    defaultCtaLink: "#careers",
  },
  {
    id: "facilities",
    labelAr: "المختبرات والمشاغل التخصصية",
    labelEn: "Specialized Labs & Facilities",
    icon: FlaskConical,
    defaultTitleAr: "المختبرات والمرافق التخصصية",
    defaultTitleEn: "Department Laboratories & Workstations",
    defaultSubtitleAr: "بنية تحتية تطبيقية متطورة تدعم الجانب العملي والتجريبي للطلاب",
    defaultSubtitleEn: "Cutting-edge laboratory infrastructure supporting practical experimentation",
    supportedLayouts: [
      { id: "grid", nameAr: "شبكة المختبرات", nameEn: "Labs Grid" },
      { id: "list", nameAr: "قائمة تفصيلية", nameEn: "Detailed Rows" },
      { id: "compact", nameAr: "بطاقات مدمجة", nameEn: "Compact Chips" },
    ],
    allowLimit: true,
    defaultLimit: 6,
    allowCta: true,
    defaultCtaTextAr: "تجهيزات ومواعيد المخابر",
    defaultCtaTextEn: "Lab Schedules & Equipment",
    defaultCtaLink: "#facilities",
  },
  {
    id: "staff",
    labelAr: "دليل أساتذة وكادر القسم الأكاديمي",
    labelEn: "Department Faculty Staff",
    icon: Users,
    defaultTitleAr: "كادر وأساتذة القسم",
    defaultTitleEn: "Department Academic Staff",
    defaultSubtitleAr: "نخبة من الأكاديميين والباحثين المتخصصين في هذا التخصص",
    defaultSubtitleEn: "Distinguished scholars and instructors specialized in this discipline",
    supportedLayouts: [
      { id: "grid", nameAr: "شبكة بطاقات الأساتذة", nameEn: "Profile Cards" },
      { id: "list", nameAr: "دليل جدولي", nameEn: "Directory List" },
      { id: "compact", nameAr: "صور مدمجة", nameEn: "Compact Avatars" },
    ],
    allowLimit: true,
    defaultLimit: 8,
    allowCta: true,
    defaultCtaTextAr: "الدليل الكامل للهيئة التعليمية",
    defaultCtaTextEn: "Full Faculty Directory",
    defaultCtaLink: "/faculty",
  },
  {
    id: "top_students",
    labelAr: "لوحة الشرف وأوائل القسم",
    labelEn: "Top Students & Honor Roll",
    icon: GraduationCap,
    defaultTitleAr: "لوحة الشرف والتميز الأكاديمي",
    defaultTitleEn: "Department Honor Roll",
    defaultSubtitleAr: "نحتفي بالطلبة المتفوقين في مقررات وسنوات هذا التخصص",
    defaultSubtitleEn: "Celebrating top performing students with highest academic standings",
    supportedLayouts: [
      { id: "grid", nameAr: "منصة التتويج والبطاقات", nameEn: "Podium & Cards" },
      { id: "compact", nameAr: "موجز", nameEn: "Compact" },
    ],
    allowLimit: false,
    allowCta: false,
  },
  {
    id: "alumni_stories",
    labelAr: "قصص نجاح خريجي القسم",
    labelEn: "Alumni Success Stories",
    icon: Sparkles,
    defaultTitleAr: "قصص نجاح خريجي التخصص",
    defaultTitleEn: "Program Alumni Success Stories",
    defaultSubtitleAr: "بصمات خريجينا وإنجازاتهم في كبرى المؤسسات والشركات الرائدة",
    defaultSubtitleEn: "Inspiring achievements and career breakthroughs of our alumni",
    supportedLayouts: [
      { id: "grid", nameAr: "شبكة بطاقات", nameEn: "Cards Grid" },
      { id: "compact", nameAr: "موجز", nameEn: "Compact" },
    ],
  },
];

function hexToRgba(hex: string, alpha: number) {
  if (!hex || !hex.startsWith("#")) return `rgba(30, 58, 138, ${alpha})`;
  let c = hex.substring(1);
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

export default function ProgramsManagement() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState("all");

  // React Query Hooks
  const { data: programsList, isLoading } = usePrograms();
  const { data: facultiesList } = useFaculties();
  const { data: facultyMembersList } = useFacultyMembers();

  const displayPrograms = programsList || [];
  const displayFaculties = facultiesList || [];
  const displayMembers = facultyMembersList || [];

  const createMutation = useCreateProgram();
  const updateMutation = useUpdateProgram();
  const deleteMutation = useDeleteProgram();

  // Dialog State
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<ExtendedProgram | null>(null);

  // Courses Management Dialog State
  const [isCoursesDialogOpen, setIsCoursesDialogOpen] = useState(false);
  const [coursesProgram, setCoursesProgram] = useState<ExtendedProgram | null>(null);
  const [selectedYearTab, setSelectedYearTab] = useState<string>("1");
  const [selectedSemesterTab, setSelectedSemesterTab] = useState<string>("1");
  const [courseSearch, setCourseSearch] = useState("");

  // Sub-dialog: Add / Edit Course
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseCode, setCourseCode] = useState("");
  const [courseNameAr, setCourseNameAr] = useState("");
  const [courseNameEn, setCourseNameEn] = useState("");
  const [courseCredits, setCourseCredits] = useState<number>(3);
  const [courseYear, setCourseYear] = useState<number>(1);
  const [courseSemester, setCourseSemester] = useState<number>(1);
  const [coursePrerequisites, setCoursePrerequisites] = useState("");
  const [courseDescriptionAr, setCourseDescriptionAr] = useState("");
  const [courseDescriptionEn, setCourseDescriptionEn] = useState("");

  // Course Delete State
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [isCourseDeleteOpen, setIsCourseDeleteOpen] = useState(false);

  // Course Queries & Mutations
  const { data: programCoursesList, isLoading: isCoursesLoading } = useCourses(coursesProgram?.id);
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();

  // Form Fields - Tab 1: General & Branding
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [facultyId, setFacultyId] = useState<string>("");
  const [mottoAr, setMottoAr] = useState("");
  const [mottoEn, setMottoEn] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1E3A8A");
  const [accentColor, setAccentColor] = useState("#F59E0B");
  const [heroBanner, setHeroBanner] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");

  // Form Fields - Tab 2: Page Builder & Layout
  const [headerStyle, setHeaderStyle] = useState<"hero_split" | "hero_full" | "minimal">("hero_split");
  const [sectionsOrder, setSectionsOrder] = useState<string[]>([
    "stats",
    "head",
    "curriculum",
    "career_paths",
    "facilities",
    "staff",
    "top_students",
    "alumni_stories",
  ]);
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>({
    stats: true,
    head: true,
    curriculum: true,
    career_paths: true,
    facilities: true,
    staff: true,
    top_students: true,
    alumni_stories: true,
  });
  const [sectionsConfig, setSectionsConfig] = useState<Record<string, FacultySectionConfig>>({});
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

  // Form Fields - Tab 3: Head & Leadership
  const [headId, setHeadId] = useState<string>("none");
  const [headNameAr, setHeadNameAr] = useState("");
  const [headNameEn, setHeadNameEn] = useState("");
  const [headMessageAr, setHeadMessageAr] = useState("");
  const [headMessageEn, setHeadMessageEn] = useState("");
  const [headPhoto, setHeadPhoto] = useState("");

  // Form Fields - Tab 4: Academic Stats & Admissions
  const [establishedYear, setEstablishedYear] = useState<number>(2005);
  const [studentsCount, setStudentsCount] = useState<number>(350);
  const [labsCount, setLabsCount] = useState<number>(6);
  const [researchPapersCount, setResearchPapersCount] = useState<number>(80);
  const [employmentRate, setEmploymentRate] = useState<number>(90);
  const [duration, setDuration] = useState<number>(5);
  const [creditHours, setCreditHours] = useState<number>(160);
  const [minScorePercent, setMinScorePercent] = useState<number>(60);
  const [minScorePoints, setMinScorePoints] = useState<number>(120);
  const [tuitionSyrian, setTuitionSyrian] = useState<number>(2500000);
  const [tuitionNonResident, setTuitionNonResident] = useState<number>(1500);
  const [branch, setBranch] = useState<BranchEnum>(BranchEnum.BOTH);

  // Form Fields - Tab 5: Labs & Career Paths
  const [facilities, setFacilities] = useState<FacultyFacility[]>([]);
  const [careerPaths, setCareerPaths] = useState("");
  const [guideDocumentUrl, setGuideDocumentUrl] = useState("");
  const [newLabNameAr, setNewLabNameAr] = useState("");
  const [newLabNameEn, setNewLabNameEn] = useState("");
  const [newLabDescAr, setNewLabDescAr] = useState("");

  const updateSectionConfig = (sectionId: string, updates: Partial<FacultySectionConfig>) => {
    setSectionsConfig((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        ...updates,
      },
    }));
  };

  const resetSectionConfig = (sectionId: string) => {
    setSectionsConfig((prev) => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const newOrder = [...sectionsOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setSectionsOrder(newOrder);
  };

  const handleToggleSection = (sectionId: string) => {
    setEnabledSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Image Upload Handlers (Logo <= 2MB, Banner <= 4MB, Head Photo <= 2MB)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(isArabic ? "يرجى اختيار ملف صورة صالح (PNG, JPG, SVG, WEBP)" : "Please select a valid image file");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        isArabic
          ? "حجم ملف الشعار كبير جداً! الحد الأقصى المسموح به هو 2 ميغابايت."
          : "Logo file is too large! Maximum allowed size is 2MB."
      );
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoUrl(reader.result);
        toast.success(isArabic ? "تم تحميل شعار القسم بنجاح!" : "Department logo uploaded!");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleHeroBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(isArabic ? "يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP)" : "Please select a valid image file");
      e.target.value = "";
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error(
        isArabic
          ? "حجم صورة البانر كبير جداً! الحد الأقصى المسموح به هو 4 ميغابايت."
          : "Banner file is too large! Maximum allowed size is 4MB."
      );
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setHeroBanner(reader.result);
        toast.success(isArabic ? "تم تحميل صورة البانر بنجاح!" : "Hero banner uploaded!");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleHeadPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(isArabic ? "يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP)" : "Please select a valid image file");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        isArabic
          ? "حجم صورة رئيس القسم كبير جداً! الحد الأقصى المسموح به هو 2 ميغابايت."
          : "Photo file is too large! Maximum allowed size is 2MB."
      );
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setHeadPhoto(reader.result);
        toast.success(isArabic ? "تم تحميل صورة رئيس القسم بنجاح!" : "Department head photo uploaded!");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAddFacility = () => {
    if (!newLabNameAr) return;
    const item: FacultyFacility = {
      nameAr: newLabNameAr,
      nameEn: newLabNameEn || newLabNameAr,
      descriptionAr: newLabDescAr,
    };
    setFacilities([...facilities, item]);
    setNewLabNameAr("");
    setNewLabNameEn("");
    setNewLabDescAr("");
  };

  const handleRemoveFacility = (index: number) => {
    setFacilities(facilities.filter((_, i) => i !== index));
  };

  const handleOpenDialog = (program: ExtendedProgram | null = null) => {
    setCurrentProgram(program);
    if (program) {
      setNameAr(program.nameAr || "");
      setNameEn(program.nameEn || "");
      setSlug(program.slug || "");
      setFacultyId(program.faculty ? program.faculty.toString() : displayFaculties[0]?.id?.toString() || "");
      setMottoAr(program.mottoAr || "نحو التميز الأكاديمي والمهني");
      setMottoEn(program.mottoEn || "Towards Academic & Professional Excellence");
      setPrimaryColor(program.primaryColor || "#1E3A8A");
      setAccentColor(program.accentColor || "#F59E0B");
      setHeroBanner(program.heroBanner || "");
      setLogoUrl(program.logoUrl || "");
      setDescriptionAr(program.descriptionAr || "");
      setDescriptionEn(program.descriptionEn || "");

      setHeadId(program.head ? program.head.toString() : "none");
      setHeadNameAr(program.headNameAr || "");
      setHeadNameEn(program.headNameEn || "");
      setHeadMessageAr(program.headMessageAr || "");
      setHeadMessageEn(program.headMessageEn || "");
      setHeadPhoto(program.headPhoto || "");

      setEstablishedYear(program.establishedYear || 2005);
      setStudentsCount(program.studentsCount || 350);
      setLabsCount(program.labsCount || 6);
      setResearchPapersCount(program.researchPapersCount || 80);
      setEmploymentRate(program.employmentRate || 90);
      setDuration(program.duration || 5);
      setCreditHours(program.creditHours || 160);
      setMinScorePercent(program.minScorePercent || 60);
      setMinScorePoints(program.minScorePoints || 120);
      setTuitionSyrian(program.tuitionSyrian || 2500000);
      setTuitionNonResident(program.tuitionNonResident || 1500);
      setBranch(program.branch || BranchEnum.BOTH);

      setFacilities(program.facilities || []);
      setCareerPaths(program.careerPaths || "");
      setGuideDocumentUrl(program.guideDocumentUrl || "");

      const layout = program.layoutConfig || {};
      setHeaderStyle(layout.headerStyle || "hero_split");
      setSectionsOrder(
        layout.sectionsOrder && layout.sectionsOrder.length > 0
          ? layout.sectionsOrder
          : [
            "stats",
            "head",
            "curriculum",
            "career_paths",
            "facilities",
            "staff",
            "top_students",
            "alumni_stories",
          ]
      );
      setEnabledSections({
        stats: layout.showQuickStats ?? true,
        head: layout.showDeanMessage ?? true,
        curriculum: (layout as any).showCurriculum ?? true,
        career_paths: (layout as any).showCareerPaths ?? true,
        facilities: layout.showFacilities ?? true,
        staff: layout.showStaff ?? true,
        top_students: layout.showTopStudents ?? true,
        alumni_stories: layout.showAlumniStories ?? true,
      });
      setSectionsConfig(layout.sectionsConfig || {});
      setExpandedSectionId(null);
    } else {
      setNameAr("");
      setNameEn("");
      setSlug("");
      setFacultyId(displayFaculties[0]?.id?.toString() || "");
      setMottoAr("نحو التميز الأكاديمي والمهني");
      setMottoEn("Towards Academic & Professional Excellence");
      setPrimaryColor("#1E3A8A");
      setAccentColor("#F59E0B");
      setHeroBanner("");
      setLogoUrl("");
      setDescriptionAr("");
      setDescriptionEn("");

      setHeadId("none");
      setHeadNameAr("");
      setHeadNameEn("");
      setHeadMessageAr("");
      setHeadMessageEn("");
      setHeadPhoto("");

      setEstablishedYear(2005);
      setStudentsCount(350);
      setLabsCount(6);
      setResearchPapersCount(80);
      setEmploymentRate(90);
      setDuration(5);
      setCreditHours(160);
      setMinScorePercent(60);
      setMinScorePoints(120);
      setTuitionSyrian(2500000);
      setTuitionNonResident(1500);
      setBranch(BranchEnum.BOTH);

      setFacilities([]);
      setCareerPaths("");
      setGuideDocumentUrl("");

      setHeaderStyle("hero_split");
      setSectionsOrder([
        "stats",
        "head",
        "curriculum",
        "career_paths",
        "facilities",
        "staff",
        "top_students",
        "alumni_stories",
      ]);
      setEnabledSections({
        stats: true,
        head: true,
        curriculum: true,
        career_paths: true,
        facilities: true,
        staff: true,
        top_students: true,
        alumni_stories: true,
      });
      setSectionsConfig({});
      setExpandedSectionId(null);
    }
    setIsOpen(true);
  };

  // Filtered Programs list
  const filteredPrograms = useMemo(() => {
    return displayPrograms.filter((p) => {
      const matchesSearch =
        searchQuery === "" ||
        p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFaculty =
        selectedFacultyFilter === "all" || p.faculty?.toString() === selectedFacultyFilter;

      return matchesSearch && matchesFaculty;
    });
  }, [displayPrograms, searchQuery, selectedFacultyFilter]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr) {
      toast.error(isArabic ? "يرجى كتابة اسم القسم بالعربية" : "Please enter department name in Arabic");
      return;
    }
    if (!facultyId || Number(facultyId) <= 0) {
      toast.error(
        isArabic
          ? "يجب اختيار الكلية التابع لها هذا القسم (يرجى إنشاء كلية أولاً من إدارة الكليات)"
          : "Please select an assigned faculty"
      );
      return;
    }

    const cleanSlug =
      slug.trim().replace(/^\/+|\/+$/g, "").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") ||
      (nameEn || nameAr).trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9_-]+/g, "").replace(/^-+|-+$/g, "") ||
      `prog-${Date.now()}`;

    const selectedHead = headId !== "none" ? Number(headId) : null;

    const payload: Partial<ExtendedProgram> = {
      nameAr,
      nameEn: nameEn || nameAr,
      slug: cleanSlug,
      faculty: Number(facultyId),
      head: selectedHead as any,
      headNameAr,
      headNameEn,
      headMessageAr,
      headMessageEn,
      headPhoto,
      mottoAr,
      mottoEn,
      primaryColor,
      accentColor,
      heroBanner,
      logoUrl,
      descriptionAr: descriptionAr || `قسم ${nameAr}`,
      descriptionEn: descriptionEn || `Department of ${nameEn || nameAr}`,
      establishedYear,
      studentsCount,
      labsCount: facilities.length > 0 ? facilities.length : labsCount,
      researchPapersCount,
      employmentRate,
      facilities,
      careerPaths,
      guideDocumentUrl,
      duration,
      creditHours,
      minScorePercent,
      minScorePoints,
      tuitionSyrian,
      tuitionNonResident,
      branch,
      layoutConfig: {
        headerStyle,
        sectionsOrder,
        showQuickStats: enabledSections.stats ?? true,
        showDeanMessage: enabledSections.head ?? true,
        showCurriculum: enabledSections.curriculum ?? true,
        showCareerPaths: enabledSections.career_paths ?? true,
        showFacilities: enabledSections.facilities ?? true,
        showStaff: enabledSections.staff ?? true,
        showTopStudents: enabledSections.top_students ?? true,
        showAlumniStories: enabledSections.alumni_stories ?? true,
        sectionsConfig,
      } as any,
    };

    try {
      if (currentProgram) {
        await updateMutation.mutateAsync({ id: currentProgram.id, data: payload });
        toast.success(isArabic ? "تم تحديث هوية وتخطيط القسم بنجاح!" : "Department microsite updated successfully!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(isArabic ? "تم إنشاء القسم الجديد وموقعه بنجاح!" : "Department created successfully!");
      }
      setIsOpen(false);
    } catch (err: any) {
      const data = err?.body || err?.response?.data;
      let errorMsg = isArabic ? "حدث خطأ أثناء حفظ القسم" : "Failed to save department";
      if (data) {
        if (typeof data === "string") {
          errorMsg = data;
        } else if (data.slug) {
          const slugErr = Array.isArray(data.slug) ? data.slug[0] : data.slug;
          errorMsg = `${isArabic ? "خطأ في الرابط المختصر: " : "Slug error: "}${slugErr}`;
        } else if (data.detail) {
          errorMsg = data.detail;
        } else if (typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          if (firstKey && data[firstKey]) {
            const firstErr = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
            errorMsg = `${firstKey}: ${firstErr}`;
          }
        }
      }
      toast.error(errorMsg);
    }
  };

  const handleDelete = async () => {
    if (!currentProgram) return;
    try {
      await deleteMutation.mutateAsync(currentProgram.id);
      toast.success(isArabic ? "تم حذف القسم بنجاح" : "Department deleted successfully");
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء حذف القسم" : "Failed to delete department");
    }
  };

  // Course Management Handlers
  const handleOpenCourses = (program: ExtendedProgram) => {
    setCoursesProgram(program);
    setSelectedYearTab("1");
    setSelectedSemesterTab("1");
    setCourseSearch("");
    setIsCoursesDialogOpen(true);
  };

  const handleOpenCourseForm = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseCode(course.code || "");
      setCourseNameAr(course.nameAr || "");
      setCourseNameEn(course.nameEn || "");
      setCourseCredits(course.credits || 3);
      setCourseYear(course.year || Number(selectedYearTab) || 1);
      setCourseSemester(course.semester || Number(selectedSemesterTab) || 1);
      setCoursePrerequisites(course.prerequisitesText || "");
      setCourseDescriptionAr(course.descriptionAr || "");
      setCourseDescriptionEn(course.descriptionEn || "");
    } else {
      setEditingCourse(null);
      setCourseCode("");
      setCourseNameAr("");
      setCourseNameEn("");
      setCourseCredits(3);
      setCourseYear(Number(selectedYearTab) || 1);
      setCourseSemester(Number(selectedSemesterTab) || 1);
      setCoursePrerequisites("");
      setCourseDescriptionAr("");
      setCourseDescriptionEn("");
    }
    setIsCourseFormOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coursesProgram) return;
    if (!courseCode.trim()) {
      toast.error(isArabic ? "يرجى كتابة رمز المقرر (مثال: SWE201)" : "Please enter course code");
      return;
    }
    if (!courseNameAr.trim()) {
      toast.error(isArabic ? "يرجى كتابة اسم المقرر بالعربية" : "Please enter course name in Arabic");
      return;
    }

    const payload: Partial<Course> = {
      code: courseCode.trim().toUpperCase(),
      nameAr: courseNameAr.trim(),
      nameEn: courseNameEn.trim() || courseNameAr.trim(),
      credits: Number(courseCredits) || 3,
      program: coursesProgram.id,
      year: Number(courseYear) || 1,
      semester: Number(courseSemester) || 1,
      prerequisitesText: coursePrerequisites.trim(),
      descriptionAr: courseDescriptionAr.trim(),
      descriptionEn: courseDescriptionEn.trim(),
    };

    try {
      if (editingCourse) {
        await updateCourseMutation.mutateAsync({ id: editingCourse.id, data: payload });
        toast.success(isArabic ? "تم تحديث بيانات المقرر بنجاح!" : "Course updated successfully!");
      } else {
        await createCourseMutation.mutateAsync(payload);
        toast.success(isArabic ? "تم إضافة المقرر الدراسي بنجاح!" : "Course created successfully!");
      }
      setIsCourseFormOpen(false);
    } catch (err: any) {
      toast.error(isArabic ? "حدث خطأ أثناء حفظ المقرر" : "Failed to save course");
    }
  };

  const handleDeleteCourse = async () => {
    if (!deletingCourse) return;
    try {
      await deleteCourseMutation.mutateAsync(deletingCourse.id);
      toast.success(isArabic ? "تم حذف المقرر الدراسي بنجاح!" : "Course deleted successfully!");
      setIsCourseDeleteOpen(false);
      setDeletingCourse(null);
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء حذف المقرر" : "Failed to delete course");
    }
  };

  // Helper for live preview
  const currentFacultySlug = useMemo(() => {
    if (!facultyId) return "";
    const f = displayFaculties.find((fac) => fac.id === Number(facultyId));
    return f?.slug || "";
  }, [facultyId, displayFaculties]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-start" dir={dir}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isArabic ? "إدارة الأقسام والتخصصات الأكاديمية" : "Departments & Academic Programs"}
          </h1>
          <p className="text-muted-foreground">
            {isArabic
              ? "تحكم متكامل بالهوية البصرية، مخرجات التعلم، المخابر، محرر الصفحة، ورؤساء الأقسام."
              : "Comprehensive control of department visual identity, page builder, labs, curriculum & leadership."}
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="font-bold gap-2">
          <Plus className="h-4 w-4" />
          {isArabic ? "إضافة قسم جديد" : "Add Department"}
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isArabic ? "البحث بالاسم أو الرابط..." : "Search by name or slug..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                <Select value={selectedFacultyFilter} onValueChange={setSelectedFacultyFilter}>
                  <SelectTrigger className="w-full sm:w-56 bg-background">
                    <SelectValue placeholder={isArabic ? "تصفية حسب الكلية" : "Filter by Faculty"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isArabic ? "جميع الكليات" : "All Faculties"}</SelectItem>
                    {displayFaculties.map((f) => (
                      <SelectItem key={f.id} value={f.id.toString()}>
                        {isArabic ? f.nameAr : f.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle: List / Cards */}
              <div className="flex items-center bg-muted/50 p-1 rounded-xl border shrink-0">
                <Button
                  type="button"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3 gap-1.5 text-xs font-bold rounded-lg"
                  onClick={() => setViewMode("list")}
                  title={isArabic ? "عرض القائمة" : "List View"}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">{isArabic ? "قائمة" : "List"}</span>
                </Button>
                <Button
                  type="button"
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3 gap-1.5 text-xs font-bold rounded-lg"
                  onClick={() => setViewMode("cards")}
                  title={isArabic ? "عرض البطاقات" : "Card View"}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">{isArabic ? "بطاقات" : "Cards"}</span>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground font-bold">{isArabic ? "جاري تحميل قائمة الأقسام..." : "Loading departments..."}</p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground font-bold">
              <BookOpen className="h-10 w-10 text-muted-foreground/30" />
              <p>{isArabic ? "لا يوجد أقسام أكاديمية مطابقة للبحث" : "No academic departments found"}</p>
              <Button variant="outline" size="sm" onClick={() => handleOpenDialog()} className="mt-2 font-bold gap-2">
                <Plus className="h-4 w-4" />
                {isArabic ? "إضافة قسم جديد" : "Add Department"}
              </Button>
            </div>
          ) : viewMode === "list" ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="text-start font-bold">{isArabic ? "القسم والتخصص" : "Department"}</TableHead>
                    <TableHead className="text-start font-bold">{isArabic ? "الكلية التابع لها" : "Assigned Faculty"}</TableHead>
                    <TableHead className="text-start font-bold">{isArabic ? "رئيس القسم" : "Department Head"}</TableHead>
                    <TableHead className="text-start font-bold">{isArabic ? "الهوية البصرية" : "Branding"}</TableHead>
                    <TableHead className="text-start font-bold">{isArabic ? "الساعات والمعامل" : "Duration & Credits"}</TableHead>
                    <TableHead className="text-center font-bold">{isArabic ? "القسم والتخصص" : "Department"}</TableHead>
                    <TableHead className="text-center font-bold">{isArabic ? "الكلية التابع لها" : "Assigned Faculty"}</TableHead>
                    <TableHead className="text-center font-bold">{isArabic ? "رئيس القسم" : "Department Head"}</TableHead>
                    <TableHead className="text-center font-bold">{isArabic ? "الهوية البصرية" : "Branding"}</TableHead>
                    <TableHead className="text-center font-bold">{isArabic ? "الساعات والمعامل" : "Duration & Credits"}</TableHead>
                    <TableHead className="text-center font-bold px-6">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrograms.map((program) => {
                    const parentFaculty = displayFaculties.find((f) => f.id === program.faculty);
                    const headDisplay = program.headDetail
                      ? (isArabic ? program.headDetail.nameAr : program.headDetail.nameEn)
                      : (isArabic ? program.headNameAr : program.headNameEn);

                    return (
                      <TableRow key={program.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="text-start">
                          <div className="flex items-center gap-3">
                            {program.logoUrl ? (
                              <div className="w-10 h-10 rounded-xl border bg-background p-1 shrink-0 flex items-center justify-center overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={program.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                              </div>
                            ) : (
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold"
                                style={{ backgroundColor: program.primaryColor || "#1E3A8A" }}
                              >
                                <GraduationCap className="h-5 w-5" />
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="font-bold text-sm">{isArabic ? program.nameAr : program.nameEn}</span>
                              {program.mottoAr && (
                                <span className="text-[11px] text-muted-foreground line-clamp-1">
                                  {isArabic ? program.mottoAr : program.mottoEn}
                                </span>
                              )}
                              <span className="text-[10px] text-muted-foreground font-mono">
                                /{parentFaculty?.slug || "faculty"}/{program.slug}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-start">
                          <Badge variant="secondary" className="font-bold gap-1 bg-primary/5 text-primary border-primary/10">
                            <Building2 className="h-3 w-3" />
                            {parentFaculty ? (isArabic ? parentFaculty.nameAr : parentFaculty.nameEn) : (isArabic ? "غير مسند" : "Unassigned")}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-start">
                          {headDisplay ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7 border shrink-0">
                                {program.headPhoto && <AvatarImage src={program.headPhoto} alt={headDisplay} />}
                                <AvatarFallback className="bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                                  <Crown className="h-3.5 w-3.5" />
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-bold">{headDisplay}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">{isArabic ? "لم يعين بعد" : "No Head"}</span>
                          )}
                        </TableCell>

                        <TableCell className="text-start">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-4 h-4 rounded-full border shadow-2xs inline-block"
                              style={{ backgroundColor: program.primaryColor || "#1E3A8A" }}
                              title={isArabic ? "اللون الرئيسي" : "Primary"}
                            />
                            <span
                              className="w-4 h-4 rounded-full border shadow-2xs inline-block"
                              style={{ backgroundColor: program.accentColor || "#F59E0B" }}
                              title={isArabic ? "لون التمييز" : "Accent"}
                            />
                            {program.heroBanner && (
                              <Badge variant="outline" className="text-[9px] py-0 px-1 text-muted-foreground">
                                {isArabic ? "بانر ✓" : "Banner ✓"}
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground text-start">
                          <div>{program.duration} {isArabic ? "سنوات" : "years"} ({program.creditHours} {isArabic ? "ساعة" : "credits"})</div>
                          <div className="text-[10px] text-muted-foreground/80">
                            {program.facilities?.length || program.labsCount || 0} {isArabic ? "مخابر" : "labs"} • {program.studentsCount || 0} {isArabic ? "طالب" : "students"}
                          </div>
                        </TableCell>

                        <TableCell className="text-center px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenCourses(program)}
                              className="gap-1.5 text-xs font-bold hover:bg-primary/10 hover:text-primary transition-all border-primary/20 shrink-0"
                              title={isArabic ? "إدارة الخطة والمقررات الدراسية" : "Manage Curriculum Courses"}
                            >
                              <BookOpen className="h-3.5 w-3.5 text-primary" />
                              <span className="hidden md:inline">{isArabic ? "الخطة والمقررات" : "Courses"}</span>
                              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-mono bg-primary/10 text-primary">
                                {program.courses?.length ?? 0}
                              </Badge>
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="gap-2 cursor-pointer font-bold text-primary" onClick={() => handleOpenCourses(program)}>
                                  <BookOpen className="h-4 w-4" /> {isArabic ? "إدارة الخطة والمقررات الدراسية" : "Manage Curriculum & Courses"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleOpenDialog(program)}>
                                  <Edit className="h-4 w-4" /> {isArabic ? "تعديل القسم وتخصيص الموقع" : "Edit & Page Builder"}
                                </DropdownMenuItem>
                                {parentFaculty && (
                                  <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                                    <Link href={`/academics/${parentFaculty.slug}/${program.slug}`} target="_blank">
                                      <ExternalLink className="h-4 w-4 text-primary" /> {isArabic ? "معاينة صفحة القسم" : "Preview Page"}
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 text-destructive font-bold cursor-pointer" onClick={() => { setCurrentProgram(program); setIsDeleteOpen(true); }}>
                                  <Trash2 className="h-4 w-4" /> {isArabic ? "حذف القسم" : "Delete"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6 bg-muted/10">
              {filteredPrograms.map((program) => {
                const parentFaculty = displayFaculties.find((f) => f.id === program.faculty);
                const headDisplay = program.headDetail
                  ? (isArabic ? program.headDetail.nameAr : program.headDetail.nameEn)
                  : (isArabic ? program.headNameAr : program.headNameEn);
                const pColor = program.primaryColor || "#1E3A8A";
                const aColor = program.accentColor || "#F59E0B";

                return (
                  <Card
                    key={program.id}
                    className="border border-border/70 hover:border-primary/40 bg-card rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      <CardHeader className="p-5 pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {program.logoUrl ? (
                              <div className="w-12 h-12 rounded-xl border bg-background p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={program.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                              </div>
                            ) : (
                              <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105"
                                style={{
                                  backgroundColor: hexToRgba(pColor, 0.1),
                                  color: pColor,
                                  borderColor: hexToRgba(pColor, 0.25),
                                }}
                              >
                                <GraduationCap className="h-6 w-6" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <CardTitle
                                className="text-base font-bold truncate group-hover:text-primary transition-colors cursor-pointer"
                                onClick={() => handleOpenDialog(program)}
                                title={isArabic ? program.nameAr : program.nameEn}
                              >
                                {isArabic ? program.nameAr : program.nameEn}
                              </CardTitle>
                              <span className="text-[11px] text-muted-foreground font-mono truncate block">
                                /{parentFaculty?.slug || "faculty"}/{program.slug}
                              </span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer font-bold text-primary"
                                onClick={() => handleOpenCourses(program)}
                              >
                                <BookOpen className="h-4 w-4" />
                                {isArabic ? "إدارة الخطة والمقررات" : "Manage Courses & Plan"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer font-bold"
                                onClick={() => handleOpenDialog(program)}
                              >
                                <Edit className="h-4 w-4" />
                                {isArabic ? "تعديل القسم وتخصيص الموقع" : "Edit Department"}
                              </DropdownMenuItem>
                              {parentFaculty && (
                                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                                  <Link href={`/academics/${parentFaculty.slug}/${program.slug}`} target="_blank">
                                    <ExternalLink className="h-4 w-4 text-primary" />
                                    {isArabic ? "معاينة موقع القسم" : "Preview Department Page"}
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="gap-2 text-destructive font-bold cursor-pointer"
                                onClick={() => {
                                  setCurrentProgram(program);
                                  setIsDeleteOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                {isArabic ? "حذف القسم" : "Delete Department"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Faculty Badge & Colors */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                          <Badge variant="secondary" className="font-bold gap-1 bg-primary/5 text-primary border-primary/10 text-xs">
                            <Building2 className="h-3 w-3" />
                            {parentFaculty ? (isArabic ? parentFaculty.nameAr : parentFaculty.nameEn) : (isArabic ? "غير مسند" : "Unassigned")}
                          </Badge>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3 h-3 rounded-full border shadow-2xs inline-block"
                              style={{ backgroundColor: pColor }}
                              title={isArabic ? "اللون الأساسي" : "Primary"}
                            />
                            <span
                              className="w-3 h-3 rounded-full border shadow-2xs inline-block"
                              style={{ backgroundColor: aColor }}
                              title={isArabic ? "لون التمييز" : "Accent"}
                            />
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-5 pt-0 space-y-3">
                        {/* Motto Badge */}
                        {program.mottoAr && (
                          <div
                            className="p-2 rounded-lg border text-xs font-bold flex items-center gap-1.5"
                            style={{
                              backgroundColor: hexToRgba(aColor, 0.08),
                              borderColor: hexToRgba(aColor, 0.2),
                              color: aColor,
                            }}
                          >
                            <Sparkles className="h-3.5 w-3.5 shrink-0" />
                            <span className="line-clamp-1">{isArabic ? program.mottoAr : program.mottoEn}</span>
                          </div>
                        )}

                        {/* Department Head */}
                        <div className="p-2.5 rounded-xl border bg-muted/30 flex items-center gap-2.5">
                          <Avatar className="h-7 w-7 border shrink-0">
                            {program.headPhoto && <AvatarImage src={program.headPhoto} alt={headDisplay || ""} />}
                            <AvatarFallback className="bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                              <Crown className="h-3.5 w-3.5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                              {isArabic ? "رئيس القسم" : "Department Head"}
                            </span>
                            <p className="text-xs font-bold text-foreground truncate">
                              {headDisplay || (isArabic ? "لم يعين بعد" : "No Head Appointed")}
                            </p>
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold pt-1">
                          <div className="p-2 rounded-xl bg-muted/40 border border-border/40">
                            <span className="text-muted-foreground block text-[10px] mb-0.5">
                              {isArabic ? "مدة الدراسة" : "Duration"}
                            </span>
                            <span className="text-xs font-bold text-primary">
                              {program.duration} {isArabic ? "سنوات" : "yrs"} ({program.creditHours}h)
                            </span>
                          </div>
                          <div className="p-2 rounded-xl bg-muted/40 border border-border/40">
                            <span className="text-muted-foreground block text-[10px] mb-0.5">
                              {isArabic ? "المخابر والطلاب" : "Labs & Students"}
                            </span>
                            <span className="text-xs font-bold text-primary">
                              {program.facilities?.length || program.labsCount || 0} {isArabic ? "مخابر" : "labs"} • {program.studentsCount || 0}
                            </span>
                          </div>
                        </div>

                        {/* Manage Courses Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenCourses(program)}
                          className="w-full font-bold gap-2 text-xs mt-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all"
                        >
                          <BookOpen className="h-3.5 w-3.5 text-primary" />
                          <span>{isArabic ? "الخطة والمقررات الدراسية" : "Courses & Study Plan"}</span>
                          <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-mono bg-primary/10 text-primary">
                            {program.courses?.length ?? 0}
                          </Badge>
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Department Full Microsite Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[850px] w-[95vw]">
          <DialogHeader className="p-6 pb-4 border-b bg-muted/30">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              {currentProgram
                ? (isArabic ? "تعديل القسم وتخصيص الموقع الفرعي" : "Edit Department & Customize Microsite")
                : (isArabic ? "إضافة قسم وتخصيص موقعه الفرعي" : "Add New Department Microsite")}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? "تخصيص الهوية البصرية، كلمة رئيس القسم، محرر الصفحة، المخابر والآفاق المهنية."
                : "Configure visual branding, Head of Dept message, page builder, laboratories & career horizons."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <DialogBody className="space-y-6">
              <Tabs defaultValue="branding" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="branding" className="gap-1.5 text-xs font-bold">
                    <Palette className="h-3.5 w-3.5" />
                    {isArabic ? "الهوية والألوان" : "Branding"}
                  </TabsTrigger>
                  <TabsTrigger value="builder" className="gap-1.5 text-xs font-bold">
                    <Sliders className="h-3.5 w-3.5" />
                    {isArabic ? "محرر الصفحة" : "Page Builder"}
                  </TabsTrigger>
                  <TabsTrigger value="leadership" className="gap-1.5 text-xs font-bold">
                    <Crown className="h-3.5 w-3.5" />
                    {isArabic ? "رئاسة القسم" : "Leadership"}
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="gap-1.5 text-xs font-bold">
                    <Award className="h-3.5 w-3.5" />
                    {isArabic ? "المؤشرات والقبول" : "Key Stats"}
                  </TabsTrigger>
                  <TabsTrigger value="facilities" className="gap-1.5 text-xs font-bold">
                    <FlaskConical className="h-3.5 w-3.5" />
                    {isArabic ? "المخابر والآفاق" : "Labs & Career"}
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Visual Identity & Basic Info */}
                <TabsContent value="branding" className="space-y-5">
                  {/* Color Palette Dropdown */}
                  <div className="space-y-2 p-3.5 bg-muted/20 border rounded-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <Label className="text-xs font-bold flex items-center gap-1.5">
                        <Palette className="h-4 w-4 text-primary" />
                        <span>{isArabic ? "اختيار قالب ألوان متناسق (Color Themes)" : "Choose a Color Theme"}</span>
                      </Label>
                      <span className="text-[11px] text-muted-foreground">
                        {isArabic ? "يمكنك اختيار أي قالب وتعديل درجاته بحرية" : "Select any palette and customize below"}
                      </span>
                    </div>

                    <Select
                      onValueChange={(val) => {
                        const selected = COLOR_PALETTES.find((p) => p.id === val);
                        if (selected) {
                          setPrimaryColor(selected.primary);
                          setAccentColor(selected.accent);
                        }
                      }}
                    >
                      <SelectTrigger className="bg-background w-full">
                        <SelectValue placeholder={isArabic ? "-- اختر قالباً لونياً متناسقاً للقسم --" : "-- Select a balanced color palette --"} />
                      </SelectTrigger>
                      <SelectContent>
                        {COLOR_PALETTES.map((palette) => (
                          <SelectItem key={palette.id} value={palette.id}>
                            <div className="flex items-center justify-between w-full min-w-[280px] gap-4">
                              <span className="font-medium text-xs">{isArabic ? palette.nameAr : palette.nameEn}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="w-4 h-4 rounded-full border shadow-2xs inline-block" style={{ backgroundColor: palette.primary }} />
                                <span className="w-4 h-4 rounded-full border shadow-2xs inline-block" style={{ backgroundColor: palette.accent }} />
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="p-nameAr">{isArabic ? "اسم القسم (بالعربية) *" : "Department Name (AR) *"}</Label>
                      <Input id="p-nameAr" value={nameAr} onChange={(e) => setNameAr(e.target.value)} required placeholder="هندسة البرمجيات ونظم المعلومات" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="p-nameEn">{isArabic ? "اسم القسم (بالإنكليزية)" : "Department Name (EN)"}</Label>
                      <Input
                        id="p-nameEn"
                        value={nameEn}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNameEn(val);
                          if (!currentProgram && (!slug || slug === nameEn.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, ""))) {
                            setSlug(val.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, ""));
                          }
                        }}
                        placeholder="Software Engineering & Information Systems"
                      />
                    </div>
                  </div>

                  {/* Assigned Faculty Selector & Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span>{isArabic ? "الكلية التابع لها هذا القسم *" : "Assigned Faculty *"}</span>
                      </Label>
                      <Select value={facultyId} onValueChange={setFacultyId}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder={isArabic ? "اختر الكلية..." : "Select Faculty..."} />
                        </SelectTrigger>
                        <SelectContent>
                          {displayFaculties.map((f) => (
                            <SelectItem key={f.id} value={f.id.toString()}>
                              {isArabic ? f.nameAr : f.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="p-slug" className="flex items-center gap-1.5">
                        <span>{isArabic ? "الرابط المختصر (Slug) *" : "Department Slug *"}</span>
                      </Label>
                      <Input
                        id="p-slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                        required
                        dir="ltr"
                        placeholder="software-eng"
                      />
                    </div>
                  </div>

                  {/* Slug Explanation Box */}
                  <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
                      <Info className="h-3.5 w-3.5 shrink-0" />
                      <span>{isArabic ? "وظيفة الرابط المختصر:" : "What is Department Slug?"}</span>
                    </div>
                    <p className="leading-relaxed text-[11px]">
                      {isArabic
                        ? `هو المعرف النظيف لصفحة القسم التابع للكلية على الويب: asu.edu.sy/academics/${currentFacultySlug || "faculty"}/${slug || "dept"}. يُسهل المشاركة المباشرة ويدعم أرشفة محركات البحث (SEO).`
                        : `A clean web identifier for the program: asu.edu.sy/academics/${currentFacultySlug || "faculty"}/${slug || "dept"} boosting direct sharing and Google search indexing.`}
                    </p>
                  </div>

                  {/* Primary & Accent Color Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="p-primaryColor">{isArabic ? "اللون الرئيسي للقسم" : "Department Primary Color"}</Label>
                      <div className="flex gap-2">
                        <Input id="p-primaryColor" type="color" className="w-12 h-10 p-1 cursor-pointer shrink-0" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                        <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#1E3A8A" className="font-mono text-xs" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="p-accentColor">{isArabic ? "لون التمييز الثانوي" : "Department Accent Color"}</Label>
                      <div className="flex gap-2">
                        <Input id="p-accentColor" type="color" className="w-12 h-10 p-1 cursor-pointer shrink-0" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                        <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} placeholder="#F59E0B" className="font-mono text-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Logo and Banner Upload with Previews */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                    {/* Logo / Emblem Uploader */}
                    <div className="space-y-3 p-3.5 rounded-xl border bg-muted/10">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold flex items-center gap-1.5">
                          <ImageIcon className="h-4 w-4 text-primary" />
                          <span>{isArabic ? "شعار القسم (Logo / Emblem)" : "Department Emblem"}</span>
                        </Label>
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          {isArabic ? "الحد الأقصى: 2MB" : "Max 2MB"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          id="p-logoUploadInput"
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="font-bold gap-2 text-xs"
                          onClick={() => document.getElementById("p-logoUploadInput")?.click()}
                        >
                          <Upload className="h-3.5 w-3.5" />
                          {isArabic ? "رفع الشعار من جهازك" : "Upload Logo File"}
                        </Button>

                        {logoUrl && (
                          <div className="relative group w-12 h-12 rounded-xl border bg-background p-1 shadow-2xs flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                            <button
                              type="button"
                              onClick={() => setLogoUrl("")}
                              className="absolute -top-1.5 -end-1.5 bg-destructive text-white rounded-full p-0.5 shadow-xs hover:opacity-90"
                              title={isArabic ? "إزالة الشعار" : "Remove"}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      <Input
                        id="p-logoUrl"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder={isArabic ? "أو أدخل رابط الشعار مباشرة..." : "Or paste image link..."}
                        className="text-xs"
                      />
                    </div>

                    {/* Hero Banner Uploader */}
                    <div className="space-y-3 p-3.5 rounded-xl border bg-muted/10">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold flex items-center gap-1.5">
                          <LayoutTemplate className="h-4 w-4 text-primary" />
                          <span>{isArabic ? "صورة البانر العريضة (Hero Banner)" : "Hero Banner Image"}</span>
                        </Label>
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          {isArabic ? "الحد الأقصى: 4MB" : "Max 4MB"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          id="p-bannerUploadInput"
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleHeroBannerUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="font-bold gap-2 text-xs"
                          onClick={() => document.getElementById("p-bannerUploadInput")?.click()}
                        >
                          <Upload className="h-3.5 w-3.5" />
                          {isArabic ? "رفع صورة البانر" : "Upload Banner File"}
                        </Button>

                        {heroBanner && (
                          <div className="relative group w-20 h-10 rounded-lg border bg-background overflow-hidden shadow-2xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={heroBanner} alt="Banner" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setHeroBanner("")}
                              className="absolute top-1 end-1 bg-destructive text-white rounded-full p-0.5 shadow-xs hover:opacity-90"
                              title={isArabic ? "إزالة البانر" : "Remove"}
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <Input
                        id="p-heroBanner"
                        value={heroBanner}
                        onChange={(e) => setHeroBanner(e.target.value)}
                        placeholder={isArabic ? "أو أدخل رابط صورة البانر مباشرة..." : "Or paste image link..."}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="p-mottoAr">{isArabic ? "شعار ورسالة القسم (بالعربية)" : "Department Motto (AR)"}</Label>
                      <Input id="p-mottoAr" value={mottoAr} onChange={(e) => setMottoAr(e.target.value)} placeholder="روّاد هندسة البرمجيات والذكاء الاصطناعي" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="p-mottoEn">{isArabic ? "شعار ورسالة القسم (بالإنكليزية)" : "Department Motto (EN)"}</Label>
                      <Input id="p-mottoEn" value={mottoEn} onChange={(e) => setMottoEn(e.target.value)} placeholder="Engineering Digital Horizons" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="p-descAr">{isArabic ? "شرح ونبذة تعريفية عن القسم" : "Department Overview"}</Label>
                    <Textarea id="p-descAr" value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} rows={3} placeholder="نبذة عامة وشاملة عن القسم وأهدافه ومخرجات التعلم الأكاديمية والعملية..." />
                  </div>
                </TabsContent>

                {/* Tab 2: Page Builder & Modular Sections */}
                <TabsContent value="builder" className="space-y-6">
                  {/* Header Style Picker */}
                  <div className="space-y-3">
                    <Label className="text-sm font-bold flex items-center gap-2">
                      <LayoutTemplate className="h-4 w-4 text-primary" />
                      <span>{isArabic ? "نمط ترويسة صفحة القسم (Header Style)" : "Header Layout Style"}</span>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: "hero_split",
                          nameAr: "عصري مقسوم (Split)",
                          nameEn: "Modern Split",
                          descAr: "هيدر بانورامي مع معلومات التخصص والشعار وبطاقات ملخصة",
                          descEn: "Emblem, overview and action buttons side by side",
                        },
                        {
                          id: "hero_full",
                          nameAr: "بانورامي عريض (Cinematic)",
                          nameEn: "Cinematic Full",
                          descAr: "صورة بانورامية تغطي الهيدر مع تدرج لوني يعكس هوية القسم",
                          descEn: "Full width banner with branded color overlay",
                        },
                        {
                          id: "minimal",
                          nameAr: "هادئ ومركّز (Minimal)",
                          nameEn: "Clean Minimal",
                          descAr: "ترويسة بسيطة خفيفة تركز على العناوين والمسارات والمعدل",
                          descEn: "Compact and clean header focused on content",
                        },
                      ].map((style) => (
                        <div
                          key={style.id}
                          onClick={() => setHeaderStyle(style.id as any)}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${headerStyle === style.id
                            ? "border-primary bg-primary/5 shadow-2xs"
                            : "border-muted hover:border-muted-foreground/30 bg-background"
                            }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs">{isArabic ? style.nameAr : style.nameEn}</span>
                            {headerStyle === style.id && <Check className="h-4 w-4 text-primary" />}
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {isArabic ? style.descAr : style.descEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sections Manager / Reordering & Deep Customizer */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-bold flex items-center gap-2">
                          <Layers className="h-4 w-4 text-primary" />
                          <span>{isArabic ? "ترتيب أقسام وتخطيط صفحة القسم" : "Department Sections Flow & Visibility"}</span>
                        </Label>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {isArabic
                            ? "استخدم الأسهم لإعادة ترتيب ظهور الكتل، وفعّل أو عطّل أي كتلة، واضغط 'تخصيص الكتلة' لتعديل نصوصها وخلفيتها وتخطيطها."
                            : "Use arrows to reorder sections, toggle visibility, and expand each block to customize its titles, layout and background."}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {sectionsOrder.filter((id) => enabledSections[id]).length} / {sectionsOrder.length} {isArabic ? "مفعّل" : "Active"}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {sectionsOrder.map((sectionId, idx) => {
                        const item = DEFAULT_PROGRAM_SECTIONS_LIST.find((s) => s.id === sectionId) || {
                          id: sectionId,
                          labelAr: sectionId,
                          labelEn: sectionId,
                          icon: LayoutTemplate,
                          defaultTitleAr: sectionId,
                          defaultTitleEn: sectionId,
                          defaultSubtitleAr: "",
                          defaultSubtitleEn: "",
                          supportedLayouts: [{ id: "grid", nameAr: "افتراضي", nameEn: "Default" }],
                        };
                        const ItemIcon = item.icon;
                        const isEnabled = enabledSections[sectionId] ?? true;
                        const isExpanded = expandedSectionId === sectionId;
                        const secConf = sectionsConfig[sectionId] || {};

                        return (
                          <div
                            key={sectionId}
                            className={`rounded-2xl border transition-all overflow-hidden ${isEnabled ? "bg-background border-border shadow-2xs" : "bg-muted/30 border-muted opacity-70"
                              } ${isExpanded ? "ring-2 ring-primary/40 border-primary/50 shadow-md" : ""}`}
                          >
                            {/* Main Section Header Row */}
                            <div className="p-3.5 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-mono font-bold text-muted-foreground shrink-0">
                                  {idx + 1}
                                </span>
                                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                  <ItemIcon className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-xs font-bold text-foreground">
                                      {isArabic ? item.labelAr : item.labelEn}
                                    </p>
                                    {secConf.titleAr && (
                                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal text-muted-foreground">
                                        {secConf.titleAr}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                      id: {sectionId}
                                    </span>
                                    {secConf.bgStyle && secConf.bgStyle !== "default" && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                                        {isArabic ? "خلفية: " : "bg: "}
                                        {secConf.bgStyle === "muted"
                                          ? isArabic ? "رمادي" : "muted"
                                          : secConf.bgStyle === "tint"
                                            ? isArabic ? "تدرج القسم" : "tint"
                                            : isArabic ? "لون القسم البارز" : "solid"}
                                      </span>
                                    )}
                                    {secConf.layoutVariant && secConf.layoutVariant !== "grid" && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium">
                                        {isArabic ? "تخطيط: " : "layout: "}
                                        {secConf.layoutVariant}
                                      </span>
                                    )}
                                    {secConf.itemLimit && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                                        {isArabic ? "حد: " : "limit: "}
                                        {secConf.itemLimit}
                                      </span>
                                    )}
                                    {secConf.showCta && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-medium">
                                        CTA ✓
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 ms-auto shrink-0">
                                {/* Up Button */}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  disabled={idx === 0}
                                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                  onClick={() => handleMoveSection(idx, "up")}
                                  title={isArabic ? "تحريك لأعلى" : "Move up"}
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                </Button>

                                {/* Down Button */}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  disabled={idx === sectionsOrder.length - 1}
                                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                  onClick={() => handleMoveSection(idx, "down")}
                                  title={isArabic ? "تحريك لأسفل" : "Move down"}
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </Button>

                                {/* Toggle Visibility */}
                                <Button
                                  type="button"
                                  variant={isEnabled ? "secondary" : "outline"}
                                  size="sm"
                                  className={`h-7 px-2.5 text-xs font-bold gap-1 ${isEnabled ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "text-muted-foreground"
                                    }`}
                                  onClick={() => handleToggleSection(sectionId)}
                                >
                                  {isEnabled ? (
                                    <>
                                      <Eye className="h-3.5 w-3.5" />
                                      <span>{isArabic ? "ظاهر" : "Visible"}</span>
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="h-3.5 w-3.5" />
                                      <span>{isArabic ? "مخفي" : "Hidden"}</span>
                                    </>
                                  )}
                                </Button>

                                {/* Settings / Accordion Toggle */}
                                <Button
                                  type="button"
                                  variant={isExpanded ? "default" : "outline"}
                                  size="sm"
                                  className="h-7 px-2.5 text-xs font-bold gap-1"
                                  onClick={() => setExpandedSectionId(isExpanded ? null : sectionId)}
                                >
                                  <SlidersHorizontal className="h-3.5 w-3.5" />
                                  <span>{isArabic ? "تخصيص الكتلة" : "Settings"}</span>
                                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                </Button>
                              </div>
                            </div>

                            {/* Deep Section Customizer Panel */}
                            {isExpanded && (
                              <div className="border-t bg-muted/15 p-4 sm:p-5 space-y-5 animate-in fade-in-50 duration-200">
                                {/* Panel Header & Reset */}
                                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                                  <div className="flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold text-foreground">
                                      {isArabic
                                        ? `خيارات تخصيص كتلة: ${item.labelAr}`
                                        : `Block Customizer: ${item.labelEn}`}
                                    </span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-[11px] text-muted-foreground hover:text-destructive gap-1 px-2"
                                    onClick={() => resetSectionConfig(sectionId)}
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                    <span>{isArabic ? "إعادة ضبط للافتراضي" : "Reset Block"}</span>
                                  </Button>
                                </div>

                                {/* 1. Custom Section Titles & Subtitles */}
                                <div className="space-y-3">
                                  <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                    <FileText className="h-3.5 w-3.5 text-primary" />
                                    <span>{isArabic ? "العناوين والنصوص التعريفية للكتلة" : "Custom Section Titles"}</span>
                                  </Label>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <span className="text-[11px] font-medium text-muted-foreground">
                                        {isArabic ? "العنوان الرئيسي (بالعربية)" : "Section Title (AR)"}
                                      </span>
                                      <Input
                                        value={secConf.titleAr || ""}
                                        placeholder={item.defaultTitleAr}
                                        onChange={(e) => updateSectionConfig(sectionId, { titleAr: e.target.value })}
                                        className="h-8 text-xs bg-background"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[11px] font-medium text-muted-foreground">
                                        {isArabic ? "العنوان الرئيسي (بالإنكليزية)" : "Section Title (EN)"}
                                      </span>
                                      <Input
                                        value={secConf.titleEn || ""}
                                        placeholder={item.defaultTitleEn}
                                        onChange={(e) => updateSectionConfig(sectionId, { titleEn: e.target.value })}
                                        className="h-8 text-xs bg-background"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[11px] font-medium text-muted-foreground">
                                        {isArabic ? "النص التوضيحي/الفرعي (بالعربية)" : "Section Subtitle (AR)"}
                                      </span>
                                      <Input
                                        value={secConf.subtitleAr || ""}
                                        placeholder={item.defaultSubtitleAr}
                                        onChange={(e) => updateSectionConfig(sectionId, { subtitleAr: e.target.value })}
                                        className="h-8 text-xs bg-background"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[11px] font-medium text-muted-foreground">
                                        {isArabic ? "النص التوضيحي/الفرعي (بالإنكليزية)" : "Section Subtitle (EN)"}
                                      </span>
                                      <Input
                                        value={secConf.subtitleEn || ""}
                                        placeholder={item.defaultSubtitleEn}
                                        onChange={(e) => updateSectionConfig(sectionId, { subtitleEn: e.target.value })}
                                        className="h-8 text-xs bg-background"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* 2. Layout Variant & Background Styling */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                  {/* Layout Variant */}
                                  <div className="space-y-2">
                                    <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                      <LayoutTemplate className="h-3.5 w-3.5 text-primary" />
                                      <span>{isArabic ? "نمط العرض والتخطيط (Layout Variant)" : "Layout Variant"}</span>
                                    </Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                      {item.supportedLayouts.map((l) => {
                                        const isCurrent = (secConf.layoutVariant || item.supportedLayouts[0].id) === l.id;
                                        return (
                                          <button
                                            type="button"
                                            key={l.id}
                                            onClick={() => updateSectionConfig(sectionId, { layoutVariant: l.id })}
                                            className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${isCurrent
                                              ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                                              : "border-border bg-background text-foreground hover:bg-muted"
                                              }`}
                                          >
                                            <span>{isArabic ? l.nameAr : l.nameEn}</span>
                                            {isCurrent && <Check className="h-3.5 w-3.5" />}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Background Styling */}
                                  <div className="space-y-2">
                                    <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                      <Paintbrush className="h-3.5 w-3.5 text-primary" />
                                      <span>{isArabic ? "خلفية القسم (Background Style)" : "Section Background"}</span>
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {[
                                        { id: "default", nameAr: "نظيف (افتراضي)", nameEn: "Clean Default" },
                                        { id: "muted", nameAr: "رمادي هادئ", nameEn: "Muted Slate" },
                                        { id: "tint", nameAr: "تدرج هوية القسم", nameEn: "Program Tint" },
                                        { id: "solid", nameAr: "لون القسم البارز", nameEn: "Solid Branded" },
                                      ].map((b) => {
                                        const isCurrent = (secConf.bgStyle || "default") === b.id;
                                        return (
                                          <button
                                            type="button"
                                            key={b.id}
                                            onClick={() => updateSectionConfig(sectionId, { bgStyle: b.id as any })}
                                            className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${isCurrent
                                              ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                                              : "border-border bg-background text-foreground hover:bg-muted"
                                              }`}
                                          >
                                            <span>{isArabic ? b.nameAr : b.nameEn}</span>
                                            {isCurrent && <Check className="h-3.5 w-3.5" />}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>

                                {/* 3. Item Limit (If supported) */}
                                {item.allowLimit && (
                                  <div className="space-y-2 pt-1 border-t border-border/60">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                        <Layers className="h-3.5 w-3.5 text-primary" />
                                        <span>{isArabic ? "الحد الأقصى لعدد العناصر المعروضة" : "Items Display Limit"}</span>
                                      </Label>
                                      <span className="text-[11px] text-muted-foreground">
                                        {isArabic ? "الافتراضي: " : "Default: "}
                                        {item.defaultLimit}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Input
                                        type="number"
                                        min={1}
                                        max={24}
                                        value={secConf.itemLimit ?? item.defaultLimit ?? 6}
                                        onChange={(e) => updateSectionConfig(sectionId, { itemLimit: Number(e.target.value) })}
                                        className="h-8 w-28 text-xs bg-background"
                                      />
                                      <span className="text-[11px] text-muted-foreground">
                                        {isArabic ? "عنصر كحد أقصى يتم عرضه في الصفحة" : "max items rendered"}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* 4. Custom CTA Button (If supported) */}
                                {item.allowCta && (
                                  <div className="space-y-3 pt-1 border-t border-border/60">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                        <ExternalLink className="h-3.5 w-3.5 text-primary" />
                                        <span>{isArabic ? "زر التفاعل والانتقال (CTA Button)" : "Section Action Button (CTA)"}</span>
                                      </Label>
                                      <Button
                                        type="button"
                                        variant={secConf.showCta ? "default" : "outline"}
                                        size="sm"
                                        className="h-6 text-[11px] px-2 font-bold"
                                        onClick={() => updateSectionConfig(sectionId, { showCta: !secConf.showCta })}
                                      >
                                        {secConf.showCta ? (isArabic ? "الزر مفعّل ✓" : "Enabled ✓") : (isArabic ? "تفعيل الزر" : "Enable CTA")}
                                      </Button>
                                    </div>

                                    {secConf.showCta && (
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-background border">
                                        <div className="space-y-1">
                                          <span className="text-[10px] font-medium text-muted-foreground">
                                            {isArabic ? "نص الزر (بالعربية)" : "Button Text (AR)"}
                                          </span>
                                          <Input
                                            value={secConf.ctaTextAr || ""}
                                            placeholder={item.defaultCtaTextAr || (isArabic ? "عرض المزيد" : "Learn More")}
                                            onChange={(e) => updateSectionConfig(sectionId, { ctaTextAr: e.target.value })}
                                            className="h-8 text-xs"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <span className="text-[10px] font-medium text-muted-foreground">
                                            {isArabic ? "نص الزر (بالإنكليزية)" : "Button Text (EN)"}
                                          </span>
                                          <Input
                                            value={secConf.ctaTextEn || ""}
                                            placeholder={item.defaultCtaTextEn || "Explore More"}
                                            onChange={(e) => updateSectionConfig(sectionId, { ctaTextEn: e.target.value })}
                                            className="h-8 text-xs"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <span className="text-[10px] font-medium text-muted-foreground">
                                            {isArabic ? "رابط التوجيه (URL)" : "Target Link"}
                                          </span>
                                          <Input
                                            value={secConf.ctaLink || ""}
                                            placeholder={item.defaultCtaLink || "#"}
                                            onChange={(e) => updateSectionConfig(sectionId, { ctaLink: e.target.value })}
                                            className="h-8 text-xs"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live preview banner */}
                  {currentProgram && currentFacultySlug && (
                    <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-foreground">
                          {isArabic ? "هل ترغب بمعاينة كيف يبدو الموقع الفرعي للقسم؟" : "Want to preview the live department microsite?"}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" asChild className="text-xs font-bold gap-1">
                        <Link href={`/academics/${currentFacultySlug}/${currentProgram.slug}`} target="_blank">
                          <ExternalLink className="h-3.5 w-3.5" />
                          {isArabic ? "معاينة حية" : "Live Preview"}
                        </Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Tab 3: Head & Leadership */}
                <TabsContent value="leadership" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center gap-2">
                      <Crown className="h-4 w-4 text-amber-500" />
                      <span>{isArabic ? "تعيين رئيس القسم من الكادر التدريسي (اختياري)" : "Appoint Department Head (Optional)"}</span>
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      {isArabic
                        ? "اختياري: يمكنك حفظ القسم الآن دون تعيين رئيس، وتعيينه لاحقاً بعد إضافة كادر الأساتذة."
                        : "Optional: You can save the department without a Head and appoint one later."}
                    </p>
                    <Select value={headId} onValueChange={setHeadId}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={isArabic ? "اختر رئيس القسم (اختياري)" : "Select Head of Department (Optional)"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{isArabic ? "-- بدون رئيس قسم حالياً (يمكن تعيينه لاحقاً) --" : "-- No Head (Can appoint later) --"}</SelectItem>
                        {displayMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id.toString()}>
                            {isArabic ? member.nameAr : member.nameEn} ({isArabic ? member.titleAr : member.titleEn})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="p-headNameAr">{isArabic ? "اسم رئيس القسم (يدوياً إذا لم يُختر من القائمة)" : "Head Name (AR)"}</Label>
                      <Input id="p-headNameAr" value={headNameAr} onChange={(e) => setHeadNameAr(e.target.value)} placeholder="د. باسل خوري" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="p-headNameEn">{isArabic ? "اسم رئيس القسم (بالإنكليزية)" : "Head Name (EN)"}</Label>
                      <Input id="p-headNameEn" value={headNameEn} onChange={(e) => setHeadNameEn(e.target.value)} placeholder="Dr. Basel Khoury" />
                    </div>
                  </div>

                  {/* Head Photo Direct Upload */}
                  <div className="space-y-3 p-3.5 rounded-xl border bg-muted/10">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold flex items-center gap-1.5">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        <span>{isArabic ? "صورة رئيس القسم الشخصية" : "Head Photo"}</span>
                      </Label>
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        {isArabic ? "الحد الأقصى: 2MB" : "Max 2MB"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        id="p-headPhotoInput"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleHeadPhotoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="font-bold gap-2 text-xs"
                        onClick={() => document.getElementById("p-headPhotoInput")?.click()}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {isArabic ? "رفع الصورة الشخصية" : "Upload Photo"}
                      </Button>

                      {headPhoto && (
                        <div className="relative group w-12 h-12 rounded-full border bg-background overflow-hidden shadow-2xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={headPhoto} alt="Head" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setHeadPhoto("")}
                            className="absolute -top-1 -end-1 bg-destructive text-white rounded-full p-0.5 shadow-xs hover:opacity-90"
                            title={isArabic ? "إزالة الصورة" : "Remove"}
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <Input
                      id="p-headPhotoUrl"
                      value={headPhoto}
                      onChange={(e) => setHeadPhoto(e.target.value)}
                      placeholder={isArabic ? "أو أدخل رابط الصورة مباشرة..." : "Or paste image link..."}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="p-headMessageAr">{isArabic ? "كلمة رئيس القسم الترحيبية والرؤية (بالعربية)" : "Head Welcome Message (AR)"}</Label>
                    <Textarea
                      id="p-headMessageAr"
                      value={headMessageAr}
                      onChange={(e) => setHeadMessageAr(e.target.value)}
                      rows={4}
                      placeholder="يسرني أن أرحب بكم في قسم هندسة البرمجيات، حيث نسعى لتخريج مهندسين متميزين قادرين على قيادة التحول الرقمي..."
                    />
                  </div>
                </TabsContent>

                {/* Tab 4: Key Academic Stats & Admissions */}
                <TabsContent value="stats" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="p-establishedYear">{isArabic ? "سنة التأسيس" : "Established Year"}</Label>
                      <Input id="p-establishedYear" type="number" value={establishedYear} onChange={(e) => setEstablishedYear(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="p-studentsCount">{isArabic ? "عدد الطلاب المقيدين" : "Active Students Count"}</Label>
                      <Input id="p-studentsCount" type="number" value={studentsCount} onChange={(e) => setStudentsCount(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="p-labsCount">{isArabic ? "عدد المختبرات والمشاغل" : "Labs Count"}</Label>
                      <Input id="p-labsCount" type="number" value={labsCount} onChange={(e) => setLabsCount(Number(e.target.value))} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="p-researchPapers">{isArabic ? "عدد الأبحاط والأوراق العلمية" : "Published Papers"}</Label>
                      <Input id="p-researchPapers" type="number" value={researchPapersCount} onChange={(e) => setResearchPapersCount(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="p-employmentRate">{isArabic ? "نسبة توظيف الخريجين (%)" : "Employment Rate (%)"}</Label>
                      <Input id="p-employmentRate" type="number" value={employmentRate} onChange={(e) => setEmploymentRate(Number(e.target.value))} />
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {isArabic ? "معايير الدراسة وشروط القبول والرسوم" : "Curriculum & Admission Criteria"}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="p-duration">{isArabic ? "مدة الدراسة (بالسنوات)" : "Duration (Years)"}</Label>
                        <Input id="p-duration" type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="p-credits">{isArabic ? "عدد الساعات المعتمدة" : "Credit Hours"}</Label>
                        <Input id="p-credits" type="number" value={creditHours} onChange={(e) => setCreditHours(Number(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="p-minPercent">{isArabic ? "الحد الأدنى للثانوية (%)" : "Min Score (%)"}</Label>
                        <Input id="p-minPercent" type="number" value={minScorePercent} onChange={(e) => setMinScorePercent(Number(e.target.value))} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="p-tuitionSyp">{isArabic ? "القسط السنوي للطلاب السوريين (ل.س)" : "Tuition (Syrian SYP)"}</Label>
                        <Input id="p-tuitionSyp" type="number" value={tuitionSyrian} onChange={(e) => setTuitionSyrian(Number(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="p-tuitionUsd">{isArabic ? "القسط السنوي للطلاب غير المقيمين ($)" : "Tuition (Non-Resident USD)"}</Label>
                        <Input id="p-tuitionUsd" type="number" value={tuitionNonResident} onChange={(e) => setTuitionNonResident(Number(e.target.value))} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 5: Labs, Career Paths & Prospectus */}
                <TabsContent value="facilities" className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="p-guideDoc">{isArabic ? "رابط دليل القسم / الخطة الدراسية PDF" : "Program Prospectus / Syllabus PDF URL"}</Label>
                    <Input id="p-guideDoc" value={guideDocumentUrl} onChange={(e) => setGuideDocumentUrl(e.target.value)} placeholder="https://asu.edu.sy/docs/software-eng-plan.pdf" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="p-careerPaths">{isArabic ? "الفرص والآفاق المهنية للخريجين" : "Career Opportunities & Job Horizons"}</Label>
                    <Textarea
                      id="p-careerPaths"
                      value={careerPaths}
                      onChange={(e) => setCareerPaths(e.target.value)}
                      rows={3}
                      placeholder={isArabic ? "مطور برمجيات كامل، مهندس سحابي، محلل نظم، مدير مشاريع تقنية، باحث ذكاء اصطناعي..." : "Full-stack Developer, Cloud Architect, Systems Analyst, Tech Lead..."}
                    />
                  </div>

                  {/* Facilities / Labs Manager */}
                  <div className="space-y-3 border-t pt-4">
                    <Label className="font-bold text-base flex items-center gap-2">
                      <FlaskConical className="h-5 w-5 text-primary" />
                      <span>{isArabic ? "المختبرات والمشاغل التخصصية التابعة للقسم" : "Specialized Department Labs & Facilities"}</span>
                    </Label>

                    {facilities.map((facility, idx) => (
                      <div key={idx} className="p-3 border rounded-xl bg-muted/20 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-foreground">{facility.nameAr}</p>
                          <p className="text-xs text-muted-foreground">{facility.descriptionAr || facility.nameEn}</p>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleRemoveFacility(idx)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <div className="p-4 border rounded-xl bg-background space-y-3">
                      <p className="text-xs font-bold text-muted-foreground">{isArabic ? "+ إضافة مخبر تخصصي جديد" : "+ Add New Specialized Lab"}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input placeholder={isArabic ? "اسم المختبر (بالعربية)" : "Lab Name (AR)"} value={newLabNameAr} onChange={(e) => setNewLabNameAr(e.target.value)} />
                        <Input placeholder={isArabic ? "اسم المختبر (بالإنكليزية)" : "Lab Name (EN)"} value={newLabNameEn} onChange={(e) => setNewLabNameEn(e.target.value)} />
                      </div>
                      <Textarea placeholder={isArabic ? "تجهيزات ومحتويات المختبر والأنظمة البرمجية المتوفرة..." : "Lab description, hardware and software setups..."} value={newLabDescAr} onChange={(e) => setNewLabDescAr(e.target.value)} rows={2} />
                      <Button type="button" variant="outline" size="sm" className="font-bold gap-2" onClick={handleAddFacility}>
                        <Plus className="h-4 w-4" />
                        {isArabic ? "إضافة المختبر للقائمة" : "Add Lab to List"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogBody>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="font-bold gap-2">
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isArabic ? "حفظ وتطبيق إعدادات القسم" : "Save Department & Microsite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* High-Risk Operation Captcha Delete Confirmation Dialog */}
      <CaptchaModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title={isArabic ? "حذف القسم الأكاديمي (عملية عالية الخطورة)" : "High-Risk Operation: Delete Department"}
        description={
          isArabic
            ? `تحذير: هل أنت متأكد من حذف قسم ${currentProgram?.nameAr || "هذا القسم"}؟ سيتم حذف جميع بيانات وموقع وتعيينات هذا القسم.`
            : `Warning: Are you sure you want to delete ${currentProgram?.nameEn}? All related data and pages will be removed.`
        }
        confirmText={isArabic ? "تأكيد حذف القسم الأمني" : "Confirm Security Deletion"}
        isPending={deleteMutation.isPending}
      />

      {/* Comprehensive Course / Curriculum Management Dialog */}
      <Dialog open={isCoursesDialogOpen} onOpenChange={setIsCoursesDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b bg-muted/20 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>
                    {isArabic
                      ? `الخطة الدراسية والمقررات - ${coursesProgram?.nameAr || ""}`
                      : `Curriculum & Courses - ${coursesProgram?.nameEn || ""}`}
                  </span>
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs">
                  {isArabic
                    ? "إدارة وتوزيع كافة المقررات الدراسية الأكاديمية على السنوات والفصول الدراسية وتحديثها فورياً على موقع القسم."
                    : "Manage all academic courses, credit hours, syllabi, and prerequisites across academic years."}
                </DialogDescription>
              </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={
                    isArabic
                      ? "البحث في المقررات بالرمز أو الاسم..."
                      : "Search courses by code or name..."
                  }
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="ps-9 h-9 text-xs"
                />
                {courseSearch && (
                  <button
                    onClick={() => setCourseSearch("")}
                    className="absolute end-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground font-semibold">
                <span>{isArabic ? "إجمالي المقررات:" : "Total Courses:"}</span>
                <Badge variant="outline" className="font-mono text-xs px-2 py-0.5">
                  {programCoursesList?.length ?? 0} {isArabic ? "مقرر" : "courses"}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <DialogBody className="p-6 flex-1 overflow-y-auto space-y-4">
            {isCoursesLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground font-bold">
                  {isArabic ? "جاري تحميل مقررات الخطة الدراسية..." : "Loading curriculum courses..."}
                </p>
              </div>
            ) : courseSearch ? (
              /* Search Results across all years */
              <div className="space-y-3">
                <p className="text-xs font-bold text-muted-foreground">
                  {isArabic
                    ? `نتائج البحث عن "${courseSearch}":`
                    : `Search results for "${courseSearch}":`}
                </p>
                {(() => {
                  const filtered = (programCoursesList || []).filter(
                    (c) =>
                      c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
                      c.nameAr.toLowerCase().includes(courseSearch.toLowerCase()) ||
                      c.nameEn.toLowerCase().includes(courseSearch.toLowerCase())
                  );

                  if (filtered.length === 0) {
                    return (
                      <div className="p-8 text-center border rounded-xl text-muted-foreground text-sm">
                        {isArabic ? "لا توجد مقررات مطابقة للبحث." : "No matching courses found."}
                      </div>
                    );
                  }

                  return (
                    <div className="border rounded-xl overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40">
                            <TableHead className="text-start font-bold">{isArabic ? "الرمز" : "Code"}</TableHead>
                            <TableHead className="text-start font-bold">{isArabic ? "المقرر" : "Course"}</TableHead>
                            <TableHead className="text-start font-bold">{isArabic ? "السنة والفصل" : "Year & Term"}</TableHead>
                            <TableHead className="text-start font-bold">{isArabic ? "الساعات" : "Credits"}</TableHead>
                            <TableHead className="text-start font-bold">{isArabic ? "المتطلب السابق" : "Prereq"}</TableHead>
                            <TableHead className="text-center font-bold">{isArabic ? "الرمز" : "Code"}</TableHead>
                            <TableHead className="text-center font-bold">{isArabic ? "المقرر" : "Course"}</TableHead>
                            <TableHead className="text-center font-bold">{isArabic ? "السنة والفصل" : "Year & Term"}</TableHead>
                            <TableHead className="text-center font-bold">{isArabic ? "الساعات" : "Credits"}</TableHead>
                            <TableHead className="text-center font-bold">{isArabic ? "المتطلب السابق" : "Prereq"}</TableHead>
                            <TableHead className="text-center font-bold">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map((course) => (
                            <TableRow key={course.id}>
                              <TableCell className="font-mono font-bold text-primary">
                                <Badge variant="secondary" className="font-mono text-xs font-bold">
                                  {course.code}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="font-bold text-sm">{isArabic ? course.nameAr : course.nameEn}</div>
                                <div className="text-[11px] text-muted-foreground">{isArabic ? course.nameEn : course.nameAr}</div>
                              </TableCell>
                              <TableCell className="text-xs">
                                {isArabic ? `السنة ${course.year} - الفصل ${course.semester}` : `Yr ${course.year} - Sem ${course.semester}`}
                              </TableCell>
                              <TableCell className="text-xs font-semibold">
                                {course.credits} {isArabic ? "ساعات" : "credits"}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {course.prerequisitesText || "—"}
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                    onClick={() => handleOpenCourseForm(course)}
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                      setDeletingCourse(course);
                                      setIsCourseDeleteOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* Year Tabs with Semesters */
              <Tabs value={selectedYearTab} onValueChange={setSelectedYearTab} className="w-full space-y-4">
                <TabsList className="w-full grid grid-cols-5 p-1 bg-muted/40 rounded-xl border h-auto">
                  {Array.from({ length: coursesProgram?.duration || 5 }, (_, i) => i + 1).map((yearNum) => {
                    const yearCourses = (programCoursesList || []).filter((c) => c.year === yearNum);
                    const yearLabels: Record<number, string> = {
                      1: "السنة الأولى",
                      2: "السنة الثانية",
                      3: "السنة الثالثة",
                      4: "السنة الرابعة",
                      5: "السنة الخامسة",
                    };
                    const label = isArabic ? (yearLabels[yearNum] || `السنة ${yearNum}`) : `Year ${yearNum}`;
                    const isSelected = selectedYearTab === yearNum.toString();

                    return (
                      <TabsTrigger
                        key={yearNum}
                        value={yearNum.toString()}
                        className={`text-xs font-bold gap-2 py-2 rounded-lg transition-all data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-xs ${isSelected
                            ? "!bg-primary !text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:bg-muted/60"
                          }`}
                      >
                        <span>{label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono transition-colors ${isSelected
                              ? "bg-white/20 text-white font-bold"
                              : "bg-muted text-foreground"
                            }`}
                        >
                          {yearCourses.length}
                        </span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {Array.from({ length: coursesProgram?.duration || 5 }, (_, i) => i + 1).map((yearNum) => {
                  return (
                    <TabsContent key={yearNum} value={yearNum.toString()} className="space-y-4 pt-1">
                      {/* Semester Switcher */}
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                          {[1, 2].map((sem) => {
                            const semCount = (programCoursesList || []).filter(
                              (c) => c.year === yearNum && c.semester === sem
                            ).length;
                            const isSelected = selectedSemesterTab === sem.toString();
                            return (
                              <button
                                key={sem}
                                type="button"
                                onClick={() => setSelectedSemesterTab(sem.toString())}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${isSelected
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "bg-muted/40 text-muted-foreground hover:bg-muted"
                                  }`}
                              >
                                <span>{isArabic ? (sem === 1 ? "الفصل الأول" : "الفصل الثاني") : `Semester ${sem}`}</span>
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isSelected ? "bg-white/20 text-white" : "bg-muted text-foreground"
                                    }`}
                                >
                                  {semCount}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCourse(null);
                            setCourseCode("");
                            setCourseNameAr("");
                            setCourseNameEn("");
                            setCourseCredits(3);
                            setCourseYear(yearNum);
                            setCourseSemester(Number(selectedSemesterTab));
                            setCoursePrerequisites("");
                            setCourseDescriptionAr("");
                            setCourseDescriptionEn("");
                            setIsCourseFormOpen(true);
                          }}
                          className="text-xs font-bold gap-1"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>
                            {isArabic
                              ? `إضافة مقرر (فصل ${selectedSemesterTab})`
                              : `Add Course (Sem ${selectedSemesterTab})`}
                          </span>
                        </Button>
                      </div>

                      {/* Semester Courses Table */}
                      {(() => {
                        const semCourses = (programCoursesList || []).filter(
                          (c) => c.year === yearNum && c.semester === Number(selectedSemesterTab)
                        );

                        if (semCourses.length === 0) {
                          return (
                            <div className="p-10 border-2 border-dashed rounded-xl text-center flex flex-col items-center justify-center gap-3 bg-muted/10">
                              <BookOpen className="h-10 w-10 text-muted-foreground/30" />
                              <p className="text-sm font-bold text-muted-foreground">
                                {isArabic
                                  ? `لا توجد مقررات مسجلة في الفصل الدراسي ${selectedSemesterTab} للسنة ${yearNum}.`
                                  : `No courses registered for Year ${yearNum} - Semester ${selectedSemesterTab}.`}
                              </p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingCourse(null);
                                  setCourseCode("");
                                  setCourseNameAr("");
                                  setCourseNameEn("");
                                  setCourseCredits(3);
                                  setCourseYear(yearNum);
                                  setCourseSemester(Number(selectedSemesterTab));
                                  setCoursePrerequisites("");
                                  setCourseDescriptionAr("");
                                  setCourseDescriptionEn("");
                                  setIsCourseFormOpen(true);
                                }}
                                className="font-bold gap-1.5"
                              >
                                <Plus className="h-4 w-4" />
                                <span>{isArabic ? "إضافة أول مقرر لهذا الفصل" : "Add First Course to Semester"}</span>
                              </Button>
                            </div>
                          );
                        }

                        return (
                          <div className="border rounded-xl overflow-hidden shadow-2xs">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-muted/30">
                                  <TableHead className="w-24 text-start font-bold">{isArabic ? "الرمز" : "Code"}</TableHead>
                                  <TableHead className="text-start font-bold">{isArabic ? "اسم المقرر" : "Course Name"}</TableHead>
                                  <TableHead className="w-24 text-center font-bold">{isArabic ? "الرمز" : "Code"}</TableHead>
                                  <TableHead className="text-center font-bold">{isArabic ? "اسم المقرر" : "Course Name"}</TableHead>
                                  <TableHead className="w-24 text-center font-bold">{isArabic ? "الساعات" : "Credits"}</TableHead>
                                  <TableHead className="text-start font-bold">{isArabic ? "المتطلب السابق" : "Prerequisite"}</TableHead>
                                  <TableHead className="text-start font-bold">{isArabic ? "الوصف" : "Description"}</TableHead>
                                  <TableHead className="text-center font-bold">{isArabic ? "المتطلب السابق" : "Prerequisite"}</TableHead>
                                  <TableHead className="text-center font-bold">{isArabic ? "الوصف" : "Description"}</TableHead>
                                  <TableHead className="w-20 text-center font-bold">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {semCourses.map((c) => (
                                  <TableRow key={c.id} className="hover:bg-muted/20 transition-colors">
                                    <TableCell className="font-mono">
                                      <Badge variant="secondary" className="font-mono text-xs font-bold bg-primary/10 text-primary border-primary/20">
                                        {c.code}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <div className="font-bold text-sm text-foreground">{c.nameAr}</div>
                                      <div className="text-[11px] text-muted-foreground">{c.nameEn}</div>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-xs">
                                      <Badge variant="outline" className="font-mono text-[11px]">
                                        {c.credits} {isArabic ? "ساعات" : "cr"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                      {c.prerequisitesText ? (
                                        <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300">
                                          {c.prerequisitesText}
                                        </Badge>
                                      ) : (
                                        <span className="text-muted-foreground/60">—</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                                      {c.descriptionAr || c.descriptionEn || "—"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                          onClick={() => handleOpenCourseForm(c)}
                                          title={isArabic ? "تعديل" : "Edit"}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                          onClick={() => {
                                            setDeletingCourse(c);
                                            setIsCourseDeleteOpen(true);
                                          }}
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
                        );
                      })()}
                    </TabsContent>
                  );
                })}
              </Tabs>
            )}
          </DialogBody>

          <DialogFooter className="p-4 border-t bg-muted/20 shrink-0">
            <Button variant="outline" onClick={() => setIsCoursesDialogOpen(false)}>
              {isArabic ? "إغلاق" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sub-dialog: Add / Edit Course */}
      <Dialog open={isCourseFormOpen} onOpenChange={setIsCourseFormOpen}>
        <DialogContent className="sm:max-w-[550px] w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>
                {editingCourse
                  ? (isArabic ? `تعديل المقرر: ${editingCourse.nameAr}` : `Edit Course: ${editingCourse.nameEn}`)
                  : (isArabic ? "إضافة مقرر دراسي جديد" : "Add New Academic Course")}
              </span>
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? `الخطة الدراسية لقسم ${coursesProgram?.nameAr || ""}`
                : `Curriculum syllabus for ${coursesProgram?.nameEn || ""}`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCourse} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <DialogBody className="space-y-4 py-4 px-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="c-code" className="text-xs font-bold">
                    {isArabic ? "رمز المقرر *" : "Course Code *"}
                  </Label>
                  <Input
                    id="c-code"
                    placeholder="SWE201"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="font-mono uppercase font-bold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c-credits" className="text-xs font-bold">
                    {isArabic ? "عدد الساعات المعتمدة *" : "Credit Hours *"}
                  </Label>
                  <Input
                    id="c-credits"
                    type="number"
                    min={1}
                    max={12}
                    value={courseCredits}
                    onChange={(e) => setCourseCredits(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="c-nameAr" className="text-xs font-bold">
                  {isArabic ? "اسم المقرر (بالعربية) *" : "Course Name (Arabic) *"}
                </Label>
                <Input
                  id="c-nameAr"
                  placeholder={isArabic ? "مثال: هندسة البرمجيات 1" : "e.g., Software Engineering 1"}
                  value={courseNameAr}
                  onChange={(e) => setCourseNameAr(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="c-nameEn" className="text-xs font-bold">
                  {isArabic ? "اسم المقرر (بالإنكليزية)" : "Course Name (English)"}
                </Label>
                <Input
                  id="c-nameEn"
                  placeholder="Software Engineering I"
                  value={courseNameEn}
                  onChange={(e) => setCourseNameEn(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="c-year" className="text-xs font-bold">
                    {isArabic ? "السنة الدراسية *" : "Academic Year *"}
                  </Label>
                  <Select
                    value={courseYear.toString()}
                    onValueChange={(val) => setCourseYear(Number(val))}
                  >
                    <SelectTrigger id="c-year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: coursesProgram?.duration || 5 }, (_, i) => i + 1).map((y) => {
                        const yearLabels: Record<number, string> = {
                          1: "السنة الأولى",
                          2: "السنة الثانية",
                          3: "السنة الثالثة",
                          4: "السنة الرابعة",
                          5: "السنة الخامسة",
                        };
                        return (
                          <SelectItem key={y} value={y.toString()}>
                            {isArabic ? (yearLabels[y] || `السنة ${y}`) : `Year ${y}`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c-sem" className="text-xs font-bold">
                    {isArabic ? "الفصل الدراسي *" : "Semester *"}
                  </Label>
                  <Select
                    value={courseSemester.toString()}
                    onValueChange={(val) => setCourseSemester(Number(val))}
                  >
                    <SelectTrigger id="c-sem">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{isArabic ? "الفصل الدراسي الأول" : "Semester 1"}</SelectItem>
                      <SelectItem value="2">{isArabic ? "الفصل الدراسي الثاني" : "Semester 2"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="c-prereq" className="text-xs font-bold">
                  {isArabic ? "المتطلب السابق (إن وجد)" : "Prerequisites (Optional)"}
                </Label>
                <Input
                  id="c-prereq"
                  placeholder={isArabic ? "مثال: CS101 برمجة 1" : "e.g., CS101 Programming I"}
                  value={coursePrerequisites}
                  onChange={(e) => setCoursePrerequisites(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="c-descAr" className="text-xs font-bold">
                  {isArabic ? "نبذة وتوصيف المقرر بالعربية" : "Course Syllabus / Description (Arabic)"}
                </Label>
                <Textarea
                  id="c-descAr"
                  rows={3}
                  placeholder={
                    isArabic
                      ? "وصف موجز للمفاهيم ومخرجات التعلم المستهدفة من هذا المقرر..."
                      : "Course topics and intended learning outcomes..."
                  }
                  value={courseDescriptionAr}
                  onChange={(e) => setCourseDescriptionAr(e.target.value)}
                />
              </div>
            </DialogBody>

            <DialogFooter className="px-6 py-4 border-t bg-muted/10 gap-2 shrink-0">
              <Button type="button" variant="outline" onClick={() => setIsCourseFormOpen(false)}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={createCourseMutation.isPending || updateCourseMutation.isPending}
                className="font-bold gap-1.5"
              >
                {(createCourseMutation.isPending || updateCourseMutation.isPending) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isArabic ? "حفظ المقرر" : "Save Course"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Course Delete Confirmation Dialog */}
      <Dialog open={isCourseDeleteOpen} onOpenChange={setIsCourseDeleteOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <span>{isArabic ? "تأكيد حذف المقرر الدراسي" : "Delete Course Confirmation"}</span>
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? `هل أنت متأكد من حذف المقرر (${deletingCourse?.nameAr} - ${deletingCourse?.code}) من الخطة الدراسية لقسم ${coursesProgram?.nameAr}؟`
                : `Are you sure you want to delete course ${deletingCourse?.nameEn} (${deletingCourse?.code})?`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="px-6 py-4 border-t bg-muted/10 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsCourseDeleteOpen(false);
                setDeletingCourse(null);
              }}
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              disabled={deleteCourseMutation.isPending}
              onClick={handleDeleteCourse}
              className="font-bold gap-1.5"
            >
              {deleteCourseMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {isArabic ? "تأكيد الحذف" : "Delete Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
