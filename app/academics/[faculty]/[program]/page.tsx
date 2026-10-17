"use client";

import React, { useState, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { DepartmentNavbar } from "@/components/layout/department-navbar";
import { ASULogo } from "@/components/ui/asu-logo";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import { useFaculties } from "@/hooks/use-faculties";
import { usePrograms } from "@/hooks/use-programs";
import { useFacultyMembers } from "@/hooks/use-faculty-members";
import { useNews } from "@/hooks/use-news";
import { AcademicsNewsCarousel } from "@/components/academics/news-carousel";
import { AcademicsStaffCarousel } from "@/components/academics/faculty-staff-carousel";
import { TopStudents } from "@/components/academics/top-students";
import { SuccessStories } from "@/components/academics/success-stories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GraduationCap,
  Clock,
  DollarSign,
  Target,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
  Users,
  Award,
  Crown,
  Sparkles,
  FlaskConical,
  Briefcase,
  Download,
  ExternalLink,
  Building2,
  Mail,
  CheckCircle2,
  Quote,
  ArrowRight,
  ArrowLeft,
  Compass,
} from "lucide-react";

interface Course {
  code: string;
  nameAr: string;
  nameEn: string;
  hours: number;
  descriptionAr: string;
  descriptionEn: string;
  prerequisitesAr: string;
  prerequisitesEn: string;
  objectivesAr: string;
  objectivesEn: string;
  topicsAr: string[];
  topicsEn: string[];
}

interface SemesterData {
  semester: number;
  courses: Course[];
}

interface YearData {
  year: number;
  semesters: SemesterData[];
}

function hexToRgba(hex: string, alpha: number) {
  if (!hex || !hex.startsWith("#")) return `rgba(30, 58, 138, ${alpha})`;
  let c = hex.substring(1);
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

export default function ProgramPage({
  params,
}: {
  params: Promise<{ faculty: string; program: string }>;
}) {
  const { faculty: facultySlug, program: programSlug } = use(params);
  const { language, t, dir } = useLanguage();
  const isArabic = language === "ar";
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const BackArrow = dir === "rtl" ? ChevronRight : ChevronLeft;

  const { data: backendFaculties, isLoading: isFacultiesLoading } = useFaculties();
  const { data: backendPrograms, isLoading: isProgramsLoading } = usePrograms();
  const { data: allMembers } = useFacultyMembers();
  const { data: allNews } = useNews();

  const displayFaculties = backendFaculties || [];
  const displayPrograms = backendPrograms || [];

  const faculty = displayFaculties.find((f) => f.slug === facultySlug);
  const program =
    displayPrograms.find((p) => p.slug === programSlug) ||
    faculty?.programs?.find((p) => p.slug === programSlug);

  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const curriculum = useMemo(() => {
    if (!program) return [];
    if (program.courses && program.courses.length > 0) {
      const yearsMap = new Map<number, Map<number, Course[]>>();
      for (let y = 1; y <= program.duration; y++) {
        const semMap = new Map<number, Course[]>();
        semMap.set(1, []);
        semMap.set(2, []);
        yearsMap.set(y, semMap);
      }
      for (const c of program.courses) {
        const y = c.year || 1;
        const s = c.semester || 1;
        if (!yearsMap.has(y)) {
          yearsMap.set(y, new Map());
        }
        if (!yearsMap.get(y)!.has(s)) {
          yearsMap.get(y)!.set(s, []);
        }
        yearsMap.get(y)!.get(s)!.push({
          code: c.code,
          nameAr: c.nameAr,
          nameEn: c.nameEn,
          hours: c.credits || 3,
          descriptionAr: c.descriptionAr || `مقرر ${c.nameAr}`,
          descriptionEn: c.descriptionEn || `Course ${c.nameEn}`,
          prerequisitesAr: c.prerequisitesText || "لا يوجد متطلبات سابقة",
          prerequisitesEn: c.prerequisitesText || "No prerequisites",
          objectivesAr: `إكساب الطالب المعارف التخصصية في ${c.nameAr}`,
          objectivesEn: `Equip students with specialized knowledge in ${c.nameEn}`,
          topicsAr: ["المفاهيم الأساسية", "التطبيقات العملية", "حل المسائل"],
          topicsEn: ["Core Concepts", "Practical Applications", "Problem Solving"],
        });
      }
      const result: YearData[] = [];
      yearsMap.forEach((semMap, y) => {
        const semesters: SemesterData[] = [];
        semMap.forEach((courses, s) => {
          semesters.push({ semester: s, courses });
        });
        semesters.sort((a, b) => a.semester - b.semester);
        result.push({ year: y, semesters });
      });
      return result.sort((a, b) => a.year - b.year);
    }
    return [];
  }, [program]);

  // Loading State
  if (isFacultiesLoading || isProgramsLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-md shadow-xs h-16 flex items-center">
          <div className="section-container flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <ASULogo priority className="h-8 sm:h-9" />
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <GraduationCap className="h-10 w-10 text-primary animate-pulse" />
            <p className="text-sm font-bold text-muted-foreground">
              {isArabic ? "جاري تحميل بيانات القسم..." : "Loading department..."}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!faculty || !program) {
    notFound();
  }

  // Visual Identity & Theming
  const primaryColor = program.primaryColor || faculty.primaryColor || "#1E3A8A";
  const accentColor = program.accentColor || faculty.accentColor || "#F59E0B";
  const heroBanner = program.heroBanner || faculty.heroBanner || "";
  const logoUrl = program.logoUrl || faculty.logoUrl || "";
  const motto = isArabic
    ? (program.mottoAr || "نحو التميز الأكاديمي والمهني")
    : (program.mottoEn || "Towards Academic & Professional Excellence");

  const layout = program.layoutConfig || {};
  const headerStyle = layout.headerStyle || "hero_split";

  // Head of Department details
  const headName = isArabic
    ? (program.headNameAr || program.headDetail?.nameAr)
    : (program.headNameEn || program.headDetail?.nameEn);
  const headMessage = isArabic ? program.headMessageAr : program.headMessageEn;
  const headPhoto = program.headPhoto || "/user.png";

  // Filter staff associated with this department or faculty
  const programStaff = (allMembers || []).filter(
    (m) =>
      m.departmentAr === program.nameAr ||
      m.departmentEn === program.nameEn ||
      m.department === program.id ||
      (m as any).departmentDetail?.slug === program.slug ||
      m.faculty === faculty.id
  );

  // Filter and prioritize news associated with this department or faculty
  const cleanProgName = program.nameAr ? program.nameAr.replace(/^قسم\s+/, "") : "";
  const programNews = (allNews || []).filter(
    (item) =>
      item.faculty === faculty.id ||
      (item as any).program === program.id ||
      (item as any).department === program.id ||
      (item.titleAr && (item.titleAr.includes(program.nameAr) || (cleanProgName && item.titleAr.includes(cleanProgName)))) ||
      (item.contentAr && (item.contentAr.includes(program.nameAr) || (cleanProgName && item.contentAr.includes(cleanProgName)))) ||
      (item.excerptAr && (item.excerptAr.includes(program.nameAr) || (cleanProgName && item.excerptAr.includes(cleanProgName)))) ||
      (item.titleEn && program.nameEn && item.titleEn.toLowerCase().includes(program.nameEn.toLowerCase()))
  );
  const sortedProgramNews = [...programNews].sort((a, b) => {
    const aMatches =
      (a.titleAr && (a.titleAr.includes(program.nameAr) || (cleanProgName && a.titleAr.includes(cleanProgName)))) ||
        (a.excerptAr && (a.excerptAr.includes(program.nameAr) || (cleanProgName && a.excerptAr.includes(cleanProgName)))) ||
        (a.contentAr && (a.contentAr.includes(program.nameAr) || (cleanProgName && a.contentAr.includes(cleanProgName))))
        ? 1
        : 0;
    const bMatches =
      (b.titleAr && (b.titleAr.includes(program.nameAr) || (cleanProgName && b.titleAr.includes(cleanProgName)))) ||
        (b.excerptAr && (b.excerptAr.includes(program.nameAr) || (cleanProgName && b.excerptAr.includes(cleanProgName)))) ||
        (b.contentAr && (b.contentAr.includes(program.nameAr) || (cleanProgName && b.contentAr.includes(cleanProgName))))
        ? 1
        : 0;
    return bMatches - aMatches;
  });

  // Parse Career Paths
  const careerItems = program.careerPaths && program.careerPaths.trim()
    ? program.careerPaths.split(/[\n,،•\r]+/).map((s) => s.trim()).filter(Boolean)
    : (isArabic
      ? [
        "تطوير البرمجيات والأنظمة السحابية المتقدمة",
        "هندسة الذكاء الاصطناعي ونظم تعلم الآلة",
        "إدارة وتصميم قواعد البيانات الضخمة",
        "أمن الشبكات والمعلومات والأمن السيبراني",
        "إدارة المشاريع التكنولوجية والتحول الرقمي",
        "البحث العلمي والتطوير الأكاديمي والصناعي",
      ]
      : [
        "Software & Cloud Systems Engineering",
        "Artificial Intelligence & Machine Learning",
        "Big Data & Enterprise Database Architecture",
        "Cybersecurity & Network Defense",
        "Tech Project Leadership & Digital Transformation",
        "Scientific Research & Academic Development",
      ]);

  // Facilities
  const facilities = program.facilities && program.facilities.length > 0
    ? program.facilities
    : [
      {
        nameAr: "مختبر البرمجيات والأنظمة المدمجة",
        nameEn: "Software & Embedded Systems Lab",
        descriptionAr: "مجهز بأحدث محطات العمل وشاشات التطوير السحابية وأنظمة الاختبار المؤتمتة.",
      },
      {
        nameAr: "مخبر الذكاء الاصطناعي والحوسبة المتقدمة",
        nameEn: "AI & High Performance Computing Lab",
        descriptionAr: "وحدات معالجة رسومية عالية الأداء GPU ومخدمات مخصصة لتدريب نماذج الذكاء الاصطناعي.",
      },
      {
        nameAr: "مختبر الشبكات والأمن السيبراني",
        nameEn: "Networks & Cybersecurity Workstation",
        descriptionAr: "تجهيزات شبكية وسيرفرات محاكاة لاختبار الاختراق وتأمين البنى التحتية الحيوية.",
      },
    ];

  // Dynamic Section BG Helper
  const getSectionBgProps = (bgStyle?: string, defaultClass = "bg-background") => {
    switch (bgStyle) {
      case "muted":
        return {
          className: "border-b",
          style: {
            backgroundColor: hexToRgba(primaryColor, 0.03),
            borderColor: hexToRgba(primaryColor, 0.12),
          },
          isSolid: false,
        };
      case "tint":
        return {
          className: "border-b",
          style: {
            background: `linear-gradient(180deg, ${hexToRgba(primaryColor, 0.07)} 0%, transparent 100%)`,
            borderColor: hexToRgba(primaryColor, 0.15),
          },
          isSolid: false,
        };
      case "solid":
        return {
          className: "border-b text-white",
          style: {
            backgroundColor: primaryColor,
          },
          isSolid: true,
        };
      default:
        return {
          className: "border-b",
          style: {
            background: `linear-gradient(180deg, ${hexToRgba(primaryColor, 0.02)} 0%, transparent 100%)`,
            borderColor: hexToRgba(primaryColor, 0.08),
          },
          isSolid: false,
        };
    }
  };

  // Sections Order
  const defaultSectionsOrder = [
    "stats",
    "head",
    "news",
    "curriculum",
    "career_paths",
    "facilities",
    "staff",
    "top_students",
    "alumni_stories",
  ];

  let rawSectionsOrder =
    layout.sectionsOrder && layout.sectionsOrder.length > 0
      ? [...layout.sectionsOrder]
      : [...defaultSectionsOrder];
  if (!rawSectionsOrder.includes("news")) {
    const headIdx = rawSectionsOrder.indexOf("head");
    if (headIdx !== -1) {
      rawSectionsOrder.splice(headIdx + 1, 0, "news");
    } else {
      rawSectionsOrder.push("news");
    }
  }
  const sectionsOrder = rawSectionsOrder;

  const sectionsConfig = layout.sectionsConfig || {};

  return (
    <div
      className="flex min-h-screen flex-col text-start relative program-themed-page"
      dir={dir}
      style={
        {
          "--program-primary": primaryColor,
          "--program-accent": accentColor,
          "--primary": primaryColor,
          "--accent": accentColor,
          "--ring": primaryColor,
          backgroundColor: "var(--background)",
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -5%, ${hexToRgba(primaryColor, 0.08)} 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 100% 40%, ${hexToRgba(accentColor, 0.04)} 0%, transparent 60%),
            radial-gradient(ellipse 70% 40% at 0% 80%, ${hexToRgba(primaryColor, 0.05)} 0%, transparent 60%)
          `,
        } as React.CSSProperties
      }
    >
      <style>{`
        /* 1. Base Fallback & Interactive Border Card (Curriculum & Admissions) */
        .program-themed-page .program-card,
        .program-themed-page .card-interactive-border {
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            135deg,
            ${hexToRgba(primaryColor, 0.045)} 0%,
            ${hexToRgba(primaryColor, 0.01)} 100%
          ), var(--card);
          border-color: ${hexToRgba(primaryColor, 0.16)} !important;
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.3s ease;
          will-change: transform, box-shadow;
        }
        .program-themed-page .program-card::after,
        .program-themed-page .card-interactive-border::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 20%,
            ${hexToRgba(primaryColor, 0.12)} 38%,
            ${hexToRgba(accentColor, 0.28)} 50%,
            rgba(255, 255, 255, 0.25) 52%,
            ${hexToRgba(primaryColor, 0.12)} 62%,
            transparent 80%
          );
          transform: translateX(-120%);
          transition: transform 0.85s ease;
          pointer-events: none;
          z-index: 5;
        }
        .program-themed-page .program-card:hover,
        .program-themed-page .card-interactive-border:hover {
          transform: translateY(-7px) translateZ(0);
          border-color: ${hexToRgba(primaryColor, 0.55)} !important;
          box-shadow: 0 22px 40px -10px ${hexToRgba(primaryColor, 0.25)},
                      0 4px 16px -2px ${hexToRgba(primaryColor, 0.12)} !important;
        }
        .program-themed-page .program-card:hover::after,
        .program-themed-page .card-interactive-border:hover::after {
          transform: translateX(120%);
        }
        .program-themed-page .card-interactive-border:hover .card-arrow-shift {
          transform: ${isArabic ? "translateX(-6px)" : "translateX(6px)"};
        }
        .card-arrow-shift {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* 2. STATS PULSE & BOTTOM GLOW BAR */
        .program-themed-page .card-stat-pulse {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, ${hexToRgba(primaryColor, 0.045)} 0%, ${hexToRgba(primaryColor, 0.01)} 100%), var(--card);
          border-color: ${hexToRgba(primaryColor, 0.16)} !important;
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.3s ease;
          will-change: transform, box-shadow;
        }
        .program-themed-page .card-stat-pulse::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 15%;
          right: 15%;
          height: 3px;
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent, ${primaryColor}, ${accentColor}, transparent);
          transform: scaleX(0);
          transition: transform 0.35s ease;
          pointer-events: none;
        }
        .program-themed-page .card-stat-pulse:hover {
          transform: translateY(-4px) translateZ(0);
          border-color: ${hexToRgba(primaryColor, 0.45)} !important;
          box-shadow: 0 14px 28px -6px ${hexToRgba(primaryColor, 0.18)}, 0 0 0 1px ${hexToRgba(accentColor, 0.25)} !important;
        }
        .program-themed-page .card-stat-pulse:hover::after {
          transform: scaleX(1);
        }
        .program-themed-page .card-stat-pulse:hover .stat-icon {
          transform: scale(1.15) rotate(-6deg);
        }
        .program-themed-page .card-stat-pulse:hover .stat-number {
          transform: scale(1.06);
          color: ${primaryColor};
        }
        .stat-icon {
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .stat-number {
          display: inline-block;
          transition: transform 0.25s ease, color 0.25s ease;
        }

        /* 3. EDITORIAL QUOTE CARD (Head of Department) */
        .program-themed-page .card-editorial-quote {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, ${hexToRgba(primaryColor, 0.045)} 0%, ${hexToRgba(primaryColor, 0.01)} 100%), var(--card);
          border-color: ${hexToRgba(primaryColor, 0.2)} !important;
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.3s ease;
          will-change: transform, box-shadow;
        }
        .program-themed-page .card-editorial-quote:hover {
          transform: translateY(-4px) translateZ(0);
          border-color: ${hexToRgba(primaryColor, 0.5)} !important;
          box-shadow: 0 20px 40px -10px ${hexToRgba(primaryColor, 0.16)}, 0 0 0 1px ${hexToRgba(accentColor, 0.25)} !important;
        }
        .program-themed-page .card-editorial-quote:hover .quote-watermark {
          transform: scale(1.22) rotate(-10deg);
          opacity: 0.65;
          color: ${accentColor} !important;
        }
        .program-themed-page .card-editorial-quote:hover .editorial-portrait {
          box-shadow: 0 0 0 4px ${hexToRgba(primaryColor, 0.3)}, 0 12px 28px -5px ${hexToRgba(primaryColor, 0.25)};
          transform: scale(1.02);
        }
        .quote-watermark {
          transition: all 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .editorial-portrait {
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        /* 4. DIRECTIONAL MAGNETIC SHIFT (Career Paths) */
        .program-themed-page .card-magnetic-shift {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, ${hexToRgba(primaryColor, 0.04)} 0%, ${hexToRgba(primaryColor, 0.01)} 100%), var(--card);
          border-color: ${hexToRgba(primaryColor, 0.16)} !important;
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.3s ease;
          will-change: transform, box-shadow;
        }
        .program-themed-page .card-magnetic-shift:hover {
          transform: ${isArabic ? "translateX(-8px)" : "translateX(8px)"} translateZ(0);
          border-color: ${hexToRgba(primaryColor, 0.45)} !important;
          box-shadow: ${isArabic ? "-4px" : "4px"} 0 0 0 ${primaryColor},
                      0 14px 28px -6px ${hexToRgba(primaryColor, 0.18)} !important;
        }
        .program-themed-page .card-magnetic-shift:hover .magnetic-icon {
          transform: scale(1.2) rotate(6deg);
          color: ${primaryColor};
        }
        .magnetic-icon {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease;
        }

        /* 5. CINEMATIC ZOOM (Specialized Labs & Facilities) */
        .program-themed-page .card-cinematic-zoom {
          position: relative;
          overflow: hidden;
          border-color: ${hexToRgba(primaryColor, 0.16)} !important;
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.3s ease;
          will-change: transform, box-shadow;
        }
        .program-themed-page .card-cinematic-zoom:hover {
          transform: translateY(-5px) translateZ(0);
          border-color: ${hexToRgba(primaryColor, 0.45)} !important;
          box-shadow: 0 18px 36px -8px ${hexToRgba(primaryColor, 0.22)} !important;
        }
        .program-themed-page .card-cinematic-zoom:hover .cinematic-badge {
          transform: scale(1.15) translateY(-3px);
          box-shadow: 0 10px 22px -3px ${hexToRgba(primaryColor, 0.35)};
        }
        .cinematic-badge {
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* 6. AVATAR HALO PULSE (Department Staff) */
        .program-themed-page .card-avatar-halo {
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, ${hexToRgba(primaryColor, 0.03)} 0%, transparent 100%), var(--card);
          border-color: ${hexToRgba(primaryColor, 0.16)} !important;
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.3s ease;
          will-change: transform, box-shadow;
        }
        .program-themed-page .card-avatar-halo:hover {
          transform: translateY(-5px) translateZ(0);
          border-color: ${hexToRgba(primaryColor, 0.45)} !important;
          box-shadow: 0 16px 32px -8px ${hexToRgba(primaryColor, 0.18)} !important;
        }
        .program-themed-page .card-avatar-halo .avatar-halo-target {
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .program-themed-page .card-avatar-halo:hover .avatar-halo-target {
          transform: scale(1.06);
          box-shadow: 0 0 0 5px ${hexToRgba(primaryColor, 0.25)},
                      0 0 0 10px ${hexToRgba(primaryColor, 0.1)} !important;
        }
        .program-themed-page .card-avatar-halo:hover .staff-name {
          color: ${primaryColor};
        }
        .staff-name {
          transition: color 0.25s ease;
        }
        .program-themed-page .program-course-row {
          transition: background-color 0.15s ease-in-out;
        }
        .program-themed-page .program-course-row:hover {
          background-color: ${hexToRgba(primaryColor, 0.06)} !important;
        }

        /* Targeted ONLY at TabsTrigger buttons - NEVER TabsContent! */
        .program-themed-tabs button[data-slot="tabs-trigger"][data-state="active"],
        .program-themed-tabs [role="tab"][data-state="active"] {
          background-color: ${primaryColor} !important;
          color: #ffffff !important;
          box-shadow: 0 4px 14px ${hexToRgba(primaryColor, 0.35)} !important;
        }
        .program-themed-tabs button[data-slot="tabs-trigger"][data-state="inactive"],
        .program-themed-tabs [role="tab"][data-state="inactive"] {
          color: var(--muted-foreground) !important;
          background-color: transparent !important;
          box-shadow: none !important;
          transition: all 0.15s ease-in-out;
        }
        .program-themed-tabs button[data-slot="tabs-trigger"][data-state="inactive"]:hover,
        .program-themed-tabs [role="tab"][data-state="inactive"]:hover {
          color: ${primaryColor} !important;
          background-color: ${hexToRgba(primaryColor, 0.08)} !important;
        }
        .program-themed-tabs [data-slot="tabs-content"],
        .program-themed-tabs [role="tabpanel"] {
          background-color: transparent !important;
          box-shadow: none !important;
        }

        /* Footer Theming for Department Page */
        .program-themed-page footer {
          border-top-color: ${hexToRgba(primaryColor, 0.2)} !important;
        }
        .program-themed-page footer a:hover {
          color: ${primaryColor} !important;
        }
        .program-themed-page footer .text-primary {
          color: ${primaryColor} !important;
        }
        .program-themed-page footer .footer-social-btn:hover {
          background-color: ${primaryColor} !important;
          color: #ffffff !important;
        }
        .program-themed-page footer .footer-social-btn:hover svg {
          color: #ffffff !important;
        }
      `}</style>

      {/* ========================================================================= */}
      {/* DEDICATED DEPARTMENT HEADER (هيدر مخصص للقسم بدلاً من هيدر النظام)          */}
      {/* ========================================================================= */}
      <DepartmentNavbar
        faculty={faculty}
        program={program}
        primaryColor={primaryColor}
        accentColor={accentColor}
      />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HEADER SECTION (3 Variants: hero_split | hero_full | minimal)             */}
        {/* ========================================================================= */}

        {/* 1. HERO SPLIT (Default) - Department Image Background & Clean Layout */}
        {headerStyle === "hero_split" && (
          <section className="relative overflow-hidden border-b py-14 sm:py-20 text-white min-h-[380px] flex items-center">
            {/* Background Image / Banner */}
            {heroBanner ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroBanner}
                alt={program.nameAr}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            ) : (
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${hexToRgba(primaryColor, 0.88)} 50%, #0F172A 100%)`,
                }}
              />
            )}

            {/* Branded Gradient Overlay for high readability */}
            <div
              className="absolute inset-0"
              style={{
                background: heroBanner
                  ? `linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, ${hexToRgba(primaryColor, 0.82)} 60%, rgba(15, 23, 42, 0.72) 100%)`
                  : `radial-gradient(ellipse at 80% 20%, ${hexToRgba(accentColor, 0.22)} 0%, transparent 60%), linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.88) 100%)`,
              }}
            />

            <div className="section-container relative z-10 w-full">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* Text and Actions */}
                <div className="space-y-4 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="font-bold gap-1 bg-white/20 text-white border-white/30 backdrop-blur-md"
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      {isArabic ? faculty.nameAr : faculty.nameEn}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs font-mono text-white/90 border-white/30 bg-black/20 backdrop-blur-xs"
                    >
                      {program.creditHours} {t("common.creditHours")} • {program.duration} {isArabic ? "سنوات" : "Years"}
                    </Badge>
                  </div>

                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
                    {isArabic ? program.nameAr : program.nameEn}
                  </h1>

                  {motto && (
                    <div className="flex items-center gap-2 pt-0.5">
                      <Badge
                        className="text-xs sm:text-sm font-bold gap-1.5 px-3 py-1 border shadow-xs"
                        style={{
                          backgroundColor: hexToRgba(accentColor, 0.22),
                          color: accentColor,
                          borderColor: hexToRgba(accentColor, 0.45),
                        }}
                      >
                        <Sparkles className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
                        <span>{motto}</span>
                      </Badge>
                    </div>
                  )}

                  <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-3xl drop-shadow-xs">
                    {isArabic ? program.descriptionAr : program.descriptionEn}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-3">
                    <Button
                      asChild
                      size="lg"
                      className="font-bold gap-2 text-slate-900 bg-white hover:bg-white/90 shadow-xl"
                    >
                      <Link href="/admissions">
                        {isArabic ? "تقديم طلب القبول" : "Apply for Admission"}
                        <Arrow className="h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="font-bold gap-2 text-white border-white/40 bg-black/25 hover:bg-black/40 backdrop-blur-xs shadow-md"
                    >
                      <a href="#curriculum">
                        <BookOpen className="h-4 w-4" />
                        {isArabic ? "الخطة والمقررات" : "Study Plan"}
                      </a>
                    </Button>

                    {program.guideDocumentUrl && (
                      <Button
                        asChild
                        variant="ghost"
                        size="lg"
                        className="font-bold gap-2 text-white/90 hover:text-white hover:bg-white/10"
                      >
                        <a href={program.guideDocumentUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                          {isArabic ? "دليل التخصص PDF" : "Prospectus PDF"}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Optional department logo badge on the side if uploaded */}
                {logoUrl && (
                  <div className="hidden lg:flex items-center justify-center shrink-0">
                    <div className="w-32 h-32 rounded-3xl bg-white/15 backdrop-blur-md p-4 border border-white/25 shadow-2xl flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain filter drop-shadow-md" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 2. HERO FULL (Cinematic) */}
        {headerStyle === "hero_full" && (
          <section className="relative min-h-[460px] flex items-center py-20 overflow-hidden text-white">
            {heroBanner ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroBanner}
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor} 0%, #0F172A 100%)`,
                }}
              />
            )}
            {/* Color Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, rgba(0,0,0,0.92) 0%, ${hexToRgba(primaryColor, 0.78)} 60%, rgba(0,0,0,0.65) 100%)`,
              }}
            />

            <div className="section-container relative z-10 space-y-5">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-md">
                {isArabic ? faculty.nameAr : faculty.nameEn}
              </Badge>

              <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl">
                {isArabic ? program.nameAr : program.nameEn}
              </h1>

              {motto && (
                <div className="flex items-center gap-2">
                  <Badge
                    className="text-sm sm:text-base font-bold gap-2 px-3.5 py-1.5 border shadow-sm"
                    style={{
                      backgroundColor: hexToRgba(accentColor, 0.25),
                      color: accentColor,
                      borderColor: hexToRgba(accentColor, 0.5),
                    }}
                  >
                    <Sparkles className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
                    <span>{motto}</span>
                  </Badge>
                </div>
              )}

              <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl drop-shadow-sm">
                {isArabic ? program.descriptionAr : program.descriptionEn}
              </p>

              <div className="flex flex-wrap gap-3 pt-3">
                <Button asChild size="lg" className="font-bold gap-2 bg-white text-slate-900 hover:bg-white/90 shadow-lg">
                  <Link href="/admissions">
                    {isArabic ? "تقديم طلب القبول" : "Apply for Admission"}
                    <Arrow className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-bold gap-2 text-white border-white/50 bg-black/30 hover:bg-black/50">
                  <a href="#curriculum">
                    <BookOpen className="h-4 w-4" />
                    {isArabic ? "الخطة والمقررات" : "Study Plan"}
                  </a>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* 3. MINIMAL HEADER */}
        {headerStyle === "minimal" && (
          <section className="border-b bg-background py-8 sm:py-10">
            <div className="section-container space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                    {isArabic ? program.nameAr : program.nameEn}
                  </h1>
                  {motto && (
                    <p className="text-xs font-bold mt-1 flex items-center gap-1.5" style={{ color: accentColor }}>
                      <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: accentColor }} />
                      <span>{motto}</span>
                    </p>
                  )}
                </div>
                <Button asChild className="font-bold gap-2 shrink-0 text-white shadow-md" style={{ backgroundColor: primaryColor }}>
                  <Link href="/admissions">
                    {isArabic ? "التقديم الآن" : "Apply Now"}
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* DYNAMIC MODULAR SECTIONS ENGINE                                          */}
        {/* ========================================================================= */}
        {sectionsOrder.map((sectionId) => {
          const secConf = sectionsConfig[sectionId] || {};
          const bgProps = getSectionBgProps(secConf.bgStyle);

          // 1. KEY STATISTICS SECTION
          if (sectionId === "stats" && (layout.showQuickStats ?? true)) {
            const isCompact = secConf.layoutVariant === "compact";
            return (
              <section key="stats" id="stats" className={`py-12 ${bgProps.className}`} style={bgProps.style}>
                <div className="section-container space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-6 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
                        <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                          {secConf.titleAr || (isArabic ? "أرقام وإحصائيات القسم" : "Department by the Numbers")}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground ps-5">
                        {secConf.subtitleAr || (isArabic ? "مؤشرات التميز الأكاديمي والطلابي والبحثي في التخصص" : "Key academic and excellence indicators")}
                      </p>
                    </div>
                  </div>

                  {isCompact ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: isArabic ? "مدة الدراسة" : "Duration", val: `${program.duration} ${isArabic ? "سنوات" : "Years"}`, icon: Clock, isAccent: false },
                        { label: isArabic ? "الساعات المعتمدة" : "Credit Hours", val: `${program.creditHours}`, icon: GraduationCap, isAccent: false },
                        { label: isArabic ? "الحد الأدنى للقبول" : "Min Score", val: `${program.minScorePercent}%`, icon: Target, isAccent: true },
                        { label: isArabic ? "المخابر التخصصية" : "Labs", val: `${facilities.length || program.labsCount || 6}`, icon: FlaskConical, isAccent: false },
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        const itemColor = item.isAccent ? accentColor : primaryColor;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.45, delay: idx * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="h-full"
                          >
                            <div
                              className="p-4 rounded-2xl border shadow-2xs flex items-center gap-3 transition-all card-stat-pulse h-full"
                              style={{
                                background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.04)} 0%, ${hexToRgba(primaryColor, 0.01)} 100%)`,
                                borderColor: item.isAccent ? hexToRgba(accentColor, 0.35) : hexToRgba(primaryColor, 0.16),
                              }}
                            >
                              <div
                                className="p-2.5 rounded-xl shrink-0 stat-icon"
                                style={{
                                  backgroundColor: hexToRgba(itemColor, 0.12),
                                  color: itemColor,
                                }}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="text-lg font-black block stat-number" style={{ color: itemColor }}>{item.val}</span>
                                <span className="block text-xs text-muted-foreground font-medium">{item.label}</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { icon: Clock, val: `${program.duration} ${isArabic ? "سنوات" : "Years"}`, label: isArabic ? "مدة الدراسة" : "Duration", isAccent: false },
                        { icon: GraduationCap, val: program.creditHours, label: t("common.creditHours"), isAccent: false },
                        { icon: Target, val: `${program.minScorePercent}%`, label: isArabic ? "الحد الأدنى للثانوية" : "Min Score", isAccent: true },
                        { icon: FlaskConical, val: facilities.length || program.labsCount || 6, label: isArabic ? "مخابر ومشاغل متطورة" : "Specialized Labs", isAccent: false },
                        { icon: Users, val: `${program.studentsCount || 350}+`, label: isArabic ? "طالب مقيد بالقسم" : "Active Students", isAccent: false },
                        { icon: FileText, val: `${program.researchPapersCount || 80}+`, label: isArabic ? "بحث وورقة علمية" : "Published Papers", isAccent: false },
                        { icon: Award, val: `${program.employmentRate || 90}%`, label: isArabic ? "نسبة توظيف الخريجين" : "Employment Rate", isAccent: true },
                        { icon: DollarSign, val: `${(program.tuitionSyrian / 1000).toFixed(0)}K`, label: `${program.tuitionCurrency?.syrian || "ل.س"}${isArabic ? " / ساعة معتمدة" : " / hour"}`, isAccent: false },
                      ].map((stat, idx) => {
                        const Icon = stat.icon;
                        const statColor = stat.isAccent ? accentColor : primaryColor;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, delay: (idx % 4) * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="h-full"
                          >
                            <Card
                              className="card-stat-pulse rounded-2xl border h-full"
                              style={{
                                background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.04)} 0%, ${hexToRgba(primaryColor, 0.01)} 100%)`,
                                borderColor: stat.isAccent ? hexToRgba(accentColor, 0.35) : hexToRgba(primaryColor, 0.16),
                              }}
                            >
                              <CardContent className="p-5 flex items-center gap-3.5 h-full">
                                <div
                                  className="p-3 rounded-2xl shrink-0 stat-icon"
                                  style={{
                                    backgroundColor: hexToRgba(statColor, 0.12),
                                    color: statColor,
                                  }}
                                >
                                  <Icon className="h-6 w-6" />
                                </div>
                                <div>
                                  <span className="text-2xl font-black block stat-number" style={{ color: statColor }}>
                                    {stat.val}
                                  </span>
                                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          // 2. HEAD OF DEPARTMENT MESSAGE
          if (sectionId === "head" && (layout.showDeanMessage ?? true)) {
            const isSplit = (secConf.layoutVariant || "split") === "split";
            return (
              <section key="head" id="head" className={`py-14 sm:py-20 ${bgProps.className}`} style={bgProps.style}>
                <div className="section-container">
                  <div className="mb-8 space-y-1 text-center sm:text-start">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <span className="w-2.5 h-6 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
                      <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        {secConf.titleAr || (isArabic ? "كلمة رئيس القسم" : "Head of Department Message")}
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground sm:ps-5">
                      {secConf.subtitleAr || (isArabic ? "الرؤية الأكاديمية والخطط المستقبلية لتطوير التخصص" : "Academic vision and roadmap for the department")}
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 35, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    <div
                      className={`rounded-3xl border p-6 sm:p-10 shadow-lg card-editorial-quote ${isSplit ? "grid grid-cols-1 md:grid-cols-12 gap-8 items-center" : "space-y-6"}`}
                      style={{
                        background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.045)} 0%, ${hexToRgba(primaryColor, 0.01)} 100%)`,
                        borderColor: hexToRgba(primaryColor, 0.2),
                        boxShadow: `0 10px 30px -5px ${hexToRgba(primaryColor, 0.08)}`,
                      }}
                    >
                      <div className={isSplit ? "md:col-span-4 flex flex-col items-center text-center space-y-3" : "flex items-center gap-4"}>
                        <div
                          className="relative group w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 p-1 shadow-md overflow-hidden editorial-portrait"
                          style={{ borderColor: hexToRgba(primaryColor, 0.4) }}
                        >
                          {headPhoto ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={headPhoto} alt={headName || "Head"} className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center rounded-2xl"
                              style={{ backgroundColor: hexToRgba(primaryColor, 0.08) }}
                            >
                              <Crown className="h-12 w-12" style={{ color: primaryColor }} />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Badge
                            className="font-bold text-xs gap-1 border shadow-2xs mb-1"
                            style={{
                              backgroundColor: hexToRgba(accentColor, 0.14),
                              color: accentColor,
                              borderColor: hexToRgba(accentColor, 0.35),
                            }}
                          >
                            <Crown className="h-3 w-3 mr-1" style={{ color: accentColor }} />
                            {isArabic ? "رئيس القسم" : "Head of Department"}
                          </Badge>
                          <h3 className="font-bold text-lg text-foreground">{headName || (isArabic ? "رئيس القسم" : "Head of Dept")}</h3>
                          <p className="text-xs font-semibold" style={{ color: primaryColor }}>
                            {isArabic ? `رئاسة ${program.nameAr}` : `Head of ${program.nameEn}`}
                          </p>
                        </div>
                      </div>

                      <div className={isSplit ? "md:col-span-8 space-y-4" : "space-y-4"}>
                        <Quote className="h-8 w-8 quote-watermark" style={{ color: accentColor, opacity: 0.35 }} />
                        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                          {headMessage ||
                            (isArabic
                              ? "أهلاً بكم في قسمنا الأكاديمي. نعمل بجهد متواصل لتمكين طلبتنا من أحدث المعارف النظرية والتطبيقية، وربطهم بسوق العمل عبر مشاريع واقعية وبنية مخبرية رائدة تضمن تفوقهم وتخرجهم على أعلى درجات الكفاءة."
                              : "Welcome to our department. We are dedicated to providing our students with cutting-edge academic curricula and hands-on skills, preparing them to lead in the rapidly evolving job market.")}
                        </p>

                        {secConf.showCta && (
                          <div className="pt-2">
                            <Button asChild size="sm" className="font-bold text-white shadow-md" style={{ backgroundColor: primaryColor }}>
                              <a href={secConf.ctaLink || "#contact"}>
                                {secConf.ctaTextAr || (isArabic ? "تواصل مع رئاسة القسم" : "Contact Dept Head")}
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>
            );
          }

          // NEWS & ANNOUNCEMENTS SECTION
          if (sectionId === "news" && ((layout as any).showNews ?? true) && sortedProgramNews.length > 0) {
            const sConf = sectionsConfig.news || {};
            const bgProps = getSectionBgProps(sConf.bgStyle, "bg-muted/20");
            const title =
              (isArabic ? sConf.titleAr : sConf.titleEn) ||
              (isArabic ? `أخبار وإعلانات ${program.nameAr}` : `${program.nameEn} News`);
            const subtitle =
              (isArabic ? sConf.subtitleAr : sConf.subtitleEn) ||
              (isArabic
                ? "أحدث أنشطة ومسابقات وابتكارات طلاب وأساتذة القسم"
                : "Latest updates, hackathons, and innovations");
            const limit = sConf.itemLimit && sConf.itemLimit > 0 ? sConf.itemLimit : undefined;
            const displayedNews = limit ? sortedProgramNews.slice(0, limit) : sortedProgramNews;

            return (
              <AcademicsNewsCarousel
                key="news"
                articles={displayedNews}
                title={title}
                subtitle={subtitle}
                viewAllHref={sConf.ctaLink || "/news"}
                viewAllText={(isArabic ? sConf.ctaTextAr : sConf.ctaTextEn) || (isArabic ? "عرض الكل" : "View All")}
                primaryColor={primaryColor}
                accentColor={accentColor}
                scopeBadgeText={isArabic ? `أخبار ${program.nameAr}` : `${program.nameEn} News`}
                bgProps={bgProps}
              />
            );
          }

          // 3. CURRICULUM & STUDY PLAN
          if (sectionId === "curriculum" && ((layout as any).showCurriculum ?? true)) {
            return (
              <section key="curriculum" id="curriculum" className={`py-14 sm:py-20 ${bgProps.className}`} style={bgProps.style}>
                <div className="section-container space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-6 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
                        <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                          {secConf.titleAr || (isArabic ? "الخطة الدراسية وتوزيع المقررات" : "Curriculum & Syllabi")}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground ps-5">
                        {secConf.subtitleAr || (isArabic ? `يتكون البرنامج من ${program.creditHours} ساعة معتمدة موزعة على ${program.duration} سنوات دراسية` : `The program consists of ${program.creditHours} credit hours distributed over ${program.duration} academic years`)}
                      </p>
                    </div>

                    {(secConf.showCta || program.guideDocumentUrl) && (
                      <Button asChild variant="outline" size="sm" className="font-bold gap-2">
                        <a href={program.guideDocumentUrl || secConf.ctaLink || "#"} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                          {secConf.ctaTextAr || (isArabic ? "تحميل الخطة الكاملة PDF" : "Download Full Syllabus")}
                        </a>
                      </Button>
                    )}
                  </div>

                  {curriculum.length === 0 ? (
                    <div className="p-12 text-center border rounded-3xl bg-muted/10 text-muted-foreground text-sm space-y-3">
                      <BookOpen className="h-10 w-10 mx-auto opacity-40" style={{ color: primaryColor }} />
                      <p className="font-bold text-foreground">
                        {isArabic ? "الخطة الدراسية قيد الإدراج والاعتماد" : "Curriculum plan under update"}
                      </p>
                      <p className="text-xs max-w-md mx-auto leading-relaxed">
                        {isArabic
                          ? "يتم حالياً إدراج المقررات الدراسية المعتمدة لهذا القسم عبر لوحة التحكم الأكاديمية."
                          : "Approved courses are currently being added via the administrative portal."}
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
                    >
                      <Card
                        className="border shadow-md rounded-3xl overflow-hidden program-themed-tabs card-interactive-border"
                        style={{
                          background: `linear-gradient(180deg, ${hexToRgba(primaryColor, 0.03)} 0%, transparent 100%)`,
                          borderColor: hexToRgba(primaryColor, 0.16),
                        }}
                      >
                        <CardContent className="p-4 sm:p-6">
                          <Tabs defaultValue="year-1" className="w-full">
                            <TabsList
                              className="grid w-full h-auto p-1.5 mb-6 rounded-2xl border"
                              style={{
                                backgroundColor: hexToRgba(primaryColor, 0.06),
                                borderColor: hexToRgba(primaryColor, 0.14),
                                gridTemplateColumns: `repeat(${curriculum.length || 1}, minmax(0, 1fr))`,
                              }}
                            >
                              {curriculum.map((yearData) => (
                                <TabsTrigger
                                  key={yearData.year}
                                  value={`year-${yearData.year}`}
                                  className="py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all"
                                  onClick={() => setExpandedCourse(null)}
                                >
                                  {isArabic ? `السنة ${yearData.year}` : `Year ${yearData.year}`}
                                </TabsTrigger>
                              ))}
                            </TabsList>

                            {curriculum.map((yearData) => (
                              <TabsContent key={yearData.year} value={`year-${yearData.year}`} className="space-y-6">
                                <Tabs defaultValue="sem-1" className="w-full">
                                  <TabsList
                                    className="grid grid-cols-2 w-full h-auto p-1.5 mb-6 rounded-2xl border"
                                    style={{
                                      backgroundColor: hexToRgba(primaryColor, 0.04),
                                      borderColor: hexToRgba(primaryColor, 0.14),
                                    }}
                                  >
                                    {yearData.semesters.map((semData) => (
                                      <TabsTrigger
                                        key={semData.semester}
                                        value={`sem-${semData.semester}`}
                                        className="py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all"
                                        onClick={() => setExpandedCourse(null)}
                                      >
                                        {isArabic
                                          ? `الفصل ${semData.semester === 1 ? "الأول" : "الثاني"}`
                                          : `Semester ${semData.semester === 1 ? "I" : "II"}`}
                                      </TabsTrigger>
                                    ))}
                                  </TabsList>

                                  {yearData.semesters.map((semData) => (
                                    <TabsContent key={semData.semester} value={`sem-${semData.semester}`}>
                                      <div
                                        className="overflow-x-auto border rounded-2xl bg-card shadow-2xs"
                                        style={{ borderColor: hexToRgba(primaryColor, 0.15) }}
                                      >
                                        <Table>
                                          <TableHeader>
                                            <TableRow
                                              className="border-b"
                                              style={{
                                                backgroundColor: hexToRgba(primaryColor, 0.07),
                                                borderColor: hexToRgba(primaryColor, 0.14),
                                              }}
                                            >
                                              <TableHead className="w-[120px] font-semibold">{isArabic ? "الرمز" : "Code"}</TableHead>
                                              <TableHead className="font-semibold">{isArabic ? "اسم المقرر" : "Course Name"}</TableHead>
                                              <TableHead className="w-[100px] text-center font-semibold">{isArabic ? "الساعات" : "Credits"}</TableHead>
                                              <TableHead className="w-[160px] font-semibold">{isArabic ? "المتطلب السابق" : "Prerequisite"}</TableHead>
                                              <TableHead className="w-[50px]" />
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {semData.courses.map((course) => {
                                              const isExpanded = expandedCourse === course.code;
                                              return (
                                                <React.Fragment key={course.code}>
                                                  <TableRow
                                                    className="cursor-pointer program-course-row group"
                                                    onClick={() => setExpandedCourse(isExpanded ? null : course.code)}
                                                  >
                                                    <TableCell className="font-mono font-bold" style={{ color: primaryColor }}>
                                                      {course.code}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-foreground">
                                                      {isArabic ? course.nameAr : course.nameEn}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      <span
                                                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
                                                        style={{
                                                          backgroundColor: hexToRgba(accentColor, 0.12),
                                                          color: accentColor,
                                                          border: `1px solid ${hexToRgba(accentColor, 0.28)}`,
                                                        }}
                                                      >
                                                        {course.hours} {isArabic ? "س" : "h"}
                                                      </span>
                                                    </TableCell>
                                                    <TableCell>
                                                      <Badge variant="outline" className="text-xs">
                                                        {isArabic ? course.prerequisitesAr : course.prerequisitesEn}
                                                      </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-end">
                                                      {isExpanded ? (
                                                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                      ) : (
                                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                      )}
                                                    </TableCell>
                                                  </TableRow>

                                                  {isExpanded && (
                                                    <TableRow
                                                      className="hover:bg-transparent"
                                                      style={{
                                                        backgroundColor: hexToRgba(primaryColor, 0.03),
                                                        borderBottom: `1px solid ${hexToRgba(primaryColor, 0.12)}`,
                                                      }}
                                                    >
                                                      <TableCell colSpan={5} className="p-0 border-t-0 whitespace-normal">
                                                        <div className="p-6 space-y-4 animate-in fade-in-50 duration-200">
                                                          <div className="grid gap-6 md:grid-cols-3">
                                                            <div className="md:col-span-2 space-y-2">
                                                              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: primaryColor }}>
                                                                <BookOpen className="h-4 w-4" />
                                                                {isArabic ? "وصف المقرر العلمي" : "Course Description"}
                                                              </h4>
                                                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                                                {isArabic ? course.descriptionAr : course.descriptionEn}
                                                              </p>
                                                            </div>

                                                            <div className="space-y-2 border-s ps-4">
                                                              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: primaryColor }}>
                                                                <Target className="h-4 w-4" />
                                                                {isArabic ? "أهداف ومخرجات المقرر" : "Course Objectives"}
                                                              </h4>
                                                              <div className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                                                                {isArabic ? course.objectivesAr : course.objectivesEn}
                                                              </div>
                                                            </div>
                                                          </div>

                                                          <div className="space-y-2 pt-2 border-t">
                                                            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: primaryColor }}>
                                                              <FileText className="h-4 w-4" />
                                                              {isArabic ? "المحاور والمواضيع الرئيسية" : "Key Topics Covered"}
                                                            </h4>
                                                            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                                                              {(isArabic ? course.topicsAr : course.topicsEn).map((topic, idx) => (
                                                                <div
                                                                  key={idx}
                                                                  className="flex items-start gap-2 p-2 rounded-lg bg-card border text-xs text-muted-foreground"
                                                                  style={{ borderColor: hexToRgba(primaryColor, 0.12) }}
                                                                >
                                                                  <Badge
                                                                    className="shrink-0 h-4 w-4 p-0 flex items-center justify-center rounded-full text-[10px] text-white"
                                                                    style={{
                                                                      background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`
                                                                    }}
                                                                  >
                                                                    {idx + 1}
                                                                  </Badge>
                                                                  <span>{topic}</span>
                                                                </div>
                                                              ))}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </TableCell>
                                                    </TableRow>
                                                  )}
                                                </React.Fragment>
                                              );
                                            })}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </TabsContent>
                                  ))}
                                </Tabs>
                              </TabsContent>
                            ))}
                          </Tabs>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>
              </section>
            );
          }

          // 4. CAREER PATHS & HORIZONS
          if (sectionId === "career_paths" && ((layout as any).showCareerPaths ?? true)) {
            const isList = secConf.layoutVariant === "list";
            const isChips = secConf.layoutVariant === "compact";
            return (
              <section key="career_paths" id="career_paths" className={`py-14 sm:py-20 ${bgProps.className}`} style={bgProps.style}>
                <div className="section-container space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-6 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
                        <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                          {secConf.titleAr || (isArabic ? "الفرص والآفاق المهنية للخريجين" : "Career Paths & Horizons")}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground ps-5">
                        {secConf.subtitleAr || (isArabic ? "القطاعات والوظائف الحيوية التي تفتح أبوابها لخريجي هذا التخصص" : "High demand industry sectors and roles for graduates")}
                      </p>
                    </div>

                    {secConf.showCta && (
                      <Button asChild size="sm" className="font-bold text-white shadow-md" style={{ backgroundColor: primaryColor }}>
                        <a href={secConf.ctaLink || "#careers"}>
                          {secConf.ctaTextAr || (isArabic ? "استكشف شراكات التوظيف" : "Career Partnerships")}
                        </a>
                      </Button>
                    )}
                  </div>

                  {isChips ? (
                    <div className="flex flex-wrap gap-2.5">
                      {careerItems.map((role, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95, y: 15 }}
                          whileInView={{ opacity: 1, scale: 1, y: 0 }}
                          viewport={{ once: true, margin: "-30px" }}
                          transition={{ duration: 0.35, delay: (idx % 8) * 0.05 }}
                        >
                          <div
                            className="p-3 rounded-xl border shadow-2xs flex items-center gap-2 card-magnetic-shift"
                            style={{
                              background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.04)} 0%, ${hexToRgba(primaryColor, 0.01)} 100%)`,
                              borderColor: hexToRgba(primaryColor, 0.16),
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 shrink-0 magnetic-icon" style={{ color: accentColor }} />
                            <span className="font-medium text-xs sm:text-sm">{role}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : isList ? (
                    <div className="space-y-3">
                      {careerItems.map((role, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-30px" }}
                          transition={{ duration: 0.4, delay: (idx % 6) * 0.06 }}
                        >
                          <div
                            className="p-4 rounded-2xl border shadow-2xs flex items-center justify-between card-magnetic-shift"
                            style={{
                              background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.04)} 0%, ${hexToRgba(primaryColor, 0.01)} 100%)`,
                              borderColor: hexToRgba(primaryColor, 0.16),
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="p-2.5 rounded-xl shrink-0 magnetic-icon"
                                style={{
                                  backgroundColor: hexToRgba(primaryColor, 0.12),
                                  color: primaryColor,
                                }}
                              >
                                <Briefcase className="h-5 w-5" />
                              </div>
                              <span className="font-bold text-sm sm:text-base text-foreground">{role}</span>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs font-bold"
                              style={{
                                borderColor: hexToRgba(accentColor, 0.35),
                                backgroundColor: hexToRgba(accentColor, 0.08),
                                color: accentColor,
                              }}
                            >
                              {isArabic ? "مطلوب بسوق العمل" : "High Demand"}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {careerItems.map((role, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 25 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.45, delay: (idx % 6) * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                          className="h-full"
                        >
                          <Card
                            className="card-magnetic-shift rounded-2xl border h-full"
                            style={{
                              background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.04)} 0%, ${hexToRgba(primaryColor, 0.01)} 100%)`,
                              borderColor: hexToRgba(primaryColor, 0.16),
                            }}
                          >
                            <CardContent className="p-5 space-y-2 h-full">
                              <div
                                className="p-3 rounded-2xl w-fit magnetic-icon shadow-2xs"
                                style={{
                                  backgroundColor: hexToRgba(accentColor, 0.12),
                                  color: accentColor,
                                }}
                              >
                                <Briefcase className="h-5 w-5" />
                              </div>
                              <h4 className="font-bold text-base text-foreground pt-1">{role}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {isArabic
                                  ? "فرص وظيفية واعدة لدى الشركات المحلية والعالمية، وشركات التقنية ومراكز الابتكار."
                                  : "Exciting career opportunities at local, regional and multinational organizations."}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          // 5. SPECIALIZED LABORATORIES & FACILITIES
          if (sectionId === "facilities" && (layout.showFacilities ?? true)) {
            const displayLimit = secConf.itemLimit || 6;
            const shownFacilities = facilities.slice(0, displayLimit);
            return (
              <section key="facilities" id="facilities" className={`py-14 sm:py-20 ${bgProps.className}`} style={bgProps.style}>
                <div className="section-container space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-6 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
                        <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                          {secConf.titleAr || (isArabic ? "المختبرات والمشاغل التخصصية" : "Specialized Labs & Facilities")}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground ps-5">
                        {secConf.subtitleAr || (isArabic ? "بنية تحتية تطبيقية متطورة تدعم الجانب العملي والتجريبي للطلاب" : "Cutting-edge infrastructure supporting hands-on practical training")}
                      </p>
                    </div>

                    {secConf.showCta && (
                      <Button asChild size="sm" variant="outline" className="font-bold">
                        <a href={secConf.ctaLink || "#contact"}>
                          {secConf.ctaTextAr || (isArabic ? "تجهيزات ومواعيد المخابر" : "Lab Schedules")}
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shownFacilities.map((facility, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, delay: (idx % 6) * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="h-full"
                      >
                        <Card
                          className="card-cinematic-zoom group rounded-3xl overflow-hidden border h-full flex flex-col"
                          style={{
                            background: `linear-gradient(180deg, ${hexToRgba(primaryColor, 0.03)} 0%, transparent 100%)`,
                            borderColor: hexToRgba(primaryColor, 0.16),
                          }}
                        >
                          <div
                            className="h-32 p-6 flex items-center justify-center relative overflow-hidden"
                            style={{
                              background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.12)} 0%, ${hexToRgba(primaryColor, 0.04)} 100%)`,
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
                            <div
                              className="p-4 rounded-2xl border shadow-md relative z-10 cinematic-badge"
                              style={{
                                backgroundColor: "var(--background)",
                                color: primaryColor,
                                borderColor: hexToRgba(primaryColor, 0.2),
                              }}
                            >
                              <FlaskConical className="h-8 w-8" />
                            </div>
                          </div>
                          <CardHeader className="p-5 pb-2">
                            <CardTitle className="text-base sm:text-lg font-bold">
                              {isArabic ? facility.nameAr : (facility.nameEn || facility.nameAr)}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-5 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">
                            {facility.descriptionAr || (facility.nameEn ? `Equipped for advanced coursework and student projects.` : "")}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 6. DEPARTMENT ACADEMIC STAFF (CONTINUOUS MOVING CAROUSEL)
          if (sectionId === "staff" && (layout.showStaff ?? true) && programStaff.length > 0) {
            const sConf = sectionsConfig.staff || {};
            const bgProps = getSectionBgProps(sConf.bgStyle);
            const title = (isArabic ? sConf.titleAr : sConf.titleEn) || (isArabic ? `كادر وأساتذة ${program.nameAr}` : `${program.nameEn} Faculty Staff`);
            const subtitle = (isArabic ? sConf.subtitleAr : sConf.subtitleEn) || (isArabic ? "الهيئة التدريسية" : "Academic Faculty");
            const limit = sConf.itemLimit && sConf.itemLimit > 0 ? sConf.itemLimit : undefined;
            const displayedStaff = limit ? programStaff.slice(0, limit) : programStaff;

            return (
              <AcademicsStaffCarousel
                key="staff"
                staff={displayedStaff}
                title={title}
                subtitle={subtitle}
                badgeText={`${programStaff.length} ${isArabic ? "أساتذة وباحثين" : "Faculty Members"}`}
                viewAllHref={sConf.ctaLink || "/faculty"}
                viewAllText={(isArabic ? sConf.ctaTextAr : sConf.ctaTextEn) || (isArabic ? "الدليل الكامل" : "View All Faculty")}
                primaryColor={primaryColor}
                accentColor={accentColor}
                bgProps={bgProps}
              />
            );
          }

          // 7. TOP STUDENTS & HONOR ROLL
          if (sectionId === "top_students" && (layout.showTopStudents ?? true)) {
            return (
              <div key="top_students">
                <TopStudents
                  facultySlug={faculty.slug}
                  programSlug={program.slug}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                />
              </div>
            );
          }

          // 8. ALUMNI STORIES
          if (sectionId === "alumni_stories" && (layout.showAlumniStories ?? true)) {
            return (
              <div key="alumni_stories">
                <SuccessStories
                  facultySlug={faculty.slug}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                />
              </div>
            );
          }

          return null;
        })}

        {/* ========================================================================= */}
        {/* COMPREHENSIVE ADMISSION REQUIREMENTS & TUITION FEES SECTION               */}
        {/* ========================================================================= */}
        <section
          id="admissions-fees"
          className="py-14 sm:py-20 border-t"
          style={{
            background: `linear-gradient(180deg, ${hexToRgba(primaryColor, 0.04)} 0%, transparent 100%)`,
            borderTopColor: hexToRgba(primaryColor, 0.16),
          }}
        >
          <div className="section-container space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="w-2.5 h-6 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
                <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {isArabic ? "شروط القبول والرسوم الدراسية" : "Admission Criteria & Tuition Fees"}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isArabic
                  ? "كافة التفاصيل المتعلقة بمعدلات القبول، الأوراق المطلوبة، وتكلفة الساعة المعتمدة."
                  : "Complete overview of entry requirements, required documents, and credit hour fees."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Tuition Fees Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="lg:col-span-6 h-full"
              >
                <Card
                  className="rounded-3xl border shadow-md overflow-hidden card-interactive-border h-full"
                  style={{
                    background: `linear-gradient(180deg, ${hexToRgba(primaryColor, 0.03)} 0%, transparent 100%)`,
                    borderColor: hexToRgba(primaryColor, 0.18),
                  }}
                >
                  <CardHeader
                    className="p-6 pb-4 border-b"
                    style={{
                      backgroundColor: hexToRgba(primaryColor, 0.07),
                      borderBottomColor: hexToRgba(primaryColor, 0.12),
                    }}
                  >
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <DollarSign className="h-5 w-5" style={{ color: primaryColor }} />
                      {isArabic ? "الرسوم والأقساط الدراسية" : "Tuition Fees Breakdown"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow
                            style={{
                              backgroundColor: hexToRgba(primaryColor, 0.05),
                              borderColor: hexToRgba(primaryColor, 0.12),
                            }}
                          >
                            <TableHead className="text-start">{isArabic ? "الفئة" : "Category"}</TableHead>
                            <TableHead className="text-start">{isArabic ? "الرسم / ساعة" : "Fee / Hour"}</TableHead>
                            <TableHead className="text-start">{isArabic ? "الإجمالي التقديري" : "Estimated Total"}</TableHead>
                            <TableHead className="text-center">{isArabic ? "الفئة" : "Category"}</TableHead>
                            <TableHead className="text-center">{isArabic ? "الرسم / ساعة" : "Fee / Hour"}</TableHead>
                            <TableHead className="text-center">{isArabic ? "الإجمالي التقديري" : "Estimated Total"}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-bold text-xs sm:text-sm">
                              {isArabic ? "الطلاب السوريون" : "Syrian Students"}
                            </TableCell>
                            <TableCell className="text-xs font-mono">
                              {program.tuitionSyrian.toLocaleString()} {program.tuitionCurrency?.syrian || "ل.س"}
                            </TableCell>
                            <TableCell className="text-xs font-mono font-bold" style={{ color: primaryColor }}>
                              {(program.tuitionSyrian * program.creditHours).toLocaleString()} {program.tuitionCurrency?.syrian || "ل.س"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-bold text-xs sm:text-sm">
                              {isArabic ? "غير المقيمين والوافدون" : "Non-Residents"}
                            </TableCell>
                            <TableCell className="text-xs font-mono">
                              ${program.tuitionNonResident} {program.tuitionCurrency?.nonResident || "USD"}
                            </TableCell>
                            <TableCell className="text-xs font-mono font-bold" style={{ color: primaryColor }}>
                              ${(program.tuitionNonResident * program.creditHours).toLocaleString()} {program.tuitionCurrency?.nonResident || "USD"}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div
                      className="p-3.5 rounded-2xl border text-xs text-muted-foreground space-y-1"
                      style={{
                        backgroundColor: hexToRgba(primaryColor, 0.035),
                        borderColor: hexToRgba(primaryColor, 0.12),
                      }}
                    >
                      <p className="font-bold text-foreground">{isArabic ? "المنح والحسومات المعتمدة:" : "Scholarships & Discounts:"}</p>
                      <p>• {isArabic ? "5% منح كاملة مخصصة لوزارة التعليم العالي والبحث العلمي." : "5% Full Scholarships for the Ministry of Higher Education."}</p>
                      <p>• {isArabic ? "خصومات تشجيعية خاصة للتفوق الأكاديمي ولأبناء الشهداء والأخوة." : "Academic excellence and sibling discount packages."}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Admission Criteria Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="lg:col-span-6 h-full"
              >
                <Card
                  className="rounded-3xl border shadow-md overflow-hidden card-interactive-border h-full"
                  style={{
                    background: `linear-gradient(180deg, ${hexToRgba(primaryColor, 0.03)} 0%, transparent 100%)`,
                    borderColor: hexToRgba(primaryColor, 0.18),
                  }}
                >
                  <CardHeader
                    className="p-6 pb-4 border-b"
                    style={{
                      backgroundColor: hexToRgba(primaryColor, 0.07),
                      borderBottomColor: hexToRgba(primaryColor, 0.12),
                    }}
                  >
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Target className="h-5 w-5" style={{ color: accentColor }} />
                      {isArabic ? "شروط ومعايير القبول" : "Admission Requirements"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className="p-3 rounded-2xl border"
                        style={{
                          backgroundColor: hexToRgba(accentColor, 0.08),
                          borderColor: hexToRgba(accentColor, 0.35),
                        }}
                      >
                        <span className="text-[11px] block font-medium" style={{ color: accentColor }}>{isArabic ? "الحد الأدنى للثانوية" : "Min Score"}</span>
                        <span className="text-xl font-bold" style={{ color: accentColor }}>{program.minScorePercent}%</span>
                      </div>
                      <div
                        className="p-3 rounded-2xl border"
                        style={{
                          backgroundColor: hexToRgba(primaryColor, 0.04),
                          borderColor: hexToRgba(primaryColor, 0.14),
                        }}
                      >
                        <span className="text-[11px] text-muted-foreground block">{isArabic ? "مجموع الدرجات" : "Min Points"}</span>
                        <span className="text-xl font-bold" style={{ color: primaryColor }}>{program.minScorePoints} {isArabic ? "درجة" : "pts"}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <p className="font-bold text-foreground">{isArabic ? "المؤهل الدراسي المطلوب:" : "Required Credential:"}</p>
                      <p>
                        {isArabic
                          ? `الشهادة الثانوية العامة السورية أو ما يعادلها (الفرع ${program.branch === "scientific" ? "العلمي" : program.branch === "literary" ? "الأدبي" : "العلمي أو الأدبي"}).`
                          : `Syrian Baccalaureate or equivalent (${program.branch === "scientific" ? "Scientific" : "Scientific/Literary"}).`}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <p className="font-bold text-foreground">{isArabic ? "المستندات المطلوبة للتسجيل:" : "Required Documents:"}</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>{isArabic ? "صورة مصدقة أصولاً عن الشهادة الثانوية" : "Certified copy of High School Certificate"}</li>
                        <li>{isArabic ? "صورة الهوية الشخصية أو جواز السفر" : "Copy of ID / Passport"}</li>
                        <li>{isArabic ? "4 صور شخصية حديثة ملونة" : "4 Recent passport photos"}</li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <Button asChild size="lg" className="w-full font-bold text-white shadow-md hover:opacity-95" style={{ backgroundColor: primaryColor }}>
                        <Link href="/admissions">
                          {isArabic ? "بدء تقديم طلب التسجيل الإلكتروني" : "Apply for Admission Online"}
                          <Arrow className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer primaryColor={primaryColor} accentColor={accentColor} />
    </div>
  );
}
