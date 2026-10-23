"use client";

import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { FacultyNavbar } from "@/components/layout/faculty-navbar";
import { ASULogo } from "@/components/ui/asu-logo";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { useFaculties } from "@/hooks/use-faculties";
import { useNews } from "@/hooks/use-news";
import { useEvents } from "@/hooks/use-events";
import { useFacultyMembers } from "@/hooks/use-faculty-members";
import { TopStudents } from "@/components/academics/top-students";
import { SuccessStories } from "@/components/academics/success-stories";
import { AcademicsNewsCarousel } from "@/components/academics/news-carousel";
import { AcademicsStaffCarousel } from "@/components/academics/faculty-staff-carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Clock,
  DollarSign,
  Target,
  ChevronLeft,
  ChevronRight,
  Award,
  Crown,
  School,
  FileText,
  Sparkles,
  FlaskConical,
  Users,
  Calendar,
  MapPin,
  ExternalLink,
  Download,
  Quote,
  Mail,
  Building2,
} from "lucide-react";

function hexToRgba(hex: string, alpha: number) {
  if (!hex || !hex.startsWith("#")) return `rgba(128, 0, 0, ${alpha})`;
  let c = hex.substring(1);
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

function getDefaultFacultyFacilities(slug: string) {
  const s = (slug || "").toLowerCase();
  if (s.includes("informatic") || s.includes("comput") || s.includes("it") || s.includes("ce") || s.includes("eng")) {
    return [
      {
        nameAr: "مخبر الذكاء الاصطناعي والحوسبة الفائقة",
        nameEn: "Artificial Intelligence & HPC Lab",
        descriptionAr: "مجهز بوحدات معالجة رسومية متطورة (NVIDIA GPU Cluster) لتدريب نماذج التعلم العميق، الرؤية الحاسوبية وتطبيقات الذكاء التوليدي.",
        descriptionEn: "Equipped with advanced NVIDIA GPU clusters for deep learning, computer vision, and generative AI research.",
      },
      {
        nameAr: "مخبر النظم المدمجة وإنترنت الأشياء (IoT)",
        nameEn: "Embedded Systems & IoT Lab",
        descriptionAr: "بيئة تطبيقية متكاملة لبرمجة المتحكمات الدقيقة، المستشعرات الذكية، وأنظمة الأتمتة الصناعية والروبوتات.",
        descriptionEn: "Integrated hands-on environment for microcontroller programming, smart sensors, industrial automation, and robotics.",
      },
      {
        nameAr: "مخبر الأمن السيبراني والشبكات السحابية",
        nameEn: "Cybersecurity & Cloud Networks Lab",
        descriptionAr: "مختبر معزول لاختبار الاختراق الأخلاقي، محاكاة الهجمات والتهديدات السيبرانية، وإدارة البنى التحتية السحابية الموزعة.",
        descriptionEn: "Isolated environment for ethical hacking, penetration testing, threat simulation, and distributed cloud systems.",
      },
      {
        nameAr: "مخبر هندسة البرمجيات والواقع الافتراضي",
        nameEn: "Software Engineering & VR Studio",
        descriptionAr: "محطات عمل عالية الأداء لتصميم النظم البرمجية المعقدة، اختبار الجودة، وبناء بيئات الواقع المعزز والافتراضي.",
        descriptionEn: "High-performance workstations for large-scale software modeling, automated testing, and immersive VR/AR experiences.",
      },
    ];
  }

  if (s.includes("dent") || s.includes("med") || s.includes("health")) {
    return [
      {
        nameAr: "مخبر المحاكاة ورؤوس الفانتوم السريرية",
        nameEn: "Phantom Head & Clinical Simulation Lab",
        descriptionAr: "بيئة محاكاة سريرية متقدمة مزودة برؤوس فانتوم تفاعلية لتدريب الطلاب على المهارات السريرية التشخيصية والعلاجية.",
        descriptionEn: "Advanced phantom simulator units allowing students to master hands-on clinical and diagnostic skills in a safe environment.",
      },
      {
        nameAr: "مخبر التشريح الرقمي والمحاكاة ثلاثية الأبعاد",
        nameEn: "Digital Anatomy & 3D Virtual Dissection Lab",
        descriptionAr: "طاولات تشريح رقمية تفاعلية لعرض التفاصيل المجهرية والتشريحية بدقة فائقة وبشكل تفاعلي ثلاثي الأبعاد.",
        descriptionEn: "Interactive digital dissection tables enabling students to explore high-resolution 3D anatomical structures.",
      },
      {
        nameAr: "مخبر التعويضات والابتسامة الرقمية (CAD/CAM)",
        nameEn: "Digital Prosthetics & CAD/CAM Lab",
        descriptionAr: "أنظمة مسح وتصميم رقمي متطورة وطباعة ثلاثية الأبعاد لإنتاج التركيبات والتعويضات بدقة ميكرونية متقدمة.",
        descriptionEn: "State-of-the-art 3D scanners, CAD/CAM milling units, and fabrication systems for modern restorative dentistry.",
      },
      {
        nameAr: "مخبر البيولوجيا الجزيئية وعلم الأنسجة",
        nameEn: "Histology & Molecular Biology Lab",
        descriptionAr: "مجاهر إلكترونية متصلة بشاشات عرض عالية الدقة ومعدات تحليل الأنسجة والجينات والأبحاث الحيوية.",
        descriptionEn: "High-resolution digital microscopy and molecular analysis tools for histological and biomedical investigations.",
      },
    ];
  }

  if (s.includes("pharm")) {
    return [
      {
        nameAr: "مخبر الكيمياء الصيدلية وتصميم الدواء",
        nameEn: "Medicinal Chemistry & Drug Design Lab",
        descriptionAr: "مجهز بأجهزة قياس الطيف، المحاكاة الجزيئية، والتخليق الكيميائي للمركبات الدوائية المبتكرة.",
        descriptionEn: "Equipped with spectrophotometers, molecular modeling software, and synthesis tools for novel therapeutic compounds.",
      },
      {
        nameAr: "مخبر الصيدلانيات وتكنولوجيا النانو",
        nameEn: "Pharmaceutics & Nanotechnology Lab",
        descriptionAr: "أجهزة متقدمة لتصنيع الأشكال الصيدلانية، اختبارات الذوبان والانحلال، وتطوير نواقل الأدوية النانوية.",
        descriptionEn: "Advanced equipment for pharmaceutical dosage formulation, dissolution profiling, and nanocarrier research.",
      },
      {
        nameAr: "مخبر المراقبة الدوائية وضبط الجودة (HPLC)",
        nameEn: "Drug Quality Control & HPLC Lab",
        descriptionAr: "أجهزة الكروماتوغرافيا السائلة عالية الأداء (HPLC) والمعايرة التحليلية لضمان جودة ونقاوة المستحضرات الطبية.",
        descriptionEn: "High-Performance Liquid Chromatography (HPLC) units and analytical instrumentation for drug purity verification.",
      },
    ];
  }

  if (s.includes("arch") || s.includes("civil") || s.includes("art")) {
    return [
      {
        nameAr: "استوديو التصميم المعماري ونمذجة BIM",
        nameEn: "BIM & Architectural Design Studio",
        descriptionAr: "محطات نمذجة متقدمة وبرمجيات نمذجة معلومات البناء وتوليد الرسوم والواقع الافتراضي للمشاريع الحضرية.",
        descriptionEn: "Advanced workstations running industry-standard BIM, parametric modeling, and architectural rendering suites.",
      },
      {
        nameAr: "مخبر ميكانيك التربة وفحص المواد الإنشائية",
        nameEn: "Soil Mechanics & Materials Testing Lab",
        descriptionAr: "أجهزة قياس قوة الخرسانة، اختبارات الشد والضغط للمواد، وأجهزة الفحص الجيوتقني للتربة.",
        descriptionEn: "Universal testing machines for concrete and steel tensile/compression tests, plus geotechnical soil equipment.",
      },
      {
        nameAr: "استوديو الطباعة ثلاثية الأبعاد والتصنيع الرقمي",
        nameEn: "3D Fabrication & Prototyping Lab",
        descriptionAr: "طابعات ثلاثية الأبعاد، قواطع ليزرية CNC، وأدوات النمذجة المادية السريعة للمجسمات المعمارية.",
        descriptionEn: "3D printers, laser CNC cutters, and physical prototyping tools for rapid scale architectural model making.",
      },
    ];
  }

  return [
    {
      nameAr: "مخبر الأبحاث المتقدمة والدراسات التخصصية",
      nameEn: "Advanced Research & Studies Lab",
      descriptionAr: "بيئة بحثية تفاعلية مزودة بأحدث التجهيزات والبرمجيات المتخصصة لدعم أبحاث الطلاب ومشاريع التخرج.",
      descriptionEn: "Interactive research environment equipped with modern specialized equipment to support graduation research.",
    },
    {
      nameAr: "مخبر الحوسبة والتطبيقات الرقمية",
      nameEn: "Computing & Digital Applications Lab",
      descriptionAr: "قاعة حوسبة عالية السرعة مزودة بحزم التحليل الإحصائي وبرمجيات المحاكاة التخصصية.",
      descriptionEn: "High-speed computing facility loaded with advanced statistical analysis software and specialized simulations.",
    },
    {
      nameAr: "حاضنة الابتكار ومشاريع التخرج",
      nameEn: "Innovation & Graduation Projects Hub",
      descriptionAr: "مساحة عمل مشتركة تتيح للفرق الطلابية تطوير نماذجهم التطبيقية وربطها بمتطلبات سوق العمل والمجتمع.",
      descriptionEn: "Collaborative workspace enabling student teams to develop prototypes and align projects with industry needs.",
    },
  ];
}

export default function FacultyPage({
  params,
}: {
  params: Promise<{ faculty: string }>;
}) {
  const { faculty: facultySlug } = use(params);
  const { language, dir } = useLanguage();
  const { isPagePublished } = useSiteSettings();
  const isArabic = language === "ar";
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const BackArrow = dir === "rtl" ? ChevronRight : ChevronLeft;

  const { data: backendFaculties, isLoading } = useFaculties();
  const { data: allNews } = useNews();
  const { data: allEvents } = useEvents();
  const { data: allMembers } = useFacultyMembers();

  const displayFaculties = backendFaculties || [];
  const rawFaculty = displayFaculties.find((f) => f.slug === facultySlug);
  const faculty = rawFaculty
    ? {
        ...rawFaculty,
        programs: (rawFaculty.programs || []).filter((p) =>
          isPagePublished(`/academics/${rawFaculty.slug}/${p.slug}`)
        ),
      }
    : undefined;

  if (isLoading) {
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
            <Building2 className="h-10 w-10 text-primary animate-pulse" />
            <p className="text-sm font-bold text-muted-foreground">
              {isArabic ? "جاري تحميل بيانات الكلية..." : "Loading faculty..."}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!faculty) {
    notFound();
  }

  // Visual Identity & Theming
  const primaryColor = faculty.primaryColor || "#800000";
  const accentColor = faculty.accentColor || "#D4AF37";
  const heroBanner = faculty.heroBanner || "";
  const logoUrl = faculty.logoUrl || "";
  const motto = isArabic ? faculty.mottoAr : faculty.mottoEn;
  const layout = faculty.layoutConfig || {};
  const headerStyle = layout.headerStyle || "hero_split";

  // Filtered Faculty Specific Content
  const facultyNews = (allNews || []).filter((item) => item.faculty === faculty.id);
  const facultyEvents = (allEvents || []).filter((item) => item.faculty === faculty.id);
  const facultyStaff = (allMembers || []).filter(
    (m) => m.faculty === faculty.id || (m as any).facultySlug === faculty.slug
  );
  const rawFacilities = faculty.facilities || [];
  const facilities = rawFacilities.length > 0 ? rawFacilities : getDefaultFacultyFacilities(faculty.slug);

  // Dean Data
  const deanName = isArabic
    ? faculty.deanNameAr || faculty.deanDetail?.nameAr
    : faculty.deanNameEn || faculty.deanDetail?.nameEn;
  const deanMessage = isArabic ? faculty.deanMessageAr : faculty.deanMessageEn;
  const deanPhoto = faculty.deanPhoto || "/user.png";

  // Page Builder Ordered Sections & Granular Configs
  const defaultSectionsOrder = [
    "stats",
    "dean",
    "programs",
    "news",
    "events",
    "facilities",
    "staff",
    "top_students",
    "alumni_stories",
  ];
  const sectionsOrder =
    layout.sectionsOrder && layout.sectionsOrder.length > 0
      ? layout.sectionsOrder
      : defaultSectionsOrder;

  const sectionsConfig = layout.sectionsConfig || {};

  const getSectionBgProps = (bgStyle?: string, defaultClass = "bg-background") => {
    switch (bgStyle) {
      case "muted":
        return { className: "bg-muted/20 border-b", style: {}, isSolid: false };
      case "tint":
        return {
          className: "border-b",
          style: {
            background: `linear-gradient(180deg, ${hexToRgba(primaryColor, 0.06)} 0%, transparent 100%)`,
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
      case "default":
        return { className: "bg-background border-b", style: {}, isSolid: false };
      default:
        return { className: `${defaultClass} border-b`, style: {}, isSolid: false };
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col font-sans relative faculty-themed-page"
      dir={dir}
      style={
        {
          "--faculty-primary": primaryColor,
          "--faculty-accent": accentColor,
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
        /* 1. Base Fallback Card & Interactive Border Card (Programs) */
        .faculty-themed-page .faculty-card,
        .faculty-themed-page .card-interactive-border {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, ${hexToRgba(primaryColor, 0.045)} 0%, ${hexToRgba(primaryColor, 0.01)} 100%), var(--card);
          border-color: ${hexToRgba(primaryColor, 0.16)} !important;
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.3s ease;
          will-change: transform, box-shadow;
        }
        .faculty-themed-page .faculty-card::after,
        .faculty-themed-page .card-interactive-border::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 20%,
            ${hexToRgba(primaryColor, 0.08)} 38%,
            ${hexToRgba(accentColor, 0.28)} 50%,
            ${hexToRgba(primaryColor, 0.08)} 62%,
            transparent 80%
          );
          transform: translateX(-120%);
          transition: transform 0.85s ease;
          pointer-events: none;
          z-index: 5;
        }
        .faculty-themed-page .faculty-card:hover,
        .faculty-themed-page .card-interactive-border:hover {
          transform: translateY(-7px) translateZ(0);
          border-color: ${hexToRgba(primaryColor, 0.55)} !important;
          box-shadow: 0 22px 40px -10px ${hexToRgba(primaryColor, 0.25)},
                      0 4px 16px -2px ${hexToRgba(primaryColor, 0.12)} !important;
        }
        .faculty-themed-page .faculty-card:hover::after,
        .faculty-themed-page .card-interactive-border:hover::after {
          transform: translateX(120%);
        }
        .faculty-themed-page .card-interactive-border:hover .card-arrow-shift {
          transform: ${isArabic ? "translateX(-6px)" : "translateX(6px)"};
        }
        .card-arrow-shift {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* 2. STATS PULSE & BOTTOM GLOW BAR */
        .faculty-themed-page .card-stat-pulse {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, ${hexToRgba(primaryColor, 0.045)} 0%, ${hexToRgba(primaryColor, 0.01)} 100%), var(--card);
          border-color: ${hexToRgba(primaryColor, 0.16)} !important;
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.3s ease;
          will-change: transform, box-shadow;
        }
        .faculty-themed-page .card-stat-pulse::after {
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
        .faculty-themed-page .card-stat-pulse:hover {
          transform: translateY(-4px) translateZ(0);
          border-color: ${hexToRgba(primaryColor, 0.45)} !important;
          box-shadow: 0 14px 28px -6px ${hexToRgba(primaryColor, 0.18)} !important;
        }
        .faculty-themed-page .card-stat-pulse:hover::after {
          transform: scaleX(1);
        }
        .faculty-themed-page .card-stat-pulse:hover .stat-icon {
          transform: scale(1.15) rotate(-6deg);
        }
        .faculty-themed-page .card-stat-pulse:hover .stat-number {
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

        /* 3. EDITORIAL QUOTE CARD (Dean Welcome) */
        .faculty-themed-page .card-editorial-quote {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, ${hexToRgba(primaryColor, 0.045)} 0%, ${hexToRgba(primaryColor, 0.01)} 100%), var(--card);
          border-color: ${hexToRgba(primaryColor, 0.2)} !important;
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.3s ease;
          will-change: transform, box-shadow;
        }
        .faculty-themed-page .card-editorial-quote:hover {
          transform: translateY(-4px) translateZ(0);
          border-color: ${hexToRgba(primaryColor, 0.5)} !important;
          box-shadow: 0 20px 40px -10px ${hexToRgba(primaryColor, 0.16)}, 0 0 0 1px ${hexToRgba(primaryColor, 0.2)} !important;
        }
        .faculty-themed-page .card-editorial-quote:hover .quote-watermark {
          transform: scale(1.22) rotate(-10deg);
          opacity: 0.65;
          color: ${accentColor} !important;
        }
        .faculty-themed-page .card-editorial-quote:hover .editorial-portrait {
          box-shadow: 0 0 0 4px ${hexToRgba(primaryColor, 0.3)}, 0 12px 28px -5px ${hexToRgba(primaryColor, 0.25)};
          transform: scale(1.02);
        }
        .quote-watermark {
          transition: all 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .editorial-portrait {
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        /* 4. CINEMATIC ZOOM (Facilities, News, Events) */
        .faculty-themed-page .card-cinematic-zoom {
          position: relative;
          overflow: hidden;
          border-color: ${hexToRgba(primaryColor, 0.16)} !important;
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.3s ease;
          will-change: transform, box-shadow;
        }
        .faculty-themed-page .card-cinematic-zoom:hover {
          transform: translateY(-5px) translateZ(0);
          border-color: ${hexToRgba(primaryColor, 0.45)} !important;
          box-shadow: 0 18px 36px -8px ${hexToRgba(primaryColor, 0.22)} !important;
        }
        .faculty-themed-page .card-cinematic-zoom img,
        .faculty-themed-page .card-cinematic-zoom .cinematic-media {
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.4s ease;
          will-change: transform;
        }
        .faculty-themed-page .card-cinematic-zoom:hover img,
        .faculty-themed-page .card-cinematic-zoom:hover .cinematic-media {
          transform: scale(1.07);
        }
        .faculty-themed-page .card-cinematic-zoom:hover .cinematic-badge {
          transform: scale(1.15) translateY(-3px);
          box-shadow: 0 10px 22px -3px ${hexToRgba(primaryColor, 0.35)};
        }
        .cinematic-badge {
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* 5. AVATAR HALO PULSE (Staff Directory) */
        .faculty-themed-page .card-avatar-halo {
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, ${hexToRgba(primaryColor, 0.03)} 0%, transparent 100%), var(--card);
          border-color: ${hexToRgba(primaryColor, 0.16)} !important;
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
                      border-color 0.3s ease;
          will-change: transform, box-shadow;
        }
        .faculty-themed-page .card-avatar-halo:hover {
          transform: translateY(-5px) translateZ(0);
          border-color: ${hexToRgba(primaryColor, 0.45)} !important;
          box-shadow: 0 16px 32px -8px ${hexToRgba(primaryColor, 0.18)} !important;
        }
        .faculty-themed-page .card-avatar-halo .avatar-halo-target {
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .faculty-themed-page .card-avatar-halo:hover .avatar-halo-target {
          transform: scale(1.06);
          box-shadow: 0 0 0 5px ${hexToRgba(primaryColor, 0.25)},
                      0 0 0 10px ${hexToRgba(primaryColor, 0.1)} !important;
        }
        .faculty-themed-page .card-avatar-halo:hover .staff-name {
          color: ${primaryColor};
        }
        .staff-name {
          transition: color 0.25s ease;
        }
        .faculty-themed-page footer {
          border-top-color: ${hexToRgba(primaryColor, 0.2)} !important;
        }
        .faculty-themed-page footer a:hover {
          color: ${primaryColor} !important;
        }
        .faculty-themed-page footer .text-primary {
          color: ${primaryColor} !important;
        }
        .faculty-themed-page footer .footer-social-btn:hover {
          background-color: ${primaryColor} !important;
          color: #ffffff !important;
        }
        .faculty-themed-page footer .footer-social-btn:hover svg {
          color: #ffffff !important;
        }
      `}</style>

      {/* ========================================================================= */}
      {/* DEDICATED FACULTY HEADER (هيدر مخصص للكلية)                                 */}
      {/* ========================================================================= */}
      <FacultyNavbar
        faculty={faculty}
        primaryColor={primaryColor}
        accentColor={accentColor}
      />

      <main className="flex-1">
        {/* ===================== HERO HEADER (Dynamic Styles) ===================== */}

        {/* 1. HERO SPLIT (Default Modern Style - Image Background with Overlay) */}
        {headerStyle === "hero_split" && (
          <section className="relative overflow-hidden border-b py-14 sm:py-20 text-white min-h-[380px] flex items-center">
            {/* Background Image / Banner */}
            {heroBanner ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroBanner}
                alt={faculty.nameAr}
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
                      {faculty.programs?.length || 0} {isArabic ? "أقسام وتخصصات أكاديمية" : "Academic Programs"}
                    </Badge>
                    {faculty.establishedYear && (
                      <Badge
                        variant="outline"
                        className="text-xs font-mono text-white/90 border-white/30 bg-black/20 backdrop-blur-xs"
                      >
                        {isArabic ? `تأسست عام ${faculty.establishedYear}` : `Est. ${faculty.establishedYear}`}
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
                    {isArabic ? faculty.nameAr : faculty.nameEn}
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
                    {isArabic ? faculty.descriptionAr : faculty.descriptionEn}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-3">
                    <Button
                      asChild
                      size="lg"
                      className="font-bold gap-2 text-slate-900 bg-white hover:bg-white/90 shadow-xl"
                    >
                      <Link href="#programs-section">
                        <School className="h-4 w-4" />
                        {isArabic ? "الأقسام والتخصصات" : "Departments"}
                      </Link>
                    </Button>

                    {faculty.guideDocumentUrl && (
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="font-bold gap-2 text-white border-white/40 bg-black/25 hover:bg-black/40 backdrop-blur-xs shadow-md"
                      >
                        <a href={faculty.guideDocumentUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                          {isArabic ? "دليل الكلية PDF" : "Prospectus PDF"}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Optional faculty logo badge on the side */}
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

        {/* 2. HERO FULL (Cinematic Header) */}
        {headerStyle === "hero_full" && (
          <section className="relative min-h-[460px] flex items-center py-20 overflow-hidden text-white">
            {heroBanner ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroBanner}
                alt={faculty.nameEn}
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
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, rgba(0,0,0,0.92) 0%, ${hexToRgba(primaryColor, 0.78)} 60%, rgba(0,0,0,0.65) 100%)`,
              }}
            />

            <div className="section-container relative z-10 space-y-5 text-center sm:text-start max-w-4xl">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-md">
                {faculty.programs?.length || 0} {isArabic ? "أقسام أكاديمية" : "Departments"}
              </Badge>

              <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight">
                {isArabic ? faculty.nameAr : faculty.nameEn}
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
                {isArabic ? faculty.descriptionAr : faculty.descriptionEn}
              </p>

              <div className="flex flex-wrap gap-3 pt-3">
                <Button asChild size="lg" className="font-bold gap-2 bg-white text-slate-900 hover:bg-white/90 shadow-lg">
                  <Link href="#programs-section">
                    <School className="h-4 w-4" />
                    {isArabic ? "الأقسام والتخصصات" : "Departments"}
                  </Link>
                </Button>
                {faculty.guideDocumentUrl && (
                  <Button asChild variant="outline" size="lg" className="font-bold gap-2 text-white border-white/50 bg-black/30 hover:bg-black/50">
                    <a href={faculty.guideDocumentUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                      {isArabic ? "دليل الكلية PDF" : "Prospectus PDF"}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 3. HERO MINIMAL */}
        {headerStyle === "minimal" && (
          <section className="border-b bg-background py-8 sm:py-10">
            <div className="section-container space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-black text-foreground">
                      {isArabic ? faculty.nameAr : faculty.nameEn}
                    </h1>
                    {motto && (
                      <p className="text-xs font-bold mt-1 flex items-center gap-1.5" style={{ color: accentColor }}>
                        <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: accentColor }} />
                        <span>{motto}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="font-bold text-xs" style={{ borderColor: primaryColor, color: primaryColor }}>
                    {faculty.programs.length} {isArabic ? "أقسام أكاديمية" : "Programs"}
                  </Badge>
                  {faculty.guideDocumentUrl && (
                    <Button asChild variant="outline" size="sm" className="font-bold gap-1 text-xs">
                      <a href={faculty.guideDocumentUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-3.5 w-3.5" />
                        {isArabic ? "الدليل الأكاديمي" : "Prospectus"}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===================== DYNAMIC SECTIONS (Ordered by Page Builder) ===================== */}
        {sectionsOrder.map((sectionId) => {
          // 1. STATS BAR SECTION
          if (sectionId === "stats" && layout.showQuickStats !== false) {
            const sConf = sectionsConfig.stats || {};
            const bgProps = getSectionBgProps(sConf.bgStyle, "bg-background");
            const isCompact = sConf.layoutVariant === "compact";
            const customTitle = isArabic ? sConf.titleAr : sConf.titleEn;
            const customSubtitle = isArabic ? sConf.subtitleAr : sConf.subtitleEn;

            return (
              <section key="stats" className={`py-8 text-start ${bgProps.className}`} style={bgProps.style}>
                <div className="section-container">
                  {(customTitle || customSubtitle) && (
                    <div className="mb-6">
                      {customTitle && (
                        <h3 className={`text-xl font-black ${bgProps.isSolid ? "text-white" : "text-foreground"}`}>
                          {customTitle}
                        </h3>
                      )}
                      {customSubtitle && (
                        <p className={`text-xs mt-1 ${bgProps.isSolid ? "text-white/80" : "text-muted-foreground"}`}>
                          {customSubtitle}
                        </p>
                      )}
                    </div>
                  )}

                  {isCompact ? (
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="flex flex-wrap items-center justify-around gap-4 p-4 rounded-2xl border bg-background/80 backdrop-blur-xs card-stat-pulse"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 stat-icon" style={{ color: primaryColor }} />
                        <span className="text-xs text-muted-foreground">{isArabic ? "التأسيس: " : "Est: "}</span>
                        <span className="text-sm font-black text-foreground stat-number">{faculty.establishedYear || 2005}</span>
                      </div>
                      <div className="h-4 w-px bg-border hidden sm:block" />
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 stat-icon" style={{ color: primaryColor }} />
                        <span className="text-xs text-muted-foreground">{isArabic ? "الطلاب: " : "Students: "}</span>
                        <span className="text-sm font-black text-foreground stat-number">{faculty.studentsCount || 1200}+</span>
                      </div>
                      <div className="h-4 w-px bg-border hidden sm:block" />
                      <div className="flex items-center gap-2">
                        <School className="h-4 w-4 stat-icon" style={{ color: primaryColor }} />
                        <span className="text-xs text-muted-foreground">{isArabic ? "الأقسام: " : "Depts: "}</span>
                        <span className="text-sm font-black text-foreground stat-number">{faculty.programs.length}</span>
                      </div>
                      <div className="h-4 w-px bg-border hidden sm:block" />
                      <div className="flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 stat-icon" style={{ color: primaryColor }} />
                        <span className="text-xs text-muted-foreground">{isArabic ? "المختبرات: " : "Labs: "}</span>
                        <span className="text-sm font-black text-foreground stat-number">{facilities.length > 0 ? facilities.length : faculty.labsCount || 12}</span>
                      </div>
                      <div className="h-4 w-px bg-border hidden sm:block" />
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 stat-icon" style={{ color: accentColor }} />
                        <span className="text-xs text-muted-foreground">{isArabic ? "التوظيف: " : "Employment: "}</span>
                        <span className="text-sm font-black stat-number" style={{ color: accentColor }}>{faculty.employmentRate || 92}%</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {[
                        { icon: Calendar, labelAr: "سنة التأسيس", labelEn: "Established", val: faculty.establishedYear || 2005, isAccent: false },
                        { icon: Users, labelAr: "الطلاب المسجلين", labelEn: "Active Students", val: `${faculty.studentsCount || 1200}+`, isAccent: false },
                        { icon: School, labelAr: "البرامج والأقسام", labelEn: "Departments", val: faculty.programs.length, isAccent: false },
                        { icon: FlaskConical, labelAr: "المختبرات والعيادات", labelEn: "Labs & Facilities", val: facilities.length > 0 ? facilities.length : faculty.labsCount || 12, isAccent: false },
                        { icon: Award, labelAr: "نسبة التوظيف", labelEn: "Employment Rate", val: `${faculty.employmentRate || 92}%`, isAccent: true },
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        const itemBg = item.isAccent ? accentColor : primaryColor;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="h-full"
                          >
                            <div className="p-4 rounded-2xl card-stat-pulse border flex items-center gap-3 h-full">
                              <div className="p-2.5 rounded-xl shrink-0 text-white stat-icon shadow-xs" style={{ backgroundColor: itemBg }}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground block font-medium">
                                  {isArabic ? item.labelAr : item.labelEn}
                                </span>
                                <span className="text-lg font-black text-foreground stat-number" style={item.isAccent ? { color: accentColor } : {}}>
                                  {item.val}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          // 2. DEAN'S MESSAGE SECTION
          if (sectionId === "dean" && layout.showDeanMessage !== false && (deanMessage || deanName)) {
            const sConf = sectionsConfig.dean || {};
            const bgProps = getSectionBgProps(sConf.bgStyle, "bg-muted/15");
            const title = (isArabic ? sConf.titleAr : sConf.titleEn) || (isArabic ? "كلمة عميد الكلية" : "Dean's Welcome Message");
            const subtitle = (isArabic ? sConf.subtitleAr : sConf.subtitleEn);
            const isCompact = sConf.layoutVariant === "compact";

            return (
              <section key="dean" className={`py-14 sm:py-20 text-start ${bgProps.className}`} style={bgProps.style}>
                <div className="section-container">
                  <motion.div
                    initial={{ opacity: 0, y: 35, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    {isCompact ? (
                      <div
                        className="rounded-3xl p-6 sm:p-8 relative overflow-hidden border shadow-md flex flex-col sm:flex-row items-center gap-6 card-editorial-quote"
                      >
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 shadow-md shrink-0 editorial-portrait" style={{ borderColor: primaryColor }}>
                          <Image src={deanPhoto} alt={deanName || "Dean"} fill className="object-cover" />
                        </div>
                        <div className="flex-1 space-y-2 text-center sm:text-start">
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <Badge
                              className="font-bold text-xs gap-1 border shadow-2xs"
                              style={{
                                backgroundColor: hexToRgba(accentColor, 0.14),
                                color: accentColor,
                                borderColor: hexToRgba(accentColor, 0.35),
                              }}
                            >
                              <Crown className="h-3 w-3 mr-1" style={{ color: accentColor }} />
                              {isArabic ? "عميد الكلية" : "Faculty Dean"}
                            </Badge>
                            <h4 className="font-extrabold text-sm text-foreground">{deanName}</h4>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground italic line-clamp-3">
                            &quot;{deanMessage || (isArabic
                              ? "تسعى الكلية إلى إعداد كوادر علمية متميزة تمتلك المعرفة النظرية والخبرة العملية لمواكبة متطلبات سوق العمل."
                              : "The faculty aims to graduate distinguished scholars equipped with cutting-edge academic knowledge.")}&quot;
                          </p>
                          {sConf.showCta && sConf.ctaLink && (
                            <div className="pt-2">
                              <Button asChild size="sm" className="h-7 text-xs font-bold gap-1" style={{ backgroundColor: primaryColor, color: "#fff" }}>
                                <Link href={sConf.ctaLink}>
                                  <span>{(isArabic ? sConf.ctaTextAr : sConf.ctaTextEn) || (isArabic ? "تواصل مع العمادة" : "Contact Dean")}</span>
                                  <Arrow className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="rounded-3xl p-8 sm:p-12 relative overflow-hidden border shadow-lg card-editorial-quote"
                      >
                        <Quote
                          className="absolute top-6 end-8 h-28 w-28 opacity-20 -rotate-12 pointer-events-none quote-watermark"
                          style={{ color: accentColor }}
                        />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
                          <div className="shrink-0 text-center space-y-3">
                            <div
                              className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 shadow-xl mx-auto editorial-portrait"
                              style={{ borderColor: primaryColor }}
                            >
                              <Image src={deanPhoto} alt={deanName || "Dean"} fill className="object-cover" />
                            </div>
                            <div>
                              <Badge
                                className="font-bold text-xs gap-1 border shadow-2xs"
                                style={{
                                  backgroundColor: hexToRgba(accentColor, 0.14),
                                  color: accentColor,
                                  borderColor: hexToRgba(accentColor, 0.35),
                                }}
                              >
                                <Crown className="h-3 w-3 mr-1" style={{ color: accentColor }} />
                                {isArabic ? "عميد الكلية" : "Faculty Dean"}
                              </Badge>
                              <h4 className="font-extrabold text-base text-foreground mt-1">{deanName}</h4>
                            </div>
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
                              <div>
                                <h3 className="text-xl sm:text-2xl font-black text-foreground">
                                  {title}
                                </h3>
                                {subtitle && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
                                )}
                              </div>
                            </div>

                            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base italic">
                              &quot;{deanMessage || (isArabic
                                ? "تسعى الكلية إلى إعداد كوادر علمية متميزة تمتلك المعرفة النظرية والخبرة العملية لمواكبة متطلبات سوق العمل المحلي والدولي."
                                : "The faculty aims to graduate distinguished scholars equipped with cutting-edge academic knowledge and practical skills.")}&quot;
                            </p>

                            {sConf.showCta && sConf.ctaLink && (
                              <div className="pt-2">
                                <Button asChild size="sm" className="font-bold gap-2 shadow-xs" style={{ backgroundColor: primaryColor, color: "#fff" }}>
                                  <Link href={sConf.ctaLink}>
                                    <span>{(isArabic ? sConf.ctaTextAr : sConf.ctaTextEn) || (isArabic ? "تواصل مع مكتب العميد" : "Contact Dean Office")}</span>
                                    <Arrow className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </section>
            );
          }

          // 3. PROGRAMS / DEPARTMENTS SECTION
          if (sectionId === "programs" && layout.showPrograms !== false && faculty.programs?.length > 0) {
            const sConf = sectionsConfig.programs || {};
            const bgProps = getSectionBgProps(sConf.bgStyle, "bg-background");
            const title = (isArabic ? sConf.titleAr : sConf.titleEn) || (isArabic ? "الأقسام والتخصصات الأكاديمية" : "Departments & Academic Programs");
            const subtitle = (isArabic ? sConf.subtitleAr : sConf.subtitleEn) || (isArabic ? "الهيكل الأكاديمي" : "Academic Structure");
            const variant = sConf.layoutVariant || "grid";
            const limit = sConf.itemLimit && sConf.itemLimit > 0 ? sConf.itemLimit : faculty.programs.length;
            const displayedPrograms = faculty.programs.slice(0, limit);

            return (
              <section key="programs" id="programs-section" className={`py-14 sm:py-20 text-start ${bgProps.className}`} style={bgProps.style}>
                <div className="section-container">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
                        <School className="h-5 w-5" style={{ color: bgProps.isSolid ? "#fff" : primaryColor }} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${bgProps.isSolid ? "text-white/80" : "text-muted-foreground"}`}>
                          {subtitle}
                        </span>
                      </div>
                      <h2 className={`text-2xl sm:text-4xl font-extrabold ${bgProps.isSolid ? "text-white" : "text-foreground"}`}>
                        {title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`w-fit text-xs font-bold py-1 ${bgProps.isSolid ? "border-white/40 text-white" : ""}`}>
                        {faculty.programs.length} {isArabic ? "تخصصات معتمدة" : "Accredited Programs"}
                      </Badge>
                      {sConf.showCta && sConf.ctaLink && (
                        <Button asChild size="sm" variant={bgProps.isSolid ? "secondary" : "outline"} className="text-xs font-bold gap-1">
                          <Link href={sConf.ctaLink}>
                            <span>{(isArabic ? sConf.ctaTextAr : sConf.ctaTextEn) || (isArabic ? "كافة الأقسام" : "All Programs")}</span>
                            <Arrow className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  {variant === "list" ? (
                    <div className="space-y-4">
                      {displayedPrograms.map((program, idx) => (
                        <motion.div
                          key={program.id}
                          initial={{ opacity: 0, y: 25 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.45, delay: (idx % 6) * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                        >
                          <Link
                            href={`/academics/${faculty.slug}/${program.slug}`}
                            className="group block"
                          >
                            <Card className="p-5 border-2 hover:border-primary/50 transition-all hover:shadow-lg card-interactive-border">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="space-y-2 max-w-xl">
                                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                                    {isArabic ? program.nameAr : program.nameEn}
                                  </h3>
                                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                    {isArabic ? program.descriptionAr : program.descriptionEn}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 flex-wrap text-xs">
                                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted font-medium">
                                    <Clock className="h-3.5 w-3.5 faculty-card-icon" style={{ color: primaryColor }} />
                                    {program.duration} {isArabic ? "سنوات" : "Years"}
                                  </span>
                                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted font-medium">
                                    <GraduationCap className="h-3.5 w-3.5 faculty-card-icon" style={{ color: primaryColor }} />
                                    {program.creditHours} {isArabic ? "ساعة" : "Hrs"}
                                  </span>
                                  <span
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold"
                                    style={{
                                      backgroundColor: hexToRgba(accentColor, 0.12),
                                      color: accentColor,
                                      border: `1px solid ${hexToRgba(accentColor, 0.28)}`,
                                    }}
                                  >
                                    <Target className="h-3.5 w-3.5" style={{ color: accentColor }} />
                                    {program.minScorePercent}%
                                  </span>
                                  <Button size="sm" className="font-bold text-xs gap-1 ms-auto shadow-xs" style={{ backgroundColor: primaryColor, color: "#fff" }}>
                                    <span>{isArabic ? "الخطة الدراسية" : "Curriculum"}</span>
                                    <Arrow className="h-3.5 w-3.5 card-arrow-shift" style={{ color: accentColor }} />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  ) : variant === "compact" ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {displayedPrograms.map((program, idx) => (
                        <motion.div
                          key={program.id}
                          initial={{ opacity: 0, y: 25 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.45, delay: (idx % 6) * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                        >
                          <Link
                            href={`/academics/${faculty.slug}/${program.slug}`}
                            className="group block"
                          >
                            <div className="p-3.5 rounded-xl border hover:border-primary/40 hover:shadow-md transition-all flex items-center justify-between gap-3 card-interactive-border">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-2 h-8 rounded-full"
                                  style={{
                                    background: `linear-gradient(to bottom, ${primaryColor} 0%, ${accentColor} 100%)`
                                  }}
                                />
                                <div>
                                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                    {isArabic ? program.nameAr : program.nameEn}
                                  </h4>
                                  <span className="text-[11px] text-muted-foreground">
                                    {program.duration} {isArabic ? "سنوات" : "Years"} • {program.creditHours} {isArabic ? "ساعة" : "Hrs"}
                                  </span>
                                </div>
                              </div>
                              <Arrow className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform card-arrow-shift" />
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {displayedPrograms.map((program, idx) => (
                        <motion.div
                          key={program.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.5, delay: (idx % 6) * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                          className="h-full"
                        >
                          <Link
                            href={`/academics/${faculty.slug}/${program.slug}`}
                            className="group flex flex-col justify-between h-full block"
                          >
                            <Card
                              className="h-full transition-all duration-300 border-2 card-interactive-border"
                            >
                              <div
                                className="h-1.5 w-full rounded-t-xl"
                                style={{
                                  background: `linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%)`
                                }}
                              />
                              <CardHeader className="pb-3">
                                <CardTitle className="text-xl font-bold transition-colors group-hover:text-primary">
                                  {isArabic ? program.nameAr : program.nameEn}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 text-xs leading-relaxed pt-1">
                                  {isArabic ? program.descriptionAr : program.descriptionEn}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2.5 pt-2 border-t text-xs">
                                  <div className="flex items-center justify-between text-muted-foreground">
                                    <span className="flex items-center gap-1.5 font-medium">
                                      <GraduationCap className="h-4 w-4 faculty-card-icon" style={{ color: primaryColor }} />
                                      {isArabic ? "الساعات المعتمدة" : "Credit Hours"}
                                    </span>
                                    <span className="font-bold text-foreground">{program.creditHours}</span>
                                  </div>

                                  <div className="flex items-center justify-between text-muted-foreground">
                                    <span className="flex items-center gap-1.5 font-medium">
                                      <Clock className="h-4 w-4 faculty-card-icon" style={{ color: primaryColor }} />
                                      {isArabic ? "سنوات الدراسة" : "Duration"}
                                    </span>
                                    <span className="font-bold text-foreground">
                                      {program.duration} {isArabic ? "سنوات" : "Years"}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between text-muted-foreground">
                                    <span className="flex items-center gap-1.5 font-medium">
                                      <Target className="h-4 w-4 faculty-card-icon" style={{ color: accentColor }} />
                                      {isArabic ? "الحد الأدنى للقبول" : "Min Score"}
                                    </span>
                                    <span
                                      className="font-bold px-2 py-0.5 rounded-md text-xs"
                                      style={{
                                        backgroundColor: hexToRgba(accentColor, 0.12),
                                        color: accentColor,
                                        border: `1px solid ${hexToRgba(accentColor, 0.25)}`,
                                      }}
                                    >
                                      %{program.minScorePercent}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between text-muted-foreground">
                                    <span className="flex items-center gap-1.5 font-medium">
                                      <DollarSign className="h-4 w-4 faculty-card-icon" style={{ color: primaryColor }} />
                                      {isArabic ? "الرسوم (للسوريين)" : "Tuition (SYP)"}
                                    </span>
                                    <span className="font-bold text-foreground">
                                      {program.tuitionSyrian.toLocaleString()} {program.tuitionCurrency.syrian}
                                    </span>
                                  </div>
                                </div>

                                <div
                                  className="pt-2 flex items-center justify-between font-bold text-xs"
                                  style={{ color: primaryColor }}
                                >
                                  <span>{isArabic ? "الخطة الدراسية وتفاصيل القسم" : "View Curriculum"}</span>
                                  <Arrow className="h-4 w-4 card-arrow-shift" style={{ color: accentColor }} />
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          // 4. FACULTY NEWS & ANNOUNCEMENTS SECTION
          if (sectionId === "news" && layout.showNews !== false) {
            const sConf = sectionsConfig.news || {};
            const bgProps = getSectionBgProps(sConf.bgStyle, "bg-muted/20");
            const title = (isArabic ? sConf.titleAr : sConf.titleEn) || (isArabic ? "أخبار وإعلانات الكلية الحصرية" : "Faculty News & Announcements");
            const subtitle = (isArabic ? sConf.subtitleAr : sConf.subtitleEn) || (isArabic ? "تابع آخر المستجدات والأنشطة الأكاديمية والبحثية" : "Latest faculty updates & events");
            const limit = sConf.itemLimit && sConf.itemLimit > 0 ? sConf.itemLimit : undefined;
            const displayedNews = limit ? facultyNews.slice(0, limit) : facultyNews;

            if (facultyNews.length === 0) {
              return (
                <section key="news" className={`py-14 sm:py-20 text-start ${bgProps.className}`} style={bgProps.style}>
                  <div className="section-container">
                    <div className="p-8 rounded-2xl border bg-background text-center max-w-md mx-auto space-y-2">
                      <FileText className="h-10 w-10 mx-auto text-muted-foreground/50" />
                      <p className="text-sm font-bold text-foreground">
                        {isArabic ? "لا توجد أخبار منشورة للكلية حالياً" : "No news published for this faculty yet"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isArabic
                          ? "سيتم إدراج الإعلانات ومواعيد الامتحانات وورشات العمل الجديدة هنا فور نشرها."
                          : "Announcements, exams, and workshop schedules will appear here once posted."}
                      </p>
                    </div>
                  </div>
                </section>
              );
            }

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
                scopeBadgeText={isArabic ? `أخبار ${faculty.nameAr}` : `${faculty.nameEn} News`}
                bgProps={bgProps}
              />
            );
          }

          // 5. FACULTY UPCOMING EVENTS
          if (sectionId === "events" && layout.showEvents !== false && facultyEvents.length > 0) {
            const sConf = sectionsConfig.events || {};
            const bgProps = getSectionBgProps(sConf.bgStyle, "bg-background");
            const title = (isArabic ? sConf.titleAr : sConf.titleEn) || (isArabic ? "فعاليات وندوات الكلية القادمة" : "Faculty Events & Seminars");
            const subtitle = (isArabic ? sConf.subtitleAr : sConf.subtitleEn) || (isArabic ? "الرزنامة والأنشطة" : "Upcoming Events");
            const variant = sConf.layoutVariant || "grid";
            const limit = sConf.itemLimit && sConf.itemLimit > 0 ? sConf.itemLimit : 6;
            const displayedEvents = facultyEvents.slice(0, limit);

            return (
              <section key="events" className={`py-14 sm:py-20 text-start ${bgProps.className}`} style={bgProps.style}>
                <div className="section-container">
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Sparkles className="h-4 w-4" style={{ color: bgProps.isSolid ? "#fff" : accentColor }} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${bgProps.isSolid ? "text-white/80" : "text-muted-foreground"}`}>
                          {subtitle}
                        </span>
                      </div>
                      <h2 className={`text-2xl sm:text-3xl font-extrabold ${bgProps.isSolid ? "text-white" : "text-foreground"}`}>
                        {title}
                      </h2>
                    </div>
                    {sConf.showCta && sConf.ctaLink && (
                      <Button variant={bgProps.isSolid ? "secondary" : "outline"} size="sm" asChild className="text-xs font-bold">
                        <Link href={sConf.ctaLink}>
                          {(isArabic ? sConf.ctaTextAr : sConf.ctaTextEn) || (isArabic ? "التقويم الكامل" : "Full Calendar")}
                        </Link>
                      </Button>
                    )}
                  </div>

                  {variant === "list" ? (
                    <div className="space-y-3">
                      {displayedEvents.map((evt, idx) => (
                        <motion.div
                          key={evt.id}
                          initial={{ opacity: 0, y: 25 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.45, delay: (idx % 6) * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                        >
                          <div className="p-4 rounded-2xl border hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-cinematic-zoom">
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-xl text-center shrink-0 min-w-[70px] cinematic-badge" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                                <span className="text-xs font-bold block">{evt.date?.split("-")?.[1] || "EVENT"}</span>
                                <span className="text-lg font-black block">{evt.date?.split("-")?.[2] || "01"}</span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-[10px] font-bold" style={{ borderColor: primaryColor, color: primaryColor }}>
                                    {evt.type}
                                  </Badge>
                                  <span className="text-xs font-mono text-muted-foreground">{evt.time}</span>
                                </div>
                                <h4 className="font-bold text-base text-foreground">
                                  {isArabic ? evt.titleAr : evt.titleEn}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                  {isArabic ? evt.descriptionAr : evt.descriptionEn}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0 font-medium">
                              <MapPin className="h-3.5 w-3.5" />
                              {isArabic
                                ? (typeof evt.location === "object" ? evt.location?.ar : evt.location)
                                : (typeof evt.location === "object" ? evt.location?.en : evt.location)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : variant === "compact" ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {displayedEvents.map((evt, idx) => (
                        <motion.div
                          key={evt.id}
                          initial={{ opacity: 0, y: 25 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.45, delay: (idx % 6) * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                        >
                          <div className="p-3.5 rounded-xl border hover:shadow-xs transition-all space-y-1.5 card-cinematic-zoom">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-mono text-muted-foreground">{evt.date}</span>
                              <Badge variant="outline" className="text-[10px]" style={{ color: primaryColor, borderColor: primaryColor }}>
                                {evt.type}
                              </Badge>
                            </div>
                            <h4 className="font-bold text-xs text-foreground line-clamp-1">
                              {isArabic ? evt.titleAr : evt.titleEn}
                            </h4>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                              <MapPin className="h-3 w-3 shrink-0" />
                              {isArabic
                                ? (typeof evt.location === "object" ? evt.location?.ar : evt.location)
                                : (typeof evt.location === "object" ? evt.location?.en : evt.location)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {displayedEvents.map((evt, idx) => (
                        <motion.div
                          key={evt.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.45, delay: (idx % 6) * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                          className="h-full"
                        >
                          <Card className="p-4 border hover:shadow-md transition-all flex flex-col justify-between h-full card-cinematic-zoom">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="font-bold text-xs" style={{ borderColor: primaryColor, color: primaryColor }}>
                                  {evt.type}
                                </Badge>
                                <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {evt.date}
                                </span>
                              </div>
                              <h4 className="font-bold text-base text-foreground pt-1">
                                {isArabic ? evt.titleAr : evt.titleEn}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {isArabic ? evt.descriptionAr : evt.descriptionEn}
                              </p>
                            </div>
                            <div className="pt-3 border-t mt-3 flex items-center justify-between text-xs text-muted-foreground font-medium">
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                {isArabic
                                  ? (typeof evt.location === "object" ? evt.location?.ar : evt.location)
                                  : (typeof evt.location === "object" ? evt.location?.en : evt.location)}
                              </span>
                              <span className="font-mono">{evt.time}</span>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          // 6. RESEARCH LABS & FACILITIES SECTION
          if (sectionId === "facilities" && layout.showFacilities !== false && facilities.length > 0) {
            const sConf = sectionsConfig.facilities || {};
            const bgProps = getSectionBgProps(sConf.bgStyle, "bg-muted/15");
            const title = (isArabic ? sConf.titleAr : sConf.titleEn) || (isArabic ? "المختبرات والعيادات والمرافق البحثية" : "Laboratories & Clinical Facilities");
            const subtitle = (isArabic ? sConf.subtitleAr : sConf.subtitleEn) || (isArabic ? "البنية التحتية والمختبرات" : "Research Infrastructure");
            const variant = sConf.layoutVariant || "grid";
            const limit = sConf.itemLimit && sConf.itemLimit > 0 ? sConf.itemLimit : facilities.length;
            const displayedFacilities = facilities.slice(0, limit);

            return (
              <section key="facilities" className={`py-14 sm:py-20 text-start ${bgProps.className}`} style={bgProps.style}>
                <div className="section-container">
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <FlaskConical className="h-4 w-4" style={{ color: bgProps.isSolid ? "#fff" : primaryColor }} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${bgProps.isSolid ? "text-white/80" : "text-muted-foreground"}`}>
                          {subtitle}
                        </span>
                      </div>
                      <h2 className={`text-2xl sm:text-3xl font-extrabold ${bgProps.isSolid ? "text-white" : "text-foreground"}`}>
                        {title}
                      </h2>
                    </div>
                    {sConf.showCta && sConf.ctaLink && (
                      <Button variant={bgProps.isSolid ? "secondary" : "outline"} size="sm" asChild className="text-xs font-bold">
                        <Link href={sConf.ctaLink}>
                          {(isArabic ? sConf.ctaTextAr : sConf.ctaTextEn) || (isArabic ? "حجز مختبر" : "Book Lab")}
                        </Link>
                      </Button>
                    )}
                  </div>

                  {variant === "list" ? (
                    <div className="space-y-4">
                      {displayedFacilities.map((fac, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 25 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.45, delay: (idx % 6) * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                        >
                          <Card className="p-4 border shadow-xs hover:shadow-md transition-all card-cinematic-zoom">
                            <div className="flex items-start gap-4">
                              <div className="p-3 rounded-xl text-white shadow-xs shrink-0 cinematic-badge" style={{ backgroundColor: primaryColor }}>
                                <FlaskConical className="h-6 w-6" />
                              </div>
                              <div className="space-y-1">
                                <h3 className="text-base font-bold text-foreground">{isArabic ? fac.nameAr : fac.nameEn}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {isArabic ? fac.descriptionAr : fac.descriptionEn || fac.descriptionAr}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : variant === "compact" ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {displayedFacilities.map((fac, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 25 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.45, delay: (idx % 6) * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                        >
                          <div className="p-3 rounded-xl border flex items-center gap-2.5 shadow-xs card-cinematic-zoom">
                            <FlaskConical className="h-4 w-4 shrink-0 text-primary cinematic-badge" />
                            <span className="text-xs font-bold text-foreground truncate">{isArabic ? fac.nameAr : fac.nameEn}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {displayedFacilities.map((fac, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.45, delay: (idx % 6) * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                          className="h-full"
                        >
                          <Card className="border shadow-xs hover:shadow-md transition-all card-cinematic-zoom h-full">
                            <CardHeader className="pb-2">
                              <div className="flex items-center gap-3">
                                <div
                                  className="p-2.5 rounded-xl text-white shadow-xs shrink-0 cinematic-badge"
                                  style={{ backgroundColor: primaryColor }}
                                >
                                  <FlaskConical className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-base font-bold">
                                  {isArabic ? fac.nameAr : fac.nameEn}
                                </CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {isArabic ? fac.descriptionAr : fac.descriptionEn || fac.descriptionAr}
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

          // 7. FACULTY STAFF DIRECTORY (CONTINUOUS MOVING CAROUSEL)
          if (sectionId === "staff" && layout.showStaff !== false && facultyStaff.length > 0) {
            const sConf = sectionsConfig.staff || {};
            const bgProps = getSectionBgProps(sConf.bgStyle, "bg-background");
            const title = (isArabic ? sConf.titleAr : sConf.titleEn) || (isArabic ? "كادر وأساتذة الكلية" : "Faculty Teaching Staff");
            const subtitle = (isArabic ? sConf.subtitleAr : sConf.subtitleEn) || (isArabic ? "الهيئة التدريسية" : "Academic Faculty");
            const limit = sConf.itemLimit && sConf.itemLimit > 0 ? sConf.itemLimit : undefined;
            const displayedStaff = limit ? facultyStaff.slice(0, limit) : facultyStaff;

            return (
              <AcademicsStaffCarousel
                key="staff"
                staff={displayedStaff}
                title={title}
                subtitle={subtitle}
                badgeText={`${facultyStaff.length} ${isArabic ? "أساتذة وباحثين" : "Faculty Members"}`}
                viewAllHref={sConf.showCta && sConf.ctaLink ? sConf.ctaLink : "/faculty"}
                viewAllText={(isArabic ? sConf.ctaTextAr : sConf.ctaTextEn) || (isArabic ? "الدليل الكامل" : "Directory")}
                primaryColor={primaryColor}
                accentColor={accentColor}
                bgProps={bgProps}
              />
            );
          }

          // 8. TOP STUDENTS
          if (sectionId === "top_students" && layout.showTopStudents !== false) {
            const sConf = sectionsConfig.top_students || {};
            const bgProps = getSectionBgProps(sConf.bgStyle, "bg-background");
            return (
              <div key="top_students" className={bgProps.className} style={bgProps.style}>
                <TopStudents
                  facultySlug={faculty.slug}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                />
              </div>
            );
          }

          // 9. ALUMNI SUCCESS STORIES
          if (sectionId === "alumni_stories" && layout.showAlumniStories !== false) {
            const sConf = sectionsConfig.alumni_stories || {};
            const bgProps = getSectionBgProps(sConf.bgStyle, "bg-background");
            return (
              <div key="alumni_stories" className={bgProps.className} style={bgProps.style}>
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
      </main>

      <Footer primaryColor={primaryColor} accentColor={accentColor} />
    </div>
  );
}
