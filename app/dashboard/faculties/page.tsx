"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useFaculties, useCreateFaculty, useUpdateFaculty, useDeleteFaculty } from "@/hooks/use-faculties";
import { useFacultyMembers, useUpdateFacultyMember } from "@/hooks/use-faculty-members";
import { usePrograms, useCreateProgram, useDeleteProgram } from "@/hooks/use-programs";
import { useStudents, useUpdateStudent } from "@/hooks/use-students";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Loader2,
  Crown,
  BookOpen,
  ExternalLink,
  Palette,
  Award,
  Sparkles,
  FlaskConical,
  FileText,
  Save,
  Search,
  GraduationCap,
  ArrowRightLeft,
  School,
  Sliders,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Check,
  LayoutTemplate,
  Layers,
  Upload,
  X,
  Image as ImageIcon,
  Info,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Paintbrush,
  Link2,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogBody,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { CaptchaModal } from "@/components/ui/captcha-modal";
import { FacultyFacility, FacultySectionConfig } from "@/lib/api/models/Faculty";

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

const DEFAULT_SECTIONS_LIST: SectionMeta[] = [
  {
    id: "stats",
    labelAr: "شريط الإحصائيات والأرقام الأكاديمية",
    labelEn: "Key Statistics Bar",
    icon: Award,
    defaultTitleAr: "أرقام وإحصائيات الكلية",
    defaultTitleEn: "Faculty by the Numbers",
    defaultSubtitleAr: "مؤشرات التميز الأكاديمي والبحثي في الكلية",
    defaultSubtitleEn: "Key academic excellence and research indicators",
    supportedLayouts: [
      { id: "grid", nameAr: "بطاقات شبكية", nameEn: "Grid Cards" },
      { id: "compact", nameAr: "شريط مدمج", nameEn: "Compact Bar" },
    ],
    allowLimit: false,
    allowCta: false,
  },
  {
    id: "dean",
    labelAr: "كلمة العميد ومجلس الكلية",
    labelEn: "Dean's Message & Leadership",
    icon: Crown,
    defaultTitleAr: "كلمة عميد الكلية",
    defaultTitleEn: "Dean's Welcome Message",
    defaultSubtitleAr: "رؤية القيادة الأكاديمية ورسالتها نحو التميز",
    defaultSubtitleEn: "Academic leadership vision and commitment to excellence",
    supportedLayouts: [
      { id: "split", nameAr: "عصري مقسوم", nameEn: "Split View" },
      { id: "compact", nameAr: "موجز ومركّز", nameEn: "Compact Banner" },
    ],
    allowLimit: false,
    allowCta: true,
    defaultCtaTextAr: "تواصل مع مكتب العميد",
    defaultCtaTextEn: "Contact Dean Office",
    defaultCtaLink: "#contact",
  },
  {
    id: "programs",
    labelAr: "الأقسام والتخصصات الأكاديمية",
    labelEn: "Academic Departments & Programs",
    icon: School,
    defaultTitleAr: "الأقسام والتخصصات الأكاديمية",
    defaultTitleEn: "Departments & Academic Programs",
    defaultSubtitleAr: "استكشف التخصصات والخطط الدراسية المعتمدة في الكلية",
    defaultSubtitleEn: "Explore accredited undergraduate programs and curricula",
    supportedLayouts: [
      { id: "grid", nameAr: "شبكة بطاقات", nameEn: "Grid Cards" },
      { id: "list", nameAr: "قائمة أفقية", nameEn: "Horizontal List" },
      { id: "compact", nameAr: "صفوف مدمجة", nameEn: "Compact Rows" },
    ],
    allowLimit: true,
    defaultLimit: 6,
    allowCta: true,
    defaultCtaTextAr: "عرض كافة التخصصات والخطط",
    defaultCtaTextEn: "View All Programs",
    defaultCtaLink: "#programs-section",
  },
  {
    id: "news",
    labelAr: "أخبار وإعلانات الكلية الحصرية",
    labelEn: "Faculty News & Notices",
    icon: FileText,
    defaultTitleAr: "أخبار وإعلانات الكلية",
    defaultTitleEn: "Faculty News & Announcements",
    defaultSubtitleAr: "آخر التطورات والإعلانات الصادرة عن عمادة الكلية",
    defaultSubtitleEn: "Latest updates and announcements from the faculty",
    supportedLayouts: [
      { id: "grid", nameAr: "شبكة مقالات", nameEn: "Article Grid" },
      { id: "list", nameAr: "قائمة أفقية", nameEn: "Horizontal Cards" },
      { id: "compact", nameAr: "شريط عواجل", nameEn: "Compact Feed" },
    ],
    allowLimit: true,
    defaultLimit: 6,
    allowCta: true,
    defaultCtaTextAr: "تصفح كافة أخبار الجامعة",
    defaultCtaTextEn: "All University News",
    defaultCtaLink: "/news",
  },
  {
    id: "events",
    labelAr: "فعاليات وأنشطة الكلية",
    labelEn: "Upcoming Faculty Events",
    icon: Sparkles,
    defaultTitleAr: "فعاليات وندوات الكلية القادمة",
    defaultTitleEn: "Faculty Events & Seminars",
    defaultSubtitleAr: "المؤتمرات وورشات العمل والأنشطة الطلابية والبحثية",
    defaultSubtitleEn: "Conferences, workshops, and extracurricular student events",
    supportedLayouts: [
      { id: "grid", nameAr: "شبكة بطاقات", nameEn: "Cards Grid" },
      { id: "list", nameAr: "خط زمني", nameEn: "Timeline List" },
      { id: "compact", nameAr: "تقويم مدمج", nameEn: "Compact Rows" },
    ],
    allowLimit: true,
    defaultLimit: 6,
    allowCta: true,
    defaultCtaTextAr: "التقويم الأكاديمي والفعاليات",
    defaultCtaTextEn: "Full Events Calendar",
    defaultCtaLink: "/events",
  },
  {
    id: "facilities",
    labelAr: "المختبرات والعيادات والمشاغل",
    labelEn: "Labs & Clinical Facilities",
    icon: FlaskConical,
    defaultTitleAr: "المختبرات والعيادات والمرافق البحثية",
    defaultTitleEn: "Laboratories & Clinical Facilities",
    defaultSubtitleAr: "بنية تحتية حديثة ومجهزة بأحدث التقنيات لخدمة التعليم والبحث",
    defaultSubtitleEn: "Modern research infrastructure equipped with cutting-edge tools",
    supportedLayouts: [
      { id: "grid", nameAr: "شبكة مرافق", nameEn: "Facilities Grid" },
      { id: "list", nameAr: "قائمة تفصيلية", nameEn: "Detailed Rows" },
      { id: "compact", nameAr: "موجز وبطاقات", nameEn: "Compact Chips" },
    ],
    allowLimit: true,
    defaultLimit: 6,
    allowCta: true,
    defaultCtaTextAr: "حجز مختبر وتواصل بحثي",
    defaultCtaTextEn: "Book Research Facility",
    defaultCtaLink: "#contact",
  },
  {
    id: "staff",
    labelAr: "دليل الكادر التدريسي والأكاديمي",
    labelEn: "Faculty Staff Directory",
    icon: Users,
    defaultTitleAr: "كادر وأساتذة الكلية",
    defaultTitleEn: "Faculty Teaching Staff",
    defaultSubtitleAr: "نخبة من الأساتذة والباحثين ذوي الخبرة الأكاديمية العالمية",
    defaultSubtitleEn: "Distinguished scholars, researchers, and academic leaders",
    supportedLayouts: [
      { id: "grid", nameAr: "شبكة بطاقات", nameEn: "Profile Cards" },
      { id: "list", nameAr: "دليل جدولي", nameEn: "Directory List" },
      { id: "compact", nameAr: "صور مدمجة", nameEn: "Compact Avatars" },
    ],
    allowLimit: true,
    defaultLimit: 8,
    allowCta: true,
    defaultCtaTextAr: "الدليل الكامل لأعضاء الهيئة التعليمية",
    defaultCtaTextEn: "Full Faculty Directory",
    defaultCtaLink: "/faculty",
  },
  {
    id: "top_students",
    labelAr: "لوحة الشرف وأوائل الكلية",
    labelEn: "Top Students & Honor Roll",
    icon: GraduationCap,
    defaultTitleAr: "لوحة الشرف والتميز الأكاديمي",
    defaultTitleEn: "Faculty Honor Roll",
    defaultSubtitleAr: "نحتفي بنخبة الطلاب المتفوقين الذين حققوا أعلى المعدلات",
    defaultSubtitleEn: "Celebrating top performing students with highest GPAs",
    supportedLayouts: [
      { id: "grid", nameAr: "منصة التتويج والبطاقات", nameEn: "Podium & Cards" },
      { id: "compact", nameAr: "موجز", nameEn: "Compact" },
    ],
    allowLimit: false,
    allowCta: false,
  },
  {
    id: "alumni_stories",
    labelAr: "قصص نجاح الخريجين",
    labelEn: "Alumni Success Stories",
    icon: ArrowRightLeft,
    defaultTitleAr: "قصص نجاح خريجي الكلية",
    defaultTitleEn: "Alumni Success Stories",
    defaultSubtitleAr: "بصمات خريجينا في سوق العمل والمؤسسات والشركات الرائدة",
    defaultSubtitleEn: "Inspiring career milestones and achievements of our alumni",
    supportedLayouts: [
      { id: "grid", nameAr: "شبكة بطاقات", nameEn: "Cards Grid" },
      { id: "compact", nameAr: "موجز", nameEn: "Compact" },
    ],
    allowLimit: false,
    allowCta: false,
  },
];

function hexToRgba(hex: string, alpha: number) {
  if (!hex || !hex.startsWith("#")) return `rgba(30, 58, 138, ${alpha})`;
  let c = hex.substring(1);
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

export default function FacultiesManagement() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");

  const { data: backendFaculties, isLoading } = useFaculties();
  const { data: facultyMembersList } = useFacultyMembers();
  const { data: backendPrograms } = usePrograms();
  const { data: backendStudents } = useStudents();

  const displayFaculties = backendFaculties || [];
  const displayMembers = facultyMembersList || [];
  const displayPrograms = backendPrograms || [];
  const displayStudents = backendStudents || [];

  const createMutation = useCreateFaculty();
  const deleteMutation = useDeleteFaculty();
  const createProgramMutation = useCreateProgram();
  const deleteProgramMutation = useDeleteProgram();
  const updateMemberMutation = useUpdateFacultyMember();
  const updateStudentMutation = useUpdateStudent();

  // Hub Dialog State
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [selectedFacultyForHub, setSelectedFacultyForHub] = useState<any>(null);
  const [hubTab, setHubTab] = useState("departments");
  const [hubSearch, setHubSearch] = useState("");

  // Sub-dialog: Add Department to this faculty
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);
  const [progNameAr, setProgNameAr] = useState("");
  const [progNameEn, setProgNameEn] = useState("");
  const [progSlug, setProgSlug] = useState("");
  const [progDuration, setProgDuration] = useState(5);
  const [progCreditHours, setProgCreditHours] = useState(160);
  const [progHeadId, setProgHeadId] = useState("none");

  // Filtering for Hub
  const hubPrograms = useMemo(() => {
    if (!selectedFacultyForHub) return [];
    return displayPrograms.filter((p) => p.faculty === selectedFacultyForHub.id);
  }, [displayPrograms, selectedFacultyForHub]);

  const hubTeachers = useMemo(() => {
    if (!selectedFacultyForHub) return [];
    return displayMembers.filter((m) => {
      const belongs = m.faculty === selectedFacultyForHub.id || m.departmentDetail?.faculty === selectedFacultyForHub.id;
      if (!belongs) return false;
      if (!hubSearch) return true;
      const q = hubSearch.toLowerCase();
      return (
        m.nameAr?.toLowerCase().includes(q) ||
        m.nameEn?.toLowerCase().includes(q) ||
        m.titleAr?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q)
      );
    });
  }, [displayMembers, selectedFacultyForHub, hubSearch]);

  const hubStudents = useMemo(() => {
    if (!selectedFacultyForHub) return [];
    return displayStudents.filter((s) => {
      const belongs = s.faculty === selectedFacultyForHub.id || s.programDetail?.faculty === selectedFacultyForHub.id;
      if (!belongs) return false;
      if (!hubSearch) return true;
      const q = hubSearch.toLowerCase();
      return (
        s.nameAr?.toLowerCase().includes(q) ||
        s.nameEn?.toLowerCase().includes(q) ||
        s.studentId?.toLowerCase().includes(q)
      );
    });
  }, [displayStudents, selectedFacultyForHub, hubSearch]);

  // Facilities within Hub
  const hubFacilities = useMemo(() => {
    if (!selectedFacultyForHub) return [];
    const facs: FacultyFacility[] = selectedFacultyForHub.facilities || [];
    if (!hubSearch) return facs;
    const q = hubSearch.toLowerCase();
    return facs.filter(
      (f) =>
        f.nameAr?.toLowerCase().includes(q) ||
        f.nameEn?.toLowerCase().includes(q) ||
        f.descriptionAr?.toLowerCase().includes(q) ||
        f.descriptionEn?.toLowerCase().includes(q)
    );
  }, [selectedFacultyForHub, hubSearch]);

  // Sub-dialog: Add/Edit Lab in Hub
  const [isHubLabModalOpen, setIsHubLabModalOpen] = useState(false);
  const [editingHubLabIndex, setEditingHubLabIndex] = useState<number | null>(null);
  const [hubLabNameAr, setHubLabNameAr] = useState("");
  const [hubLabNameEn, setHubLabNameEn] = useState("");
  const [hubLabDescAr, setHubLabDescAr] = useState("");
  const [hubLabDescEn, setHubLabDescEn] = useState("");

  const handleOpenHub = (faculty: any) => {
    setSelectedFacultyForHub(faculty);
    setHubTab("departments");
    setHubSearch("");
    setIsHubOpen(true);
  };

  const handleOpenAddProgram = () => {
    setProgNameAr("");
    setProgNameEn("");
    setProgSlug("");
    setProgDuration(5);
    setProgCreditHours(160);
    setProgHeadId("none");
    setIsAddProgramOpen(true);
  };

  const handleCreateProgramInHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacultyForHub) {
      toast.error(isArabic ? "لم يتم تحديد الكلية" : "No faculty selected");
      return;
    }

    const trimmedProgNameAr = progNameAr.trim();
    const trimmedProgNameEn = progNameEn.trim();

    if (!trimmedProgNameAr) {
      toast.error(isArabic ? "يرجى إدخال اسم القسم بالعربية" : "Please enter the Arabic department name");
      return;
    }

    if (!trimmedProgNameEn) {
      toast.error(isArabic ? "يرجى إدخال اسم القسم بالإنجليزية" : "Please enter the English department name");
      return;
    }

    if (!progDuration || progDuration < 1 || progDuration > 7) {
      toast.error(isArabic ? "مدة الدراسة يجب أن تكون بين 1 و 7 سنوات" : "Study duration must be between 1 and 7 years");
      return;
    }

    if (!progCreditHours || progCreditHours <= 0) {
      toast.error(isArabic ? "الساعات المعتمدة يجب أن تكون أكبر من الصفر" : "Credit hours must be greater than zero");
      return;
    }

    const cleanSlug =
      progSlug.trim().replace(/^\/+|\/+$/g, "").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") ||
      trimmedProgNameEn.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") ||
      `dept-${Date.now()}`;

    try {
      await createProgramMutation.mutateAsync({
        faculty: selectedFacultyForHub.id,
        nameAr: trimmedProgNameAr,
        nameEn: trimmedProgNameEn,
        slug: cleanSlug,
        descriptionAr: `قسم ${trimmedProgNameAr} في ${selectedFacultyForHub.nameAr}`,
        descriptionEn: `Department of ${trimmedProgNameEn}`,
        duration: progDuration,
        creditHours: progCreditHours,
        head: progHeadId !== "none" ? Number(progHeadId) : null,
        branch: "both" as any,
        minScorePercent: 60,
        minScorePoints: 120,
        tuitionSyrian: 2500000,
        tuitionNonResident: 1500,
      });

      toast.success(isArabic ? "تمت إضافة القسم إلى الكلية بنجاح" : "Department added to faculty successfully");
      setIsAddProgramOpen(false);
    } catch (error: any) {
      const data = error?.body || error?.response?.data;
      let errorMsg = isArabic ? "حدث خطأ أثناء إضافة القسم" : "Failed to add department";
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

  const handleDeleteProgramInHub = async (programId: number) => {
    try {
      await deleteProgramMutation.mutateAsync(programId);
      toast.success(isArabic ? "تم حذف القسم بنجاح" : "Department deleted successfully");
    } catch (error) {
      toast.error(isArabic ? "حدث خطأ أثناء حذف القسم" : "Failed to delete department");
    }
  };

  const handleReassignTeacher = async (teacherId: number, deptIdVal: string) => {
    if (!selectedFacultyForHub) return;
    try {
      const deptId = deptIdVal === "none" ? null : Number(deptIdVal);
      await updateMemberMutation.mutateAsync({
        id: teacherId,
        data: {
          department: deptId as any,
          faculty: selectedFacultyForHub.id,
        },
      });
      toast.success(isArabic ? "تم تحديث تعيين المدرس والقسم بنجاح!" : "Teacher department updated!");
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء تغيير قسم المدرس" : "Failed to update teacher department");
    }
  };

  const handleReassignStudent = async (studentId: number, programIdVal: string) => {
    if (!selectedFacultyForHub) return;
    try {
      const progId = Number(programIdVal);
      await updateStudentMutation.mutateAsync({
        id: studentId,
        data: {
          program: progId,
        },
      });
      toast.success(isArabic ? "تم نقل الطالب إلى القسم المختار بنجاح!" : "Student program updated!");
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء نقل الطالب" : "Failed to update student program");
    }
  };

  const handleOpenAddHubLab = () => {
    setEditingHubLabIndex(null);
    setHubLabNameAr("");
    setHubLabNameEn("");
    setHubLabDescAr("");
    setHubLabDescEn("");
    setIsHubLabModalOpen(true);
  };

  const handleOpenEditHubLab = (index: number, lab: FacultyFacility) => {
    setEditingHubLabIndex(index);
    setHubLabNameAr(lab.nameAr || "");
    setHubLabNameEn(lab.nameEn || "");
    setHubLabDescAr(lab.descriptionAr || "");
    setHubLabDescEn(lab.descriptionEn || "");
    setIsHubLabModalOpen(true);
  };

  const handleSaveHubLab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacultyForHub) return;

    const trimmedAr = hubLabNameAr.trim();
    const trimmedEn = hubLabNameEn.trim();

    if (!trimmedAr) {
      toast.error(isArabic ? "يرجى إدخال اسم المخبر بالعربية" : "Please enter the Arabic lab name");
      return;
    }

    const currentLabs: FacultyFacility[] = [...(selectedFacultyForHub.facilities || [])];
    const labItem: FacultyFacility = {
      nameAr: trimmedAr,
      nameEn: trimmedEn || trimmedAr,
      descriptionAr: hubLabDescAr.trim(),
      descriptionEn: hubLabDescEn.trim(),
    };

    let updatedLabs: FacultyFacility[];
    if (editingHubLabIndex !== null && editingHubLabIndex >= 0) {
      updatedLabs = currentLabs.map((l, idx) => (idx === editingHubLabIndex ? labItem : l));
    } else {
      updatedLabs = [...currentLabs, labItem];
    }

    try {
      await updateMutation.mutateAsync({
        id: selectedFacultyForHub.id,
        facilities: updatedLabs,
        labsCount: updatedLabs.length,
      });

      setSelectedFacultyForHub({
        ...selectedFacultyForHub,
        facilities: updatedLabs,
        labsCount: updatedLabs.length,
      });

      setIsHubLabModalOpen(false);
      toast.success(
        editingHubLabIndex !== null
          ? (isArabic ? "تم تحديث بيانات المخبر بنجاح!" : "Laboratory updated successfully!")
          : (isArabic ? "تمت إضافة المخبر للكلية بنجاح!" : "Laboratory added successfully!")
      );
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء حفظ بيانات المخبر" : "Failed to save laboratory");
    }
  };

  const handleDeleteHubLab = async (index: number) => {
    if (!selectedFacultyForHub) return;
    const currentLabs: FacultyFacility[] = [...(selectedFacultyForHub.facilities || [])];
    const updatedLabs = currentLabs.filter((_, idx) => idx !== index);

    try {
      await updateMutation.mutateAsync({
        id: selectedFacultyForHub.id,
        facilities: updatedLabs,
        labsCount: updatedLabs.length,
      });

      setSelectedFacultyForHub({
        ...selectedFacultyForHub,
        facilities: updatedLabs,
        labsCount: updatedLabs.length,
      });

      toast.success(isArabic ? "تم حذف المخبر بنجاح!" : "Laboratory deleted successfully!");
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء حذف المخبر" : "Failed to delete laboratory");
    }
  };

  // Dialog State
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState<any>(null);

  // Form Fields - Tab 1: General & Branding
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [mottoAr, setMottoAr] = useState("");
  const [mottoEn, setMottoEn] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#800000");
  const [accentColor, setAccentColor] = useState("#D4AF37");
  const [heroBanner, setHeroBanner] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // Form Fields - Tab 2: Dean & Leadership
  const [deanId, setDeanId] = useState<string>("none");
  const [deanNameAr, setDeanNameAr] = useState("");
  const [deanNameEn, setDeanNameEn] = useState("");
  const [deanMessageAr, setDeanMessageAr] = useState("");
  const [deanMessageEn, setDeanMessageEn] = useState("");
  const [deanPhoto, setDeanPhoto] = useState("");

  // Form Fields - Tab 3: Key Stats
  const [establishedYear, setEstablishedYear] = useState<number>(2005);
  const [studentsCount, setStudentsCount] = useState<number>(1200);
  const [labsCount, setLabsCount] = useState<number>(12);
  const [researchPapersCount, setResearchPapersCount] = useState<number>(250);
  const [employmentRate, setEmploymentRate] = useState<number>(92);

  // Form Fields - Tab 4: Labs & Downloads
  const [facilities, setFacilities] = useState<FacultyFacility[]>([]);
  const [guideDocumentUrl, setGuideDocumentUrl] = useState("");

  // Form Fields - Tab 5: Page Builder & Layout
  const [headerStyle, setHeaderStyle] = useState<"hero_split" | "hero_full" | "minimal">("hero_split");
  const [sectionsOrder, setSectionsOrder] = useState<string[]>([
    "stats",
    "dean",
    "programs",
    "news",
    "events",
    "facilities",
    "staff",
    "top_students",
    "alumni_stories",
  ]);
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>({
    stats: true,
    dean: true,
    programs: true,
    news: true,
    events: true,
    facilities: true,
    staff: true,
    top_students: true,
    alumni_stories: true,
  });
  const [sectionsConfig, setSectionsConfig] = useState<Record<string, FacultySectionConfig>>({});
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

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

  // Image Upload Handlers (Logo <= 2MB, Banner <= 4MB)
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
        toast.success(isArabic ? "تم تحميل شعار الكلية بنجاح!" : "Faculty logo uploaded!");
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

  // Temporary state for adding a lab
  const [newLabNameAr, setNewLabNameAr] = useState("");
  const [newLabNameEn, setNewLabNameEn] = useState("");
  const [newLabDescAr, setNewLabDescAr] = useState("");

  const updateMutation = useUpdateFaculty(currentFaculty?.id || 0);

  const handleOpenDialog = (faculty: any = null) => {
    setCurrentFaculty(faculty);
    if (faculty) {
      setNameAr(faculty.nameAr || "");
      setNameEn(faculty.nameEn || "");
      setSlug(faculty.slug || "");
      setDescriptionAr(faculty.descriptionAr || "");
      setDescriptionEn(faculty.descriptionEn || "");
      setMottoAr(faculty.mottoAr || "الصرح الأكاديمي والبحثي الرائد");
      setMottoEn(faculty.mottoEn || "Pioneering Academic & Research Excellence");
      setPrimaryColor(faculty.primaryColor || "#800000");
      setAccentColor(faculty.accentColor || "#D4AF37");
      setHeroBanner(faculty.heroBanner || "");
      setLogoUrl(faculty.logoUrl || "");

      setDeanId(faculty.dean ? faculty.dean.toString() : "none");
      setDeanNameAr(faculty.deanNameAr || "");
      setDeanNameEn(faculty.deanNameEn || "");
      setDeanMessageAr(faculty.deanMessageAr || "");
      setDeanMessageEn(faculty.deanMessageEn || "");
      setDeanPhoto(faculty.deanPhoto || "");

      setEstablishedYear(faculty.establishedYear || 2005);
      setStudentsCount(faculty.studentsCount || 1200);
      setLabsCount(faculty.labsCount || 12);
      setResearchPapersCount(faculty.researchPapersCount || 250);
      setEmploymentRate(faculty.employmentRate || 92);

      setFacilities(faculty.facilities || []);
      setGuideDocumentUrl(faculty.guideDocumentUrl || "");

      const layout = faculty.layoutConfig || {};
      setHeaderStyle(layout.headerStyle || "hero_split");
      setSectionsOrder(
        layout.sectionsOrder && layout.sectionsOrder.length > 0
          ? layout.sectionsOrder
          : [
            "stats",
            "dean",
            "programs",
            "news",
            "events",
            "facilities",
            "staff",
            "top_students",
            "alumni_stories",
          ]
      );
      setEnabledSections({
        stats: layout.showQuickStats ?? true,
        dean: layout.showDeanMessage ?? true,
        programs: layout.showPrograms ?? true,
        news: layout.showNews ?? true,
        events: layout.showEvents ?? true,
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
      setDescriptionAr("");
      setDescriptionEn("");
      setMottoAr("الصرح الأكاديمي والبحثي الرائد");
      setMottoEn("Pioneering Academic & Research Excellence");
      setPrimaryColor("#800000");
      setAccentColor("#D4AF37");
      setHeroBanner("");
      setLogoUrl("");

      setDeanId("none");
      setDeanNameAr("");
      setDeanNameEn("");
      setDeanMessageAr("");
      setDeanMessageEn("");
      setDeanPhoto("");

      setEstablishedYear(2005);
      setStudentsCount(1200);
      setLabsCount(12);
      setResearchPapersCount(250);
      setEmploymentRate(92);

      setFacilities([]);
      setGuideDocumentUrl("");

      setHeaderStyle("hero_split");
      setSectionsOrder([
        "stats",
        "dean",
        "programs",
        "news",
        "events",
        "facilities",
        "staff",
        "top_students",
        "alumni_stories",
      ]);
      setEnabledSections({
        stats: true,
        dean: true,
        programs: true,
        news: true,
        events: true,
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

  const handleAddFacility = () => {
    const trimmedLabNameAr = newLabNameAr.trim();
    const trimmedLabNameEn = newLabNameEn.trim();
    if (!trimmedLabNameAr) {
      toast.error(isArabic ? "يرجى إدخال اسم المختبر بالعربية" : "Please enter the Arabic lab name");
      return;
    }
    const item: FacultyFacility = {
      nameAr: trimmedLabNameAr,
      nameEn: trimmedLabNameEn || trimmedLabNameAr,
      descriptionAr: newLabDescAr.trim(),
    };
    setFacilities([...facilities, item]);
    setNewLabNameAr("");
    setNewLabNameEn("");
    setNewLabDescAr("");
    toast.success(isArabic ? "تمت إضافة المختبر إلى القائمة" : "Lab added to list");
  };

  const handleRemoveFacility = (index: number) => {
    setFacilities(facilities.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNameAr = nameAr.trim();
    const trimmedNameEn = nameEn.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedNameAr) {
      toast.error(isArabic ? "يرجى إدخال اسم الكلية بالعربية" : "Please enter the Arabic faculty name");
      return;
    }

    if (!trimmedNameEn) {
      toast.error(isArabic ? "يرجى إدخال اسم الكلية بالإنجليزية" : "Please enter the English faculty name");
      return;
    }

    if (!trimmedSlug) {
      toast.error(isArabic ? "يرجى إدخال الرابط المختصر للكلية" : "Please enter the faculty slug");
      return;
    }

    if (establishedYear < 1900 || establishedYear > 2100) {
      toast.error(isArabic ? "يرجى إدخال سنة تأسيس صحيحة بين 1900 و 2100" : "Please enter a valid established year between 1900 and 2100");
      return;
    }

    if (studentsCount < 0) {
      toast.error(isArabic ? "عدد الطلاب لا يمكن أن يكون سالباً" : "Students count cannot be negative");
      return;
    }

    if (labsCount < 0) {
      toast.error(isArabic ? "عدد المختبرات لا يمكن أن يكون سالباً" : "Labs count cannot be negative");
      return;
    }

    if (researchPapersCount < 0) {
      toast.error(isArabic ? "عدد الأبحاث لا يمكن أن يكون سالباً" : "Research papers count cannot be negative");
      return;
    }

    if (employmentRate < 0 || employmentRate > 100) {
      toast.error(isArabic ? "نسبة التوظيف يجب أن تكون بين 0 و 100" : "Employment rate must be between 0 and 100");
      return;
    }

    const cleanSlug =
      trimmedSlug.replace(/^\/+|\/+$/g, "").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") ||
      trimmedNameEn.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9_-]+/g, "").replace(/^-+|-+$/g, "") ||
      `faculty-${Date.now()}`;

    const selectedDean = deanId !== "none" ? Number(deanId) : null;

    const payload: any = {
      nameAr: trimmedNameAr,
      nameEn: trimmedNameEn,
      slug: cleanSlug,
      descriptionAr: descriptionAr.trim() || `كلية ${trimmedNameAr}`,
      descriptionEn: descriptionEn.trim() || `Faculty of ${trimmedNameEn}`,
      mottoAr: mottoAr.trim(),
      mottoEn: mottoEn.trim(),
      primaryColor,
      accentColor,
      heroBanner,
      logoUrl,
      dean: selectedDean,
      deanNameAr: deanNameAr.trim(),
      deanNameEn: deanNameEn.trim(),
      deanMessageAr: deanMessageAr.trim(),
      deanMessageEn: deanMessageEn.trim(),
      deanPhoto: deanPhoto.trim(),
      establishedYear,
      studentsCount,
      labsCount: facilities.length > 0 ? facilities.length : labsCount,
      researchPapersCount,
      employmentRate,
      facilities,
      guideDocumentUrl: guideDocumentUrl.trim(),
      layoutConfig: {
        headerStyle,
        sectionsOrder,
        showQuickStats: enabledSections.stats ?? true,
        showDeanMessage: enabledSections.dean ?? true,
        showPrograms: enabledSections.programs ?? true,
        showNews: enabledSections.news ?? true,
        showEvents: enabledSections.events ?? true,
        showFacilities: enabledSections.facilities ?? true,
        showStaff: enabledSections.staff ?? true,
        showTopStudents: enabledSections.top_students ?? true,
        showAlumniStories: enabledSections.alumni_stories ?? true,
        sectionsConfig,
      },
    };

    try {
      if (currentFaculty) {
        await updateMutation.mutateAsync({ id: currentFaculty.id, ...payload });
        toast.success(isArabic ? "تم تحديث موقع وهوية الكلية بنجاح" : "Faculty microsite updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(isArabic ? "تم إنشاء الكلية وموقعها الفرعي بنجاح" : "Faculty microsite created successfully");
      }
      setIsOpen(false);
    } catch (error: any) {
      const data = error?.body || error?.response?.data;
      let errorMsg = isArabic ? "حدث خطأ أثناء حفظ بيانات الكلية" : "Failed to save faculty";
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
    if (!currentFaculty) return;
    try {
      await deleteMutation.mutateAsync(currentFaculty.id);
      toast.success(isArabic ? "تم حذف الكلية وموقعها الفرعي" : "Faculty microsite deleted");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(isArabic ? "حدث خطأ أثناء الحذف" : "Failed to delete faculty");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-start" dir={dir}>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            {isArabic ? "إدارة الكليات والمواقع الفرعية" : "Faculties & Microsites Management"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic
              ? "التحكم الشامل بكلية الجامعة، الهوية البصرية والمستندات، كلمة العميد، والمختبرات الأكاديمية."
              : "Full control over faculty branding, Dean's office, research labs, and dedicated microsites."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle: Cards / List */}
          <div className="flex items-center bg-muted/50 p-1 rounded-xl border shrink-0">
            <Button
              type="button"
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-3 gap-1.5 text-xs font-bold rounded-lg"
              onClick={() => setViewMode("cards")}
              title={isArabic ? "عرض البطاقات" : "Card View"}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>{isArabic ? "بطاقات" : "Cards"}</span>
            </Button>
            <Button
              type="button"
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-3 gap-1.5 text-xs font-bold rounded-lg"
              onClick={() => setViewMode("list")}
              title={isArabic ? "عرض القائمة" : "List View"}
            >
              <List className="h-4 w-4" />
              <span>{isArabic ? "قائمة" : "List"}</span>
            </Button>
          </div>

          <Button className="font-bold flex gap-2 shadow-md min-w-44" onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4" />
            {isArabic ? "إضافة كلية جديدة" : "Add New Faculty"}
          </Button>
        </div>
      </div>

      {/* Grid of Faculties */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-bold">{isArabic ? "جاري تحميل الكليات..." : "Loading faculties..."}</p>
        </div>
      ) : displayFaculties.length === 0 ? (
        <Card className="border-none shadow-md py-12 text-center bg-gradient-to-b from-primary/5 via-background to-muted/20">
          <CardContent className="space-y-4 max-w-lg mx-auto">
            <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto text-primary">
              <Building2 className="h-12 w-12" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">
                {isArabic ? "مرحباً بك! الخطوة الأولى: ابدأ بإضافة كلية جديدة" : "Welcome! Step 1: Add Your First Faculty"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {isArabic
                  ? "الكليات هي الركيزة الأساسية للهيكل الأكاديمي للجامعة (مثل: كلية الهندسة، كلية طب الأسنان). يمكنك إضافة الكلية الآن مباشرة دون الحاجة لوجود مدرسين أو أقسام مسبقاً."
                  : "Faculties are the foundation of the academic structure. You can add a faculty directly without requiring prior staff or departments."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button onClick={() => handleOpenDialog()} className="font-bold gap-2 w-full sm:w-auto shadow-md">
                <Plus className="h-4 w-4" />
                {isArabic ? "إضافة أول كلية الآن" : "Add First Faculty Now"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayFaculties.map((faculty) => {
            const facultyMembersCount = displayMembers.filter((m) => m.faculty === faculty.id || m.facultySlug === faculty.slug).length;
            const themeColor = faculty.primaryColor || "#800000";
            const accentColor = faculty.accentColor || "#e0a800";

            return (
              <Card
                key={faculty.id}
                className="border border-border/70 hover:border-primary/40 bg-card rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group min-w-0 w-full"
              >
                <div className="min-w-0 w-full">
                  <CardHeader className="bg-muted/10 pb-3 relative p-5">
                    <div className="flex items-start justify-between gap-3 min-w-0">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105"
                          style={{
                            backgroundColor: hexToRgba(themeColor, 0.1),
                            color: themeColor,
                            borderColor: hexToRgba(themeColor, 0.25),
                          }}
                        >
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle
                            className="text-base sm:text-lg font-bold truncate group-hover:text-primary transition-colors cursor-pointer"
                            onClick={() => handleOpenHub(faculty)}
                            title={isArabic ? faculty.nameAr : faculty.nameEn}
                          >
                            {isArabic ? faculty.nameAr : faculty.nameEn}
                          </CardTitle>
                          <span className="text-[11px] text-muted-foreground font-mono truncate block">
                            /academics/{faculty.slug}
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
                            onClick={() => handleOpenHub(faculty)}
                          >
                            <Users className="h-4 w-4" />
                            {isArabic ? "إدارة الأقسام والكوادر والطلاب" : "Manage Depts, Staff & Students"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer font-bold"
                            onClick={() => handleOpenDialog(faculty)}
                          >
                            <Edit className="h-4 w-4" />
                            {isArabic ? "تعديل الكلية والموقع الفرعي" : "Edit Faculty & Microsite"}
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                            <Link href={`/academics/${faculty.slug}`} target="_blank">
                              <ExternalLink className="h-4 w-4 text-primary" />
                              {isArabic ? "معاينة الموقع الفرعي للكلية" : "Preview Public Microsite"}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="gap-2 text-destructive font-bold cursor-pointer"
                            onClick={() => {
                              setCurrentFaculty(faculty);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            {isArabic ? "حذف الكلية" : "Delete Faculty"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Color Swatches */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40 min-w-0 gap-2">
                      <span className="text-[11px] text-muted-foreground font-medium truncate">
                        {isArabic ? "الهوية البصرية للكلية" : "Visual Identity"}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="w-3 h-3 rounded-full border shadow-2xs inline-block shrink-0"
                          style={{ backgroundColor: themeColor }}
                          title={isArabic ? "اللون الأساسي" : "Primary"}
                        />
                        <span
                          className="w-3 h-3 rounded-full border shadow-2xs inline-block shrink-0"
                          style={{ backgroundColor: accentColor }}
                          title={isArabic ? "اللون الثانوي" : "Accent"}
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 pt-3 space-y-3.5 min-w-0">
                    {faculty.descriptionAr && (
                      <CardDescription className="line-clamp-2 text-xs font-medium leading-relaxed">
                        {isArabic ? faculty.descriptionAr : faculty.descriptionEn}
                      </CardDescription>
                    )}

                    {/* Motto Badge */}
                    {faculty.mottoAr && (
                      <div
                        className="p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 min-w-0 overflow-hidden"
                        style={{
                          backgroundColor: hexToRgba(accentColor, 0.08),
                          borderColor: hexToRgba(accentColor, 0.22),
                          color: accentColor,
                        }}
                      >
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{isArabic ? faculty.mottoAr : faculty.mottoEn}</span>
                      </div>
                    )}

                    {/* Dean Badge */}
                    <div className="p-2.5 border rounded-xl bg-amber-500/5 border-amber-500/20 flex items-center justify-between min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                          <Crown className="h-4 w-4 text-amber-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] uppercase font-bold text-amber-700 truncate">
                            {isArabic ? "عمادة الكلية" : "Faculty Dean"}
                          </p>
                          <p className="text-xs font-bold text-foreground truncate">
                            {faculty.deanDetail
                              ? (isArabic ? faculty.deanDetail.nameAr : faculty.deanDetail.nameEn)
                              : (faculty.deanNameAr || (isArabic ? "لم يتم تعيين عميد بعد" : "No Dean Appointed"))}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold pt-1 min-w-0">
                      <div className="p-2 rounded-xl bg-muted/40 border border-border/40 min-w-0 overflow-hidden">
                        <span className="text-muted-foreground block text-[10px] mb-0.5 truncate">
                          {isArabic ? "الأقسام" : "Depts"}
                        </span>
                        <span className="text-sm font-bold text-primary truncate block">
                          {faculty.totalPrograms ?? displayPrograms.filter((p) => p.faculty === faculty.id).length}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-muted/40 border border-border/40 min-w-0 overflow-hidden">
                        <span className="text-muted-foreground block text-[10px] mb-0.5 truncate">
                          {isArabic ? "المدرسين" : "Teachers"}
                        </span>
                        <span className="text-sm font-bold text-primary truncate block">
                          {faculty.totalTeachers ?? displayMembers.filter((m: any) => m.faculty === faculty.id || m.departmentDetail?.faculty === faculty.id).length}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-muted/40 border border-border/40 min-w-0 overflow-hidden">
                        <span className="text-muted-foreground block text-[10px] mb-0.5 truncate">
                          {isArabic ? "الطلاب" : "Students"}
                        </span>
                        <span className="text-sm font-bold text-primary truncate block">
                          {faculty.totalStudents ?? displayStudents.filter((s: any) => s.faculty === faculty.id || s.programDetail?.faculty === faculty.id).length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card className="border border-border/70 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="text-start font-bold">{isArabic ? "الكلية" : "Faculty"}</TableHead>
                    <TableHead className="text-start font-bold">{isArabic ? "عميد الكلية" : "Faculty Dean"}</TableHead>
                    <TableHead className="text-start font-bold">{isArabic ? "الهوية البصرية" : "Branding"}</TableHead>
                    <TableHead className="text-start font-bold">{isArabic ? "الإحصائيات" : "Statistics"}</TableHead>
                    <TableHead className="text-end font-bold px-6">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayFaculties.map((faculty) => {
                    const themeColor = faculty.primaryColor || "#800000";
                    const accentColor = faculty.accentColor || "#e0a800";
                    const deanName = faculty.deanDetail
                      ? (isArabic ? faculty.deanDetail.nameAr : faculty.deanDetail.nameEn)
                      : (faculty.deanNameAr || (isArabic ? "لم يعين بعد" : "No Dean"));
                    const totalProgs = faculty.totalPrograms ?? displayPrograms.filter((p) => p.faculty === faculty.id).length;
                    const totalTeach = faculty.totalTeachers ?? displayMembers.filter((m: any) => m.faculty === faculty.id || m.departmentDetail?.faculty === faculty.id).length;
                    const totalStuds = faculty.totalStudents ?? displayStudents.filter((s: any) => s.faculty === faculty.id || s.programDetail?.faculty === faculty.id).length;

                    return (
                      <TableRow key={faculty.id} className="hover:bg-muted/30 transition-colors">
                        {/* Faculty Info */}
                        <TableCell className="text-start">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                              style={{
                                backgroundColor: hexToRgba(themeColor, 0.1),
                                color: themeColor,
                                borderColor: hexToRgba(themeColor, 0.25),
                              }}
                            >
                              <Building2 className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                              <span
                                className="font-bold text-sm cursor-pointer hover:text-primary transition-colors"
                                onClick={() => handleOpenHub(faculty)}
                              >
                                {isArabic ? faculty.nameAr : faculty.nameEn}
                              </span>
                              {faculty.mottoAr && (
                                <span className="text-[11px] text-muted-foreground line-clamp-1">
                                  {isArabic ? faculty.mottoAr : faculty.mottoEn}
                                </span>
                              )}
                              <span className="text-[10px] text-muted-foreground font-mono">
                                /academics/{faculty.slug}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Dean */}
                        <TableCell className="text-start">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                              <Crown className="h-3.5 w-3.5 text-amber-600" />
                            </div>
                            <span className="text-xs font-bold">{deanName}</span>
                          </div>
                        </TableCell>

                        {/* Branding */}
                        <TableCell className="text-start">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-4 h-4 rounded-full border shadow-2xs inline-block"
                              style={{ backgroundColor: themeColor }}
                              title={isArabic ? "اللون الأساسي" : "Primary"}
                            />
                            <span
                              className="w-4 h-4 rounded-full border shadow-2xs inline-block"
                              style={{ backgroundColor: accentColor }}
                              title={isArabic ? "اللون الثانوي" : "Accent"}
                            />
                          </div>
                        </TableCell>

                        {/* Statistics */}
                        <TableCell className="text-xs text-muted-foreground text-start">
                          <div className="flex items-center gap-2 font-medium">
                            <Badge variant="secondary" className="text-[11px] bg-muted/60 font-semibold">
                              {totalProgs} {isArabic ? "أقسام" : "depts"}
                            </Badge>
                            <span>•</span>
                            <span>{totalTeach} {isArabic ? "مدرس" : "teachers"}</span>
                            <span>•</span>
                            <span>{totalStuds} {isArabic ? "طالب" : "students"}</span>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-center px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenHub(faculty)}
                              className="gap-1.5 text-xs font-bold hover:bg-primary/10 hover:text-primary transition-all border-primary/20 shrink-0"
                            >
                              <Users className="h-3.5 w-3.5 text-primary" />
                              <span>{isArabic ? "إدارة الكوادر والأقسام" : "Manage Hub"}</span>
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="gap-2 cursor-pointer font-bold"
                                  onClick={() => handleOpenDialog(faculty)}
                                >
                                  <Edit className="h-4 w-4" />
                                  {isArabic ? "تعديل الكلية والموقع الفرعي" : "Edit Faculty"}
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                                  <Link href={`/academics/${faculty.slug}`} target="_blank">
                                    <ExternalLink className="h-4 w-4 text-primary" />
                                    {isArabic ? "معاينة الموقع الفرعي" : "Preview Microsite"}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="gap-2 text-destructive font-bold cursor-pointer"
                                  onClick={() => {
                                    setCurrentFaculty(faculty);
                                    setIsDeleteOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  {isArabic ? "حذف الكلية" : "Delete Faculty"}
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
          </CardContent>
        </Card>
      )}

      {/* Add / Edit Faculty Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[850px] w-[95vw]">
          <DialogHeader className="p-6 pb-4 border-b bg-muted/30">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              {currentFaculty
                ? (isArabic ? "تعديل الكلية وتخصيص الموقع الفرعي" : "Edit Faculty & Customize Microsite")
                : (isArabic ? "إضافة كلية وموقع فرعي جديد" : "Add New Faculty Microsite")}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? "تخصيص الهوية البصرية، كلمة العميد، الإحصائيات الأكاديمية والمختبرات للكلية."
                : "Configure visual branding, Dean message, academic statistics, & research labs."}
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
                    {isArabic ? "عمادة الكلية" : "Dean's Office"}
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="gap-1.5 text-xs font-bold">
                    <Award className="h-3.5 w-3.5" />
                    {isArabic ? "الإحصائيات" : "Key Stats"}
                  </TabsTrigger>
                  <TabsTrigger value="labs" className="gap-1.5 text-xs font-bold">
                    <FlaskConical className="h-3.5 w-3.5" />
                    {isArabic ? "المختبرات" : "Labs & Files"}
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Visual Identity & Basic Info */}
                <TabsContent value="branding" className="space-y-5">
                  {/* Color Palette Dropdown */}
                  <div className="space-y-2 p-3.5 bg-muted/20 border rounded-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <Label className="text-xs font-bold flex items-center gap-1.5">
                        <Palette className="h-4 w-4 text-primary" />
                        <span>{isArabic ? "قالب الألوان" : "Color Theme"}</span>
                      </Label>
                      <span className="text-[11px] text-muted-foreground">
                        {isArabic ? "اختر قالباً لونياً متناسقاً أو خصص الألوان أدناه" : "Select a harmonious palette or customize below"}
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
                        <SelectValue placeholder={isArabic ? "اختر قالباً لونياً متناسقاً" : "Select a balanced color palette"} />
                      </SelectTrigger>
                      <SelectContent>
                        {COLOR_PALETTES.map((palette) => (
                          <SelectItem key={palette.id} value={palette.id}>
                            <div className="flex items-center justify-between w-full min-w-[280px] gap-4">
                              <span className="font-medium text-xs">{isArabic ? palette.nameAr : palette.nameEn}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="w-4 h-4 rounded-full border shadow-xs inline-block" style={{ backgroundColor: palette.primary }} />
                                <span className="w-4 h-4 rounded-full border shadow-xs inline-block" style={{ backgroundColor: palette.accent }} />
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="f-nameAr">{isArabic ? "اسم الكلية بالعربية" : "Arabic Faculty Name"}</Label>
                      <Input
                        id="f-nameAr"
                        value={nameAr}
                        onChange={(e) => setNameAr(e.target.value)}
                        required
                        placeholder={isArabic ? "مثال: كلية الهندسة" : "e.g. Faculty of Engineering"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f-nameEn">{isArabic ? "اسم الكلية بالإنجليزية" : "English Faculty Name"}</Label>
                      <Input
                        id="f-nameEn"
                        value={nameEn}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNameEn(val);
                          if (!currentFaculty && (!slug || slug === nameEn.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, ""))) {
                            setSlug(val.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, ""));
                          }
                        }}
                        placeholder={isArabic ? "مثال: Faculty of Engineering" : "e.g. Faculty of Engineering"}
                      />
                    </div>
                  </div>

                  {/* Slug and Color Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                    <div className="sm:col-span-6 space-y-2">
                      <Label htmlFor="f-slug" className="flex items-center gap-1.5">
                        <span>{isArabic ? "الرابط المختصر" : "Faculty Slug"}</span>
                      </Label>
                      <Input
                        id="f-slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                        required
                        dir="ltr"
                        placeholder={isArabic ? "مثال: engineering" : "e.g. engineering"}
                      />
                    </div>

                    <div className="sm:col-span-3 space-y-2">
                      <Label htmlFor="f-primaryColor">{isArabic ? "اللون الرئيسي" : "Primary Color"}</Label>
                      <div className="flex gap-2">
                        <Input id="f-primaryColor" type="color" className="w-12 h-10 p-1 cursor-pointer shrink-0" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                        <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#800000" className="font-mono text-xs" />
                      </div>
                    </div>

                    <div className="sm:col-span-3 space-y-2">
                      <Label htmlFor="f-accentColor">{isArabic ? "لون التمييز الثانوي" : "Accent Color"}</Label>
                      <div className="flex gap-2">
                        <Input id="f-accentColor" type="color" className="w-12 h-10 p-1 cursor-pointer shrink-0" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                        <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} placeholder="#D4AF37" className="font-mono text-xs" />
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
                          <span>{isArabic ? "شعار الكلية" : "Faculty Emblem"}</span>
                        </Label>
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          {isArabic ? "الحد الأقصى: 2 ميغابايت" : "Max 2MB"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          id="f-logoUploadInput"
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
                          onClick={() => document.getElementById("f-logoUploadInput")?.click()}
                        >
                          <Upload className="h-3.5 w-3.5" />
                          {isArabic ? "رفع الشعار من جهازك" : "Upload Logo File"}
                        </Button>

                        {logoUrl && (
                          <div className="relative group w-12 h-12 rounded-xl border bg-background p-1 shadow-xs flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                            <button
                              type="button"
                              onClick={() => setLogoUrl("")}
                              className="absolute -top-1.5 -end-1.5 bg-destructive text-white rounded-full p-0.5 shadow-sm hover:opacity-90"
                              title={isArabic ? "إزالة الشعار" : "Remove"}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      <Input
                        id="f-logoUrl"
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
                          <span>{isArabic ? "صورة البانر الرئيسية" : "Hero Banner Image"}</span>
                        </Label>
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          {isArabic ? "الحد الأقصى: 4 ميغابايت" : "Max 4MB"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          id="f-bannerUploadInput"
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
                          onClick={() => document.getElementById("f-bannerUploadInput")?.click()}
                        >
                          <Upload className="h-3.5 w-3.5" />
                          {isArabic ? "رفع صورة البانر" : "Upload Banner File"}
                        </Button>

                        {heroBanner && (
                          <div className="relative group w-20 h-10 rounded-lg border bg-background overflow-hidden shadow-xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={heroBanner} alt="Banner" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setHeroBanner("")}
                              className="absolute top-1 end-1 bg-destructive text-white rounded-full p-0.5 shadow-sm hover:opacity-90"
                              title={isArabic ? "إزالة البانر" : "Remove"}
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <Input
                        id="f-heroBanner"
                        value={heroBanner}
                        onChange={(e) => setHeroBanner(e.target.value)}
                        placeholder={isArabic ? "أو أدخل رابط صورة البانر مباشرة..." : "Or paste image link..."}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="f-mottoAr">{isArabic ? "شعار الكلية بالعربية" : "Arabic Faculty Motto"}</Label>
                      <Input
                        id="f-mottoAr"
                        value={mottoAr}
                        onChange={(e) => setMottoAr(e.target.value)}
                        placeholder={isArabic ? "مثال: روّاد التكنولوجيا والابتكار الهندسي" : "e.g. Pioneering Engineering Innovation"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f-mottoEn">{isArabic ? "شعار الكلية بالإنجليزية" : "English Faculty Motto"}</Label>
                      <Input
                        id="f-mottoEn"
                        value={mottoEn}
                        onChange={(e) => setMottoEn(e.target.value)}
                        placeholder={isArabic ? "مثال: Pioneering Engineering Innovation" : "e.g. Pioneering Engineering Innovation"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="f-descAr">{isArabic ? "نبذة عن الكلية بالعربية" : "Arabic Faculty Description"}</Label>
                      <Textarea
                        id="f-descAr"
                        value={descriptionAr}
                        onChange={(e) => setDescriptionAr(e.target.value)}
                        rows={3}
                        placeholder={isArabic ? "نبذة عامة وشاملة عن الكلية وتخصصاتها الأكاديمية والمخبرية..." : "Comprehensive overview of the faculty..."}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f-descEn">{isArabic ? "نبذة عن الكلية بالإنجليزية" : "English Faculty Description"}</Label>
                      <Textarea
                        id="f-descEn"
                        value={descriptionEn}
                        onChange={(e) => setDescriptionEn(e.target.value)}
                        rows={3}
                        placeholder={isArabic ? "نبذة عامة وشاملة عن الكلية بالإنجليزية..." : "Comprehensive overview of the faculty in English..."}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2: Page Builder & Modular Sections */}
                <TabsContent value="builder" className="space-y-6">
                  {/* Header Style Picker */}
                  <div className="space-y-3">
                    <Label className="text-sm font-bold flex items-center gap-2">
                      <LayoutTemplate className="h-4 w-4 text-primary" />
                      <span>{isArabic ? "نمط ترويسة الصفحة" : "Header Layout Style"}</span>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: "hero_split",
                          nameAr: "عصري مقسوم",
                          nameEn: "Modern Split",
                          descAr: "هيدر بانورامي مع معلومات الكلية والشعار وأزرار تفاعلية",
                          descEn: "Emblem, overview and action buttons side by side",
                        },
                        {
                          id: "hero_full",
                          nameAr: "بانورامي عريض",
                          nameEn: "Cinematic Full",
                          descAr: "صورة بانورامية تغطي الهيدر مع تدرج لوني يعكس ثيم الكلية",
                          descEn: "Full width banner with branded color overlay",
                        },
                        {
                          id: "minimal",
                          nameAr: "هادئ ومركّز",
                          nameEn: "Clean Minimal",
                          descAr: "ترويسة بسيطة خفيفة تركز على العناوين والمسارات",
                          descEn: "Compact and clean header focused on content",
                        },
                      ].map((style) => (
                        <div
                          key={style.id}
                          onClick={() => setHeaderStyle(style.id as any)}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${headerStyle === style.id
                            ? "border-primary bg-primary/5 shadow-xs"
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

                  {/* Sections Manager / Drag & Drop Reordering */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-bold flex items-center gap-2">
                          <Layers className="h-4 w-4 text-primary" />
                          <span>{isArabic ? "ترتيب أقسام وتخطيط صفحة الكلية" : "Page Sections Flow & Visibility"}</span>
                        </Label>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {isArabic
                            ? "استخدم الأسهم لإعادة ترتيب ظهور الأقسام في الصفحة، وفعّل أو عطّل ظهور أي قسم حسب رغبتك."
                            : "Use arrows to reorder sections and toggle buttons to show or hide blocks on the live page."}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {sectionsOrder.filter((id) => enabledSections[id]).length} / {sectionsOrder.length} {isArabic ? "مفعّل" : "Active"}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {sectionsOrder.map((sectionId, idx) => {
                        const item = DEFAULT_SECTIONS_LIST.find((s) => s.id === sectionId) || {
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
                            className={`rounded-2xl border transition-all overflow-hidden ${isEnabled ? "bg-background border-border shadow-xs" : "bg-muted/30 border-muted opacity-70"
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
                                            ? isArabic ? "تدرج الكلية" : "tint"
                                            : isArabic ? "لون الكلية البارز" : "solid"}
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
                                        {isArabic ? "العنوان الرئيسي بالعربية" : "Arabic Section Title"}
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
                                        {isArabic ? "العنوان الرئيسي بالإنجليزية" : "English Section Title"}
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
                                        {isArabic ? "النص الفرعي بالعربية" : "Arabic Section Subtitle"}
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
                                        {isArabic ? "النص الفرعي بالإنجليزية" : "English Section Subtitle"}
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
                                      <span>{isArabic ? "نمط العرض والتخطيط" : "Layout Variant"}</span>
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {item.supportedLayouts.map((l) => {
                                        const isCurrent = (secConf.layoutVariant || item.supportedLayouts[0].id) === l.id;
                                        return (
                                          <button
                                            type="button"
                                            key={l.id}
                                            onClick={() => updateSectionConfig(sectionId, { layoutVariant: l.id })}
                                            className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${isCurrent
                                              ? "border-primary bg-primary text-primary-foreground shadow-xs"
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
                                      <span>{isArabic ? "خلفية القسم" : "Section Background"}</span>
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {[
                                        { id: "default", nameAr: "افتراضي نظيف", nameEn: "Clean Default" },
                                        { id: "muted", nameAr: "رمادي هادئ", nameEn: "Muted Slate" },
                                        { id: "tint", nameAr: "تدرج هوية الكلية", nameEn: "Faculty Tint" },
                                        { id: "solid", nameAr: "لون الكلية البارز", nameEn: "Solid Branded" },
                                      ].map((b) => {
                                        const isCurrent = (secConf.bgStyle || "default") === b.id;
                                        return (
                                          <button
                                            type="button"
                                            key={b.id}
                                            onClick={() => updateSectionConfig(sectionId, { bgStyle: b.id as any })}
                                            className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${isCurrent
                                              ? "border-primary bg-primary text-primary-foreground shadow-xs"
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
                                        {item.defaultLimit || 6}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {[3, 4, 6, 8, 12, 0].map((num) => {
                                        const currentLimit = secConf.itemLimit !== undefined ? secConf.itemLimit : item.defaultLimit;
                                        const isCurrent = currentLimit === num;
                                        const labelText = num === 0 ? (isArabic ? "الكل بدون حد" : "All Items") : `${num}`;
                                        return (
                                          <Button
                                            key={num}
                                            type="button"
                                            variant={isCurrent ? "default" : "outline"}
                                            size="sm"
                                            className="h-7 px-3 text-xs font-bold"
                                            onClick={() => updateSectionConfig(sectionId, { itemLimit: num })}
                                          >
                                            {labelText}
                                          </Button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* 4. Call To Action (CTA Button) */}
                                {item.allowCta && (
                                  <div className="space-y-3 pt-2 border-t border-border/60">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                        <Link2 className="h-3.5 w-3.5 text-primary" />
                                        <span>{isArabic ? "زر الإجراء الإضافي" : "Custom Action Button"}</span>
                                      </Label>
                                      <Button
                                        type="button"
                                        variant={secConf.showCta ? "secondary" : "outline"}
                                        size="sm"
                                        className={`h-6 text-[11px] font-bold ${secConf.showCta ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : ""
                                          }`}
                                        onClick={() => updateSectionConfig(sectionId, { showCta: !secConf.showCta })}
                                      >
                                        {secConf.showCta ? (isArabic ? "مفعّل ✓" : "Enabled ✓") : (isArabic ? "معطّل" : "Disabled")}
                                      </Button>
                                    </div>

                                    {secConf.showCta && (
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-background border">
                                        <div className="space-y-1">
                                          <span className="text-[10px] font-medium text-muted-foreground">
                                            {isArabic ? "نص الزر بالعربية" : "Arabic Button Text"}
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
                                            {isArabic ? "نص الزر بالإنجليزية" : "English Button Text"}
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
                                            {isArabic ? "رابط التوجيه" : "Target Link"}
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
                  {currentFaculty && (
                    <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-foreground">
                          {isArabic ? "هل ترغب بمعاينة كيف يبدو الموقع الفرعي للكلية؟" : "Want to preview the live faculty microsite?"}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" asChild className="text-xs font-bold gap-1">
                        <Link href={`/faculties/${currentFaculty.slug}`} target="_blank">
                          <ExternalLink className="h-3.5 w-3.5" />
                          {isArabic ? "معاينة حية" : "Live Preview"}
                        </Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Tab 2: Dean & Leadership */}
                <TabsContent value="leadership" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center gap-2">
                      <Crown className="h-4 w-4 text-amber-600" />
                      <span>{isArabic ? "تعيين عميد الكلية" : "Appoint Faculty Dean"}</span>
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      {isArabic
                        ? "يمكنك حفظ الكلية دون تعيين عميد، وتعيينه لاحقاً بعد إضافة كادر الأساتذة."
                        : "You can save the faculty without appointing a Dean and assign one later after adding staff."}
                    </p>
                    <Select value={deanId} onValueChange={setDeanId}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={isArabic ? "اختر أستاذ لتعيينه عميداً" : "Select Professor as Dean"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{isArabic ? "بدون عميد حالياً" : "No Dean Assigned"}</SelectItem>
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
                      <Label htmlFor="f-deanNameAr">{isArabic ? "اسم العميد بالعربية" : "Arabic Dean Name"}</Label>
                      <Input
                        id="f-deanNameAr"
                        value={deanNameAr}
                        onChange={(e) => setDeanNameAr(e.target.value)}
                        placeholder={isArabic ? "مثال: أ. د. محمد سعيد الحموي" : "e.g. Prof. Dr. Mohammad Saeed"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f-deanNameEn">{isArabic ? "اسم العميد بالإنجليزية" : "English Dean Name"}</Label>
                      <Input
                        id="f-deanNameEn"
                        value={deanNameEn}
                        onChange={(e) => setDeanNameEn(e.target.value)}
                        placeholder={isArabic ? "مثال: Prof. Dr. Mohammad Saeed" : "e.g. Prof. Dr. Mohammad Saeed"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="f-deanPhoto">{isArabic ? "رابط صورة العميد" : "Dean Photo URL"}</Label>
                    <Input
                      id="f-deanPhoto"
                      value={deanPhoto}
                      onChange={(e) => setDeanPhoto(e.target.value)}
                      placeholder={isArabic ? "مثال: /images/faculty/prof_male_1.png" : "e.g. /images/faculty/prof_male_1.png"}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="f-deanMessageAr">{isArabic ? "كلمة العميد الترحيبية بالعربية" : "Arabic Dean Welcome Message"}</Label>
                      <Textarea
                        id="f-deanMessageAr"
                        value={deanMessageAr}
                        onChange={(e) => setDeanMessageAr(e.target.value)}
                        rows={4}
                        placeholder={isArabic ? "أهلاً بكم في الكلية، نهدف إلى تقديم تعليم عالي الجودة يواكب المعايير العالمية..." : "Welcome to the faculty. We are committed to academic excellence and innovation..."}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f-deanMessageEn">{isArabic ? "كلمة العميد الترحيبية بالإنجليزية" : "English Dean Welcome Message"}</Label>
                      <Textarea
                        id="f-deanMessageEn"
                        value={deanMessageEn}
                        onChange={(e) => setDeanMessageEn(e.target.value)}
                        rows={4}
                        placeholder={isArabic ? "أهلاً بكم في الكلية باللغة الإنجليزية..." : "Welcome message from the Dean in English..."}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 3: Key Statistics */}
                <TabsContent value="stats" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="f-establishedYear">{isArabic ? "سنة التأسيس" : "Established Year"}</Label>
                      <Input id="f-establishedYear" type="number" value={establishedYear} onChange={(e) => setEstablishedYear(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f-studentsCount">{isArabic ? "عدد الطلاب المسجلين" : "Active Students Count"}</Label>
                      <Input id="f-studentsCount" type="number" value={studentsCount} onChange={(e) => setStudentsCount(Number(e.target.value))} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="f-labsCount">{isArabic ? "عدد المختبرات والمرافق" : "Labs & Facilities Count"}</Label>
                      <Input id="f-labsCount" type="number" value={labsCount} onChange={(e) => setLabsCount(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f-researchPapers">{isArabic ? "عدد الأبحاث المنشورة" : "Published Papers"}</Label>
                      <Input id="f-researchPapers" type="number" value={researchPapersCount} onChange={(e) => setResearchPapersCount(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f-employmentRate">{isArabic ? "نسبة توظيف الخريجين المئوية" : "Employment Rate Percentage"}</Label>
                      <Input id="f-employmentRate" type="number" value={employmentRate} onChange={(e) => setEmploymentRate(Number(e.target.value))} />
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 4: Research Labs & Documents */}
                <TabsContent value="labs" className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="f-guideDoc">{isArabic ? "رابط دليل الكلية التعريفي" : "Faculty Prospectus Link"}</Label>
                    <Input
                      id="f-guideDoc"
                      value={guideDocumentUrl}
                      onChange={(e) => setGuideDocumentUrl(e.target.value)}
                      placeholder={isArabic ? "مثال: https://asu.edu.sy/docs/engineering-prospectus.pdf" : "e.g. https://asu.edu.sy/docs/engineering-prospectus.pdf"}
                    />
                  </div>

                  {/* Facilities List Manager */}
                  <div className="space-y-3 border-t pt-4">
                    <Label className="font-bold text-base flex items-center gap-2">
                      <FlaskConical className="h-5 w-5 text-primary" />
                      <span>{isArabic ? "المختبرات والمرافق التابعة للكلية" : "Faculty Research Labs & Facilities"}</span>
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
                      <p className="text-xs font-bold text-muted-foreground">{isArabic ? "+ إضافة مختبر جديد للكلية" : "+ Add New Research Lab"}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          placeholder={isArabic ? "اسم المختبر بالعربية" : "Arabic Lab Name"}
                          value={newLabNameAr}
                          onChange={(e) => setNewLabNameAr(e.target.value)}
                        />
                        <Input
                          placeholder={isArabic ? "اسم المختبر بالإنجليزية" : "English Lab Name"}
                          value={newLabNameEn}
                          onChange={(e) => setNewLabNameEn(e.target.value)}
                        />
                      </div>
                      <Textarea
                        placeholder={isArabic ? "تجهيزات ومحتويات المختبر والأنظمة المتوفرة..." : "Lab description, equipment, and workstations..."}
                        value={newLabDescAr}
                        onChange={(e) => setNewLabDescAr(e.target.value)}
                        rows={2}
                      />
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
                {isArabic ? (currentFaculty ? "حفظ التغييرات" : "إضافة الكلية") : (currentFaculty ? "Save Changes" : "Add Faculty")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Faculty Management Hub Dialog (Master-Detail) */}
      <Dialog open={isHubOpen} onOpenChange={setIsHubOpen}>
        <DialogContent className="sm:max-w-[950px] w-[95vw]">
          <DialogHeader className="p-6 pb-4 border-b bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-3 rounded-xl text-white font-bold shadow-md shrink-0"
                  style={{ backgroundColor: selectedFacultyForHub?.primaryColor || "#800000" }}
                >
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    {isArabic ? "مركز إدارة الكلية:" : "Faculty Management Hub:"}{" "}
                    <span className="text-primary">
                      {selectedFacultyForHub ? (isArabic ? selectedFacultyForHub.nameAr : selectedFacultyForHub.nameEn) : ""}
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-xs mt-1">
                    {isArabic
                      ? "إدارة متكاملة للأقسام الأكاديمية، المخابر والمختبرات البحثية، توزيع الكادر التدريسي، والطلاب التابعين للكلية."
                      : "Comprehensive management of academic departments, research laboratories, faculty staff allocation, and student rosters."}
                  </DialogDescription>
                </div>
              </div>

              {/* Badges Summary */}
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="gap-1 bg-background font-bold text-xs py-1">
                  <School className="h-3.5 w-3.5 text-primary" />
                  {hubPrograms.length} {isArabic ? "أقسام" : "Depts"}
                </Badge>
                <Badge variant="outline" className="gap-1 bg-background font-bold text-xs py-1">
                  <FlaskConical className="h-3.5 w-3.5 text-amber-600" />
                  {hubFacilities.length} {isArabic ? "مخابر" : "Labs"}
                </Badge>
                <Badge variant="outline" className="gap-1 bg-background font-bold text-xs py-1">
                  <Users className="h-3.5 w-3.5 text-blue-600" />
                  {hubTeachers.length} {isArabic ? "مدرسين" : "Staff"}
                </Badge>
                <Badge variant="outline" className="gap-1 bg-background font-bold text-xs py-1">
                  <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                  {hubStudents.length} {isArabic ? "طلاب" : "Students"}
                </Badge>
              </div>
            </div>

            {/* Search within Hub (Teachers/Students/Facilities) */}
            {(hubTab === "teachers" || hubTab === "students" || hubTab === "facilities") && (
              <div className="relative mt-4">
                <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={
                    hubTab === "teachers"
                      ? (isArabic ? "بحث في كوادر الكلية (بالاسم، الرتبة، البريد)..." : "Search faculty staff...")
                      : hubTab === "students"
                      ? (isArabic ? "بحث في طلاب الكلية (بالاسم، الرقم الجامعي)..." : "Search enrolled students...")
                      : (isArabic ? "بحث في مخابر ومختبرات الكلية..." : "Search faculty laboratories...")
                  }
                  value={hubSearch}
                  onChange={(e) => setHubSearch(e.target.value)}
                  className="ps-9 bg-background"
                />
              </div>
            )}
          </DialogHeader>

          <DialogBody className="space-y-4">
            <Tabs value={hubTab} onValueChange={setHubTab} className="w-full">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-6 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="departments" className="font-bold text-xs gap-2">
                  <School className="h-4 w-4" />
                  {isArabic ? `الأقسام (${hubPrograms.length})` : `Depts (${hubPrograms.length})`}
                </TabsTrigger>
                <TabsTrigger value="facilities" className="font-bold text-xs gap-2">
                  <FlaskConical className="h-4 w-4" />
                  {isArabic ? `المخابر (${hubFacilities.length})` : `Labs (${hubFacilities.length})`}
                </TabsTrigger>
                <TabsTrigger value="teachers" className="font-bold text-xs gap-2">
                  <Users className="h-4 w-4" />
                  {isArabic ? `الكادر (${hubTeachers.length})` : `Staff (${hubTeachers.length})`}
                </TabsTrigger>
                <TabsTrigger value="students" className="font-bold text-xs gap-2">
                  <GraduationCap className="h-4 w-4" />
                  {isArabic ? `الطلاب (${hubStudents.length})` : `Students (${hubStudents.length})`}
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Departments */}
              <TabsContent value="departments" className="space-y-4 m-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm">
                      {isArabic ? "قائمة الأقسام التابعة للكلية" : "Departments in this Faculty"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isArabic
                        ? "كل قسم يحتوي على برامجه الأكاديمية ومدرسيه وطلابه."
                        : "Each department maintains its degree programs, teachers, and students."}
                    </p>
                  </div>
                  <Button size="sm" className="font-bold gap-2 shadow-sm" onClick={handleOpenAddProgram}>
                    <Plus className="h-4 w-4" />
                    {isArabic ? "إضافة قسم جديد لهذه الكلية" : "Add Department to Faculty"}
                  </Button>
                </div>

                {hubPrograms.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center bg-muted/20 space-y-3">
                    <School className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                    <p className="font-bold text-sm text-muted-foreground">
                      {isArabic ? "لا توجد أقسام مسجلة لهذه الكلية حتى الآن." : "No departments registered for this faculty yet."}
                    </p>
                    <Button size="sm" variant="outline" className="font-bold gap-2" onClick={handleOpenAddProgram}>
                      <Plus className="h-4 w-4" />
                      {isArabic ? "إضافة أول قسم الآن" : "Add First Department Now"}
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-xl overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>{isArabic ? "اسم القسم" : "Department Name"}</TableHead>
                          <TableHead>{isArabic ? "مدة الدراسة" : "Duration"}</TableHead>
                          <TableHead>{isArabic ? "رئيس القسم" : "Head of Department"}</TableHead>
                          <TableHead className="text-center">{isArabic ? "المدرسون" : "Teachers"}</TableHead>
                          <TableHead className="text-center">{isArabic ? "الطلاب" : "Students"}</TableHead>
                          <TableHead className="text-end">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hubPrograms.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-bold">
                              <div className="flex flex-col">
                                <span>{isArabic ? p.nameAr : p.nameEn}</span>
                                <span className="text-[11px] text-muted-foreground font-mono">/{p.slug}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs">
                              {p.duration} {isArabic ? "سنوات" : "Years"} ({p.creditHours || 160} {isArabic ? "ساعة" : "hrs"})
                            </TableCell>
                            <TableCell className="text-xs">
                              {p.headDetail ? (
                                <span className="font-medium text-foreground">
                                  {isArabic ? p.headDetail.nameAr : p.headDetail.nameEn}
                                </span>
                              ) : (
                                <span className="text-muted-foreground italic">{isArabic ? "غير معيّن" : "Not appointed"}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="font-bold text-xs">
                                {p.teachersCount ?? 0}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="font-bold text-xs">
                                {p.studentsCount ?? 0}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-end">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="h-8 text-xs font-bold"
                                >
                                  <Link href={`/dashboard/programs?search=${encodeURIComponent(p.slug)}`}>
                                    <Edit className="h-3.5 w-3.5 me-1" />
                                    {isArabic ? "تعديل" : "Edit"}
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-xs font-bold text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteProgramInHub(p.id)}
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
                )}
              </TabsContent>

              {/* Tab 2: Laboratories & Research Facilities */}
              <TabsContent value="facilities" className="space-y-4 m-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm">
                      {isArabic ? "المخابر والمختبرات والعيادات البحثية" : "Research Laboratories & Facilities"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isArabic
                        ? "إدارة المختبرات والتجهيزات العلمية التابعة للكلية وتعديل بياناتها المعروضة في الموقع."
                        : "Manage faculty research facilities, equipment specs, and public showcase."}
                    </p>
                  </div>
                  <Button size="sm" className="font-bold gap-2 shadow-sm" onClick={handleOpenAddHubLab}>
                    <Plus className="h-4 w-4" />
                    {isArabic ? "إضافة مخبر جديد للكلية" : "Add Lab to Faculty"}
                  </Button>
                </div>

                {hubFacilities.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center bg-muted/20 space-y-3">
                    <FlaskConical className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                    <p className="font-bold text-sm text-muted-foreground">
                      {isArabic ? "لا توجد مخابر مخصصة مسجلة لهذه الكلية حتى الآن." : "No custom laboratories registered for this faculty yet."}
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                      {isArabic
                        ? "يتم حالياً عرض المخابر التلقائية المعتمدة على الصفحة العامة للكلية، يمكنك إضافة وتخصيص المخابر هنا مباشرة."
                        : "Currently displaying standardized default labs on public page. You can add and customize labs directly here."}
                    </p>
                    <Button size="sm" variant="outline" className="font-bold gap-2" onClick={handleOpenAddHubLab}>
                      <Plus className="h-4 w-4" />
                      {isArabic ? "إضافة أول مخبر مخصص" : "Add First Lab Now"}
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-xl overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="min-w-[220px]">{isArabic ? "اسم المخبر" : "Laboratory Name"}</TableHead>
                          <TableHead>{isArabic ? "الوصف والتجهيزات" : "Description & Equipment"}</TableHead>
                          <TableHead className="text-end">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hubFacilities.map((lab, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-bold">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="p-2.5 rounded-lg text-white shadow-xs shrink-0"
                                  style={{ backgroundColor: selectedFacultyForHub?.primaryColor || "#800000" }}
                                >
                                  <FlaskConical className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="text-xs sm:text-sm font-bold text-foreground">{isArabic ? lab.nameAr : lab.nameEn}</p>
                                  <p className="text-[11px] text-muted-foreground font-medium">{isArabic ? lab.nameEn : lab.nameAr}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground max-w-md">
                              <p className="line-clamp-2">
                                {isArabic ? lab.descriptionAr || "N/A" : lab.descriptionEn || lab.descriptionAr || "N/A"}
                              </p>
                            </TableCell>
                            <TableCell className="text-end">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-xs font-bold"
                                  onClick={() => handleOpenEditHubLab(idx, lab)}
                                >
                                  <Edit className="h-3.5 w-3.5 me-1" />
                                  {isArabic ? "تعديل" : "Edit"}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-xs font-bold text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteHubLab(idx)}
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
                )}
              </TabsContent>

              {/* Tab 3: Faculty Staff */}
              <TabsContent value="teachers" className="space-y-4 m-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm">
                      {isArabic ? "الكادر التدريسي وأعضاء الهيئة التعليمية" : "Teaching Faculty Members"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isArabic
                        ? "يمكنك تغيير القسم الأكاديمي المسند لكل أستاذ بشكل فوري ومباشر."
                        : "Instantly reassign any faculty member to another department within this faculty."}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild className="font-bold gap-2">
                    <Link href="/dashboard/faculty-members">
                      <Plus className="h-4 w-4" />
                      {isArabic ? "إضافة مدرس جديد" : "Add Faculty Member"}
                    </Link>
                  </Button>
                </div>

                {hubTeachers.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center bg-muted/20 space-y-3">
                    <Users className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                    <p className="font-bold text-sm text-muted-foreground">
                      {isArabic ? "لا يوجد مدرسون مسندون لهذه الكلية حالياً." : "No faculty members found for this faculty."}
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-xl overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>{isArabic ? "الأستاذ" : "Faculty Member"}</TableHead>
                          <TableHead>{isArabic ? "الرتبة العلمية" : "Academic Title"}</TableHead>
                          <TableHead className="min-w-[220px]">{isArabic ? "القسم الأكاديمي" : "Assigned Department"}</TableHead>
                          <TableHead className="text-end">{isArabic ? "الملف الشخصي" : "Profile"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hubTeachers.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border">
                                  <AvatarImage src={member.image} />
                                  <AvatarFallback className="font-bold bg-primary/10 text-primary text-xs">
                                    {member.nameAr?.slice(0, 1) || "P"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-bold text-xs">{isArabic ? member.nameAr : member.nameEn}</p>
                                  <p className="text-[11px] text-muted-foreground font-mono">{member.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs font-medium">
                              {isArabic ? member.titleAr : member.titleEn}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={member.department ? member.department.toString() : "none"}
                                onValueChange={(val) => handleReassignTeacher(member.id, val)}
                              >
                                <SelectTrigger className="h-8 text-xs bg-background">
                                  <SelectValue placeholder={isArabic ? "اختر القسم" : "Select Department"} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">
                                    {isArabic ? "بدون قسم محدد" : "General Faculty"}
                                  </SelectItem>
                                  {hubPrograms.map((prog) => (
                                    <SelectItem key={prog.id} value={prog.id.toString()}>
                                      {isArabic ? prog.nameAr : prog.nameEn}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-end">
                              <Button variant="ghost" size="sm" asChild className="h-8 text-xs font-bold">
                                <Link href="/dashboard/faculty-members">
                                  <Edit className="h-3.5 w-3.5 me-1" />
                                  {isArabic ? "إدارة" : "Manage"}
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Tab 3: Enrolled Students */}
              <TabsContent value="students" className="space-y-4 m-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm">
                      {isArabic ? "الطلاب المسجلون في برامج الكلية" : "Enrolled Students"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isArabic
                        ? "إعادة تسكين وتغيير قسم الطالب الأكاديمي أو الانتقال للنقل الجماعي."
                        : "Instantly transfer students between departments or use bulk transfer."}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild className="font-bold gap-2">
                    <Link href="/dashboard/students">
                      <ArrowRightLeft className="h-4 w-4" />
                      {isArabic ? "النقل الجماعي للطلاب" : "Bulk Transfer"}
                    </Link>
                  </Button>
                </div>

                {hubStudents.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center bg-muted/20 space-y-3">
                    <GraduationCap className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                    <p className="font-bold text-sm text-muted-foreground">
                      {isArabic ? "لا يوجد طلاب مسجلون في هذه الكلية حالياً." : "No enrolled students found for this faculty."}
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-xl overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>{isArabic ? "الطالب" : "Student"}</TableHead>
                          <TableHead>{isArabic ? "الرقم الجامعي" : "Student ID"}</TableHead>
                          <TableHead>{isArabic ? "السنة الدراسية" : "Academic Year"}</TableHead>
                          <TableHead className="min-w-[220px]">{isArabic ? "القسم المسجل به" : "Enrolled Department"}</TableHead>
                          <TableHead className="text-end">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hubStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-bold text-xs">
                              <div>
                                <span>{isArabic ? student.nameAr : student.nameEn}</span>
                                <span className="block text-[11px] text-muted-foreground font-normal">{student.email}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs font-mono font-bold text-primary">
                              {student.studentId}
                            </TableCell>
                            <TableCell className="text-xs">
                              {isArabic ? `السنة ${student.year ?? "-"}` : `Year ${student.year ?? "-"}`}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={student.program ? student.program.toString() : ""}
                                onValueChange={(val) => handleReassignStudent(student.id, val)}
                              >
                                <SelectTrigger className="h-8 text-xs bg-background">
                                  <SelectValue placeholder={isArabic ? "اختر القسم" : "Select Department"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {hubPrograms.map((prog) => (
                                    <SelectItem key={prog.id} value={prog.id.toString()}>
                                      {isArabic ? prog.nameAr : prog.nameEn}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-end">
                              <Button variant="ghost" size="sm" asChild className="h-8 text-xs font-bold">
                                <Link href="/dashboard/students">
                                  <Edit className="h-3.5 w-3.5 me-1" />
                                  {isArabic ? "سجل الطالب" : "Profile"}
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogBody>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsHubOpen(false)}>
              {isArabic ? "إغلاق المركز" : "Close Hub"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sub-Dialog: Add Program directly into Selected Faculty */}
      <Dialog open={isAddProgramOpen} onOpenChange={setIsAddProgramOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="p-6 pb-4 border-b bg-muted/20">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <School className="h-5 w-5 text-primary" />
              {isArabic ? "إضافة قسم جديد إلى:" : "Add Department to:"}{" "}
              <span className="text-primary">{selectedFacultyForHub?.nameAr}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isArabic
                ? "سيتم إسناد هذا القسم تلقائياً لهذه الكلية وتجهيزه لاستقبال الطلاب والمدرسين."
                : "This department will be automatically attached to this faculty and ready for students & staff."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProgramInHub} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <DialogBody className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  {isArabic ? "اسم القسم بالعربية" : "Arabic Department Name"} <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={progNameAr}
                  onChange={(e) => setProgNameAr(e.target.value)}
                  placeholder={isArabic ? "مثال: قسم هندسة البرمجيات" : "e.g. Software Engineering"}
                  className="bg-background text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  {isArabic ? "اسم القسم بالإنجليزية" : "English Department Name"} <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={progNameEn}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProgNameEn(val);
                    if (!progSlug || progSlug === progNameEn.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "")) {
                      setProgSlug(val.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, ""));
                    }
                  }}
                  placeholder="e.g. Software Engineering Department"
                  className="bg-background text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{isArabic ? "الرابط المختصر" : "URL Slug"}</Label>
                  <Input
                    value={progSlug}
                    onChange={(e) => setProgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                    dir="ltr"
                    placeholder="software-engineering"
                    className="bg-background text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">{isArabic ? "سنوات الدراسة" : "Study Duration"}</Label>
                  <Input
                    type="number"
                    min={1}
                    max={7}
                    value={progDuration}
                    onChange={(e) => setProgDuration(Number(e.target.value))}
                    className="bg-background text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isArabic ? "رئيس القسم الأكاديمي" : "Department Head"}</Label>
                <Select value={progHeadId} onValueChange={setProgHeadId}>
                  <SelectTrigger className="bg-background text-xs sm:text-sm">
                    <SelectValue placeholder={isArabic ? "اختر رئيس القسم" : "Select Department Head"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{isArabic ? "بدون رئيس قسم حالياً" : "No Head Assigned"}</SelectItem>
                    {displayMembers
                      .filter((m) => m.faculty === selectedFacultyForHub?.id || m.departmentDetail?.faculty === selectedFacultyForHub?.id)
                      .map((m) => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          {isArabic ? m.nameAr : m.nameEn} ({m.titleAr})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </DialogBody>

            <DialogFooter className="p-4 px-6 border-t bg-muted/10 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddProgramOpen(false)}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" disabled={createProgramMutation.isPending} className="font-bold gap-2">
                {createProgramMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {isArabic ? "إضافة القسم" : "Add Department"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sub-Dialog: Add/Edit Laboratory directly in Selected Faculty Hub */}
      <Dialog open={isHubLabModalOpen} onOpenChange={setIsHubLabModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader className="p-6 pb-4 border-b bg-muted/20">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              {editingHubLabIndex !== null
                ? (isArabic ? "تعديل بيانات المخبر البحثي" : "Edit Laboratory")
                : (isArabic ? "إضافة مخبر بحثي جديد للكلية" : "Add New Laboratory")}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isArabic
                ? "أدخل اسم المخبر والتجهيزات العلمية المتوفرة به لعرضها في صفحة الكلية الرسمية."
                : "Enter laboratory details and research equipment to showcase on the official faculty page."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveHubLab}>
            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <Label htmlFor="hub-lab-name-ar" className="text-xs font-bold">
                  {isArabic ? "اسم المخبر بالعربية" : "Arabic Lab Name"} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="hub-lab-name-ar"
                  value={hubLabNameAr}
                  onChange={(e) => setHubLabNameAr(e.target.value)}
                  placeholder={isArabic ? "مثال: مخبر الذكاء الاصطناعي والحوسبة الفائقة" : "e.g. AI & HPC Lab"}
                  className="bg-background text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hub-lab-name-en" className="text-xs font-bold">
                  {isArabic ? "اسم المخبر بالإنجليزية" : "English Lab Name"} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="hub-lab-name-en"
                  value={hubLabNameEn}
                  onChange={(e) => setHubLabNameEn(e.target.value)}
                  placeholder="e.g. Artificial Intelligence & HPC Lab"
                  className="bg-background text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hub-lab-desc-ar" className="text-xs font-bold">
                  {isArabic ? "الوصف والتجهيزات بالعربية" : "Arabic Description & Equipment"}
                </Label>
                <Textarea
                  id="hub-lab-desc-ar"
                  value={hubLabDescAr}
                  onChange={(e) => setHubLabDescAr(e.target.value)}
                  placeholder={isArabic ? "وصف الأجهزة والمعدات المتوفرة والأنشطة البحثية المقامة في المخبر..." : "Equipment specs and research activities..."}
                  className="bg-background text-xs sm:text-sm"
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hub-lab-desc-en" className="text-xs font-bold">
                  {isArabic ? "الوصف والتجهيزات بالإنجليزية" : "English Description & Equipment"}
                </Label>
                <Textarea
                  id="hub-lab-desc-en"
                  value={hubLabDescEn}
                  onChange={(e) => setHubLabDescEn(e.target.value)}
                  placeholder="Equipment specifications and research focus in English..."
                  className="bg-background text-xs sm:text-sm"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="p-4 px-6 border-t bg-muted/10 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsHubLabModalOpen(false)}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="font-bold gap-2">
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {editingHubLabIndex !== null
                  ? (isArabic ? "حفظ التعديلات" : "Update Laboratory")
                  : (isArabic ? "إضافة المخبر" : "Save Laboratory")}
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
        title={isArabic ? "حذف الكلية والموقع الفرعي (عملية عالية الخطورة)" : "High-Risk Operation: Delete Faculty"}
        description={
          isArabic
            ? `تحذير: هل أنت متأكد من حذف ${currentFaculty?.nameAr || "هذه الكلية"}؟ سيتم حذف كافة الأقسام التابعة لها نهائياً. أدخل رمز التحقق للبدء بالحذف.`
            : `Warning: Are you sure you want to delete ${currentFaculty?.nameEn}? All associated departments will be deleted. Please verify captcha code to proceed.`
        }
        confirmText={isArabic ? "تأكيد حذف الكلية الأمني" : "Confirm Security Deletion"}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
