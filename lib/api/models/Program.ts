import type { BranchEnum } from "./BranchEnum";
import type { Course } from "./Course";
import type { FacultyFacility, FacultyLayoutConfig } from "./Faculty";

export type Program = {
  readonly id: number;
  slug: string;
  faculty: number;
  readonly facultySlug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  mottoAr?: string;
  mottoEn?: string;
  primaryColor?: string;
  accentColor?: string;
  heroBanner?: string;
  logoUrl?: string;
  creditHours: number;
  minScorePercent: number;
  minScorePoints: number;
  tuitionSyrian: number;
  tuitionNonResident: number;
  readonly tuitionCurrency: Record<string, string>;
  branch?: BranchEnum;
  /**
   * Duration in years
   */
  duration: number;
  head?: number | null;
  readonly headDetail?: {
    id: number;
    nameAr: string;
    nameEn: string;
    email: string;
  } | null;
  headNameAr?: string;
  headNameEn?: string;
  headMessageAr?: string;
  headMessageEn?: string;
  headPhoto?: string;
  establishedYear?: number;
  studentsCount?: number;
  labsCount?: number;
  researchPapersCount?: number;
  employmentRate?: number;
  facilities?: Array<FacultyFacility>;
  careerPaths?: string;
  guideDocumentUrl?: string;
  layoutConfig?: FacultyLayoutConfig;
  readonly facultyNameAr?: string;
  readonly facultyNameEn?: string;
  readonly teachersCount?: number;
  readonly totalStudents?: number;
  readonly courses?: Array<Course>;
};
