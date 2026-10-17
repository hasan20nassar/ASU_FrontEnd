import type { Program } from "./Program";

export type FacultyFacility = {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  image?: string;
};

export type FacultySectionConfig = {
  titleAr?: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  layoutVariant?: "grid" | "list" | "compact" | "carousel" | "split";
  bgStyle?: "default" | "muted" | "tint" | "solid";
  itemLimit?: number;
  showCta?: boolean;
  ctaTextAr?: string;
  ctaTextEn?: string;
  ctaLink?: string;
};

export type FacultyLayoutConfig = {
  headerStyle?: "hero_split" | "hero_full" | "minimal";
  showQuickStats?: boolean;
  showDeanMessage?: boolean;
  showPrograms?: boolean;
  showNews?: boolean;
  showEvents?: boolean;
  showFacilities?: boolean;
  showStaff?: boolean;
  showTopStudents?: boolean;
  showAlumniStories?: boolean;
  sectionsOrder?: string[];
  sectionsConfig?: Record<string, FacultySectionConfig>;
};

export type Faculty = {
  readonly id: number;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon?: string;
  color?: string;
  image?: string | null;

  mottoAr?: string;
  mottoEn?: string;
  primaryColor?: string;
  accentColor?: string;
  heroBanner?: string;
  logoUrl?: string;

  dean?: number | null;
  deanDetail?: {
    id: number;
    nameAr: string;
    nameEn: string;
    email: string;
  } | null;
  deanNameAr?: string;
  deanNameEn?: string;
  deanMessageAr?: string;
  deanMessageEn?: string;
  deanPhoto?: string;

  establishedYear?: number;
  studentsCount?: number;
  labsCount?: number;
  researchPapersCount?: number;
  employmentRate?: number;

  facilities?: Array<FacultyFacility>;
  guideDocumentUrl?: string;
  layoutConfig?: FacultyLayoutConfig;

  readonly programs: Array<Program>;
  readonly totalPrograms?: number;
  readonly totalTeachers?: number;
  readonly totalStudents?: number;
};
