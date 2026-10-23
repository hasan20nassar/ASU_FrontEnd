"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import {
  useSiteSettings,
  DEFAULT_PUBLISHED_PAGES,
  getMergedPublishedPages,
} from "@/contexts/site-settings-context";
import { useFaculties } from "@/hooks/use-faculties";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Layers,
  Globe,
  Eye,
  EyeOff,
  Lock,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Home,
  Users,
  MapPin,
  Building2,
  GraduationCap,
  TreePine,
  BookOpen,
  FlaskConical,
  Newspaper,
  Phone,
  ShieldCheck,
  FileText,
  Code2,
  CheckCircle2,
  RotateCcw,
  School,
  CornerDownLeft,
  CornerDownRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface PageChildNode {
  key: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: PageChildNode[];
}

export interface PageParentNode {
  key: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  path: string;
  locationBadgeAr: string;
  locationBadgeEn: string;
  icon: React.ComponentType<{ className?: string }>;
  locked?: boolean;
  children?: PageChildNode[];
}

export default function PagesManagerPage() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";
  const { settings, updatePublishedPages } = useSiteSettings();
  const { data: backendFaculties } = useFaculties();
  const faculties = backendFaculties || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "unpublished">("all");
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({
    about: true,
    academics: true,
    campus_life: true,
  });
  const [expandedFaculties, setExpandedFaculties] = useState<Record<string, boolean>>({});
  const [isUpdatingKey, setIsUpdatingKey] = useState<string | null>(null);

  // Local mirror synced with context settings
  const [localPages, setLocalPages] = useState<Record<string, boolean>>(() =>
    getMergedPublishedPages(settings.publishedPages)
  );

  useEffect(() => {
    setLocalPages(getMergedPublishedPages(settings.publishedPages));
  }, [settings.publishedPages]);

  // Build hierarchical page tree combining static & dynamic faculty/program pages
  const pageHierarchy: PageParentNode[] = useMemo(() => {
    const facultyChildren: PageChildNode[] = faculties.map((fac) => {
      const programChildren: PageChildNode[] = (fac.programs || []).map((prog) => ({
        key: `program:${fac.slug}:${prog.slug}`,
        titleAr: prog.nameAr,
        titleEn: prog.nameEn,
        descriptionAr: `صفحة قسم/تخصص ${prog.nameAr} التابع لـ ${fac.nameAr}`,
        descriptionEn: `${prog.nameEn} Department page under ${fac.nameEn}`,
        path: `/academics/${fac.slug}/${prog.slug}`,
        icon: GraduationCap,
      }));

      return {
        key: `faculty:${fac.slug}`,
        titleAr: fac.nameAr,
        titleEn: fac.nameEn,
        descriptionAr: `الموقع الفرعي والصفحة الرسمية لـ ${fac.nameAr}`,
        descriptionEn: `Official microsite and page for ${fac.nameEn}`,
        path: `/academics/${fac.slug}`,
        icon: School,
        children: programChildren,
      };
    });

    return [
      {
        key: "home",
        titleAr: "الصفحة الرئيسية",
        titleEn: "Home Page",
        descriptionAr: "الواجهة الرئيسية لبوابة جامعة أنطاكية السورية (منشورة بشكل دائم ولا يمكن إخفاؤها)",
        descriptionEn: "Main landing page of Antioch Syrian University portal (permanently published)",
        path: "/",
        locationBadgeAr: "الهيدر + الفوتر (أساسي)",
        locationBadgeEn: "Header + Footer (Core)",
        icon: Home,
        locked: true,
      },
      {
        key: "about",
        titleAr: "عن الجامعة",
        titleEn: "About University",
        descriptionAr: "تاريخ الجامعة، الرؤية والرسالة، مجلس الأمناء، والقائمة المنسدلة التابعة لها في الهيدر",
        descriptionEn: "University history, vision & mission, board of trustees, and its header dropdown menu",
        path: "/about",
        locationBadgeAr: "الهيدر (قائمة منسدلة) + الفوتر",
        locationBadgeEn: "Header (Dropdown) + Footer",
        icon: Users,
        children: [
          {
            key: "about_directory",
            titleAr: "دليل أعضاء هيئة التدريس",
            titleEn: "Faculty Staff Directory",
            descriptionAr: "دليل الأساتذة والكادر التدريسي ومواعيد الساعات المكتبية",
            descriptionEn: "Directory of professors, academic staff, and office hours",
            path: "/about/directory",
            icon: Users,
          },
          {
            key: "about_map",
            titleAr: "خريطة الجامعة",
            titleEn: "Campus Map",
            descriptionAr: "الخريطة التفاعلية ومواقع المباني والقاعات في الحرم الجامعي",
            descriptionEn: "Interactive campus map and building locations",
            path: "/about/map",
            icon: MapPin,
          },
        ],
      },
      {
        key: "academics",
        titleAr: "الكليات والأكاديميات",
        titleEn: "Faculties & Academics",
        descriptionAr: "دليل الكليات الشامل وكافة صفحات الكليات والأقسام الأكاديمية المتفرعة عنه في الهيدر والفوتر",
        descriptionEn: "Comprehensive faculties directory and all nested faculty & department microsites",
        path: "/academics",
        locationBadgeAr: "الهيدر (قائمة منسدلة) + الفوتر + الرئيسية",
        locationBadgeEn: "Header (Dropdown) + Footer + Home",
        icon: Building2,
        children: facultyChildren,
      },
      {
        key: "admissions",
        titleAr: "القبول والتسجيل",
        titleEn: "Admissions & Registration",
        descriptionAr: "شروط ومعدلات القبول، الرسوم الدراسية، والأوراق المطلوبة للتسجيل",
        descriptionEn: "Admission requirements, minimum scores, tuition fees, and required documents",
        path: "/admissions",
        locationBadgeAr: "الهيدر + الفوتر",
        locationBadgeEn: "Header + Footer",
        icon: GraduationCap,
      },
      {
        key: "campus_life",
        titleAr: "الحياة الجامعية",
        titleEn: "Campus Life",
        descriptionAr: "السكن الجامعي، الأندية الطلابية، الأنشطة الرياضية، والصفحات الفرعية التابعة لها",
        descriptionEn: "Student housing, clubs, sports activities, and nested campus life subpages",
        path: "/campus-life",
        locationBadgeAr: "الهيدر (قائمة منسدلة) + الفوتر",
        locationBadgeEn: "Header (Dropdown) + Footer",
        icon: TreePine,
        children: [
          {
            key: "library",
            titleAr: "المكتبة المركزية",
            titleEn: "Central Library",
            descriptionAr: "المكتبة الرقمية وفهرس الكتب والمراجع العلمية ونظام الإعارة",
            descriptionEn: "Digital library, academic book catalog, and reservation system",
            path: "/library",
            icon: BookOpen,
          },
          {
            key: "research",
            titleAr: "البحث العلمي",
            titleEn: "Scientific Research",
            descriptionAr: "المراكز البحثية، الأبحاث المنشورة، والمجالات العلمية في الجامعة",
            descriptionEn: "Research centers, published papers, and scientific disciplines",
            path: "/research",
            icon: FlaskConical,
          },
        ],
      },
      {
        key: "news",
        titleAr: "الأخبار والفعاليات",
        titleEn: "News & Events",
        descriptionAr: "آخر الأخبار والإعلانات الرسمية، الفعاليات، والتقويم الأكاديمي والشواغر",
        descriptionEn: "Latest university news, official announcements, events, and academic calendar",
        path: "/news",
        locationBadgeAr: "الهيدر + الفوتر + الرئيسية",
        locationBadgeEn: "Header + Footer + Home",
        icon: Newspaper,
      },
      {
        key: "contact",
        titleAr: "اتصل بنا",
        titleEn: "Contact Us",
        descriptionAr: "نموذج التواصل المباشر، أرقام الهواتف، عناوين المكاتب، وساعات الدوام",
        descriptionEn: "Direct contact form, phone numbers, office addresses, and working hours",
        path: "/contact",
        locationBadgeAr: "الهيدر + الفوتر",
        locationBadgeEn: "Header + Footer",
        icon: Phone,
      },
      {
        key: "privacy",
        titleAr: "سياسة الخصوصية",
        titleEn: "Privacy Policy",
        descriptionAr: "سياسة حماية البيانات والخصوصية لزوار وطلاب البوابة الإلكترونية",
        descriptionEn: "Data protection and privacy policy for portal visitors and students",
        path: "/privacy",
        locationBadgeAr: "الفوتر السفلي",
        locationBadgeEn: "Bottom Footer",
        icon: ShieldCheck,
      },
      {
        key: "terms",
        titleAr: "الشروط والأحكام",
        titleEn: "Terms of Service",
        descriptionAr: "ضوابط وشروط الاستخدام الرسمي للموقع والخدمات الإلكترونية",
        descriptionEn: "Official terms and conditions for using the website and electronic services",
        path: "/terms",
        locationBadgeAr: "الفوتر السفلي",
        locationBadgeEn: "Bottom Footer",
        icon: FileText,
      },
      {
        key: "developer",
        titleAr: "مطور الموقع",
        titleEn: "Website Developer",
        descriptionAr: "معلومات الفريق التقني والمطور لبوابة جامعة أنطاكية السورية",
        descriptionEn: "Information about the technical team and developer of the ASU portal",
        path: "/developer",
        locationBadgeAr: "الفوتر السفلي",
        locationBadgeEn: "Bottom Footer",
        icon: Code2,
      },
    ];
  }, [faculties]);

  // Helper to check if a specific node is effectively published
  const isNodePublished = (key: string, parentKey?: string, grandParentKey?: string): boolean => {
    if (key === "home") return true;
    if (grandParentKey && localPages[grandParentKey] === false) return false;
    if (parentKey && localPages[parentKey] === false) return false;
    return localPages[key] !== false;
  };

  // Toggle Parent Page (cascades to all children and grandchildren)
  const handleToggleParent = async (parent: PageParentNode, checked: boolean) => {
    if (parent.locked || parent.key === "home") return;

    setIsUpdatingKey(parent.key);
    const updated: Record<string, boolean> = {
      ...localPages,
      [parent.key]: checked,
      home: true,
    };

    // Cascade to all subpages when toggling parent
    if (parent.children && parent.children.length > 0) {
      parent.children.forEach((child) => {
        updated[child.key] = checked;
        if (child.children && child.children.length > 0) {
          child.children.forEach((grandChild) => {
            updated[grandChild.key] = checked;
          });
        }
      });
    }

    setLocalPages(updated);
    const ok = await updatePublishedPages(updated);
    setIsUpdatingKey(null);

    const title = isArabic ? parent.titleAr : parent.titleEn;
    if (ok) {
      toast.success(
        checked
          ? isArabic
            ? `تم نشر صفحة "${title}" وكافة صفحاتها الفرعية بنجاح`
            : `Published "${title}" and all its subpages`
          : isArabic
            ? `تم إلغاء نشر صفحة "${title}" وإخفاء كافة صفحاتها الفرعية من الموقع`
            : `Unpublished "${title}" and hidden all its subpages`
      );
    } else {
      toast.info(
        isArabic
          ? `تم تحديث حالة "${title}" محلياً`
          : `Updated "${title}" status locally`
      );
    }
  };

  // Toggle Child Page (and cascade to grandchildren if any, e.g. Faculty -> Programs)
  const handleToggleChild = async (
    parent: PageParentNode,
    child: PageChildNode,
    checked: boolean
  ) => {
    setIsUpdatingKey(child.key);
    const updated: Record<string, boolean> = {
      ...localPages,
      [child.key]: checked,
      home: true,
    };

    // If enabling a child while parent is disabled, automatically enable parent so child can be seen
    if (checked && localPages[parent.key] === false) {
      updated[parent.key] = true;
    }

    // Cascade to grandchildren (e.g., toggling a faculty toggles its programs)
    if (child.children && child.children.length > 0) {
      child.children.forEach((grandChild) => {
        updated[grandChild.key] = checked;
      });
    }

    setLocalPages(updated);
    const ok = await updatePublishedPages(updated);
    setIsUpdatingKey(null);

    const title = isArabic ? child.titleAr : child.titleEn;
    if (ok) {
      toast.success(
        checked
          ? isArabic
            ? `تم نشر الصفحة الفرعية "${title}" بنجاح`
            : `Subpage "${title}" is now published`
          : isArabic
            ? `تم إلغاء نشر الصفحة الفرعية "${title}" وإخفاؤها من الموقع`
            : `Subpage "${title}" is now unpublished and hidden`
      );
    }
  };

  // Toggle Grandchild Page (e.g. Academic Program under a Faculty)
  const handleToggleGrandChild = async (
    parent: PageParentNode,
    child: PageChildNode,
    grandChild: PageChildNode,
    checked: boolean
  ) => {
    setIsUpdatingKey(grandChild.key);
    const updated: Record<string, boolean> = {
      ...localPages,
      [grandChild.key]: checked,
      home: true,
    };

    if (checked) {
      if (localPages[parent.key] === false) updated[parent.key] = true;
      if (localPages[child.key] === false) updated[child.key] = true;
    }

    setLocalPages(updated);
    const ok = await updatePublishedPages(updated);
    setIsUpdatingKey(null);

    const title = isArabic ? grandChild.titleAr : grandChild.titleEn;
    if (ok) {
      toast.success(
        checked
          ? isArabic
            ? `تم نشر صفحة التخصص "${title}"`
            : `Program "${title}" published`
          : isArabic
            ? `تم إلغاء نشر صفحة التخصص "${title}"`
            : `Program "${title}" unpublished`
      );
    }
  };

  // Publish all pages at once
  const handlePublishAll = async () => {
    const updated: Record<string, boolean> = { ...DEFAULT_PUBLISHED_PAGES, home: true };
    pageHierarchy.forEach((p) => {
      updated[p.key] = true;
      p.children?.forEach((c) => {
        updated[c.key] = true;
        c.children?.forEach((gc) => {
          updated[gc.key] = true;
        });
      });
    });

    setLocalPages(updated);
    await updatePublishedPages(updated);
    toast.success(
      isArabic
        ? "تم نشر وتفعيل كافة صفحات الموقع الرئيسية والفرعية بنجاح!"
        : "All main and subpages have been published!"
    );
  };

  // Compute live statistics across all nodes
  const stats = useMemo(() => {
    let total = 0;
    let published = 0;
    let mainCount = 0;
    let subCount = 0;

    pageHierarchy.forEach((p) => {
      total++;
      mainCount++;
      const pPub = isNodePublished(p.key);
      if (pPub) published++;

      p.children?.forEach((c) => {
        total++;
        subCount++;
        const cPub = isNodePublished(c.key, p.key);
        if (cPub) published++;

        c.children?.forEach((gc) => {
          total++;
          subCount++;
          const gcPub = isNodePublished(gc.key, c.key, p.key);
          if (gcPub) published++;
        });
      });
    });

    return {
      total,
      published,
      unpublished: total - published,
      mainCount,
      subCount,
    };
  }, [pageHierarchy, localPages]);

  // Filter hierarchy based on search & status filter
  const filteredHierarchy = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return pageHierarchy.filter((parent) => {
      const parentPub = isNodePublished(parent.key);

      const matchesText = (titleAr: string, titleEn: string, path: string, descAr: string, descEn: string) => {
        if (!q) return true;
        return (
          titleAr.toLowerCase().includes(q) ||
          titleEn.toLowerCase().includes(q) ||
          path.toLowerCase().includes(q) ||
          descAr.toLowerCase().includes(q) ||
          descEn.toLowerCase().includes(q)
        );
      };

      const matchesFilter = (pub: boolean) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "published") return pub;
        return !pub;
      };

      const selfMatches =
        matchesText(parent.titleAr, parent.titleEn, parent.path, parent.descriptionAr, parent.descriptionEn) &&
        matchesFilter(parentPub);

      const anyChildMatches = (parent.children || []).some((child) => {
        const childPub = isNodePublished(child.key, parent.key);
        const childHit =
          matchesText(child.titleAr, child.titleEn, child.path, child.descriptionAr, child.descriptionEn) &&
          matchesFilter(childPub);

        const anyGrandChildHit = (child.children || []).some((gc) => {
          const gcPub = isNodePublished(gc.key, child.key, parent.key);
          return (
            matchesText(gc.titleAr, gc.titleEn, gc.path, gc.descriptionAr, gc.descriptionEn) &&
            matchesFilter(gcPub)
          );
        });

        return childHit || anyGrandChildHit;
      });

      return selfMatches || anyChildMatches;
    });
  }, [pageHierarchy, searchQuery, statusFilter, localPages]);

  const toggleExpandParent = (key: string) => {
    setExpandedParents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExpandFaculty = (key: string) => {
    setExpandedFaculties((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const BranchCornerIcon = dir === "rtl" ? CornerDownLeft : CornerDownRight;

  return (
    <div
      className="space-y-6 animate-in fade-in duration-500 pb-20 text-start"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Layers className="h-8 w-8 text-primary" />
            {isArabic ? "مدير الصفحات" : "Pages Manager"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic
              ? "التحكم الشامل بنشر أو إلغاء نشر صفحات الموقع العامة والفرعية في الهيدر والفوتر."
              : "Manage publication status and visibility of all public main and nested pages across Header and Footer."}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {stats.unpublished > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePublishAll}
              className="font-bold flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/10"
            >
              <RotateCcw className="h-4 w-4" />
              {isArabic ? "نشر كافة الصفحات" : "Publish All Pages"}
            </Button>
          )}
          <Link href="/" target="_blank">
            <Button className="font-bold flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
              <Globe className="h-4 w-4" />
              {isArabic ? "معاينة الموقع العام" : "Preview Live Site"}
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">
                {isArabic ? "إجمالي صفحات الموقع" : "Total Site Pages"}
              </p>
              <p className="text-2xl font-extrabold text-foreground">{stats.total}</p>
              <p className="text-[11px] text-muted-foreground">
                {isArabic
                  ? `${stats.mainCount} رئيسية • ${stats.subCount} فرعية`
                  : `${stats.mainCount} main • ${stats.subCount} subpages`}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Layers className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">
                {isArabic ? "الصفحات المنشورة للعامة" : "Published Pages"}
              </p>
              <p className="text-2xl font-extrabold text-emerald-600">{stats.published}</p>
              <p className="text-[11px] text-emerald-600/80 font-medium">
                {isArabic ? "متاحة في الهيدر والفوتر" : "Visible in Header & Footer"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Eye className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">
                {isArabic ? "الصفحات غير المنشورة (المخفية)" : "Unpublished (Hidden)"}
              </p>
              <p className="text-2xl font-extrabold text-amber-600">{stats.unpublished}</p>
              <p className="text-[11px] text-muted-foreground">
                {isArabic ? "محجوبة عن الزوار والقوائم" : "Hidden from menus & visitors"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <EyeOff className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-primary/5">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-primary">
                {isArabic ? "الصفحة الرئيسية" : "Home Page Status"}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold text-foreground">
                  {isArabic ? "محمية ومنشورة" : "Protected & Live"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isArabic ? "استثناء دائم (لا يمكن إلغاء نشرها)" : "Permanent exception (always on)"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Lock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border-none shadow-md">
        <CardContent className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                isArabic ? "right-3.5" : "left-3.5"
              )}
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? "ابحث باسم الصفحة أو القسم أو المسار (مثال: عن الجامعة، /library، الهندسة)..."
                  : "Search by page title, section, or path (e.g. About, /library, Engineering)..."
              }
              className={cn("h-10", isArabic ? "pr-10" : "pl-10")}
            />
          </div>

          <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl shrink-0">
            <Button
              type="button"
              size="sm"
              variant={statusFilter === "all" ? "default" : "ghost"}
              onClick={() => setStatusFilter("all")}
              className="font-bold text-xs rounded-lg h-8 px-3"
            >
              {isArabic ? `الكل (${stats.total})` : `All (${stats.total})`}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={statusFilter === "published" ? "default" : "ghost"}
              onClick={() => setStatusFilter("published")}
              className="font-bold text-xs rounded-lg h-8 px-3"
            >
              {isArabic ? `المنشورة (${stats.published})` : `Published (${stats.published})`}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={statusFilter === "unpublished" ? "default" : "ghost"}
              onClick={() => setStatusFilter("unpublished")}
              className="font-bold text-xs rounded-lg h-8 px-3"
            >
              {isArabic ? `غير المنشورة (${stats.unpublished})` : `Unpublished (${stats.unpublished})`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hierarchical Pages List */}
      <div className="space-y-4">
        {filteredHierarchy.length === 0 ? (
          <Card className="border-none shadow-md">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Layers className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-bold text-base">
                {isArabic
                  ? "لا توجد صفحات مطابقة لبحثك أو للفلتر المحدد"
                  : "No pages match your search or selected filter"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredHierarchy.map((parent) => {
            const ParentIcon = parent.icon;
            const isParentPublished = isNodePublished(parent.key);
            const hasChildren = Boolean(parent.children && parent.children.length > 0);
            const isExpanded = expandedParents[parent.key] ?? true;

            const publishedChildrenCount = (parent.children || []).filter((c) =>
              isNodePublished(c.key, parent.key)
            ).length;

            return (
              <Card
                key={parent.key}
                className={cn(
                  "border transition-all duration-200 shadow-sm overflow-hidden",
                  parent.locked
                    ? "border-primary/30 bg-gradient-to-r from-primary/[0.04] to-transparent"
                    : isParentPublished
                      ? "border-border bg-card"
                      : "border-dashed border-amber-500/40 bg-muted/20"
                )}
              >
                {/* Parent Row Header */}
                <CardHeader className="p-4 sm:p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div
                        className={cn(
                          "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border transition-colors",
                          parent.locked
                            ? "bg-primary text-primary-foreground border-primary"
                            : isParentPublished
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-muted text-muted-foreground border-border"
                        )}
                      >
                        <ParentIcon className="h-5 w-5" />
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle
                            className={cn(
                              "text-base sm:text-lg font-bold",
                              !isParentPublished && "line-through text-muted-foreground"
                            )}
                          >
                            {isArabic ? parent.titleAr : parent.titleEn}
                          </CardTitle>

                          <code className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                            {parent.path}
                          </code>

                          <Badge variant="outline" className="text-[11px] font-medium">
                            {isArabic ? parent.locationBadgeAr : parent.locationBadgeEn}
                          </Badge>

                          {parent.locked ? (
                            <Badge className="bg-primary/15 text-primary hover:bg-primary/20 border-primary/30 gap-1 text-[11px] font-bold">
                              <Lock className="h-3 w-3" />
                              {isArabic ? "صفحة رئيسية (لا يمكن إلغاء نشرها)" : "Core Page (Cannot Unpublish)"}
                            </Badge>
                          ) : isParentPublished ? (
                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30 gap-1 text-[11px] font-bold">
                              <CheckCircle2 className="h-3 w-3" />
                              {isArabic ? "منشورة للعامة" : "Published"}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1 text-[11px] font-bold">
                              <EyeOff className="h-3 w-3" />
                              {isArabic ? "غير منشورة (مخفية)" : "Unpublished (Hidden)"}
                            </Badge>
                          )}

                          {hasChildren && (
                            <Badge variant="secondary" className="text-[11px] font-bold">
                              {isArabic
                                ? `${publishedChildrenCount} / ${parent.children!.length} صفحات فرعية نشطة`
                                : `${publishedChildrenCount} / ${parent.children!.length} subpages active`}
                            </Badge>
                          )}
                        </div>

                        <CardDescription className="text-xs sm:text-sm leading-relaxed">
                          {isArabic ? parent.descriptionAr : parent.descriptionEn}
                        </CardDescription>
                      </div>
                    </div>

                    {/* Parent Actions & Toggle Switch */}
                    <div className="flex items-center justify-end gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                      <Link href={parent.path} target="_blank">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {isArabic ? "معاينة" : "View"}
                        </Button>
                      </Link>

                      {hasChildren && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => toggleExpandParent(parent.key)}
                          className="h-8 px-2.5 text-xs font-bold gap-1"
                        >
                          <span>
                            {isArabic ? "الصفحات الفرعية" : "Subpages"} ({parent.children!.length})
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      )}

                      <div
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-1.5 rounded-xl border",
                          parent.locked
                            ? "bg-muted/60 border-border cursor-not-allowed"
                            : isParentPublished
                              ? "bg-emerald-500/5 border-emerald-500/30"
                              : "bg-muted/40 border-border"
                        )}
                      >
                        <Label
                          htmlFor={`switch-parent-${parent.key}`}
                          className={cn(
                            "text-xs font-bold select-none",
                            parent.locked
                              ? "text-muted-foreground cursor-not-allowed flex items-center gap-1"
                              : isParentPublished
                                ? "text-emerald-700 dark:text-emerald-400 cursor-pointer"
                                : "text-muted-foreground cursor-pointer"
                          )}
                        >
                          {parent.locked ? (
                            <>
                              <Lock className="h-3 w-3" />
                              {isArabic ? "منشورة دائماً" : "Always Published"}
                            </>
                          ) : isParentPublished ? (
                            isArabic ? "منشورة" : "Published"
                          ) : (
                            isArabic ? "غير منشورة" : "Unpublished"
                          )}
                        </Label>
                        <Switch
                          id={`switch-parent-${parent.key}`}
                          checked={isParentPublished}
                          disabled={parent.locked || isUpdatingKey === parent.key}
                          onCheckedChange={(val) => handleToggleParent(parent, val)}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Nested Subpages Section */}
                {hasChildren && isExpanded && (
                  <CardContent className="p-0 border-t bg-muted/15">
                    <div className="p-4 sm:px-6 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
                        <span className="font-bold flex items-center gap-1.5">
                          <BranchCornerIcon className="h-3.5 w-3.5 text-primary" />
                          {isArabic
                            ? `الصفحات الفرعية التابعة لـ "${parent.titleAr}":`
                            : `Subpages under "${parent.titleEn}":`}
                        </span>
                        {!isParentPublished && (
                          <span className="text-amber-600 font-semibold">
                            {isArabic
                              ? "تنبيه: الصفحة الأم غير منشورة، لذلك كافة الصفحات الفرعية مخفية حالياً."
                              : "Note: Parent page is unpublished, so all subpages are currently hidden."}
                          </span>
                        )}
                      </div>

                      <div className="grid gap-2.5">
                        {parent.children!.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildPublished = isNodePublished(child.key, parent.key);
                          const hasGrandChildren = Boolean(
                            child.children && child.children.length > 0
                          );
                          const isFacExpanded = expandedFaculties[child.key] ?? false;

                          return (
                            <div
                              key={child.key}
                              className={cn(
                                "rounded-xl border transition-all",
                                isChildPublished
                                  ? "bg-background border-border shadow-2xs"
                                  : "bg-muted/40 border-dashed border-border/70 opacity-80"
                              )}
                            >
                              <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-3 min-w-0">
                                  <div
                                    className={cn(
                                      "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                                      isChildPublished
                                        ? "bg-primary/10 text-primary"
                                        : "bg-muted text-muted-foreground"
                                    )}
                                  >
                                    <ChildIcon className="h-4 w-4" />
                                  </div>

                                  <div className="space-y-0.5 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span
                                        className={cn(
                                          "font-bold text-sm",
                                          !isChildPublished &&
                                            "line-through text-muted-foreground"
                                        )}
                                      >
                                        {isArabic ? child.titleAr : child.titleEn}
                                      </span>
                                      <code className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                        {child.path}
                                      </code>
                                      {isChildPublished ? (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] border-emerald-500/30 text-emerald-600 bg-emerald-500/5"
                                        >
                                          {isArabic ? "منشورة" : "Published"}
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] border-amber-500/30 text-amber-600 bg-amber-500/5"
                                        >
                                          {isArabic ? "مخفية" : "Hidden"}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {isArabic ? child.descriptionAr : child.descriptionEn}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 shrink-0">
                                  <Link href={child.path} target="_blank">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      {isArabic ? "فتح" : "Open"}
                                    </Button>
                                  </Link>

                                  {hasGrandChildren && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleExpandFaculty(child.key)}
                                      className="h-7 px-2 text-xs font-semibold gap-1 text-primary hover:bg-primary/10"
                                    >
                                      <span>
                                        {isArabic ? "الأقسام" : "Programs"} (
                                        {child.children!.length})
                                      </span>
                                      {isFacExpanded ? (
                                        <ChevronUp className="h-3 w-3" />
                                      ) : (
                                        <ChevronDown className="h-3 w-3" />
                                      )}
                                    </Button>
                                  )}

                                  <div className="flex items-center gap-2 ps-2 border-s">
                                    <Label
                                      htmlFor={`switch-child-${child.key}`}
                                      className="text-xs font-semibold cursor-pointer select-none"
                                    >
                                      {isChildPublished
                                        ? isArabic
                                          ? "منشورة"
                                          : "Published"
                                        : isArabic
                                          ? "مخفية"
                                          : "Hidden"}
                                    </Label>
                                    <Switch
                                      id={`switch-child-${child.key}`}
                                      checked={isChildPublished}
                                      disabled={isUpdatingKey === child.key}
                                      onCheckedChange={(val) =>
                                        handleToggleChild(parent, child, val)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Level 3: Academic Programs under Faculty */}
                              {hasGrandChildren && isFacExpanded && (
                                <div className="border-t bg-muted/25 px-4 py-3 space-y-2">
                                  <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
                                    <BranchCornerIcon className="h-3 w-3 text-primary" />
                                    {isArabic
                                      ? `الأقسام والتخصصات التابعة لـ ${child.titleAr}:`
                                      : `Departments & Programs under ${child.titleEn}:`}
                                  </p>
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    {child.children!.map((grandChild) => {
                                      const isGrandChildPub = isNodePublished(
                                        grandChild.key,
                                        child.key,
                                        parent.key
                                      );
                                      return (
                                        <div
                                          key={grandChild.key}
                                          className={cn(
                                            "p-2.5 rounded-lg border flex items-center justify-between gap-2",
                                            isGrandChildPub
                                              ? "bg-background border-border"
                                              : "bg-muted/50 border-dashed opacity-75"
                                          )}
                                        >
                                          <div className="min-w-0">
                                            <p
                                              className={cn(
                                                "text-xs font-bold truncate",
                                                !isGrandChildPub &&
                                                  "line-through text-muted-foreground"
                                              )}
                                            >
                                              {isArabic
                                                ? grandChild.titleAr
                                                : grandChild.titleEn}
                                            </p>
                                            <code className="text-[10px] font-mono text-muted-foreground block truncate">
                                              {grandChild.path}
                                            </code>
                                          </div>
                                          <div className="flex items-center gap-2 shrink-0">
                                            <Switch
                                              checked={isGrandChildPub}
                                              disabled={isUpdatingKey === grandChild.key}
                                              onCheckedChange={(val) =>
                                                handleToggleGrandChild(
                                                  parent,
                                                  child,
                                                  grandChild,
                                                  val
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

