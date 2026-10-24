"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import {
  useSiteSettings,
  HomePageConfig,
  HomeSectionId,
  HomeStatCardItem,
  HomePartnerItem,
  DEFAULT_HOME_PAGE_CONFIG,
  getMergedHomePageConfig,
} from "@/contexts/site-settings-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Sliders,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Sparkles,
  BarChart3,
  GraduationCap,
  Handshake,
  Newspaper,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  CalendarClock,
  Upload,
  Building2,
  Users,
  Award,
  BookOpen,
  Globe,
  FlaskConical,
  Briefcase,
  School,
  Landmark,
  HeartHandshake,
  Library,
  Check,
  Video,
  Image as ImageIcon,
  Palette,
  GripVertical,
  MousePointerClick,
} from "lucide-react";

const STAT_ICON_OPTIONS = [
  { key: "Building2", labelAr: "مبنى كلية", labelEn: "Building", Icon: Building2 },
  { key: "GraduationCap", labelAr: "قبعة تخرج", labelEn: "Graduation Cap", Icon: GraduationCap },
  { key: "Users", labelAr: "طلاب / أفراد", labelEn: "Users / Students", Icon: Users },
  { key: "Award", labelAr: "تميز / جائزة", labelEn: "Award", Icon: Award },
  { key: "BookOpen", labelAr: "كتاب مفتوح", labelEn: "Book Open", Icon: BookOpen },
  { key: "Globe", labelAr: "عالمي / دولي", labelEn: "Globe", Icon: Globe },
  { key: "FlaskConical", labelAr: "بحث علمي / مخبر", labelEn: "Lab / Research", Icon: FlaskConical },
  { key: "Briefcase", labelAr: "أعمال / توظيف", labelEn: "Briefcase", Icon: Briefcase },
  { key: "Sparkles", labelAr: "إبداع / ريادة", labelEn: "Sparkles", Icon: Sparkles },
  { key: "School", labelAr: "حرم جامعي", labelEn: "Campus", Icon: School },
  { key: "Landmark", labelAr: "مؤسسة أكاديمية", labelEn: "Landmark", Icon: Landmark },
  { key: "HeartHandshake", labelAr: "شراكة مجتمعية", labelEn: "Partnership", Icon: HeartHandshake },
];

const PARTNER_ICON_OPTIONS = [
  { key: "School", labelAr: "جامعة / أكاديمية", labelEn: "School / University", Icon: School },
  { key: "Building2", labelAr: "شركة / مركز", labelEn: "Company / Center", Icon: Building2 },
  { key: "Landmark", labelAr: "مصرف / مؤسسة", labelEn: "Bank / Institution", Icon: Landmark },
  { key: "GraduationCap", labelAr: "هيئة تعليمية", labelEn: "Academic Body", Icon: GraduationCap },
  { key: "Award", labelAr: "هيئة تميز وبحث", labelEn: "Excellence / Award", Icon: Award },
  { key: "BookOpen", labelAr: "مكتبة رقمية", labelEn: "Digital Library", Icon: BookOpen },
  { key: "Briefcase", labelAr: "قطاع أعمال وتقنية", labelEn: "Business & Tech", Icon: Briefcase },
  { key: "Library", labelAr: "نقابة مهنية", labelEn: "Syndicate", Icon: Library },
  { key: "Globe", labelAr: "شبكة دولية", labelEn: "Global Network", Icon: Globe },
  { key: "HeartHandshake", labelAr: "رعاية صحية ومشافي", labelEn: "Healthcare", Icon: HeartHandshake },
];

const SECTION_META: Record<
  HomeSectionId,
  {
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    Icon: React.ElementType;
  }
> = {
  hero: {
    titleAr: "القسم الترحيبي الرئيسي (Hero Section)",
    titleEn: "Main Hero Banner Section",
    descAr: "الفيديو أو الصورة الترحيبية، العنوان الرئيسي، الشفافية، وأنيميشن الدخول والأزرار",
    descEn: "Background video/image, main heading, overlay opacity, entrance animation & CTAs",
    Icon: Sparkles,
  },
  stats: {
    titleAr: "قسم الإحصائيات والأرقام (Statistics)",
    titleEn: "University Statistics Section",
    descAr: "إضافة وترتيب كروت الإحصائيات، التحكم بعدد الأعمدة، مصدر الأرقام، وأنيميشن الظهور والعدّاد",
    descEn: "Create & reorder stat cards, control column count, number sources & entrance animations",
    Icon: BarChart3,
  },
  faculties: {
    titleAr: "قسم البرامج والكليات (Faculties & Programs)",
    titleEn: "Faculties & Academic Programs",
    descAr: "تغيير أسلوب العرض (شبكة ثلاثية الأبعاد، سلايدر، Bento، أو قائمة) وأنيميشن الظهور",
    descEn: "Switch layout style (3D Tilt Grid, Carousel, Bento Showcase, Compact Directory) & animations",
    Icon: GraduationCap,
  },
  partners: {
    titleAr: "قسم شركاء النجاح (Success Partners)",
    titleEn: "Success Partners Section",
    descAr: "إنشاء وتعديل الشركاء، رفع شعار كل شريك، وتحديد اسم ووصف الشريط التفاعلي عند التمرير (Hover)",
    descEn: "Manage partners, upload partner logos, and configure the interactive hover ribbon name & style",
    Icon: Handshake,
  },
  news: {
    titleAr: "قسم آخر الأخبار والفعاليات (Latest News)",
    titleEn: "Latest News & Events Section",
    descAr: "تغيير أسلوب عرض الأخبار (كاروسيل تفاعلي، مجلة تحريرية، شبكة حديثة، أو شريط) والأنيميشن",
    descEn: "Customize news layout (Center Carousel, Editorial Magazine, Modern Grid, Feed) & animations",
    Icon: Newspaper,
  },
};

export default function HomePageBuilderPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { settings, updateHomePageConfig } = useSiteSettings();

  const [draftConfig, setDraftConfig] = useState<HomePageConfig>(() =>
    getMergedHomePageConfig(settings.homePageConfig)
  );
  const [savedBaseline, setSavedBaseline] = useState<string>(() =>
    JSON.stringify(getMergedHomePageConfig(settings.homePageConfig))
  );
  const [expandedSection, setExpandedSection] = useState<HomeSectionId | null>(null);
  const [scheduleOpenFor, setScheduleOpenFor] = useState<HomeSectionId | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Collapsible sub-items state (closed by default for clean browsing)
  const [expandedStatCardId, setExpandedStatCardId] = useState<string | null>(null);
  const [expandedPartnerId, setExpandedPartnerId] = useState<string | null>(null);

  // Drag & Drop states
  const [dragSectionIdx, setDragSectionIdx] = useState<number | null>(null);
  const [dragOverSectionIdx, setDragOverSectionIdx] = useState<number | null>(null);
  const [dragStatIdx, setDragStatIdx] = useState<number | null>(null);
  const [dragOverStatIdx, setDragOverStatIdx] = useState<number | null>(null);
  const [dragPartnerIdx, setDragPartnerIdx] = useState<number | null>(null);
  const [dragOverPartnerIdx, setDragOverPartnerIdx] = useState<number | null>(null);

  // Detect unsaved changes
  const isDirty = useMemo(() => {
    return JSON.stringify(draftConfig) !== savedBaseline;
  }, [draftConfig, savedBaseline]);

  // Sync initial settings when loaded from backend (only if user has no unsaved local edits)
  useEffect(() => {
    if (settings.homePageConfig && !isDirty) {
      const merged = getMergedHomePageConfig(settings.homePageConfig);
      setDraftConfig(merged);
      setSavedBaseline(JSON.stringify(merged));
    }
  }, [settings.homePageConfig, isDirty]);

  // Warn before closing tab if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Move section up/down in sectionsOrder
  const moveSection = (index: number, direction: "up" | "down") => {
    const newOrder = [...draftConfig.sectionsOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setDraftConfig((prev) => ({ ...prev, sectionsOrder: newOrder }));
    const movedMeta = SECTION_META[temp];
    toast.info(
      isAr
        ? `تم تغيير ترتيب "${movedMeta.titleAr}" (اضغط حفظ ونشر لاعتماد الترتيب)`
        : `Reordered "${movedMeta.titleEn}" (Click Save & Publish to apply)`
    );
  };

  // Drag-and-drop reorder for sections
  const handleDropSection = (targetIdx: number) => {
    if (dragSectionIdx === null || dragSectionIdx === targetIdx) {
      setDragSectionIdx(null);
      setDragOverSectionIdx(null);
      return;
    }
    const newOrder = [...draftConfig.sectionsOrder];
    const [moved] = newOrder.splice(dragSectionIdx, 1);
    newOrder.splice(targetIdx, 0, moved);
    setDraftConfig((prev) => ({ ...prev, sectionsOrder: newOrder }));
    setDragSectionIdx(null);
    setDragOverSectionIdx(null);
    const movedMeta = SECTION_META[moved];
    toast.info(
      isAr
        ? `تم نقل "${movedMeta.titleAr}" إلى الموضع #${targetIdx + 1}`
        : `Moved "${movedMeta.titleEn}" to position #${targetIdx + 1}`
    );
  };

  // Reset a single section to its default configuration
  const handleResetSingleSection = (sectionId: HomeSectionId) => {
    setDraftConfig((prev) => ({
      ...prev,
      [sectionId]: JSON.parse(JSON.stringify(DEFAULT_HOME_PAGE_CONFIG[sectionId])),
    }));
    const meta = SECTION_META[sectionId];
    toast.warning(
      isAr
        ? `تمت استعادة الإعدادات الافتراضية لقسم "${meta.titleAr}"`
        : `Reset "${meta.titleEn}" to default settings`,
      {
        description: isAr
          ? "اضغط على 'حفظ ونشر التعديلات' في الأعلى لاعتماد هذا التغيير."
          : "Click 'Save & Publish' at the top to apply this change.",
      }
    );
  };

  // Toggle section visibility
  const toggleSectionVisibility = (sectionId: HomeSectionId, enabled: boolean) => {
    setDraftConfig((prev) => ({
      ...prev,
      enabledSections: {
        ...prev.enabledSections,
        [sectionId]: enabled,
      },
    }));
    const meta = SECTION_META[sectionId];
    if (enabled) {
      toast.success(
        isAr
          ? `تم تفعيل ظهور "${meta.titleAr}" (اضغط حفظ لاعتماد التعديل)`
          : `"${meta.titleEn}" set to visible (Click Save to apply)`
      );
    } else {
      toast.warning(
        isAr
          ? `تم إخفاء "${meta.titleAr}" من المسودة (اضغط حفظ لاعتماد الإخفاء)`
          : `"${meta.titleEn}" hidden in draft (Click Save to apply)`
      );
    }
  };

  // Update schedule for a section
  const updateSectionSchedule = (
    sectionId: HomeSectionId,
    updates: Partial<{ enabled: boolean; startDate: string; endDate: string }>
  ) => {
    setDraftConfig((prev) => {
      const current = prev.sectionSchedules?.[sectionId] || { enabled: false };
      return {
        ...prev,
        sectionSchedules: {
          ...(prev.sectionSchedules || {}),
          [sectionId]: { ...current, ...updates },
        },
      };
    });
  };

  // Helper to convert uploaded image file to base64 Data URL
  const handleImageFileUpload = (
    file: File | undefined,
    onResult: (dataUrl: string) => void
  ) => {
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      toast.error(isAr ? "حجم الصورة كبير جداً" : "Image file too large", {
        description: isAr
          ? "يرجى اختيار صورة بحجم أقل من 2.5 ميجابايت لضمان سرعة التحميل."
          : "Please select an image smaller than 2.5 MB for optimal performance.",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        onResult(e.target.result);
        toast.success(isAr ? "تم رفع الصورة بنجاح" : "Image uploaded successfully");
      }
    };
    reader.readAsDataURL(file);
  };

  // Save & Publish
  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    try {
      const ok = await updateHomePageConfig(draftConfig);
      setSavedBaseline(JSON.stringify(draftConfig));

      if (ok) {
        toast.success(
          isAr
            ? "تم حفظ ونشر تعديلات الصفحة الرئيسية بنجاح"
            : "Home Page Saved & Published Successfully",
          {
            description: isAr
              ? "تم تطبيق الترتيب الجديد وإعدادات الأقسام والأنيميشن على الصفحة الرئيسية مباشرة."
              : "All section ordering, animations, and content updates are now live on the Home Page.",
          }
        );
      } else {
        toast.warning(isAr ? "تم حفظ التعديلات محلياً" : "Changes saved locally", {
          description: isAr
            ? "تم تطبيق التغييرات على المتصفح الحالي."
            : "Changes applied to local storage.",
        });
      }
    } catch {
      toast.error(isAr ? "حدث خطأ أثناء حفظ التعديلات" : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setDraftConfig(JSON.parse(JSON.stringify(DEFAULT_HOME_PAGE_CONFIG)));
    toast.warning(
      isAr ? "تمت استعادة الإعدادات الافتراضية" : "Reset to Default Settings",
      {
        description: isAr
          ? "اضغط على 'حفظ ونشر التعديلات' لاعتماد الإعدادات الافتراضية على الموقع."
          : "Click 'Save & Publish' to apply the default settings to the live site.",
      }
    );
  };

  // ============================================================================
  // STATS CARDS CRUD & DRAG-DROP HELPERS
  // ============================================================================
  const addStatCard = () => {
    const newId = `stat-${Date.now()}`;
    const newCard: HomeStatCardItem = {
      id: newId,
      icon: "Award",
      valueSource: "custom",
      customValue: 100,
      prefix: "",
      suffix: "+",
      labelAr: "إحصائية جديدة",
      labelEn: "New Statistic",
      subLabelAr: "",
      subLabelEn: "",
      cardVariant: "standard",
      featuredSystemTitleAr: "",
      featuredSystemTitleEn: "",
    };
    setDraftConfig((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        cards: [...prev.stats.cards, newCard],
      },
    }));
    setExpandedStatCardId(newId);
    toast.success(isAr ? "تمت إضافة كرت إحصائي جديد" : "Added new statistic card");
  };

  const updateStatCard = (index: number, updates: Partial<HomeStatCardItem>) => {
    setDraftConfig((prev) => {
      const nextCards = [...prev.stats.cards];
      nextCards[index] = { ...nextCards[index], ...updates };
      return {
        ...prev,
        stats: {
          ...prev.stats,
          cards: nextCards,
        },
      };
    });
  };

  const removeStatCard = (index: number) => {
    if (draftConfig.stats.cards.length <= 1) {
      toast.error(isAr ? "لا يمكن حذف الكرت" : "Cannot delete card", {
        description: isAr
          ? "يجب الإبقاء على كرت إحصائي واحد على الأقل في قسم الإحصائيات."
          : "At least one stat card must remain in the statistics section.",
      });
      return;
    }
    setDraftConfig((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        cards: prev.stats.cards.filter((_, idx) => idx !== index),
      },
    }));
    toast.warning(isAr ? "تم حذف الكرت الإحصائي" : "Statistic card removed");
  };

  const moveStatCard = (index: number, direction: "up" | "down") => {
    const cards = [...draftConfig.stats.cards];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= cards.length) return;
    const temp = cards[index];
    cards[index] = cards[target];
    cards[target] = temp;
    setDraftConfig((prev) => ({
      ...prev,
      stats: { ...prev.stats, cards },
    }));
  };

  const handleDropStatCard = (targetIdx: number) => {
    if (dragStatIdx === null || dragStatIdx === targetIdx) {
      setDragStatIdx(null);
      setDragOverStatIdx(null);
      return;
    }
    const cards = [...draftConfig.stats.cards];
    const [moved] = cards.splice(dragStatIdx, 1);
    cards.splice(targetIdx, 0, moved);
    setDraftConfig((prev) => ({
      ...prev,
      stats: { ...prev.stats, cards },
    }));
    setDragStatIdx(null);
    setDragOverStatIdx(null);
    toast.info(
      isAr
        ? `تم نقل الكرت "${moved.labelAr}" إلى الموضع #${targetIdx + 1}`
        : `Moved "${moved.labelEn}" to position #${targetIdx + 1}`
    );
  };

  // ============================================================================
  // PARTNERS CRUD & DRAG-DROP HELPERS
  // ============================================================================
  const addPartnerItem = () => {
    const newId = `partner-${Date.now()}`;
    const newPartner: HomePartnerItem = {
      id: newId,
      nameAr: "شريك نجاح جديد",
      nameEn: "New Success Partner",
      subtitleAr: "شراكة استراتيجية وتعاون أكاديمي",
      subtitleEn: "Strategic & Academic Partnership",
      logoUrl: "",
      fallbackIcon: "Building2",
      websiteUrl: "",
    };
    setDraftConfig((prev) => ({
      ...prev,
      partners: {
        ...prev.partners,
        partners: [newPartner, ...prev.partners.partners],
      },
    }));
    setExpandedPartnerId(newId);
    toast.success(isAr ? "تمت إضافة شريك نجاح جديد" : "Added new success partner");
  };

  const updatePartnerItem = (index: number, updates: Partial<HomePartnerItem>) => {
    setDraftConfig((prev) => {
      const nextPartners = [...prev.partners.partners];
      nextPartners[index] = { ...nextPartners[index], ...updates };
      return {
        ...prev,
        partners: {
          ...prev.partners,
          partners: nextPartners,
        },
      };
    });
  };

  const removePartnerItem = (index: number) => {
    if (draftConfig.partners.partners.length <= 1) {
      toast.error(isAr ? "لا يمكن حذف الشريك" : "Cannot delete partner", {
        description: isAr
          ? "يجب الإبقاء على شريك واحد على الأقل في قسم شركاء النجاح."
          : "At least one partner must remain in the section.",
      });
      return;
    }
    setDraftConfig((prev) => ({
      ...prev,
      partners: {
        ...prev.partners,
        partners: prev.partners.partners.filter((_, idx) => idx !== index),
      },
    }));
    toast.warning(isAr ? "تم حذف الشريك من القائمة" : "Partner removed from list");
  };

  const movePartnerItem = (index: number, direction: "up" | "down") => {
    const list = [...draftConfig.partners.partners];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    setDraftConfig((prev) => ({
      ...prev,
      partners: { ...prev.partners, partners: list },
    }));
  };

  const handleDropPartnerItem = (targetIdx: number) => {
    if (dragPartnerIdx === null || dragPartnerIdx === targetIdx) {
      setDragPartnerIdx(null);
      setDragOverPartnerIdx(null);
      return;
    }
    const list = [...draftConfig.partners.partners];
    const [moved] = list.splice(dragPartnerIdx, 1);
    list.splice(targetIdx, 0, moved);
    setDraftConfig((prev) => ({
      ...prev,
      partners: { ...prev.partners, partners: list },
    }));
    setDragPartnerIdx(null);
    setDragOverPartnerIdx(null);
    toast.info(
      isAr
        ? `تم نقل الشريك "${moved.nameAr}" إلى الموضع #${targetIdx + 1}`
        : `Moved "${moved.nameEn}" to position #${targetIdx + 1}`
    );
  };

  return (
    <div className="space-y-6 pb-12" dir={isAr ? "rtl" : "ltr"}>
      {/* Clean & Consistent Top Header Card */}
      <div className="sticky top-0 z-30 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <Link
              href="/dashboard/pages-manager"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              title={isAr ? "العودة إلى مدير الصفحات" : "Back to Pages Manager"}
            >
              {isAr ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </Link>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sliders className="h-5 w-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {isAr ? "تخصيص الصفحة الرئيسية" : "Customize Home Page"}
                </h1>
                {isDirty ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    {isAr ? "تعديلات غير محفوظة" : "Unsaved Changes"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                    <Check className="h-3 w-3" />
                    {isAr ? "محفوظ ومتزامن" : "Saved & Synced"}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isAr
                  ? "اسحب الأقسام أو استخدم الأسهم لإعادة الترتيب، وافتح أي قسم لتخصيص محتوياته وأنيميشن ظهوره"
                  : "Drag sections or use arrows to reorder, and expand any section to customize its content and animations"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetToDefault}
              className="h-10 gap-2 rounded-xl px-4 text-xs font-semibold"
            >
              <RotateCcw className="h-4 w-4" />
              {isAr ? "استعادة الافتراضي" : "Reset All"}
            </Button>

            <Button
              type="button"
              disabled={isSaving}
              onClick={handleSaveAndPublish}
              className={`relative h-10 gap-2 rounded-xl px-5 text-xs font-semibold shadow-sm transition-all ${
                isDirty
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/30 hover:bg-primary/90"
                  : "bg-primary/90 text-primary-foreground hover:bg-primary"
              }`}
            >
              <Save className="h-4 w-4" />
              {isSaving
                ? isAr
                  ? "جارٍ الحفظ..."
                  : "Saving..."
                : isAr
                ? "حفظ ونشر التعديلات"
                : "Save & Publish"}
              {isDirty && !isSaving && (
                <span className="flex h-2 w-2 rounded-full bg-amber-300" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Sections Reordering & Deep Component Inspectors */}
      <div className="space-y-4">
        {draftConfig.sectionsOrder.map((sectionId, index) => {
          const meta = SECTION_META[sectionId];
          if (!meta) return null;
          const Icon = meta.Icon;
          const isEnabled = draftConfig.enabledSections[sectionId] !== false;
          const isExpanded = expandedSection === sectionId;
          const schedule = draftConfig.sectionSchedules?.[sectionId];
          const isScheduleOpen = scheduleOpenFor === sectionId;
          const isDragOver = dragOverSectionIdx === index && dragSectionIdx !== index;

          return (
            <div
              key={sectionId}
              draggable={expandedSection !== sectionId}
              onDragStart={() => setDragSectionIdx(index)}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverSectionIdx !== index) setDragOverSectionIdx(index);
              }}
              onDragEnd={() => {
                setDragSectionIdx(null);
                setDragOverSectionIdx(null);
              }}
              onDrop={() => handleDropSection(index)}
              className={`rounded-2xl border transition-all ${
                isDragOver
                  ? "border-primary border-dashed bg-primary/5 ring-2 ring-primary/20"
                  : isEnabled
                  ? "border-border/80 bg-card shadow-sm"
                  : "border-border/50 bg-muted/20 opacity-75"
              }`}
            >
              {/* Section Header Bar */}
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3 sm:items-center">
                  {/* Drag Handle + Up / Down Order Controls */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className="cursor-grab rounded-lg p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground active:cursor-grabbing"
                      title={isAr ? "اسحب لإعادة ترتيب القسم" : "Drag to reorder section"}
                    >
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveSection(index, "up")}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
                        title={isAr ? "تحريك للأعلى" : "Move Up"}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === draftConfig.sectionsOrder.length - 1}
                        onClick={() => moveSection(index, "down")}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
                        title={isAr ? "تحريك للأسفل" : "Move Down"}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      isEnabled
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <h2 className="text-base font-bold text-foreground">
                        {isAr ? meta.titleAr : meta.titleEn}
                      </h2>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {isAr ? meta.descAr : meta.descEn}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                  {/* Schedule Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setScheduleOpenFor(isScheduleOpen ? null : sectionId)
                    }
                    className={`h-8 gap-1.5 rounded-xl px-2.5 text-xs ${
                      schedule?.enabled ? "border-primary/50 bg-primary/5 text-primary" : ""
                    }`}
                  >
                    <CalendarClock className="h-3.5 w-3.5" />
                    {isAr ? "جدولة الظهور" : "Schedule"}
                  </Button>

                  {/* Enable / Disable Switch */}
                  <div
                    className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 ${
                      isEnabled
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-border bg-muted/40"
                    }`}
                  >
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) =>
                        toggleSectionVisibility(sectionId, checked)
                      }
                    />
                    <span
                      className={`text-xs font-semibold ${
                        isEnabled
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {isEnabled
                        ? isAr
                          ? "ظاهر"
                          : "Visible"
                        : isAr
                        ? "مخفي"
                        : "Hidden"}
                    </span>
                  </div>

                  {/* Expand / Collapse Deep Inspector */}
                  <Button
                    type="button"
                    variant={isExpanded ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setExpandedSection(isExpanded ? null : sectionId)
                    }
                    className="h-8 gap-1.5 rounded-xl px-3 text-xs font-semibold"
                  >
                    {isAr ? "تخصيص المكون والأنيميشن" : "Customize & Animate"}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Optional Section Scheduling Sub-bar */}
              {isScheduleOpen && (
                <div className="border-t border-border/60 bg-muted/20 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={Boolean(schedule?.enabled)}
                        onCheckedChange={(checked) =>
                          updateSectionSchedule(sectionId, { enabled: checked })
                        }
                      />
                      <span className="text-xs font-semibold">
                        {isAr
                          ? "تفعيل الجدولة الزمنية التلقائية لظهور هذا القسم"
                          : "Enable automatic date/time scheduling for this section"}
                      </span>
                    </div>
                    {schedule?.enabled && (
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">
                            {isAr ? "من تاريخ:" : "From:"}
                          </Label>
                          <Input
                            type="datetime-local"
                            value={schedule.startDate || ""}
                            onChange={(e) =>
                              updateSectionSchedule(sectionId, {
                                startDate: e.target.value,
                              })
                            }
                            className="h-8 w-48 text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">
                            {isAr ? "إلى تاريخ:" : "Until:"}
                          </Label>
                          <Input
                            type="datetime-local"
                            value={schedule.endDate || ""}
                            onChange={(e) =>
                              updateSectionSchedule(sectionId, {
                                endDate: e.target.value,
                              })
                            }
                            className="h-8 w-48 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==============================================================
                  DEEP INSPECTOR PANELS PER SECTION
              ============================================================== */}
              {isExpanded && (
                <div className="border-t border-border/70 bg-muted/10 p-5 space-y-6">
                  {/* Top Bar Inside Section Inspector: Reset Single Section */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold text-muted-foreground">
                      {isAr
                        ? `إعدادات وتخصيص: ${meta.titleAr}`
                        : `Settings & Customization: ${meta.titleEn}`}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResetSingleSection(sectionId)}
                      className="h-7 gap-1.5 rounded-lg px-2.5 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      {isAr ? "إعادة ضبط هذا القسم فقط" : "Reset This Section Only"}
                    </Button>
                  </div>

                  {/* ==========================================================
                      1. HERO SECTION INSPECTOR
                  ========================================================== */}
                  {sectionId === "hero" && (
                    <div className="space-y-6">
                      {/* Titles & Subtitles */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            {isAr ? "العنوان الرئيسي (عربي)" : "Main Title (Arabic)"}
                          </Label>
                          <Input
                            value={draftConfig.hero.titleAr}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                hero: { ...prev.hero, titleAr: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            {isAr ? "العنوان الرئيسي (إنجليزي)" : "Main Title (English)"}
                          </Label>
                          <Input
                            dir="ltr"
                            value={draftConfig.hero.titleEn}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                hero: { ...prev.hero, titleEn: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            {isAr ? "النص التوضيحي (عربي)" : "Subtitle (Arabic)"}
                          </Label>
                          <Input
                            value={draftConfig.hero.subtitleAr}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                hero: { ...prev.hero, subtitleAr: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            {isAr ? "النص التوضيحي (إنجليزي)" : "Subtitle (English)"}
                          </Label>
                          <Input
                            dir="ltr"
                            value={draftConfig.hero.subtitleEn}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                hero: { ...prev.hero, subtitleEn: e.target.value },
                              }))
                            }
                          />
                        </div>
                      </div>

                      {/* Background Type & Media */}
                      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                        <Label className="text-xs font-bold text-primary">
                          {isAr
                            ? "نوع الخلفية والوسائط وانيميشن الظهور"
                            : "Background Media & Entrance Animation"}
                        </Label>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          {[
                            {
                              id: "video",
                              labelAr: "فيديو سينمائي (Video)",
                              labelEn: "Cinematic Video",
                              Icon: Video,
                            },
                            {
                              id: "image",
                              labelAr: "صورة ثابتة (Image)",
                              labelEn: "Static Image",
                              Icon: ImageIcon,
                            },
                            {
                              id: "gradient",
                              labelAr: "تدرج لوني هويتي (Gradient)",
                              labelEn: "Brand Gradient",
                              Icon: Palette,
                            },
                          ].map((bg) => (
                            <button
                              key={bg.id}
                              type="button"
                              onClick={() =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    backgroundType: bg.id as any,
                                  },
                                }))
                              }
                              className={`flex items-center gap-2.5 rounded-xl border p-3 text-start transition-all ${
                                draftConfig.hero.backgroundType === bg.id
                                  ? "border-primary bg-primary/10 text-primary font-bold"
                                  : "border-border bg-background hover:bg-muted/40"
                              }`}
                            >
                              <bg.Icon className="h-4 w-4 shrink-0" />
                              <span className="text-xs">
                                {isAr ? bg.labelAr : bg.labelEn}
                              </span>
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {draftConfig.hero.backgroundType === "video" && (
                            <div className="space-y-1.5">
                              <Label className="text-xs">
                                {isAr ? "رابط الفيديو (MP4 URL)" : "Video URL (MP4)"}
                              </Label>
                              <Input
                                dir="ltr"
                                value={draftConfig.hero.videoUrl}
                                onChange={(e) =>
                                  setDraftConfig((prev) => ({
                                    ...prev,
                                    hero: { ...prev.hero, videoUrl: e.target.value },
                                  }))
                                }
                              />
                            </div>
                          )}

                          {draftConfig.hero.backgroundType !== "gradient" && (
                            <div className="space-y-1.5">
                              <Label className="text-xs">
                                {isAr
                                  ? "صورة الخلفية / الغلاف (رابط أو رفع صورة)"
                                  : "Poster / Background Image (URL or Upload)"}
                              </Label>
                              <div className="flex gap-2">
                                <Input
                                  dir="ltr"
                                  value={draftConfig.hero.posterUrl}
                                  onChange={(e) =>
                                    setDraftConfig((prev) => ({
                                      ...prev,
                                      hero: {
                                        ...prev.hero,
                                        posterUrl: e.target.value,
                                      },
                                    }))
                                  }
                                  placeholder="/hero-bg.png"
                                />
                                <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-muted/50 px-3 text-xs font-medium hover:bg-muted">
                                  <Upload className="h-3.5 w-3.5" />
                                  {isAr ? "رفع" : "Upload"}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleImageFileUpload(
                                        e.target.files?.[0],
                                        (dataUrl) =>
                                          setDraftConfig((prev) => ({
                                            ...prev,
                                            hero: {
                                              ...prev.hero,
                                              posterUrl: dataUrl,
                                            },
                                          }))
                                      )
                                    }
                                  />
                                </label>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Animation & Visual Controls */}
                        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "أنيميشن ظهور النص" : "Entrance Animation"}
                            </Label>
                            <select
                              value={draftConfig.hero.animationType}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    animationType: e.target.value as any,
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value="scale-fade">
                                {isAr ? "تكبير وتلاشي (Scale Fade)" : "Scale & Fade"}
                              </option>
                              <option value="blur-reveal">
                                {isAr ? "إزالة الضبابية السينمائية (Blur Reveal)" : "Cinematic Blur Reveal"}
                              </option>
                              <option value="slide-up-stagger">
                                {isAr ? "صعود متتابع (Slide Up Stagger)" : "Slide Up Stagger"}
                              </option>
                              <option value="typewriter">
                                {isAr ? "ظهور ديناميكي (Dynamic Pop)" : "Dynamic Pop"}
                              </option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "ارتفاع القسم" : "Section Height"}
                            </Label>
                            <select
                              value={draftConfig.hero.heightVariant}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    heightVariant: e.target.value as any,
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value="full">
                                {isAr ? "ملء الشاشة (100vh)" : "Full Screen (100vh)"}
                              </option>
                              <option value="medium">
                                {isAr ? "متوسط (80vh)" : "Medium (80vh)"}
                              </option>
                              <option value="compact">
                                {isAr ? "مدمج (65vh)" : "Compact (65vh)"}
                              </option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "محاذاة المحتوى" : "Content Alignment"}
                            </Label>
                            <select
                              value={draftConfig.hero.alignment}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    alignment: e.target.value as any,
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value="center">
                                {isAr ? "توسيط (Center)" : "Center"}
                              </option>
                              <option value="start">
                                {isAr ? "محاذاة للجانب (Start)" : "Side Aligned"}
                              </option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr
                                ? `عتامة الطبقة الداكنة (${draftConfig.hero.overlayOpacity}%)`
                                : `Overlay Opacity (${draftConfig.hero.overlayOpacity}%)`}
                            </Label>
                            <input
                              type="range"
                              min={0}
                              max={85}
                              step={5}
                              value={draftConfig.hero.overlayOpacity}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    overlayOpacity: Number(e.target.value),
                                  },
                                }))
                              }
                              className="w-full accent-primary"
                            />
                          </div>
                        </div>

                        {/* Hero CTA Toggles */}
                        <div className="grid grid-cols-1 gap-4 border-t border-border/60 pt-4 md:grid-cols-2">
                          <div className="rounded-xl border border-border p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold">
                                {isAr ? "الزر الرئيسي (Primary CTA)" : "Primary CTA Button"}
                              </span>
                              <Switch
                                checked={draftConfig.hero.showPrimaryCta}
                                onCheckedChange={(v) =>
                                  setDraftConfig((prev) => ({
                                    ...prev,
                                    hero: { ...prev.hero, showPrimaryCta: v },
                                  }))
                                }
                              />
                            </div>
                            {draftConfig.hero.showPrimaryCta && (
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                <Input
                                  placeholder={isAr ? "النص بالعربية" : "Arabic Text"}
                                  value={draftConfig.hero.primaryCtaTextAr}
                                  onChange={(e) =>
                                    setDraftConfig((prev) => ({
                                      ...prev,
                                      hero: {
                                        ...prev.hero,
                                        primaryCtaTextAr: e.target.value,
                                      },
                                    }))
                                  }
                                  className="h-8 text-xs"
                                />
                                <Input
                                  dir="ltr"
                                  placeholder="English Text"
                                  value={draftConfig.hero.primaryCtaTextEn}
                                  onChange={(e) =>
                                    setDraftConfig((prev) => ({
                                      ...prev,
                                      hero: {
                                        ...prev.hero,
                                        primaryCtaTextEn: e.target.value,
                                      },
                                    }))
                                  }
                                  className="h-8 text-xs"
                                />
                                <Input
                                  dir="ltr"
                                  placeholder="/academics"
                                  value={draftConfig.hero.primaryCtaLink}
                                  onChange={(e) =>
                                    setDraftConfig((prev) => ({
                                      ...prev,
                                      hero: {
                                        ...prev.hero,
                                        primaryCtaLink: e.target.value,
                                      },
                                    }))
                                  }
                                  className="h-8 text-xs"
                                />
                              </div>
                            )}
                          </div>

                          <div className="rounded-xl border border-border p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold">
                                {isAr ? "الزر الثانوي (Secondary CTA)" : "Secondary CTA Button"}
                              </span>
                              <Switch
                                checked={draftConfig.hero.showSecondaryCta}
                                onCheckedChange={(v) =>
                                  setDraftConfig((prev) => ({
                                    ...prev,
                                    hero: { ...prev.hero, showSecondaryCta: v },
                                  }))
                                }
                              />
                            </div>
                            {draftConfig.hero.showSecondaryCta && (
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                <Input
                                  placeholder={isAr ? "النص بالعربية" : "Arabic Text"}
                                  value={draftConfig.hero.secondaryCtaTextAr}
                                  onChange={(e) =>
                                    setDraftConfig((prev) => ({
                                      ...prev,
                                      hero: {
                                        ...prev.hero,
                                        secondaryCtaTextAr: e.target.value,
                                      },
                                    }))
                                  }
                                  className="h-8 text-xs"
                                />
                                <Input
                                  dir="ltr"
                                  placeholder="English Text"
                                  value={draftConfig.hero.secondaryCtaTextEn}
                                  onChange={(e) =>
                                    setDraftConfig((prev) => ({
                                      ...prev,
                                      hero: {
                                        ...prev.hero,
                                        secondaryCtaTextEn: e.target.value,
                                      },
                                    }))
                                  }
                                  className="h-8 text-xs"
                                />
                                <Input
                                  dir="ltr"
                                  placeholder="/admissions"
                                  value={draftConfig.hero.secondaryCtaLink}
                                  onChange={(e) =>
                                    setDraftConfig((prev) => ({
                                      ...prev,
                                      hero: {
                                        ...prev.hero,
                                        secondaryCtaLink: e.target.value,
                                      },
                                    }))
                                  }
                                  className="h-8 text-xs"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ==========================================================
                      2. STATS SECTION INSPECTOR (Collapsible Cards + Drag/Drop)
                  ========================================================== */}
                  {sectionId === "stats" && (
                    <div className="space-y-6">
                      {/* Global Stats Appearance & Animation Controls */}
                      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Label className="text-xs font-bold text-primary">
                            {isAr
                              ? "إعدادات شبكة الإحصائيات والأنيميشن"
                              : "Stats Grid Layout & Entrance Animation"}
                          </Label>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={draftConfig.stats.showHeader}
                              onCheckedChange={(v) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  stats: { ...prev.stats, showHeader: v },
                                }))
                              }
                            />
                            <span className="text-xs">
                              {isAr ? "إظهار عنوان أعلى الإحصائيات" : "Show Section Header"}
                            </span>
                          </div>
                        </div>

                        {draftConfig.stats.showHeader && (
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Input
                              placeholder={isAr ? "عنوان القسم (عربي)" : "Title (AR)"}
                              value={draftConfig.stats.titleAr}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  stats: { ...prev.stats, titleAr: e.target.value },
                                }))
                              }
                              className="h-8 text-xs"
                            />
                            <Input
                              dir="ltr"
                              placeholder="Title (EN)"
                              value={draftConfig.stats.titleEn}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  stats: { ...prev.stats, titleEn: e.target.value },
                                }))
                              }
                              className="h-8 text-xs"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "عدد الأعمدة في الصف" : "Columns per Row"}
                            </Label>
                            <select
                              value={draftConfig.stats.columns}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  stats: {
                                    ...prev.stats,
                                    columns: Number(e.target.value) as 2 | 3 | 4,
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value={2}>{isAr ? "عمودان (2 كروت)" : "2 Columns"}</option>
                              <option value={3}>{isAr ? "3 أعمدة (3 كروت)" : "3 Columns"}</option>
                              <option value={4}>{isAr ? "4 أعمدة (4 كروت)" : "4 Columns"}</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "تصميم الكروت" : "Card Layout Style"}
                            </Label>
                            <select
                              value={draftConfig.stats.layoutStyle}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  stats: {
                                    ...prev.stats,
                                    layoutStyle: e.target.value as any,
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value="cards-bordered">
                                {isAr ? "كروت مؤطرة كلاسيكية (Bordered Cards)" : "Bordered Cards"}
                              </option>
                              <option value="glass-floating">
                                {isAr ? "كروت زجاجية عائمة (Floating Glass)" : "Floating Glass"}
                              </option>
                              <option value="minimal-ribbon">
                                {isAr ? "شريط رقمي انسيابي (Minimal Ribbon)" : "Minimal Ribbon"}
                              </option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "أنيميشن ظهور الكروت" : "Entrance Animation"}
                            </Label>
                            <select
                              value={draftConfig.stats.animationType}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  stats: {
                                    ...prev.stats,
                                    animationType: e.target.value as any,
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value="fade-up">
                                {isAr ? "صعود متدرج ناعم (Fade Up)" : "Fade Up Stagger"}
                              </option>
                              <option value="zoom-bounce">
                                {isAr ? "انبثاق نابض (Zoom Bounce)" : "Zoom Bounce"}
                              </option>
                              <option value="flip-x">
                                {isAr ? "انقلاب ثلاثي الأبعاد (3D Flip)" : "3D Flip"}
                              </option>
                              <option value="slide-alternate">
                                {isAr ? "انزلاق تبادلي (Slide Alternate)" : "Slide Alternate"}
                              </option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "سرعة عدّاد الأرقام" : "Counter Speed"}
                            </Label>
                            <select
                              value={draftConfig.stats.counterDuration}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  stats: {
                                    ...prev.stats,
                                    counterDuration: Number(e.target.value),
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value={1}>{isAr ? "سريع (1 ثانية)" : "Fast (1s)"}</option>
                              <option value={2}>{isAr ? "متوازن (2 ثانية)" : "Balanced (2s)"}</option>
                              <option value={3}>{isAr ? "بطيء سينمائي (3 ثوانٍ)" : "Slow (3s)"}</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Collapsible Stat Cards List + Add New Card */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-foreground">
                              {isAr
                                ? `كروت الإحصائيات (${draftConfig.stats.cards.length})`
                                : `Stat Cards (${draftConfig.stats.cards.length})`}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {isAr
                                ? "اسحب الكروت لإعادة ترتيبها أو اضغط على أي كرت لفتحه وتعديل بياناته"
                                : "Drag cards to reorder or click any card to expand and edit its details"}
                            </p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            onClick={addStatCard}
                            className="gap-1.5 rounded-xl bg-primary text-xs text-primary-foreground"
                          >
                            <Plus className="h-4 w-4" />
                            {isAr ? "إضافة كرت إحصائي جديد" : "Add New Stat Card"}
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                          {draftConfig.stats.cards.map((card, cIdx) => {
                            const isCardOpen = expandedStatCardId === card.id;
                            const isStatDragOver =
                              dragOverStatIdx === cIdx && dragStatIdx !== cIdx;
                            const StatIconComp =
                              STAT_ICON_OPTIONS.find((o) => o.key === card.icon)?.Icon ||
                              Building2;

                            return (
                              <div
                                key={card.id}
                                draggable={!isCardOpen}
                                onDragStart={() => setDragStatIdx(cIdx)}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  if (dragOverStatIdx !== cIdx) setDragOverStatIdx(cIdx);
                                }}
                                onDragEnd={() => {
                                  setDragStatIdx(null);
                                  setDragOverStatIdx(null);
                                }}
                                onDrop={() => handleDropStatCard(cIdx)}
                                className={`rounded-xl border bg-card transition-all ${
                                  isStatDragOver
                                    ? "border-primary border-dashed bg-primary/5"
                                    : "border-border shadow-xs"
                                }`}
                              >
                                {/* Compact Row Header */}
                                <div className="flex flex-wrap items-center justify-between gap-2 p-3">
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className="cursor-grab rounded-md p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground"
                                      title={isAr ? "اسحب للترتيب" : "Drag to reorder"}
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-[11px] font-bold text-muted-foreground">
                                      #{cIdx + 1}
                                    </span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                      <StatIconComp className="h-4 w-4" />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedStatCardId(isCardOpen ? null : card.id)
                                      }
                                      className="text-start"
                                    >
                                      <p className="text-xs font-bold text-foreground hover:text-primary">
                                        {isAr
                                          ? card.labelAr || "كرت إحصائي"
                                          : card.labelEn || "Stat Card"}
                                      </p>
                                      <p className="text-[11px] text-muted-foreground">
                                        {card.valueSource === "auto_faculties"
                                          ? isAr
                                            ? "تلقائي (عدد الكليات)"
                                            : "Auto (Faculties)"
                                          : card.valueSource === "auto_programs"
                                          ? isAr
                                            ? "تلقائي (عدد البرامج)"
                                            : "Auto (Programs)"
                                          : `${card.customValue}${card.suffix || ""}`}
                                      </p>
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      disabled={cIdx === 0}
                                      onClick={() => moveStatCard(cIdx, "up")}
                                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted/40 hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
                                      title={isAr ? "تقديم الكرت" : "Move Earlier"}
                                    >
                                      <ArrowUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={cIdx === draftConfig.stats.cards.length - 1}
                                      onClick={() => moveStatCard(cIdx, "down")}
                                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted/40 hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
                                      title={isAr ? "تأخير الكرت" : "Move Later"}
                                    >
                                      <ArrowDown className="h-3.5 w-3.5" />
                                    </button>
                                    <Button
                                      type="button"
                                      variant={isCardOpen ? "default" : "outline"}
                                      size="sm"
                                      onClick={() =>
                                        setExpandedStatCardId(isCardOpen ? null : card.id)
                                      }
                                      className="h-7 gap-1 rounded-lg px-2.5 text-[11px]"
                                    >
                                      {isAr ? "تعديل" : "Edit"}
                                      {isCardOpen ? (
                                        <ChevronUp className="h-3.5 w-3.5" />
                                      ) : (
                                        <ChevronDown className="h-3.5 w-3.5" />
                                      )}
                                    </Button>
                                    <button
                                      type="button"
                                      onClick={() => removeStatCard(cIdx)}
                                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                      title={isAr ? "حذف الكرت" : "Delete Card"}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Collapsible Details Form */}
                                {isCardOpen && (
                                  <div className="border-t border-border/60 bg-muted/10 p-4 space-y-3">
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                                      {/* Icon Selector */}
                                      <div className="space-y-1">
                                        <Label className="text-[11px]">
                                          {isAr ? "الأيقونة" : "Icon"}
                                        </Label>
                                        <select
                                          value={card.icon}
                                          onChange={(e) =>
                                            updateStatCard(cIdx, { icon: e.target.value })
                                          }
                                          className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs"
                                        >
                                          {STAT_ICON_OPTIONS.map((opt) => (
                                            <option key={opt.key} value={opt.key}>
                                              {isAr ? opt.labelAr : opt.labelEn}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* Value Source */}
                                      <div className="space-y-1">
                                        <Label className="text-[11px]">
                                          {isAr ? "مصدر الرقم" : "Value Source"}
                                        </Label>
                                        <select
                                          value={card.valueSource}
                                          onChange={(e) =>
                                            updateStatCard(cIdx, {
                                              valueSource: e.target.value as any,
                                            })
                                          }
                                          className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs"
                                        >
                                          <option value="custom">
                                            {isAr ? "رقم مخصص يدوي" : "Custom Number"}
                                          </option>
                                          <option value="auto_faculties">
                                            {isAr
                                              ? "تلقائي: عدد الكليات الفعلي"
                                              : "Auto: Live Faculties Count"}
                                          </option>
                                          <option value="auto_programs">
                                            {isAr
                                              ? "تلقائي: عدد البرامج الأكاديمية"
                                              : "Auto: Live Programs Count"}
                                          </option>
                                        </select>
                                      </div>

                                      {/* Custom Value */}
                                      <div className="space-y-1">
                                        <Label className="text-[11px]">
                                          {card.valueSource === "custom"
                                            ? isAr
                                              ? "الرقم المعروض"
                                              : "Number Value"
                                            : isAr
                                            ? "الرقم الاحتياطي"
                                            : "Fallback Number"}
                                        </Label>
                                        <Input
                                          type="number"
                                          value={card.customValue}
                                          onChange={(e) =>
                                            updateStatCard(cIdx, {
                                              customValue: Number(e.target.value),
                                            })
                                          }
                                          className="h-9 text-xs"
                                        />
                                      </div>

                                      {/* Suffix */}
                                      <div className="space-y-1">
                                        <Label className="text-[11px]">
                                          {isAr ? "لاحقة الرمز (مثل + أو %)" : "Suffix (e.g. + or %)"}
                                        </Label>
                                        <Input
                                          dir="ltr"
                                          value={card.suffix}
                                          onChange={(e) =>
                                            updateStatCard(cIdx, { suffix: e.target.value })
                                          }
                                          placeholder="+"
                                          className="h-9 text-xs"
                                        />
                                      </div>

                                      {/* Card Variant */}
                                      <div className="space-y-1">
                                        <Label className="text-[11px]">
                                          {isAr ? "نمط الكرت" : "Card Variant"}
                                        </Label>
                                        <select
                                          value={card.cardVariant}
                                          onChange={(e) =>
                                            updateStatCard(cIdx, {
                                              cardVariant: e.target.value as any,
                                            })
                                          }
                                          className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs"
                                        >
                                          <option value="standard">
                                            {isAr ? "كرت قياسي (Standard)" : "Standard Card"}
                                          </option>
                                          <option value="featured-split">
                                            {isAr
                                              ? "كرت مزدوج مميز (Featured Split)"
                                              : "Featured Split Card"}
                                          </option>
                                        </select>
                                      </div>
                                    </div>

                                    {/* Labels AR / EN */}
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                      <div className="space-y-1">
                                        <Label className="text-[11px]">
                                          {isAr ? "عنوان الإحصائية (عربي)" : "Label (Arabic)"}
                                        </Label>
                                        <Input
                                          value={card.labelAr}
                                          onChange={(e) =>
                                            updateStatCard(cIdx, { labelAr: e.target.value })
                                          }
                                          className="h-8 text-xs"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-[11px]">
                                          {isAr ? "عنوان الإحصائية (إنجليزي)" : "Label (English)"}
                                        </Label>
                                        <Input
                                          dir="ltr"
                                          value={card.labelEn}
                                          onChange={(e) =>
                                            updateStatCard(cIdx, { labelEn: e.target.value })
                                          }
                                          className="h-8 text-xs"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-[11px]">
                                          {isAr ? "وصف فرعي اختياري (عربي)" : "Sub-label (Arabic)"}
                                        </Label>
                                        <Input
                                          value={card.subLabelAr || ""}
                                          onChange={(e) =>
                                            updateStatCard(cIdx, {
                                              subLabelAr: e.target.value,
                                            })
                                          }
                                          className="h-8 text-xs"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-[11px]">
                                          {isAr ? "وصف فرعي اختياري (إنجليزي)" : "Sub-label (English)"}
                                        </Label>
                                        <Input
                                          dir="ltr"
                                          value={card.subLabelEn || ""}
                                          onChange={(e) =>
                                            updateStatCard(cIdx, {
                                              subLabelEn: e.target.value,
                                            })
                                          }
                                          className="h-8 text-xs"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ==========================================================
                      3. FACULTIES & PROGRAMS INSPECTOR (Layout & Animation)
                  ========================================================== */}
                  {sectionId === "faculties" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            {isAr ? "عنوان القسم (عربي)" : "Section Title (Arabic)"}
                          </Label>
                          <Input
                            value={draftConfig.faculties.titleAr}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                faculties: {
                                  ...prev.faculties,
                                  titleAr: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            {isAr ? "عنوان القسم (إنجليزي)" : "Section Title (English)"}
                          </Label>
                          <Input
                            dir="ltr"
                            value={draftConfig.faculties.titleEn}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                faculties: {
                                  ...prev.faculties,
                                  titleEn: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            {isAr ? "الوصف الفرعي (عربي)" : "Subtitle (Arabic)"}
                          </Label>
                          <Input
                            value={draftConfig.faculties.subtitleAr}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                faculties: {
                                  ...prev.faculties,
                                  subtitleAr: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            {isAr ? "الوصف الفرعي (إنجليزي)" : "Subtitle (English)"}
                          </Label>
                          <Input
                            dir="ltr"
                            value={draftConfig.faculties.subtitleEn}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                faculties: {
                                  ...prev.faculties,
                                  subtitleEn: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                      </div>

                      {/* Layout Style Cards */}
                      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                        <Label className="text-xs font-bold text-primary">
                          {isAr
                            ? "أسلوب عرض الكليات والبرامج (Layout Variant)"
                            : "Faculties Display Layout Variant"}
                        </Label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          {[
                            {
                              id: "tilt-cards-grid",
                              titleAr: "شبكة كروت ثلاثية الأبعاد (3D Tilt Grid)",
                              titleEn: "3D Tilt Cards Grid",
                              descAr: "كروت تفاعلية تميل مع حركة الماوس وتظهر صورة الكلية",
                              descEn: "Interactive 3D cards with cover images",
                            },
                            {
                              id: "carousel-slider",
                              titleAr: "سلايدر أفقي تفاعلي (Carousel Slider)",
                              titleEn: "Interactive Carousel Slider",
                              descAr: "عرض الكليات في شريط منزلق مع أزرار تنقل",
                              descEn: "Horizontal scrollable slider with navigation",
                            },
                            {
                              id: "bento-showcase",
                              titleAr: "شبكة Bento العصرية (Bento Showcase)",
                              titleEn: "Modern Bento Showcase",
                              descAr: "تصميم غير متماثل يبرز الكلية الأولى بحجم مضاعف",
                              descEn: "Asymmetric bento grid highlighting featured faculties",
                            },
                            {
                              id: "compact-directory",
                              titleAr: "دليل أكاديمي مدمج (Compact Directory)",
                              titleEn: "Compact Academic Directory",
                              descAr: "قائمة أنيقة سريعة التصفح بدون صور كبيرة",
                              descEn: "Clean minimal directory list with fast scanning",
                            },
                          ].map((layout) => (
                            <button
                              key={layout.id}
                              type="button"
                              onClick={() =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  faculties: {
                                    ...prev.faculties,
                                    layoutVariant: layout.id as any,
                                  },
                                }))
                              }
                              className={`flex flex-col justify-between rounded-xl border p-3.5 text-start transition-all ${
                                draftConfig.faculties.layoutVariant === layout.id
                                  ? "border-primary bg-primary/10 shadow-xs"
                                  : "border-border bg-background hover:bg-muted/40"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-foreground">
                                  {isAr ? layout.titleAr : layout.titleEn}
                                </span>
                                {draftConfig.faculties.layoutVariant === layout.id && (
                                  <Check className="h-4 w-4 shrink-0 text-primary" />
                                )}
                              </div>
                              <p className="mt-1.5 text-[11px] text-muted-foreground">
                                {isAr ? layout.descAr : layout.descEn}
                              </p>
                            </button>
                          ))}
                        </div>

                        {/* Animation & Columns */}
                        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "أنيميشن ظهور الكليات" : "Entrance Animation"}
                            </Label>
                            <select
                              value={draftConfig.faculties.animationType}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  faculties: {
                                    ...prev.faculties,
                                    animationType: e.target.value as any,
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value="stagger-up">
                                {isAr ? "صعود متتابع (Stagger Up)" : "Stagger Fade Up"}
                              </option>
                              <option value="curtain-reveal">
                                {isAr ? "كشف ستائري (Curtain Reveal)" : "Curtain Reveal"}
                              </option>
                              <option value="scale-blur">
                                {isAr ? "تكبير مع تلاشي الضبابية (Scale Blur)" : "Scale & Blur"}
                              </option>
                              <option value="3d-perspective">
                                {isAr ? "منظور ثلاثي الأبعاد (3D Perspective)" : "3D Perspective"}
                              </option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "عدد الأعمدة (في وضع الشبكة)" : "Grid Columns"}
                            </Label>
                            <select
                              value={draftConfig.faculties.columns}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  faculties: {
                                    ...prev.faculties,
                                    columns: Number(e.target.value) as 3 | 4 | 5,
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value={3}>{isAr ? "3 أعمدة" : "3 Columns"}</option>
                              <option value={4}>{isAr ? "4 أعمدة" : "4 Columns"}</option>
                              <option value={5}>{isAr ? "5 أعمدة" : "5 Columns"}</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "الحد الأقصى للكليات المعروضة" : "Max Items Shown"}
                            </Label>
                            <select
                              value={draftConfig.faculties.itemLimit}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  faculties: {
                                    ...prev.faculties,
                                    itemLimit: Number(e.target.value),
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value={0}>{isAr ? "عرض كافة الكليات" : "Show All"}</option>
                              <option value={3}>{isAr ? "3 كليات فقط" : "3 Faculties"}</option>
                              <option value={4}>{isAr ? "4 كليات فقط" : "4 Faculties"}</option>
                              <option value={6}>{isAr ? "6 كليات فقط" : "6 Faculties"}</option>
                              <option value={8}>{isAr ? "8 كليات فقط" : "8 Faculties"}</option>
                            </select>
                          </div>
                        </div>

                        {/* Toggles */}
                        <div className="flex flex-wrap items-center gap-6 border-t border-border/60 pt-3">
                          <label className="flex items-center gap-2 text-xs">
                            <Switch
                              checked={draftConfig.faculties.enable3DTilt}
                              onCheckedChange={(v) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  faculties: { ...prev.faculties, enable3DTilt: v },
                                }))
                              }
                            />
                            {isAr ? "تفعيل الميلان ثلاثي الأبعاد (3D Tilt)" : "Enable 3D Tilt"}
                          </label>
                          <label className="flex items-center gap-2 text-xs">
                            <Switch
                              checked={draftConfig.faculties.showCoverImage}
                              onCheckedChange={(v) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  faculties: { ...prev.faculties, showCoverImage: v },
                                }))
                              }
                            />
                            {isAr ? "إظهار الصور الخلفية للكليات" : "Show Cover Images"}
                          </label>
                          <label className="flex items-center gap-2 text-xs">
                            <Switch
                              checked={draftConfig.faculties.showProgramsCount}
                              onCheckedChange={(v) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  faculties: {
                                    ...prev.faculties,
                                    showProgramsCount: v,
                                  },
                                }))
                              }
                            />
                            {isAr ? "إظهار شارة عدد البرامج" : "Show Programs Count Badge"}
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ==========================================================
                      4. SUCCESS PARTNERS INSPECTOR (Collapsible + Live Hover Mini-Preview)
                  ========================================================== */}
                  {sectionId === "partners" && (
                    <div className="space-y-6">
                      {/* Section Titles */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            {isAr ? "عنوان القسم (عربي)" : "Section Title (Arabic)"}
                          </Label>
                          <Input
                            value={draftConfig.partners.titleAr}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                partners: {
                                  ...prev.partners,
                                  titleAr: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            {isAr ? "عنوان القسم (إنجليزي)" : "Section Title (English)"}
                          </Label>
                          <Input
                            dir="ltr"
                            value={draftConfig.partners.titleEn}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                partners: {
                                  ...prev.partners,
                                  titleEn: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                      </div>

                      {/* Hover Ribbon & Marquee Style Settings */}
                      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                        <Label className="text-xs font-bold text-primary">
                          {isAr
                            ? "إعدادات الشريط التفاعلي عند التمرير (Hover Ribbon) وطريقة العرض"
                            : "Interactive Hover Ribbon & Display Mode Settings"}
                        </Label>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr
                                ? "تصميم شريط اسم الشريك عند Hover"
                                : "Hover Name Ribbon Style"}
                            </Label>
                            <select
                              value={draftConfig.partners.hoverRibbonStyle}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  partners: {
                                    ...prev.partners,
                                    hoverRibbonStyle: e.target.value as any,
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value="floating-pill">
                                {isAr
                                  ? "كبسولة عائمة أسفل الشعار (Floating Pill)"
                                  : "Floating Pill"}
                              </option>
                              <option value="bottom-slide-bar">
                                {isAr
                                  ? "شريط سفلي منزلق داخل الكرت (Bottom Slide Bar)"
                                  : "Bottom Slide Bar"}
                              </option>
                              <option value="glow-card">
                                {isAr
                                  ? "بطاقة متوهجة كاملة (Full Glow Card)"
                                  : "Full Glow Card"}
                              </option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "أسلوب عرض الشركاء" : "Display Mode"}
                            </Label>
                            <select
                              value={draftConfig.partners.displayMode}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  partners: {
                                    ...prev.partners,
                                    displayMode: e.target.value as any,
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value="infinite-marquee">
                                {isAr
                                  ? "شريط متحرك لانهائي (Infinite Marquee)"
                                  : "Infinite Marquee"}
                              </option>
                              <option value="static-grid">
                                {isAr ? "شبكة ثابتة منتظمة (Static Grid)" : "Static Grid"}
                              </option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "ألوان شعارات الشركاء" : "Logo Color Mode"}
                            </Label>
                            <select
                              value={draftConfig.partners.logoColorMode}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  partners: {
                                    ...prev.partners,
                                    logoColorMode: e.target.value as any,
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value="grayscale-to-color">
                                {isAr
                                  ? "أحادي يتحول لملون عند Hover"
                                  : "Grayscale to Color on Hover"}
                              </option>
                              <option value="full-color">
                                {isAr ? "ملون دائماً (Full Color)" : "Always Full Color"}
                              </option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr
                                ? `سرعة الشريط المتحرك (${draftConfig.partners.marqueeSpeedSeconds} ثانية)`
                                : `Marquee Speed (${draftConfig.partners.marqueeSpeedSeconds}s)`}
                            </Label>
                            <input
                              type="range"
                              min={10}
                              max={60}
                              step={5}
                              value={draftConfig.partners.marqueeSpeedSeconds}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  partners: {
                                    ...prev.partners,
                                    marqueeSpeedSeconds: Number(e.target.value),
                                  },
                                }))
                              }
                              className="w-full accent-primary"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Collapsible Partners List CRUD */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-bold text-foreground">
                              {isAr
                                ? `قائمة شركاء النجاح (${draftConfig.partners.partners.length})`
                                : `Success Partners List (${draftConfig.partners.partners.length})`}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {isAr
                                ? "اسحب لترتيب الشركاء، أو اضغط 'تعديل' لرفع شعار الشريك وتحديد اسم الشريط عند تمرير الماوس (Hover)"
                                : "Drag to reorder partners, or click 'Edit' to upload logo and customize the hover ribbon"}
                            </p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            onClick={addPartnerItem}
                            className="gap-1.5 rounded-xl bg-primary text-xs text-primary-foreground"
                          >
                            <Plus className="h-4 w-4" />
                            {isAr ? "إضافة شريك جديد" : "Add New Partner"}
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                          {draftConfig.partners.partners.map((partner, pIdx) => {
                            const isPartnerOpen = expandedPartnerId === partner.id;
                            const isPartnerDragOver =
                              dragOverPartnerIdx === pIdx && dragPartnerIdx !== pIdx;
                            const PartnerFallbackIcon =
                              PARTNER_ICON_OPTIONS.find(
                                (o) => o.key === partner.fallbackIcon
                              )?.Icon || Building2;

                            return (
                              <div
                                key={partner.id}
                                draggable={!isPartnerOpen}
                                onDragStart={() => setDragPartnerIdx(pIdx)}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  if (dragOverPartnerIdx !== pIdx)
                                    setDragOverPartnerIdx(pIdx);
                                }}
                                onDragEnd={() => {
                                  setDragPartnerIdx(null);
                                  setDragOverPartnerIdx(null);
                                }}
                                onDrop={() => handleDropPartnerItem(pIdx)}
                                className={`rounded-xl border bg-card transition-all ${
                                  isPartnerDragOver
                                    ? "border-primary border-dashed bg-primary/5"
                                    : "border-border shadow-xs"
                                }`}
                              >
                                {/* Compact Partner Row Header */}
                                <div className="flex flex-wrap items-center justify-between gap-2 p-3">
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className="cursor-grab rounded-md p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground"
                                      title={isAr ? "اسحب للترتيب" : "Drag to reorder"}
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-[11px] font-bold text-muted-foreground">
                                      #{pIdx + 1}
                                    </span>
                                    {partner.logoUrl ? (
                                      <img
                                        src={partner.logoUrl}
                                        alt={partner.nameAr}
                                        className="h-8 w-8 rounded-lg border border-border object-contain bg-white p-0.5"
                                      />
                                    ) : (
                                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <PartnerFallbackIcon className="h-4 w-4" />
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedPartnerId(
                                          isPartnerOpen ? null : partner.id
                                        )
                                      }
                                      className="text-start"
                                    >
                                      <p className="text-xs font-bold text-foreground hover:text-primary">
                                        {isAr ? partner.nameAr : partner.nameEn}
                                      </p>
                                      <p className="text-[11px] text-muted-foreground">
                                        {isAr
                                          ? partner.subtitleAr || "شريط Hover تفاعلي"
                                          : partner.subtitleEn || "Interactive Hover Ribbon"}
                                      </p>
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      disabled={pIdx === 0}
                                      onClick={() => movePartnerItem(pIdx, "up")}
                                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted/40 hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
                                    >
                                      <ArrowUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={
                                        pIdx === draftConfig.partners.partners.length - 1
                                      }
                                      onClick={() => movePartnerItem(pIdx, "down")}
                                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted/40 hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
                                    >
                                      <ArrowDown className="h-3.5 w-3.5" />
                                    </button>
                                    <Button
                                      type="button"
                                      variant={isPartnerOpen ? "default" : "outline"}
                                      size="sm"
                                      onClick={() =>
                                        setExpandedPartnerId(
                                          isPartnerOpen ? null : partner.id
                                        )
                                      }
                                      className="h-7 gap-1 rounded-lg px-2.5 text-[11px]"
                                    >
                                      {isAr ? "تعديل" : "Edit"}
                                      {isPartnerOpen ? (
                                        <ChevronUp className="h-3.5 w-3.5" />
                                      ) : (
                                        <ChevronDown className="h-3.5 w-3.5" />
                                      )}
                                    </Button>
                                    <button
                                      type="button"
                                      onClick={() => removePartnerItem(pIdx)}
                                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Expanded Partner Editor + Live Hover Ribbon Mini-Preview */}
                                {isPartnerOpen && (
                                  <div className="border-t border-border/60 bg-muted/10 p-4 space-y-4">
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                                      {/* Left 2 Columns: Inputs */}
                                      <div className="space-y-3 lg:col-span-2">
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                          <div className="space-y-1">
                                            <Label className="text-[11px] font-semibold">
                                              {isAr
                                                ? "اسم الشريك في الشريط عند Hover (عربي)"
                                                : "Hover Ribbon Name (Arabic)"}
                                            </Label>
                                            <Input
                                              value={partner.nameAr}
                                              onChange={(e) =>
                                                updatePartnerItem(pIdx, {
                                                  nameAr: e.target.value,
                                                })
                                              }
                                              className="h-8 text-xs"
                                            />
                                          </div>

                                          <div className="space-y-1">
                                            <Label className="text-[11px] font-semibold">
                                              {isAr
                                                ? "اسم الشريك في الشريط عند Hover (إنجليزي)"
                                                : "Hover Ribbon Name (English)"}
                                            </Label>
                                            <Input
                                              dir="ltr"
                                              value={partner.nameEn}
                                              onChange={(e) =>
                                                updatePartnerItem(pIdx, {
                                                  nameEn: e.target.value,
                                                })
                                              }
                                              className="h-8 text-xs"
                                            />
                                          </div>

                                          <div className="space-y-1">
                                            <Label className="text-[11px]">
                                              {isAr
                                                ? "وصف مختصر في الشريط (عربي)"
                                                : "Hover Subtitle (Arabic)"}
                                            </Label>
                                            <Input
                                              value={partner.subtitleAr || ""}
                                              onChange={(e) =>
                                                updatePartnerItem(pIdx, {
                                                  subtitleAr: e.target.value,
                                                })
                                              }
                                              className="h-8 text-xs"
                                            />
                                          </div>

                                          <div className="space-y-1">
                                            <Label className="text-[11px]">
                                              {isAr
                                                ? "وصف مختصر في الشريط (إنجليزي)"
                                                : "Hover Subtitle (English)"}
                                            </Label>
                                            <Input
                                              dir="ltr"
                                              value={partner.subtitleEn || ""}
                                              onChange={(e) =>
                                                updatePartnerItem(pIdx, {
                                                  subtitleEn: e.target.value,
                                                })
                                              }
                                              className="h-8 text-xs"
                                            />
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                          <div className="space-y-1 sm:col-span-2">
                                            <Label className="text-[11px] font-semibold">
                                              {isAr
                                                ? "صورة / شعار الشريك (رفع صورة أو رابط)"
                                                : "Partner Logo (Upload or URL)"}
                                            </Label>
                                            <div className="flex gap-2">
                                              <Input
                                                dir="ltr"
                                                value={partner.logoUrl}
                                                onChange={(e) =>
                                                  updatePartnerItem(pIdx, {
                                                    logoUrl: e.target.value,
                                                  })
                                                }
                                                placeholder="https://... or upload image"
                                                className="h-8 text-xs"
                                              />
                                              <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                                                <Upload className="h-3.5 w-3.5" />
                                                {isAr ? "رفع شعار" : "Upload"}
                                                <input
                                                  type="file"
                                                  accept="image/*"
                                                  className="hidden"
                                                  onChange={(e) =>
                                                    handleImageFileUpload(
                                                      e.target.files?.[0],
                                                      (dataUrl) =>
                                                        updatePartnerItem(pIdx, {
                                                          logoUrl: dataUrl,
                                                        })
                                                    )
                                                  }
                                                />
                                              </label>
                                              {partner.logoUrl && (
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                    updatePartnerItem(pIdx, {
                                                      logoUrl: "",
                                                    })
                                                  }
                                                  className="h-8 px-2 text-xs text-destructive"
                                                >
                                                  {isAr ? "مسح" : "Clear"}
                                                </Button>
                                              )}
                                            </div>
                                          </div>

                                          <div className="space-y-1">
                                            <Label className="text-[11px]">
                                              {isAr ? "أيقونة بديلة" : "Fallback Icon"}
                                            </Label>
                                            <select
                                              value={partner.fallbackIcon}
                                              onChange={(e) =>
                                                updatePartnerItem(pIdx, {
                                                  fallbackIcon: e.target.value,
                                                })
                                              }
                                              className="h-8 w-full rounded-xl border border-border bg-background px-2.5 text-xs"
                                            >
                                              {PARTNER_ICON_OPTIONS.map((opt) => (
                                                <option key={opt.key} value={opt.key}>
                                                  {isAr ? opt.labelAr : opt.labelEn}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Right Column: Interactive Mini-Preview of the Partner Hover Ribbon */}
                                      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-3">
                                        <span className="mb-2 inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                                          <MousePointerClick className="h-3 w-3 text-primary" />
                                          {isAr
                                            ? "معاينة بطاقة الشريك عند تمرير الماوس (Hover)"
                                            : "Hover Ribbon Live Mini-Preview"}
                                        </span>

                                        <div className="group relative flex h-24 w-44 flex-col items-center justify-center overflow-hidden rounded-xl border border-primary/40 bg-card p-3 shadow-md">
                                          {partner.logoUrl ? (
                                            <img
                                              src={partner.logoUrl}
                                              alt={partner.nameAr}
                                              className="h-10 w-auto max-w-[110px] object-contain"
                                            />
                                          ) : (
                                            <PartnerFallbackIcon className="h-8 w-8 text-primary" />
                                          )}

                                          {/* Simulated Hover Ribbon based on selected hoverRibbonStyle */}
                                          {draftConfig.partners.hoverRibbonStyle ===
                                          "bottom-slide-bar" ? (
                                            <div className="absolute inset-x-0 bottom-0 bg-primary/95 px-2 py-1 text-center text-primary-foreground">
                                              <p className="truncate text-[10px] font-bold">
                                                {isAr ? partner.nameAr : partner.nameEn}
                                              </p>
                                            </div>
                                          ) : draftConfig.partners.hoverRibbonStyle ===
                                            "glow-card" ? (
                                            <div className="mt-1.5 text-center">
                                              <p className="truncate text-[10px] font-bold text-primary">
                                                {isAr ? partner.nameAr : partner.nameEn}
                                              </p>
                                              {(isAr
                                                ? partner.subtitleAr
                                                : partner.subtitleEn) && (
                                                <p className="truncate text-[9px] text-muted-foreground">
                                                  {isAr
                                                    ? partner.subtitleAr
                                                    : partner.subtitleEn}
                                                </p>
                                              )}
                                            </div>
                                          ) : (
                                            <div className="mt-1.5 rounded-full bg-primary px-2.5 py-0.5 text-center text-primary-foreground shadow-xs max-w-full">
                                              <p className="truncate text-[10px] font-bold">
                                                {isAr ? partner.nameAr : partner.nameEn}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ==========================================================
                      5. LATEST NEWS SECTION INSPECTOR (Layout & Animation)
                  ========================================================== */}
                  {sectionId === "news" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            {isAr ? "عنوان القسم (عربي)" : "Section Title (Arabic)"}
                          </Label>
                          <Input
                            value={draftConfig.news.titleAr}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                news: { ...prev.news, titleAr: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            {isAr ? "عنوان القسم (إنجليزي)" : "Section Title (English)"}
                          </Label>
                          <Input
                            dir="ltr"
                            value={draftConfig.news.titleEn}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                news: { ...prev.news, titleEn: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            {isAr ? "الوصف الفرعي (عربي)" : "Subtitle (Arabic)"}
                          </Label>
                          <Input
                            value={draftConfig.news.subtitleAr}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                news: {
                                  ...prev.news,
                                  subtitleAr: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">
                            {isAr ? "الوصف الفرعي (إنجليزي)" : "Subtitle (English)"}
                          </Label>
                          <Input
                            dir="ltr"
                            value={draftConfig.news.subtitleEn}
                            onChange={(e) =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                news: {
                                  ...prev.news,
                                  subtitleEn: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                      </div>

                      {/* News Layout Style Cards */}
                      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                        <Label className="text-xs font-bold text-primary">
                          {isAr
                            ? "أسلوب عرض الأخبار (News Layout Variant)"
                            : "News Display Layout Variant"}
                        </Label>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          {[
                            {
                              id: "center-focus-carousel",
                              titleAr: "كاروسيل التركيز المركزي (Center Carousel)",
                              titleEn: "Center Focus Carousel",
                              descAr: "بطاقة مركزية نشطة مع بطاقات جانبية وأزرار تنقل",
                              descEn: "Active center card with side previews & arrows",
                            },
                            {
                              id: "editorial-magazine",
                              titleAr: "مجلة تحريرية (Editorial Magazine)",
                              titleEn: "Editorial Magazine",
                              descAr: "خبر رئيسي كبير على جانب وقائمة أخبار فرعية في الجانب الآخر",
                              descEn: "1 Featured large story + vertical side story list",
                            },
                            {
                              id: "modern-grid",
                              titleAr: "شبكة كروت حديثة (Modern 3-Column Grid)",
                              titleEn: "Modern 3-Column Grid",
                              descAr: "شبكة متساوية من 3 أعمدة مع صور وتصنيفات واضحة",
                              descEn: "Clean 3-column news cards grid",
                            },
                            {
                              id: "compact-feed",
                              titleAr: "شريط أخبار مدمج (Compact Timeline Feed)",
                              titleEn: "Compact Timeline Feed",
                              descAr: "قائمة أخبار أفقية سريعة القراءة مع صور مصغرة",
                              descEn: "Fast-scanning horizontal rows with thumbnails",
                            },
                          ].map((layout) => (
                            <button
                              key={layout.id}
                              type="button"
                              onClick={() =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  news: {
                                    ...prev.news,
                                    layoutVariant: layout.id as any,
                                  },
                                }))
                              }
                              className={`flex flex-col justify-between rounded-xl border p-3.5 text-start transition-all ${
                                draftConfig.news.layoutVariant === layout.id
                                  ? "border-primary bg-primary/10 shadow-xs"
                                  : "border-border bg-background hover:bg-muted/40"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-foreground">
                                  {isAr ? layout.titleAr : layout.titleEn}
                                </span>
                                {draftConfig.news.layoutVariant === layout.id && (
                                  <Check className="h-4 w-4 shrink-0 text-primary" />
                                )}
                              </div>
                              <p className="mt-1.5 text-[11px] text-muted-foreground">
                                {isAr ? layout.descAr : layout.descEn}
                              </p>
                            </button>
                          ))}
                        </div>

                        {/* Animation, Filter & Limits */}
                        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "أنيميشن ظهور الأخبار" : "Entrance Animation"}
                            </Label>
                            <select
                              value={draftConfig.news.animationType}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  news: {
                                    ...prev.news,
                                    animationType: e.target.value as any,
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value="curtain-split">
                                {isAr ? "انشقاق ستائري (Curtain Split)" : "Curtain Split"}
                              </option>
                              <option value="stagger-fade-up">
                                {isAr ? "صعود متتابع (Stagger Fade Up)" : "Stagger Fade Up"}
                              </option>
                              <option value="scale-spring">
                                {isAr ? "ارتداد مرن (Scale Spring)" : "Scale Spring"}
                              </option>
                              <option value="blur-slide">
                                {isAr ? "انزلاق ضبابي ناعم (Blur Slide)" : "Blur Slide"}
                              </option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "فلترة فئة الأخبار" : "Category Filter"}
                            </Label>
                            <select
                              value={draftConfig.news.categoryFilter}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  news: {
                                    ...prev.news,
                                    categoryFilter: e.target.value as any,
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value="all">{isAr ? "كافة الفئات" : "All Categories"}</option>
                              <option value="announcement">{isAr ? "إعلانات" : "Announcements"}</option>
                              <option value="event">{isAr ? "فعاليات" : "Events"}</option>
                              <option value="achievement">{isAr ? "إنجازات" : "Achievements"}</option>
                              <option value="research">{isAr ? "أبحاث علمية" : "Research"}</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">
                              {isAr ? "عدد الأخبار المعروضة" : "Max News Items"}
                            </Label>
                            <select
                              value={draftConfig.news.itemLimit}
                              onChange={(e) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  news: {
                                    ...prev.news,
                                    itemLimit: Number(e.target.value),
                                  },
                                }))
                              }
                              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs"
                            >
                              <option value={0}>{isAr ? "عرض الكل" : "Show All"}</option>
                              <option value={3}>{isAr ? "3 أخبار" : "3 Items"}</option>
                              <option value={4}>{isAr ? "4 أخبار" : "4 Items"}</option>
                              <option value={6}>{isAr ? "6 أخبار" : "6 Items"}</option>
                            </select>
                          </div>
                        </div>

                        {/* Toggles */}
                        <div className="flex flex-wrap items-center gap-6 border-t border-border/60 pt-3">
                          <label className="flex items-center gap-2 text-xs">
                            <Switch
                              checked={draftConfig.news.showDate}
                              onCheckedChange={(v) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  news: { ...prev.news, showDate: v },
                                }))
                              }
                            />
                            {isAr ? "إظهار تاريخ النشر" : "Show Date"}
                          </label>
                          <label className="flex items-center gap-2 text-xs">
                            <Switch
                              checked={draftConfig.news.showCategoryBadge}
                              onCheckedChange={(v) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  news: { ...prev.news, showCategoryBadge: v },
                                }))
                              }
                            />
                            {isAr ? "إظهار شارة التصنيف" : "Show Category Badge"}
                          </label>
                          <label className="flex items-center gap-2 text-xs">
                            <Switch
                              checked={draftConfig.news.showExcerpt}
                              onCheckedChange={(v) =>
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  news: { ...prev.news, showExcerpt: v },
                                }))
                              }
                            />
                            {isAr ? "إظهار المقتطف النصي" : "Show Excerpt"}
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
