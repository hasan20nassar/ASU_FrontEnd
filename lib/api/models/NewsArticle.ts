/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryEnum } from './CategoryEnum';
export type NewsArticle = {
    readonly id: number;
    slug: string;
    titleAr: string;
    titleEn: string;
    excerptAr: string;
    excerptEn: string;
    contentAr: string;
    contentEn: string;
    image: string;
    imageCaptionAr?: string;
    imageCaptionEn?: string;
    category: CategoryEnum;
    scope?: "university" | "faculty" | "department";
    faculty?: number | null;
    facultyNameAr?: string;
    facultySlug?: string;
    program?: number | null;
    programNameAr?: string;
    programSlug?: string;
    authorNameAr?: string;
    authorNameEn?: string;
    authorTitleAr?: string;
    authorTitleEn?: string;
    readingTime?: number;
    viewsCount?: number;
    status?: "published" | "draft" | "archived";
    galleryImages?: Array<{ url: string; captionAr?: string; captionEn?: string }>;
    attachments?: Array<{ titleAr: string; titleEn?: string; url: string; size?: string; fileType?: string }>;
    date: string;
    featured?: boolean;
    createdAt?: string;
    updatedAt?: string;
};


