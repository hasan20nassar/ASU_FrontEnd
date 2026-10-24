"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface SocialLinkItem {
  key: "facebook" | "linkedin" | "youtube" | "instagram" | "telegram" | "twitter";
  nameAr: string;
  nameEn: string;
  url: string;
  enabled: boolean;
}

export interface ContactFieldItem {
  key: "email" | "phone" | "address" | "officeAddress" | "workingHours";
  value?: string;
  valueAr?: string;
  valueEn?: string;
  enabled: boolean;
}

export const DEFAULT_PUBLISHED_PAGES: Record<string, boolean> = {
  home: true,
  about: true,
  about_directory: true,
  about_map: true,
  academics: true,
  admissions: true,
  campus_life: true,
  library: true,
  research: true,
  news: true,
  contact: true,
  privacy: true,
  terms: true,
  developer: true,
};

// ============================================================================
// ENTERPRISE HOME PAGE BUILDER TYPES & DEFAULT CONFIG
// ============================================================================

export type HomeSectionId = "hero" | "stats" | "faculties" | "partners" | "news";

export interface HomeHeroConfig {
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  backgroundType: "video" | "image" | "gradient";
  videoUrl: string;
  posterUrl: string;
  overlayOpacity: number;
  backdropBlur: number;
  alignment: "center" | "start";
  heightVariant: "full" | "medium" | "compact";
  animationType: "scale-fade" | "blur-reveal" | "slide-up-stagger" | "typewriter";
  showScrollIndicator: boolean;
  showPrimaryCta: boolean;
  primaryCtaTextAr: string;
  primaryCtaTextEn: string;
  primaryCtaLink: string;
  showSecondaryCta: boolean;
  secondaryCtaTextAr: string;
  secondaryCtaTextEn: string;
  secondaryCtaLink: string;
}

export interface HomeStatCardItem {
  id: string;
  icon: string;
  valueSource: "auto_faculties" | "auto_programs" | "custom";
  customValue: number;
  prefix: string;
  suffix: string;
  labelAr: string;
  labelEn: string;
  subLabelAr?: string;
  subLabelEn?: string;
  cardVariant: "standard" | "featured-split";
  featuredSystemTitleAr?: string;
  featuredSystemTitleEn?: string;
}

export interface HomeStatsConfig {
  showHeader: boolean;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  columns: 2 | 3 | 4;
  layoutStyle: "cards-bordered" | "glass-floating" | "minimal-ribbon";
  animationType: "fade-up" | "zoom-bounce" | "flip-x" | "slide-alternate";
  counterDuration: number;
  cards: HomeStatCardItem[];
}

export interface HomeFacultiesConfig {
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  layoutVariant: "tilt-cards-grid" | "carousel-slider" | "bento-showcase" | "compact-directory";
  animationType: "stagger-up" | "curtain-reveal" | "scale-blur" | "3d-perspective";
  columns: 3 | 4 | 5;
  itemLimit: number;
  enable3DTilt: boolean;
  showCoverImage: boolean;
  showProgramsCount: boolean;
  showCta: boolean;
  ctaTextAr: string;
  ctaTextEn: string;
  ctaLink: string;
}

export interface HomePartnerItem {
  id: string;
  nameAr: string;
  nameEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  logoUrl: string;
  fallbackIcon: string;
  websiteUrl?: string;
}

export interface HomePartnersConfig {
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  displayMode: "infinite-marquee" | "static-grid";
  hoverRibbonStyle: "floating-pill" | "bottom-slide-bar" | "glow-card";
  logoColorMode: "grayscale-to-color" | "full-color";
  marqueeSpeedSeconds: number;
  marqueeDirection: "auto" | "left" | "right";
  pauseOnHover: boolean;
  partners: HomePartnerItem[];
}

export interface HomeNewsConfig {
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  layoutVariant: "center-focus-carousel" | "editorial-magazine" | "modern-grid" | "compact-feed";
  animationType: "curtain-split" | "stagger-fade-up" | "scale-spring" | "blur-slide";
  categoryFilter: "all" | "announcement" | "event" | "achievement" | "research";
  itemLimit: number;
  showDate: boolean;
  showCategoryBadge: boolean;
  showExcerpt: boolean;
  showCta: boolean;
  ctaTextAr: string;
  ctaTextEn: string;
  ctaLink: string;
}

export interface HomeSectionSchedule {
  enabled: boolean;
  startDate?: string;
  endDate?: string;
}

export interface HomePageSnapshot {
  id: string;
  timestamp: string;
  labelAr: string;
  labelEn: string;
  config: Omit<HomePageConfig, "historySnapshots">;
}

export interface HomePageConfig {
  sectionsOrder: HomeSectionId[];
  enabledSections: Record<HomeSectionId, boolean>;
  sectionSchedules: Record<string, HomeSectionSchedule>;
  hero: HomeHeroConfig;
  stats: HomeStatsConfig;
  faculties: HomeFacultiesConfig;
  partners: HomePartnersConfig;
  news: HomeNewsConfig;
  historySnapshots?: HomePageSnapshot[];
}

export const DEFAULT_HOME_PAGE_CONFIG: HomePageConfig = {
  sectionsOrder: ["hero", "stats", "faculties", "partners", "news"],
  enabledSections: {
    hero: true,
    stats: true,
    faculties: true,
    partners: true,
    news: true,
  },
  sectionSchedules: {},
  hero: {
    titleAr: "جامعة أنطاكية السورية",
    titleEn: "Antioch Syrian University",
    subtitleAr: "مؤسسة تعليمية رائدة تهدف إلى إعداد كوادر علمية متميزة ومؤهلة للمساهمة في بناء المجتمع وتطوره",
    subtitleEn: "A leading educational institution dedicated to preparing distinguished graduates qualified to contribute to society's development",
    backgroundType: "video",
    videoUrl: "/videos/home-video.mp4",
    posterUrl: "/hero-bg.png",
    overlayOpacity: 20,
    backdropBlur: 2,
    alignment: "center",
    heightVariant: "full",
    animationType: "scale-fade",
    showScrollIndicator: true,
    showPrimaryCta: false,
    primaryCtaTextAr: "استكشف الكليات",
    primaryCtaTextEn: "Explore Faculties",
    primaryCtaLink: "/academics",
    showSecondaryCta: false,
    secondaryCtaTextAr: "القبول والتسجيل",
    secondaryCtaTextEn: "Admissions",
    secondaryCtaLink: "/admissions",
  },
  stats: {
    showHeader: false,
    titleAr: "الجامعة في أرقام",
    titleEn: "University in Numbers",
    subtitleAr: "مؤشرات التميز الأكاديمي والبحثي في جامعة أنطاكية السورية",
    subtitleEn: "Indicators of academic and research excellence at Antioch Syrian University",
    columns: 3,
    layoutStyle: "cards-bordered",
    animationType: "fade-up",
    counterDuration: 2,
    cards: [
      {
        id: "stat-faculties",
        icon: "Building2",
        valueSource: "auto_faculties",
        customValue: 7,
        prefix: "",
        suffix: "",
        labelAr: "كليات متخصصة",
        labelEn: "Specialized Faculties",
        cardVariant: "standard",
      },
      {
        id: "stat-programs",
        icon: "GraduationCap",
        valueSource: "auto_programs",
        customValue: 15,
        prefix: "",
        suffix: "+",
        labelAr: "برنامج أكاديمي",
        labelEn: "Academic Programs",
        cardVariant: "standard",
      },
      {
        id: "stat-students",
        icon: "Users",
        valueSource: "custom",
        customValue: 3500,
        prefix: "",
        suffix: "+",
        labelAr: "طالب وطالبة",
        labelEn: "Students",
        subLabelAr: "معرة صيدنايا - ريف دمشق",
        subLabelEn: "Maarat Saidnaya - Damascus Countryside",
        cardVariant: "featured-split",
        featuredSystemTitleAr: "نظام الساعات المعتمدة",
        featuredSystemTitleEn: "Credit Hour System",
      },
    ],
  },
  faculties: {
    titleAr: "البرامج والكليات",
    titleEn: "Programs and Faculties",
    subtitleAr: "برامج أكاديمية متنوعة تلبي تطلعاتك المهنية",
    subtitleEn: "Diverse academic programs to meet your career aspirations",
    layoutVariant: "tilt-cards-grid",
    animationType: "stagger-up",
    columns: 4,
    itemLimit: 0,
    enable3DTilt: true,
    showCoverImage: true,
    showProgramsCount: true,
    showCta: true,
    ctaTextAr: "عرض الكل",
    ctaTextEn: "View All",
    ctaLink: "/academics",
  },
  partners: {
    titleAr: "شركاء النجاح",
    titleEn: "Success Partners",
    subtitleAr: "مؤسسات وشركات شريكة في تحقيق التميز الأكاديمي والعملي",
    subtitleEn: "Partner organizations contributing to academic and practical excellence",
    displayMode: "infinite-marquee",
    hoverRibbonStyle: "floating-pill",
    logoColorMode: "grayscale-to-color",
    marqueeSpeedSeconds: 25,
    marqueeDirection: "auto",
    pauseOnHover: true,
    partners: [
      {
        id: "partner-1",
        nameAr: "اتحاد الجامعات العربية",
        nameEn: "Association of Arab Universities",
        subtitleAr: "شراكة أكاديمية واعتراف دولي",
        subtitleEn: "Academic Partnership & Accreditation",
        logoUrl: "",
        fallbackIcon: "School",
        websiteUrl: "",
      },
      {
        id: "partner-2",
        nameAr: "المراكز الهندسية والاستشارية",
        nameEn: "Engineering Consulting Centers",
        subtitleAr: "تدريب عملي ومشاريع تخرج",
        subtitleEn: "Practical Training & Capstone Projects",
        logoUrl: "",
        fallbackIcon: "Building2",
        websiteUrl: "",
      },
      {
        id: "partner-3",
        nameAr: "المؤسسات المصرفية والمالية",
        nameEn: "Banking & Financial Institutions",
        subtitleAr: "تدريب طلاب العلوم الإدارية والاقتصادية",
        subtitleEn: "Business & Finance Internships",
        logoUrl: "",
        fallbackIcon: "Landmark",
        websiteUrl: "",
      },
      {
        id: "partner-4",
        nameAr: "هيئة التميز والإبداع",
        nameEn: "Distinction and Creativity Agency",
        subtitleAr: "رعاية المواهب والأولمبياد العلمي",
        subtitleEn: "Talent Sponsorship & Scientific Olympiad",
        logoUrl: "",
        fallbackIcon: "GraduationCap",
        websiteUrl: "",
      },
      {
        id: "partner-5",
        nameAr: "هيئة البحث العلمي والابتكار",
        nameEn: "Scientific Research Commission",
        subtitleAr: "تمويل وتطوير الأبحاث المشتركة",
        subtitleEn: "Joint Research Funding & Development",
        logoUrl: "",
        fallbackIcon: "Award",
        websiteUrl: "",
      },
      {
        id: "partner-6",
        nameAr: "المكتبات الرقمية العالمية",
        nameEn: "Global Digital Libraries",
        subtitleAr: "قواعد بيانات ومصادر علمية محكّمة",
        subtitleEn: "Peer-Reviewed Scientific Databases",
        logoUrl: "",
        fallbackIcon: "BookOpen",
        websiteUrl: "",
      },
      {
        id: "partner-7",
        nameAr: "شركات التكنولوجيا والبرمجيات",
        nameEn: "Tech & Software Enterprises",
        subtitleAr: "حاضنات تقنية وفرص توظيف",
        subtitleEn: "Tech Incubators & Career Opportunities",
        logoUrl: "",
        fallbackIcon: "Briefcase",
        websiteUrl: "",
      },
      {
        id: "partner-8",
        nameAr: "نقابة المهندسين والصيادلة",
        nameEn: "Professional Syndicates",
        subtitleAr: "تأهيل مهني واعتماد نقابي",
        subtitleEn: "Professional Qualification & Licensing",
        logoUrl: "",
        fallbackIcon: "Library",
        websiteUrl: "",
      },
      {
        id: "partner-9",
        nameAr: "شبكة الجامعات الأوروبية المتوسطية",
        nameEn: "Euro-Mediterranean University Network",
        subtitleAr: "تبادل طلابي وأكاديمي دولي",
        subtitleEn: "International Student & Faculty Exchange",
        logoUrl: "",
        fallbackIcon: "Globe",
        websiteUrl: "",
      },
      {
        id: "partner-10",
        nameAr: "مؤسسات الرعاية الصحية والمشافي التعليمية",
        nameEn: "Healthcare & Teaching Hospitals",
        subtitleAr: "تدريب سريري وطبي متقدم",
        subtitleEn: "Advanced Clinical & Medical Training",
        logoUrl: "",
        fallbackIcon: "HeartHandshake",
        websiteUrl: "",
      },
    ],
  },
  news: {
    titleAr: "آخر الأخبار",
    titleEn: "Latest News",
    subtitleAr: "تابع آخر المستجدات والإعلانات",
    subtitleEn: "Stay updated with the latest announcements",
    layoutVariant: "center-focus-carousel",
    animationType: "curtain-split",
    categoryFilter: "all",
    itemLimit: 0,
    showDate: true,
    showCategoryBadge: true,
    showExcerpt: true,
    showCta: true,
    ctaTextAr: "عرض الكل",
    ctaTextEn: "View All",
    ctaLink: "/news",
  },
  historySnapshots: [],
};

export function getMergedHomePageConfig(
  raw?: Partial<HomePageConfig> | Record<string, any>
): HomePageConfig {
  if (!raw || typeof raw !== "object") {
    return DEFAULT_HOME_PAGE_CONFIG;
  }

  const validSectionIds: HomeSectionId[] = ["hero", "stats", "faculties", "partners", "news"];
  const rawOrder = Array.isArray(raw.sectionsOrder)
    ? (raw.sectionsOrder.filter((id: any) => validSectionIds.includes(id)) as HomeSectionId[])
    : [];
  const missingIds = validSectionIds.filter((id) => !rawOrder.includes(id));
  const sectionsOrder: HomeSectionId[] =
    rawOrder.length > 0 ? [...rawOrder, ...missingIds] : [...DEFAULT_HOME_PAGE_CONFIG.sectionsOrder];

  const enabledSections: Record<HomeSectionId, boolean> = {
    ...DEFAULT_HOME_PAGE_CONFIG.enabledSections,
    ...(raw.enabledSections || {}),
  };

  const hero: HomeHeroConfig = {
    ...DEFAULT_HOME_PAGE_CONFIG.hero,
    ...(raw.hero || {}),
  };

  const stats: HomeStatsConfig = {
    ...DEFAULT_HOME_PAGE_CONFIG.stats,
    ...(raw.stats || {}),
    cards:
      Array.isArray(raw.stats?.cards) && raw.stats.cards.length > 0
        ? raw.stats.cards.map((c: any, idx: number) => ({
            id: c.id || `stat-${idx}`,
            icon: c.icon || "Building2",
            valueSource: c.valueSource || "custom",
            customValue: Number(c.customValue ?? 0),
            prefix: c.prefix ?? "",
            suffix: c.suffix ?? "",
            labelAr: c.labelAr ?? "",
            labelEn: c.labelEn ?? "",
            subLabelAr: c.subLabelAr ?? "",
            subLabelEn: c.subLabelEn ?? "",
            cardVariant: c.cardVariant || "standard",
            featuredSystemTitleAr: c.featuredSystemTitleAr ?? "",
            featuredSystemTitleEn: c.featuredSystemTitleEn ?? "",
          }))
        : DEFAULT_HOME_PAGE_CONFIG.stats.cards,
  };

  const faculties: HomeFacultiesConfig = {
    ...DEFAULT_HOME_PAGE_CONFIG.faculties,
    ...(raw.faculties || {}),
  };

  const partners: HomePartnersConfig = {
    ...DEFAULT_HOME_PAGE_CONFIG.partners,
    ...(raw.partners || {}),
    partners:
      Array.isArray(raw.partners?.partners) && raw.partners.partners.length > 0
        ? raw.partners.partners.map((p: any, idx: number) => ({
            id: p.id || `partner-${idx}`,
            nameAr: p.nameAr ?? `شريك ${idx + 1}`,
            nameEn: p.nameEn ?? `Partner ${idx + 1}`,
            subtitleAr: p.subtitleAr ?? "",
            subtitleEn: p.subtitleEn ?? "",
            logoUrl: p.logoUrl ?? "",
            fallbackIcon: p.fallbackIcon || "Building2",
            websiteUrl: p.websiteUrl ?? "",
          }))
        : DEFAULT_HOME_PAGE_CONFIG.partners.partners,
  };

  const news: HomeNewsConfig = {
    ...DEFAULT_HOME_PAGE_CONFIG.news,
    ...(raw.news || {}),
  };

  return {
    sectionsOrder,
    enabledSections,
    sectionSchedules: raw.sectionSchedules || {},
    hero,
    stats,
    faculties,
    partners,
    news,
    historySnapshots: Array.isArray(raw.historySnapshots)
      ? raw.historySnapshots.slice(0, 8)
      : [],
  };
}

export interface SiteSettings {
  email: string;
  phone: string;
  address: string;
  addressEn?: string;
  officeAddress: string;
  officeAddressEn?: string;
  workingHours: string;
  workingHoursEn?: string;
  contactFields: Record<string, ContactFieldItem>;
  registrationOpen: boolean;
  maintenanceMode: boolean;
  showResults: boolean;
  socialLinks: Record<string, SocialLinkItem>;
  publishedPages: Record<string, boolean>;
  homePageConfig: HomePageConfig;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  email: "info@asu.edu.sy",
  phone: "(+963) 11 5954910",
  address: "معرة صيدنايا، ريف دمشق، سوريا",
  addressEn: "Maarat Saidnaya, Damascus Countryside, Syria",
  officeAddress: "دمشق، البرامكة، مقابل كلية الحقوق - مكتب المتابعة والتسجيل",
  officeAddressEn: "Damascus, Baramkeh, Opposite Faculty of Law - Follow-up & Registration Office",
  workingHours: "الأحد - الخميس: 8:00 ص - 4:00 م",
  workingHoursEn: "Sunday - Thursday: 8:00 AM - 4:00 PM",
  contactFields: {
    email: {
      key: "email",
      value: "info@asu.edu.sy",
      enabled: true,
    },
    phone: {
      key: "phone",
      value: "(+963) 11 5954910",
      enabled: true,
    },
    address: {
      key: "address",
      value: "معرة صيدنايا، ريف دمشق، سوريا",
      valueAr: "معرة صيدنايا، ريف دمشق، سوريا",
      valueEn: "Maarat Saidnaya, Damascus Countryside, Syria",
      enabled: true,
    },
    officeAddress: {
      key: "officeAddress",
      value: "دمشق، البرامكة، مقابل كلية الحقوق - مكتب المتابعة والتسجيل",
      valueAr: "دمشق، البرامكة، مقابل كلية الحقوق - مكتب المتابعة والتسجيل",
      valueEn: "Damascus, Baramkeh, Opposite Faculty of Law - Follow-up & Registration Office",
      enabled: true,
    },
    workingHours: {
      key: "workingHours",
      value: "الأحد - الخميس: 8:00 ص - 4:00 م",
      valueAr: "الأحد - الخميس: 8:00 ص - 4:00 م",
      valueEn: "Sunday - Thursday: 8:00 AM - 4:00 PM",
      enabled: true,
    },
  },
  registrationOpen: true,
  maintenanceMode: false,
  showResults: true,
  socialLinks: {
    facebook: {
      key: "facebook",
      nameAr: "فيسبوك",
      nameEn: "Facebook",
      url: "https://www.facebook.com/asu.edu.sy.private",
      enabled: true,
    },
    linkedin: {
      key: "linkedin",
      nameAr: "لينكد إن",
      nameEn: "LinkedIn",
      url: "https://linkedin.com/school/antioch-syrian-university",
      enabled: true,
    },
    youtube: {
      key: "youtube",
      nameAr: "يوتيوب",
      nameEn: "YouTube",
      url: "https://youtube.com/@antiochsyrianuniversity",
      enabled: true,
    },
    instagram: {
      key: "instagram",
      nameAr: "إنستغرام",
      nameEn: "Instagram",
      url: "https://instagram.com/asu_syria",
      enabled: true,
    },
    telegram: {
      key: "telegram",
      nameAr: "تلجرام",
      nameEn: "Telegram",
      url: "https://t.me/asu_syria",
      enabled: true,
    },
    twitter: {
      key: "twitter",
      nameAr: "منصة X",
      nameEn: "X",
      url: "https://x.com/asu_syria",
      enabled: true,
    },
  },
  publishedPages: { ...DEFAULT_PUBLISHED_PAGES },
  homePageConfig: DEFAULT_HOME_PAGE_CONFIG,
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  updateSocialLink: (key: string, url: string, enabled: boolean) => Promise<void>;
  updatePublishedPages: (newPages: Record<string, boolean>) => Promise<boolean>;
  updateHomePageConfig: (newConfig: HomePageConfig) => Promise<boolean>;
  isPagePublished: (keyOrPath: string) => boolean;
  resetSettings: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const STORAGE_KEY = "asu_site_settings_v11";
const SETTINGS_EVENT = "asu_site_settings_updated";

function getCandidateApiBaseUrls(): string[] {
  const candidates: string[] = [];

  // 1. Relative same-origin proxy (works across LAN devices via Next.js rewrites)
  candidates.push("");

  // 2. Dynamic current hostname with port 8000 (if Django is running on 0.0.0.0:8000)
  if (typeof window !== "undefined" && window.location.hostname) {
    const protocol = window.location.protocol || "http:";
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1" && !host.endsWith(".vercel.app")) {
      candidates.push(`${protocol}//${host}:8000`);
    }
  }

  // 3. Configured NEXT_PUBLIC_API_URL
  if (process.env.NEXT_PUBLIC_API_URL) {
    candidates.push(process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, ""));
  }

  // 4. Localhost fallback
  candidates.push("http://127.0.0.1:8000");

  return Array.from(new Set(candidates));
}

export function getMergedContactFields(
  parsedFields?: Record<string, any>
): Record<string, ContactFieldItem> {
  const merged = { ...DEFAULT_SITE_SETTINGS.contactFields };
  if (parsedFields && typeof parsedFields === "object") {
    Object.keys(DEFAULT_SITE_SETTINGS.contactFields).forEach((key) => {
      if (parsedFields[key]) {
        const item = parsedFields[key];
        const defaultItem =
          DEFAULT_SITE_SETTINGS.contactFields[
            key as keyof typeof DEFAULT_SITE_SETTINGS.contactFields
          ];
        merged[key as keyof typeof DEFAULT_SITE_SETTINGS.contactFields] = {
          ...defaultItem,
          ...item,
          value: item.value !== undefined ? item.value : defaultItem.value,
          valueAr:
            item.valueAr ?? item.value ?? defaultItem.valueAr ?? defaultItem.value,
          valueEn:
            item.valueEn ?? defaultItem.valueEn ?? item.value ?? defaultItem.value,
          enabled: item.enabled !== undefined ? item.enabled : defaultItem.enabled,
        };
      }
    });
  }
  return merged;
}

export function getMergedPublishedPages(
  parsedPages?: Record<string, any>
): Record<string, boolean> {
  const merged: Record<string, boolean> = { ...DEFAULT_PUBLISHED_PAGES };
  if (parsedPages && typeof parsedPages === "object") {
    Object.keys(parsedPages).forEach((key) => {
      merged[key] = Boolean(parsedPages[key]);
    });
  }
  merged.home = true; // Home is always published
  return merged;
}

/**
 * Evaluates whether a given page key or URL path is published,
 * strictly enforcing parent-child hierarchy rules:
 * - Home ("/" or "home") is always published.
 * - Subpages under a parent are unpublished if the parent or the subpage itself is unpublished.
 */
export function checkIsPagePublished(
  publishedPages: Record<string, boolean> | undefined,
  keyOrPath: string
): boolean {
  const pages = publishedPages || DEFAULT_PUBLISHED_PAGES;
  const raw = (keyOrPath || "").trim();

  if (!raw || raw === "/" || raw === "home") {
    return true;
  }

  // Normalize path vs key
  const cleanPath = raw.startsWith("/") ? raw.replace(/\/+$/, "") || "/" : "";

  const isKeyEnabled = (k: string): boolean => {
    if (k === "home") return true;
    return pages[k] !== false;
  };

  // Direct key check with parent hierarchy
  if (!cleanPath) {
    if (raw === "about") return isKeyEnabled("about");
    if (raw === "about_directory")
      return isKeyEnabled("about") && isKeyEnabled("about_directory");
    if (raw === "about_map")
      return isKeyEnabled("about") && isKeyEnabled("about_map");

    if (raw === "academics") return isKeyEnabled("academics");
    if (raw.startsWith("faculty:")) {
      return isKeyEnabled("academics") && isKeyEnabled(raw);
    }
    if (raw.startsWith("program:")) {
      const parts = raw.split(":");
      if (parts.length === 3) {
        const facSlug = parts[1];
        return (
          isKeyEnabled("academics") &&
          isKeyEnabled(`faculty:${facSlug}`) &&
          isKeyEnabled(raw)
        );
      }
      return isKeyEnabled("academics") && isKeyEnabled(raw);
    }

    if (raw === "campus_life") return isKeyEnabled("campus_life");
    if (raw === "library")
      return isKeyEnabled("campus_life") && isKeyEnabled("library");
    if (raw === "research")
      return isKeyEnabled("campus_life") && isKeyEnabled("research");

    return isKeyEnabled(raw);
  }

  // Path-based evaluation
  if (cleanPath === "/") return true;

  // Protected / System paths are not public content pages
  if (
    cleanPath.startsWith("/dashboard") ||
    cleanPath.startsWith("/portal") ||
    cleanPath.startsWith("/login")
  ) {
    return true;
  }

  // 1. About & Subpages
  if (cleanPath === "/about") {
    return isKeyEnabled("about");
  }
  if (cleanPath === "/about/directory" || cleanPath.startsWith("/about/directory/")) {
    return isKeyEnabled("about") && isKeyEnabled("about_directory");
  }
  if (cleanPath === "/about/map" || cleanPath.startsWith("/about/map/")) {
    return isKeyEnabled("about") && isKeyEnabled("about_map");
  }

  // 2. Academics, Faculties & Programs
  if (cleanPath === "/academics") {
    return isKeyEnabled("academics");
  }
  if (cleanPath.startsWith("/academics/")) {
    if (!isKeyEnabled("academics")) return false;
    const segments = cleanPath.replace("/academics/", "").split("/").filter(Boolean);
    const facultySlug = segments[0];
    const programSlug = segments[1];
    if (facultySlug && !isKeyEnabled(`faculty:${facultySlug}`)) {
      return false;
    }
    if (facultySlug && programSlug) {
      if (
        !isKeyEnabled(`program:${facultySlug}:${programSlug}`) ||
        !isKeyEnabled(`program:${programSlug}`)
      ) {
        return false;
      }
    }
    return true;
  }
  if (cleanPath.startsWith("/faculties/")) {
    if (!isKeyEnabled("academics")) return false;
    const segments = cleanPath.replace("/faculties/", "").split("/").filter(Boolean);
    const facultySlug = segments[0];
    if (facultySlug && !isKeyEnabled(`faculty:${facultySlug}`)) {
      return false;
    }
    return true;
  }

  // 3. Admissions
  if (cleanPath === "/admissions" || cleanPath.startsWith("/admissions/")) {
    return isKeyEnabled("admissions");
  }

  // 4. Campus Life & Subpages (Library, Research)
  if (cleanPath === "/campus-life" || cleanPath.startsWith("/campus-life/")) {
    return isKeyEnabled("campus_life");
  }
  if (cleanPath === "/library" || cleanPath.startsWith("/library/")) {
    return isKeyEnabled("campus_life") && isKeyEnabled("library");
  }
  if (cleanPath === "/research" || cleanPath.startsWith("/research/")) {
    return isKeyEnabled("campus_life") && isKeyEnabled("research");
  }

  // 5. News
  if (cleanPath === "/news" || cleanPath.startsWith("/news/")) {
    return isKeyEnabled("news");
  }

  // 6. Contact
  if (cleanPath === "/contact" || cleanPath.startsWith("/contact/")) {
    return isKeyEnabled("contact");
  }

  // 7. Footer Legal & Info Pages
  if (cleanPath === "/privacy" || cleanPath.startsWith("/privacy/")) {
    return isKeyEnabled("privacy");
  }
  if (cleanPath === "/terms" || cleanPath.startsWith("/terms/")) {
    return isKeyEnabled("terms");
  }
  if (cleanPath === "/developer" || cleanPath.startsWith("/developer/")) {
    return isKeyEnabled("developer");
  }

  return true;
}

function getStoredSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_SITE_SETTINGS;

    const parsed = JSON.parse(saved);
    const mergedSocialLinks = { ...DEFAULT_SITE_SETTINGS.socialLinks };

    if (parsed.socialLinks && typeof parsed.socialLinks === "object") {
      Object.keys(DEFAULT_SITE_SETTINGS.socialLinks).forEach((key) => {
        if (parsed.socialLinks[key]) {
          mergedSocialLinks[key] = {
            ...mergedSocialLinks[key],
            ...parsed.socialLinks[key],
          };
        }
      });
    }

    const mergedContactFields = getMergedContactFields(parsed.contactFields);
    const mergedPublishedPages = getMergedPublishedPages(parsed.publishedPages);
    const mergedHomePageConfig = getMergedHomePageConfig(parsed.homePageConfig);

    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      contactFields: mergedContactFields,
      socialLinks: mergedSocialLinks,
      publishedPages: mergedPublishedPages,
      homePageConfig: mergedHomePageConfig,
    };
  } catch (err) {
    console.error("Failed to parse site settings from localStorage:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

async function fetchFromBackendApi(): Promise<SiteSettings | null> {
  const candidates = getCandidateApiBaseUrls();

  for (const baseUrl of candidates) {
    try {
      const res = await fetch(`${baseUrl}/api/site-settings/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      });

      if (!res.ok) continue;
      const rawData = await res.json();
      const data = Array.isArray(rawData) ? rawData[0] : rawData;
      if (!data || typeof data !== "object") continue;

      const mergedSocialLinks = { ...DEFAULT_SITE_SETTINGS.socialLinks };
      if (data.socialLinks && typeof data.socialLinks === "object") {
        Object.keys(DEFAULT_SITE_SETTINGS.socialLinks).forEach((key) => {
          if (data.socialLinks[key]) {
            mergedSocialLinks[key] = {
              ...mergedSocialLinks[key],
              ...data.socialLinks[key],
            };
          }
        });
      }

      const mergedContactFields = getMergedContactFields(data.contactFields);
      const mergedPublishedPages = getMergedPublishedPages(data.publishedPages);
      const mergedHomePageConfig = getMergedHomePageConfig(data.homePageConfig);

      return {
        email: data.email || DEFAULT_SITE_SETTINGS.email,
        phone: data.phone || DEFAULT_SITE_SETTINGS.phone,
        address: data.address || DEFAULT_SITE_SETTINGS.address,
        addressEn: data.addressEn || DEFAULT_SITE_SETTINGS.addressEn,
        officeAddress: data.officeAddress || DEFAULT_SITE_SETTINGS.officeAddress,
        officeAddressEn:
          data.officeAddressEn || DEFAULT_SITE_SETTINGS.officeAddressEn,
        workingHours: data.workingHours || DEFAULT_SITE_SETTINGS.workingHours,
        workingHoursEn:
          data.workingHoursEn || DEFAULT_SITE_SETTINGS.workingHoursEn,
        contactFields: mergedContactFields,
        registrationOpen:
          data.registrationOpen ?? DEFAULT_SITE_SETTINGS.registrationOpen,
        maintenanceMode:
          data.maintenanceMode ?? DEFAULT_SITE_SETTINGS.maintenanceMode,
        showResults: data.showResults ?? DEFAULT_SITE_SETTINGS.showResults,
        socialLinks: mergedSocialLinks,
        publishedPages: mergedPublishedPages,
        homePageConfig: mergedHomePageConfig,
      };
    } catch {
      // Try next candidate base URL
      continue;
    }
  }

  console.warn(
    "Notice: Fetching site settings from API failed on all endpoints, using cached settings."
  );
  return null;
}

async function saveToBackendApi(updatedState: SiteSettings): Promise<boolean> {
  const candidates = getCandidateApiBaseUrls();
  const payload = JSON.stringify({
    email: updatedState.email,
    phone: updatedState.phone,
    address: updatedState.address,
    addressEn: updatedState.addressEn,
    officeAddress: updatedState.officeAddress,
    officeAddressEn: updatedState.officeAddressEn,
    workingHours: updatedState.workingHours,
    workingHoursEn: updatedState.workingHoursEn,
    contactFields: updatedState.contactFields,
    registrationOpen: updatedState.registrationOpen,
    maintenanceMode: updatedState.maintenanceMode,
    showResults: updatedState.showResults,
    socialLinks: updatedState.socialLinks,
    publishedPages: {
      ...updatedState.publishedPages,
      home: true,
    },
    homePageConfig: updatedState.homePageConfig,
  });

  for (const baseUrl of candidates) {
    try {
      const res = await fetch(`${baseUrl}/api/site-settings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: payload,
      });

      if (res.ok) {
        await res.json();
        return true;
      }
    } catch {
      // Try next candidate base URL
      continue;
    }
  }

  console.error("Failed to save site settings to backend database API on all candidate URLs.");
  return false;
}

export function SiteSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    const initialCache = getStoredSettings();
    setSettings(initialCache);

    const refreshFromBackend = () => {
      fetchFromBackendApi().then((fresh) => {
        if (fresh) {
          setSettings(fresh);
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
            window.dispatchEvent(new Event(SETTINGS_EVENT));
          }
        }
      });
    };

    refreshFromBackend();

    const handleSync = () => {
      const updated = getStoredSettings();
      setSettings(updated);
    };

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        refreshFromBackend();
      }
    };

    window.addEventListener(SETTINGS_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      window.removeEventListener(SETTINGS_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updatedSocialLinks = {
      ...settings.socialLinks,
      ...(newSettings.socialLinks || {}),
    };

    const updatedContactFields = {
      ...settings.contactFields,
      ...(newSettings.contactFields || {}),
    };

    const updatedPublishedPages = getMergedPublishedPages({
      ...settings.publishedPages,
      ...(newSettings.publishedPages || {}),
    });

    const updatedHomePageConfig = newSettings.homePageConfig
      ? getMergedHomePageConfig(newSettings.homePageConfig)
      : settings.homePageConfig;

    const updatedState: SiteSettings = {
      ...settings,
      ...newSettings,
      contactFields: updatedContactFields,
      socialLinks: updatedSocialLinks,
      publishedPages: updatedPublishedPages,
      homePageConfig: updatedHomePageConfig,
    };

    setSettings(updatedState);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
        window.dispatchEvent(new Event(SETTINGS_EVENT));
      } catch (err) {
        console.error("Failed to save settings to localStorage:", err);
      }
    }

    await saveToBackendApi(updatedState);
  };

  const updatePublishedPages = async (
    newPages: Record<string, boolean>
  ): Promise<boolean> => {
    const mergedPages = getMergedPublishedPages({
      ...settings.publishedPages,
      ...newPages,
    });

    const updatedState: SiteSettings = {
      ...settings,
      publishedPages: mergedPages,
    };

    setSettings(updatedState);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
        window.dispatchEvent(new Event(SETTINGS_EVENT));
      } catch (err) {
        console.error("Failed to save publishedPages to localStorage:", err);
      }
    }

    return await saveToBackendApi(updatedState);
  };

  const updateHomePageConfig = async (
    newConfig: HomePageConfig
  ): Promise<boolean> => {
    const mergedConfig = getMergedHomePageConfig(newConfig);

    const updatedState: SiteSettings = {
      ...settings,
      homePageConfig: mergedConfig,
    };

    setSettings(updatedState);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
        window.dispatchEvent(new Event(SETTINGS_EVENT));
      } catch (err) {
        console.error("Failed to save homePageConfig to localStorage:", err);
      }
    }

    return await saveToBackendApi(updatedState);
  };

  const updateSocialLink = async (
    key: string,
    url: string,
    enabled: boolean
  ) => {
    const defaultItem = DEFAULT_SITE_SETTINGS.socialLinks[key] || {
      key,
      nameAr: key,
      nameEn: key,
      url: "",
      enabled: true,
    };
    const currentItem = settings.socialLinks[key] || defaultItem;

    const updatedSocialLinks = {
      ...settings.socialLinks,
      [key]: {
        ...currentItem,
        url,
        enabled,
      },
    };

    const updatedState: SiteSettings = {
      ...settings,
      socialLinks: updatedSocialLinks,
    };

    setSettings(updatedState);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
        window.dispatchEvent(new Event(SETTINGS_EVENT));
      } catch (err) {
        console.error("Failed to save social link setting:", err);
      }
    }

    await saveToBackendApi(updatedState);
  };

  const isPagePublished = useCallback(
    (keyOrPath: string) => {
      return checkIsPagePublished(settings.publishedPages, keyOrPath);
    },
    [settings.publishedPages]
  );

  const resetSettings = () => {
    setSettings(DEFAULT_SITE_SETTINGS);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event(SETTINGS_EVENT));
    }
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateSocialLink,
        updatePublishedPages,
        updateHomePageConfig,
        isPagePublished,
        resetSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error(
      "useSiteSettings must be used within a SiteSettingsProvider"
    );
  }
  return context;
}
