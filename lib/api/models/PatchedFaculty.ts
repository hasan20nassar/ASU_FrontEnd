import type { FacultyFacility } from './Faculty';

export type PatchedFaculty = {
    readonly id?: number;
    slug?: string;
    nameAr?: string;
    nameEn?: string;
    descriptionAr?: string;
    descriptionEn?: string;
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
};
