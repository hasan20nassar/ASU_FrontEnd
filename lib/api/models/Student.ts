/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NullEnum } from "./NullEnum";
import type { RankEnum } from "./RankEnum";
import type { ScheduleItem } from "./ScheduleItem";
import type { StudentGrade } from "./StudentGrade";
export type Student = {
  readonly id: number;
  user?: number | null;
  studentId: string;
  nameAr: string;
  nameEn: string;
  email: string;
  faculty: number;
  readonly facultySlug: string;
  readonly facultyNameAr?: string;
  readonly facultyNameEn?: string;
  program: number;
  readonly programSlug: string;
  readonly programNameAr?: string;
  readonly programNameEn?: string;
  readonly programDetail?: {
    id: number;
    nameAr: string;
    nameEn: string;
    slug: string;
    faculty?: number;
  } | null;
  year?: number;
  gpa?: string;
  totalCredits: number;
  completedCredits: number;
  image?: string | null;
  isTop: boolean;
  rank?: (RankEnum | NullEnum) | null;
  readonly schedule: Array<ScheduleItem>;
  readonly grades: Array<StudentGrade>;
};
