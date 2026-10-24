"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import {
  useSiteSettings,
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Layers,
  Lock,
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
  School,
  CornerDownLeft,
  CornerDownRight,
  SlidersHorizontal,
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
        icon: GraduationCap,
      },
      {
        key: "campus_life",
        titleAr: "الحياة الجامعية",
        titleEn: "Campus Life",
        descriptionAr: "السكن الجامعي، الأندية الطلابية، الأنشطة الرياضية، والصفحات الفرعية التابعة لها",
        descriptionEn: "Student housing, clubs, sports activities, and nested campus life subpages",
        path: "/campus-life",
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
        icon: Newspaper,
      },
      {
        key: "contact",
        titleAr: "اتصل بنا",
        titleEn: "Contact Us",
        descriptionAr: "نموذج التواصل المباشر، أرقام الهواتف، عناوين المكاتب، وساعات الدوام",
        descriptionEn: "Direct contact form, phone numbers, office addresses, and working hours",
        path: "/contact",
        icon: Phone,
      },
      {
        key: "privacy",
        titleAr: "سياسة الخصوصية",
        titleEn: "Privacy Policy",
        descriptionAr: "سياسة حماية البيانات والخصوصية لزوار وطلاب البوابة الإلكترونية",
        descriptionEn: "Data protection and privacy policy for portal visitors and students",
        path: "/privacy",
        icon: ShieldCheck,
      },
      {
        key: "terms",
        titleAr: "الشروط والأحكام",
        titleEn: "Terms of Service",
        descriptionAr: "ضوابط وشروط الاستخدام الرسمي للموقع والخدمات الإلكترونية",
        descriptionEn: "Official terms and conditions for using the website and electronic services",
        path: "/terms",
        icon: FileText,
      },
      {
        key: "developer",
        titleAr: "مطور الموقع",
        titleEn: "Website Developer",
        descriptionAr: "معلومات الفريق التقني والمطور لبوابة جامعة أنطاكية السورية",
        descriptionEn: "Information about the technical team and developer of the ASU portal",
        path: "/developer",
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
      <div className="border-b pb-5">
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

      {/* Hierarchical Pages List */}
      <div className="space-y-4">
        {pageHierarchy.map((parent) => {
          const ParentIcon = parent.icon;
          const isParentPublished = isNodePublished(parent.key);
          const hasChildren = Boolean(parent.children && parent.children.length > 0);
          const isExpanded = expandedParents[parent.key] ?? true;

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
                      </div>

                      <CardDescription className="text-xs sm:text-sm leading-relaxed">
                        {isArabic ? parent.descriptionAr : parent.descriptionEn}
                      </CardDescription>
                    </div>
                  </div>

                  {/* Parent Actions & Toggle Switch */}
                  <div className="flex items-center justify-end gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                    {parent.key === "home" && (
                      <Link href="/dashboard/pages-manager/home">
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          className="h-8 px-3 text-xs font-bold gap-1.5 shadow-xs"
                        >
                          <SlidersHorizontal className="h-3.5 w-3.5" />
                          <span>{isArabic ? "تحرير الصفحة" : "Edit Page"}</span>
                        </Button>
                      </Link>
                    )}

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
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {isArabic ? child.descriptionAr : child.descriptionEn}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-2 shrink-0">
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

                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor={`switch-child-${child.key}`}
                                    className="text-xs font-semibold cursor-pointer select-none"
                                  >
                                    {isChildPublished
                                      ? isArabic
                                        ? "منشورة"
                                        : "Published"
                                      : isArabic
                                        ? "غير منشورة"
                                        : "Unpublished"}
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
        })}
      </div>
    </div>
  );
}
