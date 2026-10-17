export interface ResearchCenter {
  id?: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon?: string;
  faculty?: number | null;
  facultyNameAr?: string;
  facultyNameEn?: string;
  directorNameAr?: string;
  directorNameEn?: string;
  location?: string;
  contactEmail?: string;
  isActive?: boolean;
  order?: number;
  publicationsCount?: number;
  createdAt?: string;
}

export type PatchedResearchCenter = Partial<ResearchCenter>;

export interface ResearchArea {
  id?: number;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isActive?: boolean;
  order?: number;
  publicationsCount?: number;
}

export type PatchedResearchArea = Partial<ResearchArea>;

export interface ResearchPublication {
  id?: number;
  titleAr: string;
  titleEn: string;
  authorsAr: string;
  authorsEn: string;
  journalAr: string;
  journalEn: string;
  publicationYear?: number;
  researchArea?: number | null;
  researchAreaNameAr?: string;
  researchAreaNameEn?: string;
  center?: number | null;
  centerTitleAr?: string;
  centerTitleEn?: string;
  faculty?: number | null;
  facultyNameAr?: string;
  facultyNameEn?: string;
  abstractAr?: string;
  abstractEn?: string;
  doiUrl?: string;
  pdfFile?: string;
  pdfFileSize?: number;
  pdfFileSizeFormatted?: string;
  viewsCount?: number;
  downloadsCount?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type PatchedResearchPublication = Partial<ResearchPublication>;

export interface ResearchStats {
  totalPublications: number;
  currentYearPublications: number;
  totalCenters: number;
  totalAreas: number;
  totalDownloads: number;
  totalViews: number;
  internationalPartnerships: number;
  annualConferences: number;
  researchProjects: number;
}
