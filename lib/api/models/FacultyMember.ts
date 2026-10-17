/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FacultyMember = {
  readonly id: number;
  faculty?: number;
  readonly facultySlug?: string;
  readonly facultyNameAr?: string;
  readonly facultyNameEn?: string;
  department?: number | null;
  readonly departmentNameAr?: string;
  readonly departmentNameEn?: string;
  readonly departmentDetail?: {
    id: number;
    nameAr: string;
    nameEn: string;
    slug: string;
    faculty?: number;
  } | null;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  departmentAr: string;
  departmentEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  email: string;
  officeHours?: string;
  locationAr?: string;
  locationEn?: string;
  image?: string;
  isHead?: boolean;
  bioAr?: string;
  bioEn?: string;
  educationAr?: Array<{
    degreeAr?: string;
    degreeEn?: string;
    schoolAr?: string;
    schoolEn?: string;
    year?: string;
  }>;
  educationEn?: Array<{
    degreeAr?: string;
    degreeEn?: string;
    schoolAr?: string;
    schoolEn?: string;
    year?: string;
  }>;
  researchAr?: string;
  researchEn?: string;
  publications?: Array<{
    titleAr?: string;
    titleEn?: string;
    journalAr?: string;
    journalEn?: string;
    year?: string;
  }>;
  officeHourSlots?: Array<{
    id?: string;
    dayAr?: string;
    dayEn?: string;
    time?: string;
    status?: string;
  }>;
  appointmentLocation?: string;
};

