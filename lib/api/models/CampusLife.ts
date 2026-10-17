export interface HousingFeature {
  id?: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type PatchedHousingFeature = Partial<HousingFeature>;

export interface StudentClub {
  id?: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon?: string;
  category?: string;
  supervisor?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type PatchedStudentClub = Partial<StudentClub>;

export interface SportActivity {
  id?: number;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type PatchedSportActivity = Partial<SportActivity>;

export interface CampusLifeOverview {
  id?: number;
  housingTitleAr?: string;
  housingTitleEn?: string;
  housingDescAr?: string;
  housingDescEn?: string;
  housingImage?: string;
  housingContactNoteAr?: string;
  housingContactNoteEn?: string;
  sportsTitleAr?: string;
  sportsTitleEn?: string;
  sportsDescAr?: string;
  sportsDescEn?: string;
  sportsImage?: string;
  championshipsTitleAr?: string;
  championshipsTitleEn?: string;
  championshipsDescAr?: string;
  championshipsDescEn?: string;
  updatedAt?: string;
}

export type PatchedCampusLifeOverview = Partial<CampusLifeOverview>;

export interface CampusLifeStats {
  totalClubs: number;
  totalHousingFeatures: number;
  totalSports: number;
}
