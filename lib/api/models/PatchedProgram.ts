/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BranchEnum } from './BranchEnum';
export type PatchedProgram = {
    readonly id?: number;
    slug?: string;
    faculty?: number;
    readonly facultySlug?: string;
    nameAr?: string;
    nameEn?: string;
    descriptionAr?: string;
    descriptionEn?: string;
    creditHours?: number;
    minScorePercent?: number;
    minScorePoints?: number;
    tuitionSyrian?: number;
    tuitionNonResident?: number;
    readonly tuitionCurrency?: Record<string, string>;
    branch?: BranchEnum;
    /**
     * Duration in years
     */
    duration?: number;
};

